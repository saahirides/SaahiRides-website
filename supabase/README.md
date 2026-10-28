# SaahiRides Supabase setup (staged)

The website is a static GitHub Pages site. The staged branch now includes `admin.html`, a browser-based Admin & Policy Centre using Supabase Auth and the existing project URL.

## Project and key safety
- Project URL: `https://uzwubbzlytqqewqibobr.supabase.co`
- Use only the project's public anon/publishable client key in browser code.
- Never place a service-role/secret key in `admin.html`, GitHub, or browser code.
- The Admin page currently accepts the public client key in a session-only form; it does not save the key in browser storage.

## Before using the Admin page
1. In Supabase Authentication, enable Email provider and configure the site URL and redirect URLs for the intended SaahiRides domain.
2. Review `schema.sql`, then run it in the Supabase SQL Editor only after approval.
3. Create/confirm the owner's account through Supabase Auth and email verification.
4. Confirm the owner's Auth UUID, then grant Admin/Owner by inserting that UUID into `public.admin_users` using the SQL Editor.
5. Explicitly grant HR publishing access by inserting the HR person's Auth UUID into `public.hr_publishers`. The HR grant cannot be self-created from the browser.
6. Configure SMTP/email delivery and password recovery before relying on email login.
7. Open `admin.html`, enter the public key, sign in, and test with separate owner, HR, ordinary-user, and anonymous sessions.

## Permissions in this staged schema
- Active Admin/Owner accounts can manage all four policy categories.
- Active HR publishers can manage only records whose category is `HR`.
- HR permissions are granted/revoked by an owner/admin through the SQL Editor; HR cannot grant themselves permissions.
- Customers/drivers cannot read policy rows yet. Their role mapping and published-policy access must be implemented and tested before those views are opened.
- Acknowledgement insert rules require the policy to be published, require acknowledgement, and match the recorded version.
- The Admin UI is an initial editor/listing interface. It is not a complete dual-approval workflow. The mandatory “Joint Founder & at least one Director Approval — MANDATORY” rule must be enforced server-side before sensitive actions go live.

## Important limitations
- The current Admin page has not been tested against your live Supabase project because the schema has not been executed and account permissions have not been configured.
- Do not select Published until your internal approval is complete. The editor does not independently verify a director's approval.
- The supplied `VITE_*` variables are not automatically loaded by a plain static `index.html`; this branch uses the Supabase JS browser library for the staged Admin page.
- The changes are staged on `work/supabase-admin-policy-centre`; `main` and the live website have not been changed. No DNS changes or live database SQL execution have occurred.
