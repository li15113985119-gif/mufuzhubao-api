import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const browser = await chromium.launch({ headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const output=resolve('qa-output');mkdirSync(output,{recursive:true});const report={viewports:[],h5Search:null,admin:null};
for(const viewport of [{width:375,height:812},{width:390,height:844},{width:430,height:932},{width:1280,height:900}]){
 const context=await browser.newContext({viewport});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto('http://localhost:8080/#/',{waitUntil:'networkidle'});await page.waitForTimeout(500);
 const metrics=await page.evaluate(()=>{const root=document.documentElement;const body=document.body;const shell=document.querySelector('.page-shell');const rect=shell?.getBoundingClientRect();return{innerWidth,clientWidth:root.clientWidth,scrollWidth:Math.max(root.scrollWidth,body.scrollWidth),shellWidth:rect?.width||0,shellLeft:rect?.left||0};});
 report.viewports.push({viewport,errors,...metrics,ok:errors.length===0&&metrics.scrollWidth<=metrics.clientWidth+2&&(viewport.width>=1280?Math.abs(metrics.shellLeft-(metrics.innerWidth-metrics.shellWidth)/2)<2:metrics.shellWidth<=metrics.innerWidth+2)});
 if(viewport.width===390){await page.locator('input').first().fill('驱动');await page.locator('.search-button').click();await page.waitForTimeout(1000);const text=await page.locator('body').innerText();report.h5Search={url:page.url(),found:text.includes('3\n条结果')&&text.includes('驱动与设备连接'),errors};await page.screenshot({path:resolve(output,'h5-cases-final.png'),fullPage:false});}
 await context.close();
}
{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5174/#/login',{waitUntil:'networkidle'});await page.getByPlaceholder('请输入管理员账号').fill('admin');await page.getByPlaceholder('请输入密码').fill('Admin@123456');await page.getByRole('button',{name:'登录管理后台'}).click();await page.waitForURL(/#\/dashboard/,{timeout:15000});await page.waitForTimeout(1000);
 report.admin={url:page.url(),charts:await page.locator('canvas').count(),hasDashboard:(await page.locator('body').innerText()).includes('数据看板'),errors};await page.screenshot({path:resolve(output,'admin-dashboard-final.png'),fullPage:false});await context.close();
}
await browser.close();writeFileSync(resolve(output,'final-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));