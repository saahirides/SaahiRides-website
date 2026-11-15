# SaahiRides AI Agent Roles — Initial Set

These role profiles are stored under `.github/agents/` for use by a compatible GitHub Copilot agent environment. They define responsibilities and guardrails; **they do not by themselves create continuously running agents, schedules, credentials, or live integrations**.

## Initial roles
1. **QA Verifier** — independent, evidence-based testing; read-only in production.
2. **Social Publishing** — prepares approved Facebook/Instagram content and verifies each platform separately; publishing requires owner approval.
3. **CRM & Partnerships** — researches and organises prospects in the existing CRM; all outbound contact requires approval.
4. **TalkBack & Alerts** — verifies video and alert workflows; live notification tests require approval.

## Operating rules
- Preserve the existing SaahiRides website, repository, Supabase project, records, and current agents.
- Do not deploy, merge to `main`, change schemas, rotate credentials, or modify production data without owner approval.
- No agent may spend money, make legal commitments, send customer/driver communications, or publish content without explicit approval.
- Reports must distinguish completed, failed, blocked, and not tested work. Include evidence and the next owner decision.
- Prefer short voice-first daily briefings where the reporting interface supports voice; urgent risks are escalated immediately.

## Integration status
This is an initial role-definition set on a review branch. It is not yet wired into the Admin Command Centre, Supabase logging, or an autonomous runtime. Those integrations require a separately reviewed implementation and authorised credentials.
