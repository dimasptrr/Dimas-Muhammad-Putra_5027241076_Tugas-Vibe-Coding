# 💰 Expense Tracker Pro: Aplikasi Manajemen Keuangan Pribadi (MERN + TS)

Aplikasi ini adalah solusi *full-stack* berbasis web yang dirancang untuk mengelola dan menganalisis keuangan pribadi dengan fokus pada keamanan, visualisasi data yang mendalam, dan *user experience* yang modern.

---

## 📋 Daftar Isi

1.  [Fitur Unggulan](#-fitur-unggulan)
2.  [Teknologi dan Stacks](#-teknologi-dan-stacks)
3.  [Tampilan Utama Aplikasi](#️-tampilan-utama-aplikasi)
4.  [Instalasi dan Menjalankan Proyek](#-instalasi-dan-menjalankan-proyek)

---

## Fitur Unggulan

Proyek ini telah berhasil mengimplementasikan serangkaian fitur inti dan fitur analisis tingkat lanjut, memastikan fungsionalitas dan keamanan data yang optimal.

| Kategori | Fitur | Deskripsi |
| :--- | :--- | :--- |
| **Analisis Data** | Visualisasi Saldo & Tren | Menghitung dan menampilkan Total Pemasukan, Total Pengeluaran, dan Saldo Akhir. Saldo defisit (< 0) ditandai dengan warna merah. |
| | Grafik Lanjutan | Diagram Lingkaran (*Pie Chart*) untuk *Breakdown* Pengeluaran per Kategori, dan Grafik Batang (*Bar Chart*) untuk Tren Pemasukan/Pengeluaran 6 Bulan Terakhir. |
| **Pengelolaan Data** | Filter Tanggal Kustom | Fitur filter transaksi menggunakan rentang tanggal *Dari* dan *Sampai* yang spesifik. |
| | CRUD Transaksi | Fitur lengkap untuk membuat, melihat, mengedit, dan menghapus (*CRUD*) transaksi Pemasukan/Pengeluaran. |
| **Fitur Khusus** | Transaksi Berulang | Opsi penandaan transaksi sebagai 'Berulang' (*Recurring*) untuk manajemen data rutin. |
| **Keamanan** | Autentikasi Aman | Login/Register menggunakan **JWT** dan *password hashing* **Bcrypt** untuk keamanan sesi. |
| **Desain** | UI/UX Profesional | Desain *card-based* modern, *input form* terpusat, dan responsivitas penuh pada berbagai ukuran layar. |

---

## Teknologi dan Stacks

Proyek ini dikembangkan menggunakan tumpukan teknologi **MERN** dengan lapisan **TypeScript** yang ketat untuk skalabilitas dan pemeliharaan kode yang lebih baik.

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend** | React.js, TypeScript | Antarmuka pengguna yang dinamis dan ketat tipe. |
| **Routing** | React Router DOM | Manajemen navigasi multi-halaman yang efisien. |
| **API Client** | Axios | Komunikasi HTTP yang efisien dengan *backend*. |
| **Backend** | Node.js, Express.js | Server API RESTful yang cepat dan *non-blocking*. |
| **Database** | MongoDB (Mongoose) | Penyimpanan data NoSQL yang fleksibel dan skema berbasis objek. |
| **Keamanan** | JWT, Bcrypt | Otentikasi sesi berbasis token dan keamanan kata sandi. |
| **Visualisasi** | Chart Library (mis. Chart.js/Recharts) | Rendering grafik analisis yang interaktif. |

---

## 3. Tampilan Utama Aplikasi

Berikut adalah visualisasi antarmuka aplikasi, menunjukkan desain yang bersih dan fitur-fitur utamanya.

### 3.1. Dashboard Utama (Analisis dan Saldo)

Menampilkan ringkasan keuangan dan visualisasi data yang kompleks untuk pemahaman cepat.

* **Pengeluaran per Kategori** dan **Tren 6 Bulan Terakhir**.

![Dashboard Overview](Link_ke_Screenshot_2025-11-24_223130.jpg)

### 3.2. Daftar Transaksi & Filter Lanjutan

Tabel transaksi dengan *badge* visual yang jelas untuk jenis transaksi, dilengkapi dengan fitur filter tanggal yang spesifik.

![Transaction List](Link_ke_Screenshot_2025-11-24_223159.jpg)

### 3.3. Form Tambah Transaksi

Desain form yang terpusat dan terorganisir untuk input data yang cepat, termasuk opsi Transaksi Berulang dan Bukti Pembayaran.

![Add New Transaction Form](Link_ke_Screenshot_2025-11-24_223218.jpg)

### 3.4. Halaman Autentikasi

Desain Login/Register yang bersih, profesional, dan fokus di tengah layar.

#### Login Pengguna

![User Login](Link_ke_Screenshot_2025-11-24_223243.png)

#### Daftar Akun Baru

![New Account Registration](Link_ke_Screenshot_2025-11-24_223259.png)

---

## 4. Instalasi dan Menjalankan Proyek

### Prasyarat

Pastikan Anda telah menginstal lingkungan berikut:

* **Node.js** (v16+)
* **MongoDB** (Lokal atau *Cloud*)
* **npm** / **Yarn**

### Langkah-Langkah

1.  **Klon Repositori:**
    ```bash
    git clone [https://github.com/USERNAME_ANDA/expense-tracker-pro.git](https://github.com/USERNAME_ANDA/expense-tracker-pro.git)
    cd expense-tracker-pro
    ```

2.  **Konfigurasi dan Jalankan Backend:**
    ```bash
    cd backend
    npm install
    # Buat file .env untuk konfigurasi MONGO_URI dan JWT_SECRET
    npm start # Berjalan di port 5000 (contoh)
    ```

3.  **Konfigurasi dan Jalankan Frontend:**
    ```bash
    cd ../frontend
    npm install
    npm run dev # Berjalan di port 5173 (contoh)
    ```

Aplikasi siap diakses di browser Anda, biasanya di `http://localhost:5173`.
