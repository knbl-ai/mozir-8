import localFont from 'next/font/local';

// The six faces of the three film styles (the same as pipeline/highlights/kit/themes/<slug>), self-hosted (latin, woff2
// from Google Fonts) so the build never fetches from Google: on 2026-11-09 Vercel's build failed in next/font/google
// (a font URL without an extension). Used by the films layout (hub + style pages) and the landing's #films section.
export const instrument = localFont({ variable: '--f-riviera-d', display: 'swap', src: [
 { path: './fonts/instrument-serif.woff2', weight: '400', style: 'normal' },
 { path: './fonts/instrument-serif-italic.woff2', weight: '400', style: 'italic' }] });
export const dmMono = localFont({ variable: '--f-riviera-t', display: 'swap', src: [
 { path: './fonts/dm-mono-400.woff2', weight: '400', style: 'normal' },
 { path: './fonts/dm-mono-500.woff2', weight: '500', style: 'normal' }] });
export const hanken = localFont({ variable: '--f-mono-d', display: 'swap', src: [{ path: './fonts/hanken-grotesk.woff2', weight: '300 800', style: 'normal' }] });
export const geistMono = localFont({ variable: '--f-mono-t', display: 'swap', src: [{ path: './fonts/geist-mono.woff2', weight: '400 500', style: 'normal' }] });
export const bricolage = localFont({ variable: '--f-sunday-d', display: 'swap', src: [{ path: './fonts/bricolage-grotesque.woff2', weight: '400 800', style: 'normal' }] });
export const spaceMono = localFont({ variable: '--f-sunday-t', display: 'swap', src: [
 { path: './fonts/space-mono-400.woff2', weight: '400', style: 'normal' },
 { path: './fonts/space-mono-700.woff2', weight: '700', style: 'normal' }] });

// Hebrew companions, one pair per style (Google Fonts, OFL, Hebrew subset only): they come FIRST in each style's stack
// and cover only Hebrew letters, so Latin keeps the style's own face. (Behind the style face, Hebrew would land in
// next/font's metric fallback — Arial — before reaching them: seen 2026-11-10.)
// (next/font needs literal options in every call: no shared object.)
export const heRivieraD = localFont({ display: 'swap', preload: false, adjustFontFallback: false, fallback: [], declarations: [{ prop: 'unicode-range', value: 'U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F' }], variable: '--he-riviera-d', src: [{ path: './fonts/he/frank-ruhl.woff2', weight: '300 900', style: 'normal' }] });   // Frank Ruhl Libre: the editorial serif
export const heRivieraT = localFont({ display: 'swap', preload: false, adjustFontFallback: false, fallback: [], declarations: [{ prop: 'unicode-range', value: 'U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F' }], variable: '--he-riviera-t', src: [{ path: './fonts/he/assistant.woff2', weight: '200 800', style: 'normal' }] });   // Assistant: light, airy text
export const heMono = localFont({ display: 'swap', preload: false, adjustFontFallback: false, fallback: [], declarations: [{ prop: 'unicode-range', value: 'U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F' }], variable: '--he-mono', src: [{ path: './fonts/he/ibm-plex-hebrew-300.woff2', weight: '300', style: 'normal' }, { path: './fonts/he/ibm-plex-hebrew-400.woff2', weight: '400', style: 'normal' }, { path: './fonts/he/ibm-plex-hebrew-600.woff2', weight: '600', style: 'normal' }] });   // IBM Plex Sans Hebrew: technical, drawing-set
export const heSundayD = localFont({ display: 'swap', preload: false, adjustFontFallback: false, fallback: [], declarations: [{ prop: 'unicode-range', value: 'U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F' }], variable: '--he-sunday-d', src: [{ path: './fonts/he/fredoka.woff2', weight: '300 700', style: 'normal' }] });   // Fredoka: round, cheerful display
export const heSundayT = localFont({ display: 'swap', preload: false, adjustFontFallback: false, fallback: [], declarations: [{ prop: 'unicode-range', value: 'U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F' }], variable: '--he-sunday-t', src: [{ path: './fonts/he/rubik.woff2', weight: '300 900', style: 'normal' }] });   // Rubik: friendly text
