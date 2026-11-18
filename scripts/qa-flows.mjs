import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const output = resolve('qa-output'); mkdirSync(output, { recursive: true });
const results = {};
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage(); const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('http://localhost:8080/#/', { waitUntil:'networkidle' });
  const input = page.locator('input').first();
  await input.fill('驱动');
  await page.getByText('搜索', { exact: true }).first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
  results.h5Search = { url: page.url(), hasResults: (await page.locator('body').innerText()).includes('驱动'), errors };
  await page.screenshot({ path: resolve(output, 'flow-search.png'), fullPage:false });
  await context.close();
}
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage(); const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5174/#/login', { waitUntil:'networkidle' });
  await page.getByPlaceholder('请输入管理员账号').fill('admin');
  await page.getByPlaceholder('请输入密码').fill('Admin@123456');
  await page.getByRole('button', { name:'登录管理后台' }).click();
  await page.waitForURL(/#\/dashboard/, { timeout:15000 });
  await page.waitForTimeout(1200);
  const dashboardText = await page.locator('body').innerText();
  results.adminLogin = { url: page.url(), dashboard: dashboardText.includes('数据看板'), cards: dashboardText.includes('案例总数'), charts: await page.locator('canvas').count(), errors };
  await page.screenshot({ path: resolve(output, 'admin-dashboard.png'), fullPage:false });
  await page.getByText('案例管理', { exact:true }).first().click();
  await page.waitForTimeout(1000);
  const caseText = await page.locator('body').innerText();
  results.adminCases = { url: page.url(), hasCases: caseText.includes('案例管理') && caseText.includes('已发布'), rows: await page.locator('.el-table__row').count() };
  await context.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 2));