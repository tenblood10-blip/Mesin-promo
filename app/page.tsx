"use client";
import { useEffect, useState } from 'react';
export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/check-promo').then(r => r.json()).then(d => { setData(d.hasil || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', background: '#0f0f0f', color: 'white', minHeight: '100vh' }}>
      <h1>🤖 MESIN PROMO - NYEDOT LINK ASLI</h1>
      <p>By tenblood10-blip | Update otomatis tiap hari jam 7 pagi dari katalogpromosi.com</p>
      {loading ? <p>⏳ Lagi nyedot promo dari link asli...</p> : data.length === 0 ? <p>Belum ada promo ketemu, coba refresh.</p> : data.map((item, i) => (
        <div key={i} style={{ background: item.status === 'BORONG!' ? '#14532d' : '#27272a', padding: 15, borderRadius: 12, marginBottom: 12 }}>
          <h2>{item.barang} - {item.status}</h2>
          <p>{item.toko}: Promo Rp {item.harga_promo?.toLocaleString()} | Warung Rp {item.hargaWarung?.toLocaleString()}</p>
          <p><b>Untung: Rp {item.untung?.toLocaleString()} ({item.persen}%)</b></p>
          <p style={{ fontSize: 12, opacity: 0.7 }}>Sumber: {item.urlSumber}</p>
          <a href={item.urlSumber} target="_blank" style={{ color: '#4ade80', fontWeight: 'bold' }}>🔗 LIHAT KATALOG ASLI →</a>
        </div>
      ))}
      <p style={{ opacity: 0.5, marginTop: 20 }}>Sumber: katalogpromosi.com / indomaret.co.id / alfamart.co.id</p>
    </div>
  );
    }
