'use client';
// The apartment page's data (one JSON per page): every fact, media file and text the page shows, plus each section's
// status. Alma Bay builds it from its content files (content/projects/alma-bay-home-data.ts); a client order's page
// loads it from the bucket (content/home-page.ts, route /r/<slug>), written by the pipeline (pipeline/client/page.py).
// Texts are { en: …, he: …, pt: … }: the page's language when given, else English.
import { createContext, createElement, useContext, type ReactNode } from 'react';
import { RTL, useLang, type Lang } from '@/lib/i18n';
import type { Orbit } from '@/content/projects/shirat-hayam';
import { T } from './strings';

export type Tx = { en: string } & Partial<Record<string, string>>;
/** ready: shown · building: shown as "under construction" in the page's style · hidden: left out */
export type Status = 'ready' | 'building' | 'hidden';
export type FilmStyleSlug = 'riviera-editorial' | 'sunday-house' | 'monograph';
export const SECTIONS = ['films', 'plan', 'model', 'building', 'area', 'contact', 'kit'] as const;
export type Section = typeof SECTIONS[number];

export type PlanRoom = { id: string; type: string; name: string; area: number | null; w: number | null; d: number | null; poly: number[][]; c: number[] };
export type PlanData = { cutout: { image: string; x: number; y: number; w: number; h: number }; view: number[]; headline: { area_m2: number; balcony_m2: number }; rooms: PlanRoom[] };
export type Place = { id: string; kind: string; name: string; label: string; walk_min: number | null; walk_m: number | null; xy: number[]; route: string | null };
export type FilmCut = { src: string; poster: string; length: string; aspect: string };
export type Shot = { kind: 'img' | 'video'; src: string; thumb: string; caption: Tx };

export interface HomeData {
 v: 2;
 slug: string;
 style: FilmStyleSlug;
 langs: Lang[];                                   // the languages the page offers (first = default)
 status: Record<Section, Status>;
 project: Tx;                                     // the development's name (or the street, without one)
 unit: Tx;                                        // "Residence 01", "Apartment 12"
 where: { tower?: string; floor?: number; floors?: number };
 address: { no?: string; street: Tx; word?: Tx; city: Tx; country: Tx };
 developer?: { name: Tx; logoWhite?: string; logoBlack?: string; url?: string; linkLabel?: Tx; about?: Tx; facts: { value: string; label: Tx }[] };
 agent?: { name: Tx; role?: Tx; phone?: string; email?: string; photo?: string };
 hero: { wide?: string; wideStill: string; tall?: string; tallStill?: string };
 facts: { area: number; balcony: number; rooms: number; nearest?: { minutes: number; label: Tx; icon: string } };
 copy: {                                          // the home's own sentences (the interface words are in strings.ts)
  pointsHead: [Tx, Tx]; wholeLine: Tx; aspect: Tx;
  buildingHead?: [Tx, Tx]; buildingSub?: Tx; buildingCanvas?: Tx;
 };
 points: { icon: string; title: Tx; text: Tx }[];
 films: Partial<Record<string, { long: FilmCut; short: FilmCut; phone: FilmCut }>>;   // per language (en = fallback)
 plan: PlanData;
 roomOrder: string[];
 rooms: Record<string, { name?: Tx; line: Tx; images: string[]; clip?: string }>;
 gallery: { src: string; thumb: string; caption: Tx; room?: string }[];
 model?: { glb: string; poster: string; orbit?: string; outdoorOrbit?: string; walk?: string };
 building?: { orbit?: { frames: string; ringVideo?: string; unit: string; startView: number; aspect?: number }; figures: { value: string; label: Tx }[]; media: Shot[] };
 map?: { image: string; view: number[]; home: number[]; items: (Omit<Place, 'name' | 'label'> & { name: Tx; label: Tx })[] };
 kit?: Partial<Record<string, { href: string; size: string; files: number; parts: { n: string; label: Tx }[] }>>;   // per language
 allLink?: { href: string; label: Tx };
}
export type { Orbit };

const Ctx = createContext<HomeData | null>(null);
export const HomeDataProvider = ({ data, children }: { data: HomeData; children: ReactNode }) => createElement(Ctx.Provider, { value: data }, children);

/** The page's language, its interface words, its data, and a reader for its texts. */
export function useHome() {
 const d = useContext(Ctx);
 if (!d) throw new Error('useHome outside HomeDataProvider');
 const lang = useLang();
 const L = (d.langs.includes(lang) ? lang : d.langs[0]) as Lang;
 const t = (T as Record<string, typeof T.en>)[L] ?? T.en;          // interface words: en / he (others fall back to English)
 const tx = (x: Tx | undefined) => (x ? x[L] ?? x.en : '');
 const byLang = <V,>(m: Partial<Record<string, V>> | undefined) => m?.[L] ?? m?.en;
 return { d, L, t, tx, byLang, rtl: RTL.includes(L) };
}
