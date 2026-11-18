import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const outputDir = resolve('qa-output');
mkdirSync(outputDir, { recursive: true });
const api = 'http://localhost:3000/api/v1';
const cases = await (await fetch(`${api}/cases?page=1&pageSize=1`)).json();
const resources = await (await fetch(`${api}/resources`)).json();
const caseId = cases.data.items[0].id;
const resourceId = resources.data[0].id;
const routes = [
  ['home', 'http://localhost:8080/#/', '沐-辅助包'],
  ['cases', 'http://localhost:8080/#/pages/cases/index', '故障案例库'],
  ['case-detail', `http://localhost:8080/#/pages/case-detail/index?id=${caseId}`, '解决步骤'],
  ['submit', 'http://localhost:8080/#/pages/submit/index', '提交问题'],
  ['mine', 'http://localhost:8080/#/pages/mine/index', '我的收藏'],
  ['resources', 'http://localhost:8080/#/pages/resources/index', '资源中心'],
  ['resource-detail', `http://localhost:8080/#/pages/resource-detail/index?id=${resourceId}`, '适用软件'],
  ['about', 'http://localhost:8080/#/pages/about/index', '项目背景'],
  ['favorites', 'http://localhost:8080/#/pages/favorites/index', '我的收藏'],
  ['my-issues', 'http://localhost:8080/#/pages/my-issues/index', '我的问题'],
  ['my-feedback', 'http://localhost:8080/#/pages/my-feedback/index', '我的反馈'],
];
const report = [];
const browser = await chromium.launch({ headless: true, executablePath });
for (const viewport of [{ width: 375, height: 812 }, { width: 390, height: 844 }, { width: 430, height: 932 }, { width: 1280, height: 900 }]) {
  const context = await browser.newContext({ viewport });
  for (const [name, url, text] of routes) {
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('pageerror', (error) => pageErrors.push(error.message));
    let navigationError = '';
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(800);
    } catch (error) { navigationError = error.message; }
    const bodyText = await page.locator('body').innerText().catch(() => '');
    const metrics = await page.evaluate(() => {
      const root = document.documentElement;
      const body = document.body;
      const all = Array.from(document.querySelectorAll('*'));
      const offenders = all.map((el) => {
        const rect = el.getBoundingClientRect();
        return { tag: el.tagName, className: typeof el.className === 'string' ? el.className : '', right: rect.right, left: rect.left, width: rect.width };
      }).filter((item) => item.width > 1 && (item.right > window.innerWidth + 2 || item.left < -2)).slice(0, 8);
      const shell = document.querySelector('.page-shell');
      const shellRect = shell?.getBoundingClientRect();
      return { innerWidth: window.innerWidth, clientWidth: root.clientWidth, scrollWidth: Math.max(root.scrollWidth, body.scrollWidth), offenders, shellWidth: shellRect?.width || 0, shellLeft: shellRect?.left || 0 };
    });
    report.push({ viewport, name, textPresent: bodyText.includes(text), navigationError, consoleErrors, pageErrors, ...metrics });
    if (viewport.width === 390 && ['home', 'cases', 'case-detail', 'submit', 'mine', 'about'].includes(name)) {
      await page.screenshot({ path: resolve(outputDir, `${name}-390.png`), fullPage: false });
    }
    if (viewport.width === 1280 && name === 'home') await page.screenshot({ path: resolve(outputDir, 'home-1280.png'), fullPage: false });
    await page.close();
  }
  await context.close();
}
await browser.close();
writeFileSync(resolve(outputDir, 'report.json'), JSON.stringify(report, null, 2));
const failures = report.filter((row) => row.navigationError || !row.textPresent || row.pageErrors.length || row.consoleErrors.length || row.scrollWidth > row.clientWidth + 2 || row.offenders.length > 0 || (row.viewport.width >= 1280 ? Math.abs(row.shellLeft - (row.innerWidth - row.shellWidth) / 2) > 2 : row.shellWidth > row.innerWidth + 2));
console.log(JSON.stringify({ checked: report.length, failures: failures.length, failuresDetail: failures }, null, 2));
