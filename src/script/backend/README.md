# Expense Tracker Backend

Backend Express.js untuk aplikasi Catatan dan Analisis Pengeluaran Pribadi.

## Fitur

✅ **Autentikasi JWT** - Login dan Register dengan token JWT 24 jam  
✅ **Password Hashing** - Menggunakan bcryptjs untuk keamanan password  
✅ **CRUD Expenses** - Buat, baca, ubah, dan hapus pengeluaran  
✅ **User Isolation** - Setiap user hanya bisa melihat pengeluaran mereka sendiri  
✅ **CORS Enabled** - Terhubung dengan frontend di localhost:5173

## Instalasi

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

File `.env` sudah dibuat. Pastikan isinya:

```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

⚠️ **Untuk production**, ubah `JWT_SECRET` dengan string random yang aman!

### 3. Jalankan Server

Development mode dengan hot reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server akan berjalan di **http://localhost:5000**

## API Endpoints

### Authentication

#### Register

```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response (201):
{
  "message": "Pendaftaran berhasil",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response (200):
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Expenses (Semua endpoint memerlukan JWT Token)

#### Get All Expenses

```
GET /api/expenses
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 1,
    "userId": 1,
    "description": "Makan siang",
    "amount": 50000,
    "category": "Food",
    "date": "2025-11-20",
    "receipt_path": null
  }
]
```

#### Get Single Expense

```
GET /api/expenses/:id
Authorization: Bearer <token>

Response (200):
{
  "id": 1,
  "userId": 1,
  "description": "Makan siang",
  "amount": 50000,
  "category": "Food",
  "date": "2025-11-20",
  "receipt_path": null
}
```

#### Create Expense

```
POST /api/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Makan siang",
  "amount": 50000,
  "category": "Food",
  "date": "2025-11-20",
  "receipt_path": null
}

Response (201):
{
  "message": "Pengeluaran berhasil ditambahkan",
  "expense": {
    "id": 1,
    "userId": 1,
    "description": "Makan siang",
    "amount": 50000,
    "category": "Food",
    "date": "2025-11-20T00:00:00.000Z",
    "receipt_path": null
  }
}
```

#### Update Expense

```
PUT /api/expenses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Makan siang di mall",
  "amount": 60000,
  "category": "Food"
}

Response (200):
{
  "message": "Pengeluaran berhasil diperbarui",
  "expense": {
    "id": 1,
    "userId": 1,
    "description": "Makan siang di mall",
    "amount": 60000,
    "category": "Food",
    "date": "2025-11-20",
    "receipt_path": null
  }
}
```

#### Delete Expense

```
DELETE /api/expenses/:id
Authorization: Bearer <token>

Response (200):
{
  "message": "Pengeluaran berhasil dihapus"
}
```

### Health Check

```
GET /api/health

Response (200):
{
  "message": "Server is running",
  "timestamp": "2025-11-20T10:30:45.123Z"
}
```

## Struktur Database

Data disimpan dalam file JSON (`data.json`):

```json
{
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "password": "$2a$10$..." // hashed password
    }
  ],
  "expenses": [
    {
      "id": 1,
      "userId": 1,
      "description": "Makan siang",
      "amount": 50000,
      "category": "Food",
      "date": "2025-11-20",
      "receipt_path": null
    }
  ]
}
```

## Kategori Pengeluaran

- `Food` - Makanan & minuman
- `Transport` - Transportasi
- `Housing` - Tempat tinggal
- `Entertainment` - Hiburan
- `Other` - Lainnya

## Error Codes

| Status | Message      | Deskripsi                               |
| ------ | ------------ | --------------------------------------- |
| 400    | Bad Request  | Input tidak lengkap atau tidak valid    |
| 401    | Unauthorized | Email/password salah atau token expired |
| 403    | Forbidden    | Token tidak valid                       |
| 404    | Not Found    | Resource tidak ditemukan                |
| 409    | Conflict     | Email sudah terdaftar                   |
| 500    | Server Error | Kesalahan internal server               |

## Development Tips

### Testing dengan cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get expenses (ganti TOKEN dengan token dari login)
curl http://localhost:5000/api/expenses \
  -H "Authorization: Bearer TOKEN"
```

### Menggunakan Postman

1. Set method ke POST/GET/PUT/DELETE sesuai kebutuhan
2. Masukkan URL endpoint
3. Untuk endpoints yang memerlukan auth:
   - Tab **Headers** → tambah `Authorization: Bearer <token>`
   - Atau gunakan tab **Auth** → Type: Bearer Token → input token

## Database Persistence

Database menggunakan file JSON (`data.json`) untuk simplicity. Untuk production, gunakan database seperti:

- PostgreSQL
- MongoDB
- MySQL

## Security Notes

⚠️ **Untuk production:**

1. Ubah `JWT_SECRET` ke string random yang aman
2. Gunakan database yang proper, bukan JSON file
3. Tambahkan HTTPS
4. Implementasikan rate limiting
5. Validasi input lebih ketat
6. Tambahkan refresh token mechanism

## Troubleshooting

### Port 5000 sudah digunakan

```bash
# Ubah port di .env atau jalankan di port lain
PORT=5001 npm start
```

### CORS Error

Pastikan `ORIGIN` di `server.js` sesuai dengan URL frontend (default: http://localhost:5173)

### Database Error

Hapus file `data.json` dan jalankan ulang server - file baru akan dibuat otomatis.

## Next Steps

✅ Backend sudah ready  
🔲 Integrasikan dengan frontend (sudah siap)  
🔲 Tambahkan file upload untuk receipt  
🔲 Implementasikan export/report expenses  
🔲 Migrasi ke database yang proper

Enjoy your Expense Tracker! 💰
