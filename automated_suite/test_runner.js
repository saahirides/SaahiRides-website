const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const COMMAND_CENTER = path.join(ROOT, 'command_center');
const OPEN_FILE = path.join(COMMAND_CENTER, 'open_anomalies.json');
const CLOSED_FILE = path.join(COMMAND_CENTER, 'closed_anomalies.json');
const BASE_URL = (process.env.TARGET_URL || 'https://saahirides.co.in').replace(/\/$/, '');
const MAX_PAGES = Number(process.env.MAX_PAGES || 40);
const CONCURRENCY = Math.min(6, Math.max(1, Number(process.env.PAGE_CONCURRENCY || 4)));
const LOAD_WORKERS = Math.min(8, Math.max(1, Number(process.env.LOAD_WORKERS || 4)));
const LOAD_REQUESTS = Math.min(3, Math.max(1, Number(process.env.LOAD_REQUESTS_PER_WORKER || 2)));

async function readJson(file) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
}
async function writeJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temp = file + '.tmp';
  await fs.writeFile(temp, JSON.stringify(data, null, 2) + '\n');
  await fs.rename(temp, file);
}
function anomaly(category, url, description, details = {}) {
  return {
    id: [category, url, description].join('|').toLowerCase().replace(/[^a-z0-9|.-]/g, '-').slice(0, 180),
    category, url, description, details, firstSeenAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString(), occurrences: 1, status: 'OPEN'
  };
}
async function getUrls() {
  const response = await fetch(BASE_URL + '/sitemap.xml');
  if (!response.ok) throw new Error('Sitemap request failed: HTTP ' + response.status);
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/g)].map(m => m[1].trim());
  return [...new Set(urls)].filter(url => {
    try { return new URL(url).origin === new URL(BASE_URL).origin; } catch { return false; }
  }).slice(0, MAX_PAGES);
}
async function runPool(items, limit, worker) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      await worker(items[index], index);
    }
  }));
}
async function inspectPage(browser, url, found) {
  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') pageErrors.push('console: ' + message.text().slice(0, 300));
  });
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if (!response) found.push(anomaly('NO_HTTP_RESPONSE', url, 'Navigation returned no HTTP response'));
    else if (response.status() >= 400) found.push(anomaly('HTTP_ERROR', url, 'Page returned HTTP ' + response.status(), { status: response.status() }));
    await page.waitForTimeout(800);
    const data = await page.evaluate(() => ({
      title: document.title.trim(),
      description: document.querySelector('meta[name="description"]')?.content?.trim() || '',
      h1Count: document.querySelectorAll('h1').length,
      imagesMissingAlt: [...document.images].filter(img => !img.hasAttribute('alt')).map(img => img.currentSrc || img.src).slice(0, 20),
      brokenLinks: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => /undefined|null/i.test(h || '')).slice(0, 20),
      forms: document.forms.length,
      buttons: document.querySelectorAll('button, input[type="submit"]').length
    }));
    if (!data.title) found.push(anomaly('SEO_TITLE_MISSING', url, 'Document title is empty'));
    if (!data.description) found.push(anomaly('SEO_DESCRIPTION_MISSING', url, 'Meta description is missing'));
    if (data.imagesMissingAlt.length) found.push(anomaly('IMAGE_ALT_MISSING', url, 'Images are missing alt attributes', { images: data.imagesMissingAlt }));
    if (data.brokenLinks.length) found.push(anomaly('MALFORMED_LINK', url, 'Links contain undefined/null route values', { links: data.brokenLinks }));
    for (const message of [...new Set(pageErrors)].slice(0, 10)) {
      found.push(anomaly('BROWSER_RUNTIME_ERROR', url, message));
    }
    return { url, status: response?.status() ?? null, title: data.title, forms: data.forms, buttons: data.buttons };
  } catch (error) {
    found.push(anomaly('PAGE_NAVIGATION_FAILURE', url, error.message));
    return { url, error: error.message };
  } finally {
    await page.close();
  }
}
async function runLightLoadProbe(url, found) {
  let cursor = 0;
  const results = [];
  const total = LOAD_WORKERS * LOAD_REQUESTS;
  await Promise.all(Array.from({ length: LOAD_WORKERS }, async () => {
    while (cursor < total) {
      cursor++;
      const started = Date.now();
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
        const latencyMs = Date.now() - started;
        results.push({ status: response.status, latencyMs });
        if (!response.ok) found.push(anomaly('LOAD_HTTP_ERROR', url, 'Light load probe returned HTTP ' + response.status, { status: response.status, latencyMs }));
        if (latencyMs > 5000) found.push(anomaly('LOAD_LATENCY_WARNING', url, 'Light load probe exceeded 5 seconds', { latencyMs }));
        await response.arrayBuffer();
      } catch (error) {
        found.push(anomaly('LOAD_REQUEST_FAILURE', url, error.message));
      }
    }
  }));
  return { requests: total, workers: LOAD_WORKERS, results };
}
async function runMasterTestMatrix() {
  console.log('Starting SaahiRides website QA against ' + BASE_URL);
  const urls = await getUrls();
  if (!urls.length) throw new Error('No same-origin pages found in sitemap');
  const browser = await chromium.launch({ headless: true });
  const found = [];
  const pageResults = [];
  try {
    await runPool(urls, CONCURRENCY, async url => pageResults.push(await inspectPage(browser, url, found)));
  } finally {
    await browser.close();
  }
  const load = await runLightLoadProbe(BASE_URL + '/', found);
  const previousOpen = await readJson(OPEN_FILE);
  const previousClosed = await readJson(CLOSED_FILE);
  const now = new Date().toISOString();
  const openById = new Map(previousOpen.map(item => [item.id, item]));
  const closedById = new Map(previousClosed.map(item => [item.id, item]));
  const reopened = [];
  let newlyDetected = 0;

  for (const item of found) {
    const priorOpen = openById.get(item.id);
    if (priorOpen) {
      priorOpen.lastSeenAt = now;
      priorOpen.occurrences = (priorOpen.occurrences || 1) + 1;
      priorOpen.details = item.details;
      priorOpen.status = priorOpen.status || 'OPEN';
      continue;
    }

    const priorClosed = closedById.get(item.id);
    const next = {
      ...item,
      status: priorClosed ? 'OPEN_REOPENED' : 'OPEN',
      firstSeenAt: priorClosed?.firstSeenAt || item.firstSeenAt || now,
      lastSeenAt: now,
      occurrences: (priorClosed?.occurrences || 0) + 1
    };
    if (priorClosed) {
      next.reopenedAt = now;
      next.previouslyClosedAt = priorClosed.resolvedAt || null;
      closedById.delete(item.id);
      reopened.push(next);
    } else {
      newlyDetected++;
    }
    openById.set(item.id, next);
  }

  const currentIds = new Set(found.map(item => item.id));
  const notReproduced = [...openById.values()].filter(item => !currentIds.has(item.id));
  for (const item of notReproduced) {
    item.status = item.status === 'OPEN_REOPENED' ? 'OPEN_REOPENED' : 'OPEN_PENDING_VERIFICATION';
    item.lastCheckedAt = now;
    item.notReproducedInRunAt = now;
    item.cleanRunsWithoutReproduction = (item.cleanRunsWithoutReproduction || 0) + 1;
  }

  const stillOpen = [...openById.values()];
  await writeJson(OPEN_FILE, stillOpen);
  await writeJson(CLOSED_FILE, [...closedById.values()]);

  const report = {
    runAt: now,
    target: BASE_URL,
    pagesDiscovered: urls.length,
    pagesInspected: pageResults.length,
    openAnomalies: stillOpen.length,
    newlyDetected,
    reopenedDefectCount: reopened.length,
    notReproducedPendingVerification: notReproduced.length,
    movedToClosedAfterCleanRun: 0,
    currentBrowserRun: true,
    fullSuiteExecuted: false,
    executionStatus: 'partial',
    reportClosed: false,
    coverageScope: 'Sitemap navigation, title/meta, image alt, same-origin references, browser errors and homepage light-load probe only. Forms, booking, WhatsApp, SOS, tours, responsive and authenticated Admin/HR journeys remain outside this runner.',
    lightLoadProbe: load,
    pageResults
  };
  await writeJson(path.join(COMMAND_CENTER, 'latest_report.json'), report);
  console.log(JSON.stringify({
    pages: urls.length,
    newFindings: newlyDetected,
    reopened: reopened.length,
    notReproducedPendingVerification: notReproduced.length,
    open: stillOpen.length,
    closedThisRun: 0,
    loadRequests: load.requests
  }, null, 2));

  // Any open anomaly keeps the run red. A clean scan alone never closes a defect.
  if (stillOpen.length > 0 || found.length > 0) process.exitCode = 1;
  return report;
}
module.exports = { runMasterTestMatrix };
if (require.main === module) runMasterTestMatrix().catch(error => { console.error(error); process.exitCode = 1; });
