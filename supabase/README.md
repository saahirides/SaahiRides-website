# SaahiRides Supabase setup (staged)

The current website repository is a static GitHub Pages site (root `index.html`); it does not currently contain a Vite app or Supabase client package. Therefore `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` will not automatically be loaded by the existing site.

## Project details
- Project URL: `https://uzwubbzlytqqewqibobr.supabase.co`
- Client key: supplied by the owner; treat it as a public browser key only if it is the project's anon/publishable key.
- Never put a service-role/secret key in this repository or browser code.

## Setup sequence
1. In Supabase Authentication, enable Email provider and configure site URL/redirect URLs for the intended SaahiRides domain.
2. Review and run `schema.sql` in the Supabase SQL Editor.
3. Create/confirm the owner's account through Supabase Auth and email verification.
4. Only after confirming the owner's Auth user UUID, add that UUID to `public.admin_users` using the SQL Editor. Do not allow self-service registration to grant admin access.
5. Build the Admin login UI against Supabase Auth and check admin membership after sign-in. Database RLS is the security boundary; hiding the tab is not.
6. Test a non-admin account and anonymous session cannot read or change restricted data.
7. Configure SMTP/email delivery and password recovery before relying on email login.

## Policy centre
The schema separates HR, Customer, Driver, and Admin Governance categories and supports version/status, dates, author/approver metadata, audience and acknowledgement records. This is a foundation only: it does not populate the approved policy text, implement an approval workflow, or prove legal compliance. HR and Admin Governance records must not be exposed to customers/drivers. Before production, tighten the policy audience predicate in `schema.sql` to explicit role/audience mapping and test every policy category.

## Safety
- This branch is a staged implementation; `main` and the live website have not been changed.
- No DNS records have been changed.
- No database SQL has been executed against the live project by this commit.
