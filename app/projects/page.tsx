import Link from 'next/link';
import { developments } from '@/content/projects';
import styles from '@/components/building/building.module.css';
export const metadata={title:'The residence collection'};
export default function Projects(){return <main className={styles.directory}><span className={styles.kicker}>THE RESIDENCE COLLECTION</span><h1>Places to<br/><em>call home.</em></h1><Link href="/">Mozir 8 <small>Completed apartment presentation · Tel Aviv ↗</small></Link>{developments.map(p=><Link key={p.id} href={`/projects/${p.id}`}>{p.name}<small>Building explorer · Three residence plans · Preview ↗</small></Link>)}</main>;}
