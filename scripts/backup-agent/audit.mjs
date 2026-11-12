import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const required = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing required GitHub secret: ${key}`);
}
const base = process.env.SUPABASE_URL.replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  "Content-Type": "application/json",
  "Accept-Profile": "private_core",
  "Content-Profile": "private_core"
};

async function rest(path, options = {}) {
  const response = await fetch(`${base}/rest/v1/${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${body.slice(0, 500)}`);
  return body ? JSON.parse(body) : null;
}

const startedAt = new Date().toISOString();
const commit = process.env.GITHUB_SHA || execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const workflowUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : null;

let report = null;
let reportError = null;
try {
  report = JSON.parse(await readFile("command_center/latest_report.json", "utf8"));
} catch (error) {
  reportError = error instanceof Error ? error.message : String(error);
}

const priorRuns = await rest(
  "command_center_execution_runs?select=id,started_at,status,summary,source_commit&agent_key=eq.backup_supervisor&order=started_at.desc&limit=8"
);
const anomalies = await rest(
  "qa_anomalies?select=id,category,severity,status,description,occurrence_count,last_seen_at&status=in.(open,reopened,in_progress)&order=last_seen_at.desc&limit=100"
);

const open = anomalies || [];
const highCritical = open.filter(x => ["high", "critical"].includes(x.severity));
const complete = !!report &&
  report.fullSuiteExecuted === true &&
  report.executionStatus === "passed" &&
  report.reportClosed === true;
const reasons = [];
if (reportError) reasons.push(`Latest QA report unavailable or invalid: ${reportError}`);
if (report && !complete) reasons.push("QA report is not a fully executed, passing, formally closed run.");
if (open.length) reasons.push(`${open.length} unresolved QA anomaly/anomalies remain.`);
if (highCritical.length) reasons.push(`${highCritical.length} high/critical anomaly/anomalies require immediate attention.`);

const status = reportError ? "failed" : (complete && open.length === 0 ? "passed" : "partial");
const summary = {
  agent: "SaahiRides Backup Supervisor (Watchtower)",
  version: "1.0.0",
  audited_at: startedAt,
  qa_report: report ? {
    runAt: report.runAt ?? null,
    executionStatus: report.executionStatus ?? "unknown",
    fullSuiteExecuted: report.fullSuiteExecuted === true,
    reportClosed: report.reportClosed === true,
    pagesDiscovered: report.pagesDiscovered ?? null,
    pagesInspected: report.pagesInspected ?? null,
    openAnomaliesReported: report.openAnomalies ?? null,
    coverageScope: report.coverageScope ?? null
  } : null,
  unresolved_anomalies: open.map(x => ({
    id: x.id, category: x.category, severity: x.severity,
    status: x.status, occurrence_count: x.occurrence_count
  })),
  escalation_reasons: reasons,
  previous_memory_run_ids: (priorRuns || []).map(x => x.id),
  previous_run_count_loaded: (priorRuns || []).length,
  source_commit: commit,
  workflow_run_url: workflowUrl,
  authority: "read-only supervision; only this execution record is written"
};

const inserted = await rest("command_center_execution_runs", {
  method: "POST",
  headers: { Prefer: "return=representation" },
  body: JSON.stringify([{
    agent_key: "backup_supervisor",
    run_type: "independent_qa_supervision",
    environment: "production",
    status,
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    summary,
    source_commit: commit,
    workflow_run_url: workflowUrl
  }])
});

console.log(JSON.stringify({
  agent: summary.agent,
  status,
  qa_complete: complete,
  unresolved_anomalies: open.length,
  high_critical: highCritical.length,
  escalation_reasons: reasons,
  persisted_run_id: inserted?.[0]?.id ?? null,
  workflow_run_url: workflowUrl
}, null, 2));

if (status !== "passed") process.exitCode = 2;
