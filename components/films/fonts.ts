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
