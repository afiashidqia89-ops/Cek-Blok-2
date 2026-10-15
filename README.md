# Dompet Keluarga APK

Paket ini mengubah aplikasi HTML **Dompet Keluarga** menjadi APK Android menggunakan Capacitor dan GitHub Actions.

## Struktur penting

- `www/index.html` - aplikasi utama.
- `www/manifest.webmanifest` - metadata aplikasi.
- `capacitor.config.json` - konfigurasi Android.
- `.github/workflows/build-apk.yml` - workflow build APK otomatis.
- `package.json` - dependensi Capacitor.

## Build APK melalui GitHub

1. Buat repository GitHub baru.
2. Ekstrak ZIP paket ini.
3. Upload **seluruh isi folder `dompet-keluarga-apk`** ke root repository. Jangan hanya mengunggah file HTML.
4. Pastikan folder tersembunyi `.github/workflows` ikut terunggah.
5. Commit ke branch `main` atau `master`.
6. Buka tab **Actions** pada repository.
7. Pilih **Build Dompet Keluarga APK**.
8. Klik **Run workflow**.
9. Setelah build selesai, buka hasil workflow.
10. Unduh artifact **Dompet-Keluarga-APK**.
11. Ekstrak artifact untuk memperoleh `Dompet-Keluarga-debug.apk`.

## Catatan Firebase

Fitur sinkronisasi dua HP di aplikasi memuat Firebase melalui HTTPS. Konfigurasi Firebase tetap dimasukkan dari menu aplikasi. Jangan menaruh kredensial admin, service account, atau private key Firebase di HTML maupun repository.

Atur Firestore Security Rules agar hanya pengguna yang berwenang dapat membaca atau mengubah dokumen keluarga. Konfigurasi frontend Firebase bukan pengganti autentikasi dan aturan akses.

## Build lokal opsional

Memerlukan Node.js 20, Java 21, dan Android SDK.

```bash
npm install
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

Hasil: `android/app/build/outputs/apk/debug/app-debug.apk`.

## Distribusi

Workflow menghasilkan debug APK untuk pengujian dan instalasi langsung. Untuk Google Play, buat release Android App Bundle (`.aab`) dan tandatangani dengan keystore privat. Jangan commit keystore atau password ke repository.
