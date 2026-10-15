'use client';
import { useEffect } from 'react';
import { captureAttribution } from '@/lib/attribution';

// Remembers the campaign a visitor arrived from (any page), for the lead form; renders nothing.
export default function AttributionCapture() {
 useEffect(() => { captureAttribution(); }, []);
 return null;
}
