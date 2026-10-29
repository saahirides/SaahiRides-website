# SaahiRides Supabase setup (staged)

The website is a static GitHub Pages site. This staged branch includes `admin.html` (Admin & Governance Portal), `hr.html` (dedicated HR Policy Workspace), the base schema, and a governance-approval migration. Both portals use Supabase Auth and the existing project URL.

## Project and key safety
- Project URL: `https://uzwubbzlytqqewqibobr.supabase.co`
- Use only the project's public anon/publishable client key in browser code.
- Never place a service-role/secret key in `admin.html`, GitHub, or browser code.
- The Admin page currently accepts the public client key in a session-only form; it does not save the key in browser storage.

## Before using the Admin page
1. In Supabase Authentication, enable Email provider and configure the site URL and redirect URLs for the intended SaahiRides domain.
2. Review `schema.sql`, then run it in the Supabase SQL Editor only after approval.\n3. Review and run `migrations/20261029_governance_approvals.sql` after the base schema.
3. Create/confirm the owner's account through Supabase Auth and email verification.
4. Confirm the owner's Auth UUID, then grant Admin/Owner by inserting that UUID into `public.admin_users` using the SQL Editor.
5. Explicitly grant HR publishing access by inserting the HR person's Auth UUID into `public.hr_publishers`. The HR grant cannot be self-created from the browser.
6. Configure SMTP/email delivery and password recovery before relying on email login.
7. Open `admin.html`, enter the public key, sign in, and test with separate owner, HR, ordinary-user, and anonymous sessions.

## Permissions in this staged schema
- Active Admin/Owner accounts can manage all four policy categories.
- Active HR publishers can manage only records whose category is `HR`.
- HR permissions are granted/revoked by a trusted administrator through the SQL Editor; HR cannot grant themselves permissions.\n- The dedicated `hr.html` workspace only offers HR-category policy drafting and submission; it does not offer a Published status.\n- The governance migration adds immutable client-side approval records and a database trigger that blocks publication until the exact policy version has approval from a designated Joint Founder and a distinct designated Director. Governance role assignments are SQL-Editor-only.
- Customers/drivers cannot read policy rows yet. Their role mapping and published-policy access must be implemented and tested before those views are opened.
- Acknowledgement insert rules require the policy to be published, require acknowledgement, and match the recorded version.
- The Admin UI is a staged editor/listing interface with approval actions for assigned governance approvers. The database trigger is the final publication gate; the UI alone is not trusted.

## Important limitations
- These changes are staged and have not been executed or integration-tested against the live Supabase project in this workflow. Confirm the base schema and migration were applied before using either portal.
- Do not select Published until your internal approval is complete. The editor does not independently verify a director's approval.
- The supplied `VITE_*` variables are not automatically loaded by a plain static `index.html`; this branch uses the Supabase JS browser library for the staged Admin page.
- The changes are staged on `work/supabase-admin-policy-centre`; `main` and the live website have not been changed. No DNS changes or live database SQL execution have occurred.
