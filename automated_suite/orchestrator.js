const { runMasterTestMatrix } = require('./test_runner');

async function main() {
  console.log('SaahiRides QA orchestration started: ' + new Date().toISOString());
  const report = await runMasterTestMatrix();
  console.log('QA run finished. Pages inspected: ' + report.pagesInspected +
    '; open anomalies: ' + report.openAnomalies);
}
main().catch(error => {
  console.error('QA orchestration failed:', error);
  process.exitCode = 1;
});
