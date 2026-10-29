# SaahiRides Supabase setup (staged)

The website is a static GitHub Pages site. This staged branch includes:
- `admin.html` — Admin & Governance Portal
- `hr.html` — dedicated HR Policy Workspace
- `schema.sql` — base policy/admin schema
- `migrations/20261029_governance_approvals.sql` — dual-approval publication gate
- `migrations/20261029_private_role_helpers.sql` — Owner/Admin separation and private authorization helpers

Both portals use Supabase Auth and the existing SaahiRides project.

## Project and key safety
- Project URL: `https://uzwubbzlytqqewqibobr.supabase.co`
- Use only the project's public anon/publishable client key in browser code.
- Never place a service-role/secret key in HTML, GitHub, or browser code.
- The Admin and HR pages are preconfigured with the project's public publishable key and auto-connect. Public client keys are intended for browser use; never put a service-role/secret key in HTML, GitHub, or browser code.

## Setup order
1. In Supabase Authentication, enable Email provider and configure the site URL and redirect URLs for the intended SaahiRides domain.
2. Review `schema.sql`, then run it in the Supabase SQL Editor.
3. Review and run `migrations/20261029_governance_approvals.sql` after the base schema.
4. Review and run `migrations/20261029_private_role_helpers.sql` to move authorization helpers into the private schema and separate Owner from Admin.
5. Create/confirm the owner's account through Supabase Auth and email verification.
6. Confirm the owner's Auth UUID, then grant Admin/Owner by inserting that UUID into `public.admin_users` using the SQL Editor.
7. Grant the HR user's Auth UUID in `public.hr_publishers`. HR access cannot be self-created from the browser.
8. Assign governance approval roles in `public.governance_approvers` using the SQL Editor only: one verified `joint_founder` account and at least one distinct verified `director` account. Do not assign both roles to the same person.
9. Configure SMTP/email delivery and password recovery before relying on email login.
9. Open `admin.html` for Admin/Governance and `hr.html` for HR. Test with separate founder, director, HR, ordinary-user, and anonymous sessions.

## Permissions and workflow
- Active Admin/Owner accounts can manage all four policy categories: HR, Customer, Driver, and Admin Governance.
- Active HR publishers can manage HR-category policies only. The dedicated `hr.html` workspace only offers HR drafts and pending-approval submissions; it does not offer a Published status.
- Governance approver role assignments are SQL-Editor-only. Assigned approvers can record approval for an exact policy version in `admin.html`.
- The database trigger blocks publication until the exact policy version has approval from a designated Joint Founder and a distinct designated Director. The trigger also blocks edits to published policy content under the same version; content changes require a new version and fresh dual approval. The database is the final publication gate; the UI alone is not trusted.
- Customers/drivers cannot read policy rows yet. Their role mapping and published-policy access must be implemented and tested before those views are opened.
- Acknowledgement insert rules require the policy to be published, require acknowledgement, and match the recorded version.

## Important limitations
- These changes are staged and have not been executed or integration-tested against the live Supabase project in this workflow. The publication trigger was hardened to run on every policy-row update so a published policy cannot be altered silently without versioning and fresh approvals. Confirm the base schema and migration are applied before using either portal.
- The mandatory approval rule is enforced for policy publication. Other sensitive business actions must receive their own server-side authorization before they are enabled.
- The supplied `VITE_*` variables are not automatically loaded by a plain static `index.html`; the staged Admin/HR pages use the Supabase JS browser library.
- Changes are on `work/supabase-admin-policy-centre`; `main` and the live website have not been changed. No DNS changes or live database SQL execution have occurred.


## Live project implementation status (2026-10-29)
The existing project `uzwubbzlytqqewqibobr` has the six base/governance tables, RLS enabled, a dual-approval publication trigger, private role-helper functions, and Owner/Admin policy separation installed. Supabase security advisors returned no security lints after helper hardening. User role assignments and end-to-end authenticated workflow tests are still required before treating the portals as production-ready. The portal pages are staged on the PR branch and are not live until that branch is merged/deployed.
