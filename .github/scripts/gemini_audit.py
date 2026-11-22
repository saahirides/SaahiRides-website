python

import os
import json
import glob
import urllib.request

api_key = os.environ["GEMINI_API_KEY"]
target_files = [
    f for f in ["index.html"] + glob.glob("app/*.html")
    if f != "app/admin.html" and os.path.exists(f)
]

for path in target_files:
    with open(path, "r", encoding="utf-8") as fh:
        content = fh.read()

    prompt = (
        f"Audit this HTML file ({path}) for SaahiRides (saahirides.co.in).\n"
        "Fix ONLY real bugs:\n"
        "1. Stray text before <!DOCTYPE html>, broken/unclosed HTML tags, duplicate IDs, or broken relative links.\n"
        "2. Shortened forms.gle links inside <iframe> tags (remove broken iframes if present, keep <a> buttons).\n"
        "3. Low-contrast links on dark navy (#0B132B / #16223F) backgrounds.\n"
        "Preserve all existing copy, styles, and structure. "
        "If no bugs exist, return exact text: NO_CHANGES_NEEDED\n"
        "Otherwise return ONLY the complete fixed HTML with no markdown fences.\n\n"
        f"FILE CONTENT:\n{content}"
    )

    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}",
        data=json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req) as resp:
        out = json.loads(resp.read().decode("utf-8"))
        fixed = out["candidates"][0]["content"]["parts"][0]["text"].strip()

    if fixed and fixed != "NO_CHANGES_NEEDED" and "<!DOCTYPE html>" in fixed:
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(fixed + "\n")

