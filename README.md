# Cek Blok

Aplikasi master data blok berbasis **Next.js**, **GitHub**, **Vercel**, dan **Neon PostgreSQL**. Dataset awal berasal dari `DB_Aresta_2026-10-14[1].xlsx`.

## Ringkasan dataset awal

- Baris blok: 6,041
- Estate unik: 24
- Kombinasi kebun unik: 33
- Kombinasi afdeling unik: 165
- Total luas: 75,248.68 ha
- Total jumlah pokok: 8,822,338
- Baris luas dan pokok = 0: 1,549

## Jalankan lokal

```bash
npm install
cp .env.example .env
# Isi DATABASE_URL dari Neon
npx prisma db push
npm run db:seed
npm run dev
```

Buka `http://localhost:3000`.

## Neon

1. Buat project baru di Neon.
2. Salin connection string PostgreSQL.
3. Simpan sebagai `DATABASE_URL` di `.env` lokal dan Vercel Environment Variables.
4. Jalankan `npx prisma db push`, lalu `npm run db:seed` satu kali dari komputer lokal.

## GitHub dan Vercel

```bash
git init
git add .
git commit -m "Initial Cek Blok"
git branch -M main
git remote add origin https://github.com/USERNAME/cek-blok-neon.git
git push -u origin main
```

Di Vercel: **Add New Project → Import GitHub repository → Environment Variables → DATABASE_URL → Deploy**.

## Catatan data

Nilai luas dan jumlah pokok nol dipertahankan dan diberi status `DATA_KOSONG` agar dapat ditinjau, bukan dihapus. Kunci unik database adalah gabungan `estate + kebun + afdeling + kode blok`.
