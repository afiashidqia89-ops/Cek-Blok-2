# Audit Data Awal

Dataset berisi 6041 baris dengan kolom Estate, Kebun, Afdeling, Blok, Luas (Ha), dan Jumlah Pokok.

Keputusan normalisasi:
- Luas dibulatkan menjadi 2 desimal saat diekspor ke CSV.
- Jumlah pokok disimpan sebagai bilangan bulat.
- Data nol dipertahankan dan ditandai untuk review.
- Afdeling disimpan sebagai teks karena terdapat nilai numerik dan kode seperti OP, OQ, OR, dan lainnya.
