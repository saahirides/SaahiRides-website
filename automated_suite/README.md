# SaahiRides Website QA

This suite performs scheduled browser-based smoke, regression and low-volume availability checks against the public website.

## Run locally
`npm install --no-save playwright`
`npx playwright install chromium`
`TARGET_URL=https://saahirides.co.in node automated_suite/orchestrator.js`

## Scheduled execution
GitHub Actions runs daily at 01:30 UTC (07:00 IST) and supports manual runs from the Actions tab.

## Coverage
- Discovers same-origin pages from the published sitemap.
- Opens each page in Chromium with bounded concurrency.
- Records HTTP/navigation failures, browser runtime errors, missing SEO title/description, missing image alt text and malformed links.
- Runs a small bounded homepage HTTP probe (default 8 requests, 4 concurrent workers).
- Maintains open, closed-after-clean-rerun, and latest-run JSON reports.

## Safety boundaries
- No production source files are modified.
- No automatic AI code patches or pushes to application files.
- An anomaly is closed only when it is not reproduced in a complete subsequent run.
- Load probes are intentionally low-volume. This is not a stress/load certification and must not be used to benchmark production capacity.
- Admin, payments, WhatsApp, GPS/SOS and authenticated Supabase workflows require dedicated test credentials/devices and are not claimed as covered by this public-site suite.
