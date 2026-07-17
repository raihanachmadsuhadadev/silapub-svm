# Public Service Report Classification System

Public Service Report Classification System adalah aplikasi web untuk membantu warga menyampaikan aspirasi atau pengaduan, memantau status tindak lanjut, serta membantu admin mengelola laporan publik secara lebih terstruktur.

Aplikasi ini dilengkapi layanan Machine Learning menggunakan Support Vector Machine (SVM) untuk memberikan rekomendasi prioritas berdasarkan teks laporan yang dikirimkan warga.

## Ringkasan Sistem

Sistem terdiri dari tiga layanan utama: Laravel API sebagai backend, Next.js sebagai frontend, dan Flask sebagai ML service. Backend menangani autentikasi, data aspirasi, master data, laporan, serta integrasi dengan ML service. Frontend menyediakan antarmuka bagi warga dan admin. ML service memproses teks aspirasi menggunakan TF-IDF dan Linear SVM untuk menghasilkan rekomendasi prioritas.

Pemisahan layanan tersebut membuat tanggung jawab setiap komponen lebih jelas dan memungkinkan backend, frontend, serta proses klasifikasi dikembangkan secara terpisah.

## Developer Role

- Menganalisis workflow pengajuan aspirasi atau pengaduan publik, tindak lanjut laporan, dan kebutuhan akses pengguna.
- Merancang struktur aplikasi dengan pemisahan backend, frontend, dan ML service.
- Mengembangkan backend API menggunakan Laravel, Laravel Sanctum, PostgreSQL, dan REST API.
- Membangun frontend menggunakan Next.js, TypeScript, Tailwind CSS, dan integrasi API.
- Mengembangkan ML service menggunakan Flask, Python, scikit-learn, TF-IDF, dan Linear SVM.
- Mengimplementasikan role-based access untuk Warga dan Admin.
- Mengembangkan fitur registrasi warga, login, pengajuan aspirasi, upload lampiran, status tracking, verifikasi aspirasi, tanggapan admin, data latih SVM, master data, laporan, dan print laporan.
- Menyiapkan akun demo, screenshot aplikasi, dan dokumentasi project.

## Tech Stack

### Backend

- Laravel API
- Laravel Sanctum
- PostgreSQL
- REST API

### Frontend

- Next.js
- TypeScript
- Tailwind CSS

### Machine Learning Service

- Flask
- Python
- scikit-learn
- TF-IDF
- Linear SVM

### UI

- Glassmorphism
- Minimalist UI
- Responsive Layout

### Tools

- Composer
- NPM
- Git

## Fitur Utama

### Public Page

- Landing page informatif.

### Warga

- Register warga.
- Login warga.
- Dashboard warga.
- Pengajuan aspirasi dengan upload lampiran.
- Status tracking aspirasi.
- Detail aspirasi warga.

### Admin

- Login admin.
- Dashboard admin.
- Kelola data aspirasi.
- Detail dan verifikasi aspirasi.
- Update status aspirasi.
- Tanggapan admin.
- Data latih SVM.
- Master kategori aspirasi.
- Master wilayah.
- Laporan aspirasi.
- Print laporan.

### Machine Learning Recommendation

- Rekomendasi prioritas menggunakan SVM.
- Pemrosesan teks aspirasi menggunakan TF-IDF.
- Integrasi Laravel API dengan Flask ML service.

### Reports

- Penyajian laporan aspirasi untuk kebutuhan administrasi.
- Print preview dan print laporan.
- Pengelolaan laporan berdasarkan data aspirasi yang tersimpan.

### UI/UX

- Toast notification.
- Confirm dialog.
- Pagination.
- Empty state.
- Loading state.
- Responsive layout.

## Role & Akses

Sistem memiliki dua role dengan menu dan tindakan yang ditampilkan sesuai tanggung jawab masing-masing.

| Role | Hak Akses |
| --- | --- |
| Warga | Registrasi, login, mengajukan aspirasi, upload lampiran, melihat detail aspirasi, dan memantau status aspirasi. |
| Admin | Mengelola aspirasi, melakukan verifikasi, memberi tanggapan, memperbarui status, mengelola data latih SVM, mengelola master kategori, mengelola master wilayah, dan mengelola laporan. |

## Arsitektur Singkat

```text
Warga/Admin
    |
    v
Frontend Next.js
    |
    v
Laravel API + Sanctum
    |
    +--> PostgreSQL
    |
    +--> Flask ML Service
             |
             +--> TF-IDF + Linear SVM
```

Endpoint service default:

- Backend API: `http://127.0.0.1:8000`
- Frontend: `http://localhost:3000`
- ML Service: `http://127.0.0.1:5001`

## Struktur Project

```text
public-service-report-classification-system/
|-- backend/              # Laravel API, Sanctum, migrations, seeders, controllers
|-- frontend/             # Next.js, TypeScript, Tailwind CSS, halaman warga/admin
|-- ml-service/           # Flask service untuk prediksi prioritas
|-- docs/
|   `-- screenshots/      # Dokumentasi tampilan aplikasi
`-- README.md
```

## Screenshots

Berikut dokumentasi tampilan utama dan alur penggunaan aplikasi.

### Landing Page

![Landing Page](docs/screenshots/01-landing-page.png)

### Login

![Login Page](docs/screenshots/04-login-page.png)

### Register Warga

![Register Warga](docs/screenshots/05-register-warga.png)

### Dashboard Warga

![Dashboard Warga](docs/screenshots/06-dashboard-warga.png)

### Form Pengajuan Aspirasi

![Form Pengajuan Aspirasi](docs/screenshots/07-form-pengajuan-aspirasi.png)

### Detail Aspirasi Warga

![Detail Aspirasi Warga](docs/screenshots/08-detail-aspirasi-warga.png)

### Dashboard Admin

![Dashboard Admin](docs/screenshots/09-dashboard-admin.png)

### Data Aspirasi Admin

![Data Aspirasi Admin](docs/screenshots/10-data-aspirasi-admin.png)

### Detail dan Verifikasi Aspirasi

![Detail dan Verifikasi Aspirasi](docs/screenshots/11-detail-verifikasi-aspirasi.png)

### Rekomendasi Prioritas SVM

![Rekomendasi Prioritas SVM](docs/screenshots/12-rekomendasi-prioritas-svm.png)

### Data Latih SVM

![Data Latih SVM](docs/screenshots/13-data-latih-svm.png)

### Laporan Aspirasi

![Laporan Aspirasi](docs/screenshots/14-laporan-aspirasi.png)

### Print Preview Laporan

![Print Preview Laporan](docs/screenshots/15-print-preview-laporan.png)

## Persiapan Environment

Pastikan perangkat berikut tersedia pada environment lokal:

- PHP
- Composer
- Node.js
- npm
- Python
- pip
- PostgreSQL
- Git

Pastikan juga ekstensi PostgreSQL untuk PHP telah diaktifkan sebelum menjalankan migrasi backend.

## Setup Backend

Jalankan perintah berikut dari root project:

```powershell
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8000
```

Perintah `migrate:fresh --seed` membuat ulang tabel dan mengisi data awal, termasuk akun demo. Gunakan perintah tersebut pada database lokal yang aman untuk dihapus dan dibuat ulang.

## Setup Frontend

Jalankan frontend dari root project:

```powershell
cd frontend
npm install
npm run dev
```

Frontend berjalan di `http://localhost:3000`.

## Setup ML Service

Siapkan virtual environment dan jalankan ML service dari root project:

```powershell
cd ml-service
python -m venv .venv
.\.venv\Scripts\activate
pip install flask flask-cors scikit-learn pandas numpy joblib
python app.py
```

ML service berjalan di `http://127.0.0.1:5001` dan menyediakan endpoint:

- `GET /health` untuk memeriksa status service.
- `POST /predict` untuk menghasilkan rekomendasi prioritas aspirasi.

## Environment Example

Contoh konfigurasi `.env` backend:

```env
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=public_service_report_classification
DB_USERNAME=postgres
DB_PASSWORD=your_password

FRONTEND_URL=http://localhost:3000
ML_SERVICE_URL=http://127.0.0.1:5001
```

Contoh konfigurasi `.env.local` frontend:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_APP_NAME="Public Service Report Classification System"
```

| Service | Variable | Keterangan |
| --- | --- | --- |
| Backend | `APP_URL` | URL Laravel API. |
| Backend | `DB_*` | Konfigurasi koneksi PostgreSQL. |
| Backend | `FRONTEND_URL` | URL frontend Next.js. |
| Backend | `ML_SERVICE_URL` | URL Flask ML service. |
| Frontend | `NEXT_PUBLIC_API_URL` | Base URL endpoint Laravel API. |
| Frontend | `NEXT_PUBLIC_APP_NAME` | Nama aplikasi pada frontend. |

Sesuaikan nilai environment dengan mesin lokal. Jangan commit file `.env`, `.env.local`, atau kredensial pribadi ke repository.

## Akun Demo

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@silapub.test` | `password` |
| Warga | `warga@silapub.test` | `password` |

Akun demo dibuat melalui seeder dan digunakan untuk pengujian lokal.

## Alur Penggunaan Sistem

1. Warga membuka landing page dan melakukan registrasi atau login.
2. Warga mengajukan aspirasi melalui form pengajuan dan dapat menambahkan lampiran.
3. Sistem menyimpan aspirasi dan menampilkan status awal kepada warga.
4. Admin login ke dashboard admin untuk melihat daftar aspirasi masuk.
5. Admin membuka detail aspirasi, melakukan verifikasi, memberi tanggapan, dan memperbarui status.
6. Sistem dapat meminta rekomendasi prioritas ke ML service berdasarkan teks aspirasi dan data latih.
7. Admin mengelola data latih, kategori, wilayah, dan laporan aspirasi.
8. Warga memantau perkembangan aspirasi melalui halaman detail aspirasi.

## Metode Klasifikasi

Teks laporan atau aspirasi diproses oleh ML service. TF-IDF digunakan untuk mengubah teks menjadi fitur numerik, kemudian Linear SVM mengklasifikasikan atau memberikan rekomendasi prioritas laporan. Hasil pemrosesan dikembalikan ke backend dan ditampilkan kepada admin untuk ditinjau.

Rekomendasi prioritas merupakan informasi pendukung dan tidak diperlakukan sebagai keputusan akhir yang bersifat mutlak. Admin tetap perlu mempertimbangkan konteks laporan saat melakukan verifikasi dan menentukan tindak lanjut.

## Validasi Build

Gunakan perintah berikut untuk validasi lokal setiap layanan.

```powershell
cd backend
php artisan test
```

```powershell
cd frontend
npm run lint
npm run build
```

```powershell
cd ml-service
.\.venv\Scripts\activate
python app.py
```

Backend, frontend, dan ML service harus berjalan bersama agar fitur rekomendasi prioritas dapat digunakan secara lengkap.

## Project Status

Aplikasi telah selesai dikembangkan sebagai sistem pengelolaan dan klasifikasi laporan layanan publik berbasis web. Sistem mencakup pengajuan laporan oleh warga, pengelolaan laporan oleh admin, status tracking, tanggapan laporan, pelaporan, serta rekomendasi prioritas berbasis SVM.

Sistem masih dapat dikembangkan lebih lanjut melalui penyimpanan hasil training model secara permanen, dashboard statistik yang lebih detail, export laporan, notifikasi real-time, pengujian otomatis, konfigurasi deployment, dan penyempurnaan UI/UX.


