# LibrarySystem
## Fitur Utama
* Operasi CRUD (Create, Read, Update, Delete) untuk koleksi buku.
* Pemisahan akses menggunakan header (x-user-role) untuk **Admin** dan **User**.
*  Validasi lokasi otomatis saat melakukan peminjaman buku dengan Latitude & Longitude.

## Penggunaan Teknologi
* **Backend**: Node.js v22.20.0 & Express.js.
* **Database**: MySQL dengan Sequelize ORM.
* **Frontend**: HTML5, CSS3 (Glassmorphism UI), & JavaScript Vanilla.
* **Testing**: Postman.

---

## Dokumentasi API

| Method | Endpoint | Deskripsi | Headers (Auth) | Body Payload (JSON) |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/books` | Menampilkan semua buku | - | - |
| **GET** | `/api/books/:id` | Menampilkan detail buku | - | - |
| **POST** | `/api/books` | Menambah buku baru | `x-user-role: admin` | `{"title": "Judul", "author": "Penulis", "stock": 15}` |
| **PUT** | `/api/books/:id` | Mengupdate data buku | `x-user-role: admin` | `{"title": "Judul Baru", "stock": 10}` |
| **DELETE** | `/api/books/:id` | Menghapus buku | `x-user-role: admin` | - |
| **POST** | `/api/borrow` | Meminjam buku & Lokasi | `x-user-role: user`, `x-user-id` | `{"bookId": 1, "latitude": -6.2, "longitude": 106.8}` |

> **Catatan Penting:**
> * **Admin Mode**: Memerlukan header `x-user-role: admin` untuk operasi tulis/ubah.
> * **User Mode**: Memerlukan header `x-user-role: user` dan `x-user-id` sebagai identitas peminjam.
> * **Geolocation**: Endpoint `/api/borrow` wajib menyertakan koordinat latitude & longitude.

---

## Logika Sistem

### 1. Mekanisme Otentikasi Stateless (Custom Headers)
Berbeda dengan sistem berbasis JWT atau Session, proyek ini menggunakan **Header-Based Authentication** untuk simulasi otentikasi cepat:
* **Admin Privilege (`x-user-role: admin`)**: Membuka jalur akses penuh untuk operasi destruktif dan modifikasi data seperti **POST**, **PUT**, dan **DELETE** pada entitas buku.
* **User Privilege (`x-user-role: user`)**: Membatasi pengguna hanya pada operasi **Read-Only** (melihat buku) dan akses spesifik ke endpoint peminjaman (`/api/borrow`).
* **Access Denied**: Setiap anomali role pada endpoint terproteksi akan memicu respon `403 Forbidden` dari middleware keamanan.

### 2. Workflow Peminjaman & Integritas Data
Logika peminjaman dirancang untuk memastikan sinkronisasi antara permintaan user dan ketersediaan stok:
* **Auto-Decrement**: Setiap transaksi peminjaman yang sukses akan memicu pengurangan stok secara otomatis pada tabel `Books`.
* **Stok Check**: Sistem melakukan validasi ketersediaan; jika stok bernilai 0, maka request peminjaman akan dibatalkan secara otomatis oleh server untuk mencegah data negatif.
* **Data Validation**: Field `title` dan `author` diproteksi agar tidak menerima nilai kosong (*null*) guna menjaga kualitas metadata buku.

### 3. Implementasi Geolocation Tracking
Fitur ini berfungsi sebagai validasi lokasi fisik saat transaksi terjadi:
* **Coordinate Requirement**: Endpoint peminjaman mewajibkan adanya payload `latitude` dan `longitude`.
* **Transaction Logging**: Koordinat lokasi tidak hanya divalidasi, tetapi juga diarsipkan ke dalam tabel `BorrowLogs` sebagai data audit peminjaman.

## Pengujian Postman
* Headers
<img width="2051" height="308" alt="image" src="https://github.com/user-attachments/assets/e7e2434a-2a6d-44b9-bd02-3e01a922fc80" />

1. GET Book
<img width="2240" height="1400" alt="image" src="https://github.com/user-attachments/assets/4879a205-7e4a-483a-a9fd-d3febccf47b7" />

2. GET Book by ID
<img width="2240" height="1400" alt="image" src="https://github.com/user-attachments/assets/30a2170a-52af-434c-9a5c-b2a115b19891" />

3. POST Book
<img width="2240" height="1400" alt="image" src="https://github.com/user-attachments/assets/490afdac-188e-4dac-98b8-2e31182f60ad" />

4. PUT Book
<img width="2240" height="1400" alt="image" src="https://github.com/user-attachments/assets/c210b07a-6809-41b1-909f-8b91d5b952d5" />

5. DELETE Book
<img width="2240" height="1400" alt="image" src="https://github.com/user-attachments/assets/d32acbd8-0a72-46ca-b211-686445de6de4" />

6. POST Borrow
<img width="2240" height="1400" alt="image" src="https://github.com/user-attachments/assets/aaf88c15-8a5f-42fd-9571-72bc919c6b2e" />
<img width="2240" height="1400" alt="image" src="https://github.com/user-attachments/assets/29945f09-8846-4f88-97cd-d564d94dfeb4" />

7. Akses Ditolak
<img width="2240" height="1400" alt="image" src="https://github.com/user-attachments/assets/46042784-c5ff-45fe-89ea-7711114bee1b" />


## Tampilan Web
1. Tampilan Awal
<img width="2240" height="1400" alt="image" src="https://github.com/user-attachments/assets/062177a3-e354-417f-abab-86019daeefcb" />

2. Tampilan Dashboard Admin
<img width="2240" height="1400" alt="image" src="https://github.com/user-attachments/assets/a10d4a4a-7d9a-4219-a3bd-b97a28ed91a6" />

3. Tambah Buku
<img width="2240" height="1400" alt="image" src="https://github.com/user-attachments/assets/48b819e0-bf5b-4ccd-8499-64f863c132c7" />

4. Edit Buku
<img width="2240" height="1400" alt="image" src="https://github.com/user-attachments/assets/a1c124b1-c2cb-4e72-a3d8-360afe5ff988" />

5. Tampilan Dashboard User
<img width="2240" height="1400" alt="image" src="https://github.com/user-attachments/assets/2d80046e-4040-4cc0-9305-213f9b3a263e" />

## Database
<img width="2240" height="1400" alt="image" src="https://github.com/user-attachments/assets/b4f5662e-7951-4f17-8818-ee047c3953d5" />
<img width="2240" height="1400" alt="image" src="https://github.com/user-attachments/assets/413cbf6e-9c09-488d-b243-462812d35523" />
<img width="2240" height="1400" alt="image" src="https://github.com/user-attachments/assets/cce67fff-5f15-4485-a6cb-c3e43c7905cf" />
















