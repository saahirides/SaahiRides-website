import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "https://saahirides.co.in",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: cors });

const sha256 = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json(405, { verified: false, error: "Method not allowed" });

  const expectedMobile = Deno.env.get("SUPER_ADMIN_MOBILE") ?? "";
  const expectedKey = Deno.env.get("SUPER_ADMIN_KEY") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!expectedMobile || !expectedKey || !supabaseUrl || !serviceKey) {
    return json(503, { verified: false, error: "Server verification is not configured" });
  }

  let body: { mobile?: string; key?: string };
  try {
    body = await req.json();
  } catch {
    return json(400, { verified: false, error: "Invalid request" });
  }
  const mobile = String(body.mobile ?? "").replace(/[^0-9+]/g, "");
  const key = String(body.key ?? "");
  if (!mobile || !key || mobile.length > 20 || key.length > 256) {
    return json(400, { verified: false, error: "Enter valid credentials" });
  }

  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limiterId = await sha256(mobile + "|" + forwarded);
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const now = new Date();
  const { data: prior, error: readError } = await admin
    .from("super_admin_login_attempts")
    .select("failures,window_started_at,locked_until")
    .eq("limiter_id", limiterId)
    .maybeSingle();

  if (readError) return json(503, { verified: false, error: "Verification service unavailable" });
  if (prior?.locked_until && new Date(prior.locked_until).getTime() > now.getTime()) {
    return json(429, { verified: false, error: "Too many attempts. Try again later." });
  }

  const windowExpired = !prior?.window_started_at ||
    now.getTime() - new Date(prior.window_started_at).getTime() > 15 * 60 * 1000;
  const failures = windowExpired ? 0 : Number(prior?.failures ?? 0);
  const mobileOk = mobile === expectedMobile.replace(/[^0-9+]/g, "");
  const keyOk = key.length === expectedKey.length &&
    [...key].reduce((acc, char, i) => acc | (char.charCodeAt(0) ^ expectedKey.charCodeAt(i)), 0) === 0;

  if (mobileOk && keyOk) {
    await admin.from("super_admin_login_attempts").delete().eq("limiter_id", limiterId);
    return json(200, { verified: true });
  }

  const nextFailures = failures + 1;
  const lockedUntil = nextFailures >= 5 ? new Date(now.getTime() + 30 * 60 * 1000).toISOString() : null;
  const row = {
    limiter_id: limiterId,
    failures: nextFailures,
    window_started_at: windowExpired ? now.toISOString() : prior.window_started_at,
    locked_until: lockedUntil,
    updated_at: now.toISOString(),
  };
  const { error: writeError } = await admin.from("super_admin_login_attempts").upsert(row, { onConflict: "limiter_id" });
  if (writeError) return json(503, { verified: false, error: "Verification service unavailable" });
  return json(401, { verified: false, error: "Credentials not accepted" });
});
