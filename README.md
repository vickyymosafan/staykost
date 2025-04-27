# StayKost - Aplikasi Manajemen Kost

StayKost adalah platform pengelolaan kost yang menghubungkan pemilik kost (owner) dengan pencari dan penyewa kost (user), dengan dukungan administratif yang kuat untuk memastikan layanan yang optimal.

## Teknologi yang Digunakan

- PHP/Laravel
- MySQL
- HTML/CSS/JavaScript
- Bootstrap/Tailwind CSS (Frontend Framework)
- Integrasi Payment Gateway (Midtrans/Xendit)
- Google Maps API (untuk peta interaktif)

## Prasyarat

- PHP >= 8.0
- Composer
- MySQL
- XAMPP/WampServer/Laragon
- Node.js dan NPM

## Instalasi

1. Clone repositori ini:

    ```
    git clone https://github.com/yourrepository/staykost.git
    ```

2. Masuk ke direktori proyek:

    ```
    cd staykost
    ```

3. Instal dependensi PHP:

    ```
    composer install
    ```

4. Instal dependensi JavaScript:

    ```
    npm install && npm run dev
    ```

5. Salin file .env.example menjadi .env:

    ```
    cp .env.example .env
    ```

6. Generate application key:

    ```
    php artisan key:generate
    ```

7. Konfigurasi database di file .env

8. Jalankan migrasi database:

    ```
    php artisan migrate
    ```

9. Jalankan seeder untuk membuat akun admin:

    ```
    php artisan db:seed --class=AdminSeeder
    ```

10. Buat symbolic link untuk storage (untuk pengelolaan gambar):

    ```
    php artisan storage:link
    ```

11. Jalankan server development:

    ```
    composer run dev
    ```

12. Akses aplikasi melalui browser: http://localhost:8000

## Kredensial Admin

```
Email: admin@gmail.com
Password: admin
Nama: Admin
```

## Fitur Utama

### 1. Admin

- Manajemen Pengguna & Akses
- Verifikasi & KYC
- Manajemen Properti & Konten
- Keuangan & Transaksi
- Laporan & Analitik
- Sistem Keamanan & Audit
- Pengaturan & Promosi

### 2. Owner Kost

- Dasbor Properti (CRUD Kamar & Unit)
- Kalender Ketersediaan
- Manajemen Booking & Pelanggan
- Komunikasi & Notifikasi
- Laporan & Analitik Khusus Owner

### 3. User (Pencari & Penyewa Kost)

- Pencarian & Eksplorasi dengan Peta Interaktif
- Detail Listing dengan Galeri Foto & Virtual Tour
- Proses Booking & Pembayaran
- Dashboard & Manajemen Akun
- Bantuan & Support

## Integrasi Pendukung

- Payment Gateway (Midtrans, Xendit)
- Maps & Geolocation API
- Email/SMS Gateway
- Layanan Cloud

## Skema Database

Proyek menggunakan database relasional dengan tabel-tabel utama:

- Users (Admin, Owner, User)
- Properties (Kost)
- Rooms
- Bookings
- Payments
- Reviews

## Lisensi

Proyek ini dilisensikan di bawah [nama lisensi] - lihat file LICENSE.md untuk detail.

## Kontak

Untuk pertanyaan atau bantuan, hubungi kami di support@staykost.com
