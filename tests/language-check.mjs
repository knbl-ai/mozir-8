// Hebrew end to end: the hub's switch, links that carry ?lang=, and both demos opening in Hebrew.
// Usage: node tests/language-check.mjs http://localhost:3088   (static server: pages end in .html)
import { chromium } from '@playwright/test';
const base = process.argv[2] ?? 'http://localhost:3088';
const executablePath = process.env.CHROME_PATH || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined);
const browser = await chromium.launch({ executablePath, headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
let failed = 0;
const check = (ok, name, detail = '') => { console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` (${detail})` : ''}`); if (!ok) failed++; };
const dir = page => page.evaluate(() => [document.documentElement.lang, document.documentElement.dir].join('/'));
const errors = [];
context.on('page', p => p.on('pageerror', e => errors.push(e.message)));

const hub = await context.newPage();
await hub.goto(base + '/', { waitUntil: 'networkidle' });
check(await dir(hub) === 'en/ltr', 'hub opens in English');
await hub.getByRole('radio', { name: 'עברית' }).click();
check(await dir(hub) === 'he/rtl', 'switch turns the hub Hebrew, right to left');
check(new URL(hub.url()).searchParams.get('lang') === 'he', 'hub URL carries ?lang=he');
check(await hub.locator('h1').innerText() === 'שתי דרכים להציג בית עוד לפני הביקור הראשון.', 'hub headline in Hebrew');
const hrefs = await hub.locator('article a').evaluateAll(as => as.map(a => a.getAttribute('href')));
check(hrefs.every(h => h?.includes('lang=he')), 'both demos link with ?lang=he', hrefs.join(', '));

const gallery = await context.newPage();
await gallery.goto(`${base}/projects/building-preview.html?lang=he#explore`, { waitUntil: 'networkidle' });
await gallery.waitForTimeout(800);
check(await dir(gallery) === 'he/rtl', 'Sales Gallery opens in Hebrew');
check(await gallery.getByRole('radio', { name: '5 חדרים' }).count() === 1, 'view switch reads 5 חדרים / 4 חדרים / גן');
check((await gallery.locator('[class*=facadeLabel]').allInnerTexts()).some(text => text.startsWith('למכירה')), 'facade label reads למכירה');
await gallery.waitForTimeout(600);
const galleryUrl = new URL(gallery.url());
check(galleryUrl.searchParams.get('lang') === 'he' && !!galleryUrl.searchParams.get('apt'), 'choosing a home keeps ?lang=he beside ?apt=', galleryUrl.search);
await gallery.getByRole('radio', { name: 'English' }).click();
check(await dir(gallery) === 'en/ltr' && new URL(gallery.url()).searchParams.get('lang') === 'en', 'Sales Gallery switches back to English and says so: ?lang=en');

const mozir = await context.newPage();
await mozir.goto(`${base}/mozir-8.html?lang=he`, { waitUntil: 'networkidle' });
check(await dir(mozir) === 'he/rtl', 'Open House opens in Hebrew');
check((await mozir.locator('#hero-title').innerText()).includes('לחיות'), 'Open House headline in Hebrew');

// A ?lang link is remembered, so a later link without it opens in that language.
const plain = await context.newPage();
await plain.goto(`${base}/mozir-8.html`, { waitUntil: 'networkidle' });
check(await dir(plain) === 'he/rtl', 'without ?lang the last language used wins');
check(new URL(plain.url()).searchParams.get('lang') === 'he', 'and the address gains ?lang=he, so a copied link opens in Hebrew');

// An English link opens in English even for a visitor whose last language was Hebrew.
const english = await context.newPage();
await english.goto(`${base}/projects/building-preview.html?lang=en`, { waitUntil: 'networkidle' });
check(await dir(english) === 'en/ltr', 'a ?lang=en link opens in English after a Hebrew visit');

check(!errors.length, 'no page errors', errors.join(' | '));
await browser.close();
process.exit(failed ? 1 : 0);
