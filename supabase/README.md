# SaahiRides Supabase setup (staged)

The current website repository is a static GitHub Pages site (root `index.html`); it does not currently contain a Vite app or Supabase client package. Therefore `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` will not automatically be loaded by the existing site.

## Project details
- Project URL: `https://uzwubbzlytqqewqibobr.supabase.co`
- Client key: supplied by the owner; use it in browser code only if it is the project's anon/publishable key.
- Never put a service-role/secret key in this repository or browser code.

## Setup sequence
1. In Supabase Authentication, enable Email provider and configure site URL/redirect URLs for the intended SaahiRides domain.
2. Review `schema.sql` carefully, then run it in the Supabase SQL Editor only after approval.
3. Create/confirm the owner's account through Supabase Auth and email verification.
4. Only after confirming the owner's Auth user UUID, add that UUID to `public.admin_users` using the SQL Editor. Do not allow self-service registration to grant admin access.
5. Build the Admin login UI against Supabase Auth and check admin membership after sign-in. Database RLS is the security boundary; hiding the tab is not.
6. Test a non-admin account and anonymous session cannot read or change restricted data.
7. Configure SMTP/email delivery and password recovery before relying on email login.

## Policy centre
The schema separates HR, Customer, Driver, and Admin Governance categories and supports version/status, dates, author/approver metadata, audience and acknowledgement records. It does not yet populate approved policy text or implement the approval workflow.

**Secure interim access:** only active admins can read policy rows until explicit customer/driver role mapping is implemented and tested. This intentionally prioritizes confidentiality over exposing customer/driver policies prematurely. Acknowledgements are restricted to the signed-in user's own record and the currently published policy version. HR and Admin Governance records must never be exposed to customers/drivers.

## Safety and status
- Work is staged on `work/supabase-admin-policy-centre`; `main` and the live website have not been changed.
- No DNS records have been changed.
- No database SQL has been executed against the Supabase project.
- The static site still needs a Supabase client integration and Admin UI; the supplied `VITE_*` values do not work automatically in plain `index.html`.
