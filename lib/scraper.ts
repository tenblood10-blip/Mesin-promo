// MESIN PENYEDOT PROMO - Ngambil dari link asli tiap hari

export const SUMBER_PROMO = [
  { toko: "Indomaret", url: "https://katalogpromosi.com/promo-indomaret/" },
  { toko: "Alfamart", url: "https://katalogpromosi.com/promo-alfamart/" },
  { toko: "Indomaret", url: "https://www.indomaret.co.id/promo" },
  { toko: "Alfamart", url: "https://www.alfamart.co.id/promo" },
];

// Daftar barang yang kita pantau + harga warung
export const DAFTAR_PANTAU: Record<string, number> = {
  "SEDAAP": 15000,
  "INDOMIE": 15500,
  "MINYAK": 47000,
  "GULA": 17500,
  "POP MIE": 6500,
  "TROPICAL": 47000,
  "SUSU": 11000,
  "KOPI": 12000,
  "SABUN": 8000,
  "SHAMPOO": 15000,
};

export async function sedotPromo() {
  const hasil: any[] = [];

  for (const sumber of SUMBER_PROMO) {
    try {
      const res = await fetch(sumber.url, {
        headers: { "User-Agent": "Mozilla/5.0 (Android) MesinPromo/1.0" },
        next: { revalidate: 0 },
      });
      const html = await res.text();
      const textBersih = html.replace(/<[^>]*>/g, " ").toUpperCase();

      // Cari tiap barang yang kita pantau di halaman promo itu
      for (const [barang, hargaWarung] of Object.entries(DAFTAR_PANTAU)) {
        if (textBersih.includes(barang)) {
          // Cari harga Rp di dekat nama barang - pake Regex
          // Contoh di web: "SEDAAP Rp 13.000" atau "SEDAAP 13.900"
          const regex = new RegExp(barang + ".{0,80}?(RP\\s?\\d+[\\.\\,]\\d+|\\d+[\\.\\,]\\d{3})", "i");
          const match = textBersih.match(regex);
          
          let hargaPromo = 0;
          if (match) {
            const angka = match[1].replace(/[^0-9]/g, "");
            hargaPromo = parseInt(angka);
          }

          // Kalo ketemu harga yang masuk akal (1000 - 100.000), simpen!
          if (hargaPromo > 1000 && hargaPromo < 100000) {
            const untung = hargaWarung - hargaPromo - 500; // 500 bensin
            hasil.push({
              barang,
              toko: sumber.toko,
              urlSumber: sumber.url,
              harga_promo: hargaPromo,
              hargaWarung,
              untung,
              persen: ((untung / hargaPromo) * 100).toFixed(1),
              status: untung >= 1000 ? "BORONG!" : "SKIP",
              waktuAmbil: new Date().toLocaleString("id-ID"),
            });
          }
        }
      }
    } catch (e) {
      console.log("Gagal sedot " + sumber.url);
    }
  }

  // Kalo web-nya nge-block / lagi down, pake data cadangan biar mesin tetep jalan
  if (hasil.length === 0) {
    return [
      { barang: "SEDAAP", toko: "Indomaret", urlSumber: "https://katalogpromosi.com/promo-indomaret/", harga_promo: 13000, hargaWarung: 15000, untung: 1500, persen: "11.5", status: "BORONG!", waktuAmbil: "Data Cadangan - Cek Link Manual" },
      { barang: "MINYAK", toko: "Indomaret", urlSumber: "https://katalogpromosi.com/promo-indomaret/", harga_promo: 41500, hargaWarung: 47000, untung: 5000, persen: "12.0", status: "BORONG!", waktuAmbil: "Data Cadangan - Cek Link Manual" },
    ];
  }

  return hasil;
  }
