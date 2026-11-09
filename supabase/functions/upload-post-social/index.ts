import { createClient } from "npm:@supabase/supabase-js@2.95.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.saahirides.co.in",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

function getPublishableKey(): string {
  const legacy = Deno.env.get("SUPABASE_ANON_KEY");
  if (legacy) return legacy;
  const raw = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.default === "string") return parsed.default;
    } catch { /* use the explicit error below */ }
  }
  throw new Error("Supabase publishable key is not available to this function.");
}

function validUsername(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{3,50}$/.test(value);
}

async function uploadPostRequest(path: string, apiKey: string, init: RequestInit = {}) {
  const response = await fetch(`https://api.upload-post.com/api${path}`, {
    ...init,
    headers: { Authorization: `Apikey ${apiKey}`, ...(init.headers || {}) },
  });
  const text = await response.text();
  let data: unknown;
  try { data = text ? JSON.parse(text) : {}; }
  catch { data = { message: text.slice(0, 1000) }; }
  return response.ok
    ? { ok: true, status: response.status, data }
    : { ok: false, status: response.status, data };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);
  const authHeader = req.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) return json({ error: "Sign in to SaahiRides Admin first." }, 401);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    if (!supabaseUrl) throw new Error("Supabase project URL is missing from function configuration.");
    const supabase = createClient(supabaseUrl, getPublishableKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.slice("Bearer ".length);
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) return json({ error: "Your Admin session is invalid or expired. Sign in again." }, 401);

    const { data: adminRow, error: adminError } = await supabase
      .from("admin_users").select("role,active").eq("user_id", userData.user.id).maybeSingle();
    if (adminError) return json({ error: "Could not verify SaahiRides Admin permission: " + adminError.message }, 403);
    if (!adminRow?.active) return json({ error: "Active SaahiRides Admin permission is required." }, 403);

    const apiKey = Deno.env.get("UPLOAD_POST_API_KEY");
    if (!apiKey) return json({ error: "UPLOAD_POST_API_KEY is not configured in Supabase Edge Function Secrets." }, 503);

    const body = await req.json().catch(() => ({}));
    const action = typeof body?.action === "string" ? body.action : "";

    if (action === "overview") {
      const [me, users] = await Promise.all([
        uploadPostRequest("/uploadposts/me", apiKey),
        uploadPostRequest("/uploadposts/users", apiKey),
      ]);
      if (!me.ok) return json({ error: "Upload-Post account check failed.", provider_status: me.status, details: me.data }, me.status);
      if (!users.ok) return json({ error: "Could not retrieve Upload-Post profiles.", provider_status: users.status, details: users.data }, users.status);
      return json({
        success: true,
        me: me.data,
        ...((users.data && typeof users.data === "object") ? users.data as Record<string, unknown> : {}),
      });
    }

    if (action === "status") {
      const requestId = typeof body?.request_id === "string" ? body.request_id.trim() : "";
      if (!/^[a-zA-Z0-9_-]{8,120}$/.test(requestId)) return json({ error: "A valid Upload-Post request ID is required." }, 400);
      const result = await uploadPostRequest("/uploadposts/status?request_id=" + encodeURIComponent(requestId), apiKey);
      if (!result.ok) return json({ error: "Could not retrieve the social publishing status.", provider_status: result.status, details: result.data }, result.status);
      return json({ success: true, ...((result.data && typeof result.data === "object") ? result.data as Record<string, unknown> : {}) });
    }

    if (action === "connect_profile") {
      const username = body?.username;
      if (!validUsername(username)) return json({ error: "Profile name must be 3–50 characters and use only letters, numbers, underscores or hyphens." }, 400);
      const listing = await uploadPostRequest("/uploadposts/users", apiKey);
      if (!listing.ok) return json({ error: "Could not check the current Upload-Post profile limit.", details: listing.data }, listing.status);
      const listingData = listing.data && typeof listing.data === "object" ? listing.data as Record<string, unknown> : {};
      const profiles = Array.isArray(listingData.profiles) ? listingData.profiles as Array<Record<string, unknown>> : [];
      const exists = profiles.some((profile) => profile.username === username);
      const profileLimit = Number(listingData.limit);
      if (!exists && Number.isFinite(profileLimit) && profiles.length >= profileLimit) {
        return json({
          error: `Upload-Post profile limit reached (${profiles.length}/${profileLimit}). No new profile was created. Upgrade the Upload-Post plan or reuse an existing profile.`,
          plan: listingData.plan || null,
          limit: profileLimit,
          profiles_used: profiles.length,
        }, 403);
      }

      if (!exists) {
        const created = await uploadPostRequest("/uploadposts/users", apiKey, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        if (!created.ok) return json({
          error: "Upload-Post could not create the publishing profile. Check the plan limit and profile name.",
          provider_status: created.status,
          details: created.data,
        }, created.status);
      }

      const link = await uploadPostRequest("/uploadposts/users/generate-jwt", apiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          platforms: ["facebook", "instagram", "google_business"],
          show_calendar: false,
          connect_title: "Connect SaahiRides social accounts",
          connect_description: "Securely connect a Facebook account, Instagram Business account, or Google Business Profile for SaahiRides publishing.",
          redirect_url: "https://www.saahirides.co.in/admin.html",
          logo_image: "https://www.saahirides.co.in/saahirides%20logo.jpg",
        }),
      });
      if (!link.ok) return json({
        error: "The profile exists, but Upload-Post could not generate its secure connection link.",
        provider_status: link.status,
        details: link.data,
      }, link.status);
      const linkData = link.data && typeof link.data === "object" ? link.data as Record<string, unknown> : {};
      return json({
        success: true,
        username,
        profile_created: !exists,
        access_url: linkData.access_url,
        duration: linkData.duration || "48h",
      });
    }

    if (action === "facebook_pages" || action === "google_business_locations") {
      const username = body?.username;
      if (!validUsername(username)) return json({ error: "A valid Upload-Post profile name is required." }, 400);
      const query = new URLSearchParams({ profile: username });
      const path = action === "facebook_pages"
        ? `/uploadposts/facebook/pages?${query.toString()}`
        : `/uploadposts/google-business/locations?${query.toString()}`;
      const result = await uploadPostRequest(path, apiKey);
      if (!result.ok) return json({
        error: action === "facebook_pages" ? "Could not load Facebook Pages." : "Could not load Google Business Profile locations.",
        provider_status: result.status,
        details: result.data,
      }, result.status);
      return json({
        success: true,
        action,
        ...((result.data && typeof result.data === "object") ? result.data as Record<string, unknown> : {}),
      });
    }

    if (action === "publish") {
      const form = await req.formData();
      const username = form.get("username");
      if (!validUsername(username)) return json({ error: "A valid publishing profile is required." }, 400);
      const allowed = new Set(["facebook", "instagram", "google_business"]);
      const platforms = form.getAll("platform[]").filter((value): value is string => typeof value === "string");
      const selected = [...new Set(platforms)];
      if (!selected.length || selected.some((platform) => !allowed.has(platform))) {
        return json({ error: "Select one or more supported platforms: Facebook, Instagram or Google Business Profile." }, 400);
      }
      const caption = String(form.get("description") || "").trim();
      const photos = form.getAll("photos[]").filter((value): value is File => value instanceof File);
      const video = form.get("video");
      const hasVideo = video instanceof File;
      if (!caption && photos.length === 0 && !hasVideo) return json({ error: "Add a caption or media before publishing." }, 400);
      if (photos.length > 10 || (hasVideo && photos.length > 0)) return json({ error: "Use up to 10 photos or one video, not both." }, 400);
      const media = hasVideo ? [video] : photos;
      if (media.some((file) => file.size > 100 * 1024 * 1024)) return json({ error: "Each media file must be 100 MB or smaller." }, 413);
      if (media.some((file) => !file.type.startsWith("image/") && !file.type.startsWith("video/"))) {
        return json({ error: "Only image and video media are supported." }, 400);
      }
      if (selected.includes("instagram") && media.length === 0) {
        return json({ error: "Instagram publishing requires photo or video media." }, 400);
      }

      const endpoint = hasVideo ? "/upload" : photos.length ? "/upload_photos" : "/upload_text";
      const payload = new FormData();
      payload.append("user", username);
      selected.forEach((platform) => payload.append("platform[]", platform));
      payload.append("description", caption);
      payload.append("title", caption.slice(0, 80) || "SaahiRides update");
      payload.append("async_upload", "true");
      if (hasVideo) payload.append("video", video);
      else photos.forEach((photo) => payload.append("photos[]", photo));
      const facebookPageId = String(form.get("facebook_page_id") || "").trim();
      const googleLocationId = String(form.get("gbp_location_id") || "").trim();
      const requestId = String(form.get("request_id") || crypto.randomUUID());
      payload.append("request_id", requestId);
      if (facebookPageId) payload.append("facebook_page_id", facebookPageId);
      if (googleLocationId) payload.append("gbp_location_id", googleLocationId);

      const published = await uploadPostRequest(endpoint, apiKey, {
        method: "POST",
        body: payload,
        headers: { "Idempotency-Key": requestId },
      });
      if (!published.ok) return json({
        error: "Upload-Post rejected the publishing request.",
        provider_status: published.status,
        details: published.data,
      }, published.status);
      const responseData = published.data && typeof published.data === "object"
        ? published.data as Record<string, unknown>
        : {};
      return json({ success: true, message: "Publishing request accepted by Upload-Post.", ...responseData });
    }

    return json({ error: "Unsupported action." }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return json({ error: message }, 500);
  }
});
