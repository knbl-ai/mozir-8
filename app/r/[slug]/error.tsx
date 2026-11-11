'use client';
// A client page that fails to render (data the checks let through): a calm message instead of a broken page.
export default function Error() {
 return <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
  <div><h1 style={{ fontSize: 28, margin: '0 0 10px' }}>This page is being updated</h1>
   <p style={{ margin: 0, color: '#666' }}>Please try again in a minute.</p>
   <p dir="rtl" style={{ margin: '6px 0 0', color: '#666' }}>העמוד מתעדכן — נסו שוב בעוד דקה.</p></div>
 </main>;
}
