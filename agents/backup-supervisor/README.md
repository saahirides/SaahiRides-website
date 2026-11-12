# SaahiRides Backup Supervisor (Watchtower)

## Purpose
An independent, non-destructive second agent that supervises primary-agent and scheduled QA work. It is deliberately separate from the website runtime and does not create a second app or dashboard.

## Responsibilities
- Read the latest website QA report and classify it honestly.
- Read open/reopened QA anomalies from Supabase.
- Read its own previous execution records as durable operational memory.
- Record each audit in `private_core.command_center_execution_runs`.
- Escalate incomplete QA, unresolved high/critical findings, missing reports, and infrastructure failures.
- Preserve evidence and report links so the primary development agent can repair and retest.

## Authority boundary
- READ: repository files/history and the allow-listed Command Centre QA/run records.
- WRITE: only its own execution-run record in Supabase.
- NEVER: edit website files, merge branches, deploy functions, alter database schema/data, publish social content, close QA defects, change pricing, or approve production changes.
- A QA run is complete only when `fullSuiteExecuted === true`, `executionStatus === "passed"`, and `reportClosed === true`. A partial/infrastructure-blocked run is never reported as successful.
- Defect closure remains subject to the existing Command Centre verified-retest rule. Business/IP/production approvals remain with the Joint Founder and Director.

## Persistent memory
Supabase is the durable memory store. Each run stores a compact snapshot in `private_core.command_center_execution_runs.summary`, including the prior run IDs, current QA state, open anomaly IDs/severities, commit SHA, and escalation reasons. The repo keeps this operating contract and executable code versioned.

## Enablement
Add GitHub Actions repository secrets:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The service-role key is used only by this private GitHub Actions runner; never add it to source code, client bundles, logs, artifacts, or repository variables. Rotate it if exposed. The runner's code only issues allow-listed reads plus one insert into its own execution history table.

Workflow: `.github/workflows/saahirides-backup-supervisor.yml`
Runner: `scripts/backup-agent/audit.mjs`

## Schedule
- Daily at 07:30 IST (02:00 UTC), after the existing 07:00 IST website QA schedule.
- Also supports manual dispatch.
- Can be invoked after the QA workflow completes.

## Operational limitation
This is a deterministic supervisory agent, not a general-purpose LLM. It provides independent checks and persistent memory without inventing AI conclusions. Any future LLM reasoning layer must be separately credentialed, read-only by default, prompt-injection hardened, and must not receive production write authority.
