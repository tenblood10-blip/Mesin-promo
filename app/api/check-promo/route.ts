import { NextResponse } from 'next/server';
import { sedotPromo } from '@/lib/scraper';

async function kirimTelegram(pesan: string) {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: pesan, parse_mode: 'HTML' }),
  });
}

export async function GET() {
  const hasil = await sedotPromo();
  for (const item of hasil) {
    if (item.status === "BORONG!") {
      await kirimTelegram(
        `🚨 SINYAL BORONG - DARI LINK ASLI!\n\nBarang: ${item.barang}\nToko: ${item.toko}\nPromo: Rp ${item.harga_promo}\nWarung: Rp ${item.hargaWarung}\nUntung: Rp ${item.untung} (${item.persen}%)\n\nCek Link: ${item.urlSumber}\n\nGas borong!`
      );
    }
  }
  return NextResponse.json({ sukses: true, jumlah: hasil.length, hasil });
                          }
