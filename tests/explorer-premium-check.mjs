// Explorer walkthrough: rotation settles, views turn, picker/stepper/deep link select, media tabs,
// lightbox, mobile. Usage: node tests/explorer-premium-check.mjs [baseUrl] [outDir]
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const base = process.argv[2] || 'http://localhost:3088';
const out = process.argv[3] || 'review';
// A plain static server needs the file name; Vercel and `next dev` serve the clean path.
const pagePath = process.argv[4] || '/projects/building-preview';
await fs.mkdir(out, { recursive: true });
const executablePath = process.env.CHROME_PATH || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined);
const browser = await chromium.launch({ executablePath, headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
const errors = [];
const check = (ok, message) => { if (!ok) throw new Error(message); console.log('✓', message); };
const settle = page => page.waitForFunction(() => !document.querySelector('[data-moving]'), null, { timeout: 5000 });

const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
page.on('pageerror', e => errors.push(e.message));
// Failed loads are reported by URL below; the browser's own favicon probe has no page response.
page.on('console', m => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) errors.push(m.text()); });
page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
await page.goto(`${base}${pagePath}#explore`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !document.body.textContent.includes('Preparing the building'), null, { timeout: 15000 });
await page.waitForTimeout(600);
await page.screenshot({ path: `${out}/explorer-desktop.png` });

const angle = () => page.locator('canvas').getAttribute('aria-label');
const start = await angle();
const stage = page.getByRole('group', { name: /Building, 360°/ });
const box = await stage.boundingBox();
await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.5, { steps: 6 });
await page.mouse.up();
await settle(page);
check((await angle()) !== start, `drag with a flick turns the building (${start} → ${await angle()})`);

await page.getByRole('radio', { name: 'Rear' }).click();
await page.waitForTimeout(250);
await page.screenshot({ path: `${out}/explorer-turning.png` });
check(await page.locator('[data-moving]').count() === 1 && await page.locator('svg polygon').count() > 0, 'apartment overlays stay on screen while the building turns');
await settle(page);
check((await angle()).includes('angle 37 of'), `Rear turns to the rear elevation (${await angle()})`);
check((await page.locator('h2').textContent()).includes('Rear residence'), 'Rear selects a rear home');
check(await page.getByText('FOR SALE', { exact: true }).count() > 0, 'the chosen home keeps its FOR SALE label with the pointer elsewhere');

await page.getByRole('button', { name: 'Next available home' }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${out}/explorer-next.png` });

await page.getByRole('button', { name: /Choose an apartment/ }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${out}/explorer-picker.png` });
await page.getByRole('option', { name: /Floor 7, Front residence/ }).click();
await settle(page);
check((await page.locator('h2').textContent()).includes('Front residence'), 'picker selects Floor 7 front');
await page.waitForTimeout(500);
check(page.url().includes('apt=front-07'), `URL carries the home (${page.url()})`);

for (const name of ['Images', 'Film', '3D', 'About', 'Floor plan']) {
 await page.getByRole('tab', { name }).click();
 await page.waitForTimeout(500);
 if (name === '3D') {
  await page.waitForFunction(() => document.querySelector('model-viewer')?.loaded, null, { timeout: 30000 });
  await page.waitForTimeout(600);
  check(!(await page.locator('[class*=modelVeil][data-visible]').count()), 'the 3D model shows once it has loaded');
 }
 await page.screenshot({ path: `${out}/explorer-tab-${name.replace(/\W+/g, '').toLowerCase()}.png` });
}
await page.getByRole('button', { name: /floor plan full screen/ }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/explorer-lightbox.png` });
await page.keyboard.press('Escape');

await page.getByRole('button', { name: 'Open the apartment view' }).click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${out}/explorer-apartment-view.png` });
const media = await page.locator('#apartment-preview').boundingBox();
check(!(await page.locator('header').isVisible()) && media.width > 1440 * 0.6, `apartment view: media takes the screen (${Math.round(media.width)}px wide)`);
await page.keyboard.press('Escape');
await page.waitForTimeout(700);
check(await page.locator('header').isVisible() && await page.locator('canvas').isVisible(), 'Esc returns to the building');
const beforeTurn = await page.locator('canvas').getAttribute('aria-label');
await page.getByRole('button', { name: 'Turn left' }).click();
await settle(page);
check((await page.locator('canvas').getAttribute('aria-label')) !== beforeTurn, 'the building still turns after the apartment view');
await page.getByRole('radio', { name: 'Architect’s view' }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${out}/explorer-reference.png` });

const deep = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await deep.goto(`${base}${pagePath}?apt=rear-05#explore`, { waitUntil: 'networkidle' });
await deep.waitForTimeout(2200);
check((await deep.locator('h2').textContent()).includes('Rear residence') && (await deep.locator('main').textContent()).includes('Floor 5'), 'deep link opens rear-05');
// Opening on a home turns the building at mount — under React's dev double-mount this once left the
// turn loop dead: no overlays, no dragging.
await settle(deep);
check(await deep.locator('svg polygon').count() > 0, 'deep link: the building shows its apartments');
const deepStart = await deep.locator('canvas').getAttribute('aria-label');
const deepBox = await deep.getByRole('group', { name: /Building, 360°/ }).boundingBox();
await deep.mouse.move(deepBox.x + deepBox.width * 0.7, deepBox.y + deepBox.height * 0.5);
await deep.mouse.down();
await deep.mouse.move(deepBox.x + deepBox.width * 0.3, deepBox.y + deepBox.height * 0.5, { steps: 6 });
await deep.mouse.up();
await settle(deep);
check((await deep.locator('canvas').getAttribute('aria-label')) !== deepStart, 'deep link: the building still turns');

const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
await phone.goto(`${base}${pagePath}#explore`, { waitUntil: 'networkidle' });
await phone.waitForTimeout(1500);
await phone.screenshot({ path: `${out}/explorer-mobile.png` });
await phone.getByRole('button', { name: /Details/ }).click();
await phone.waitForTimeout(600);
await phone.screenshot({ path: `${out}/explorer-mobile-details.png` });

await browser.close();
check(errors.length === 0, `no page errors${errors.length ? ': ' + errors.join(' | ') : ''}`);
