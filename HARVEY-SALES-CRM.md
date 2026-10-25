# Harvey Sales CRM for SaahiRides

## Important architecture note

Harvey is a separate, locally running Python sales-agent application. It is **not** a static website component and should not be embedded into the GitHub Pages site. Keep the SaahiRides website and ride-booking application unchanged; run Harvey separately on the Ubuntu laptop.

- Upstream project: https://github.com/ethanplusai/harvey
- Upstream setup guide: https://github.com/ethanplusai/harvey#readme
- SaahiRides website for product training: https://saahirides.co.in
- Harvey dashboard is local-only by default: http://127.0.0.1:5555

## Suggested SaahiRides use

Use Harvey to identify and qualify potential B2B customers such as hotels, hospitals, event planners, travel agencies and corporate transport buyers. Review discovered leads, draft campaigns and replies in the dashboard, and keep human approval enabled before sending any outreach.

## Safe setup outline (Ubuntu)

Follow the upstream README first and check its current prerequisites. The documented quick start is:

```bash
git clone https://github.com/ethanplusai/harvey.git
cd harvey
python3 --version
```

The project requires Python 3.11+ and a supported Claude Code or Codex subscription setup, plus a configured mailbox. Follow the upstream guide for the currently supported provider and exact installation steps.

Once installed and configured, train it on the SaahiRides website using the command supported by the installed version, documented as:

```bash
harvey train https://saahirides.co.in
```

Then review/confirm prospecting signals, discover and profile leads, inspect drafts in the dashboard, and only send after manual review.

## Security and operating rules

- Do not commit `.env`, `harvey.local.yaml`, mailbox credentials, OAuth tokens, dashboard tokens, or `data/harvey.db` to this website repository.
- Do not put Supabase service-role keys or private app secrets into Harvey prompts, this file, or the public website repository.
- Do not expose the local Harvey dashboard publicly or open its port to the internet.
- Start with manual approval for all outbound emails; respect opt-outs, applicable privacy/anti-spam law, and sender-domain authentication/warm-up requirements.
- Harvey does not guarantee leads or sales. Verify lead accuracy and business relevance.
- This document is an integration note only; it does not vendor or install Harvey's source code into the SaahiRides website repository.

Last reviewed: 2026-10-26
