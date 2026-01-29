# Beaconia

Şimdi ne yapmalıyım? - Decision Helper Backend API

## Proje Yapısı

```
beaconia/
├── mobile/          # Mobil uygulama (React Native)
└── server/          # Backend API (Express.js)
```

## Server (Backend)

### Teknolojiler
- **Express.js** - Web framework
- **TypeScript** - Tip güvenliği
- **Prisma** - ORM
- **PostgreSQL** - Veritabanı
- **Zod** - Validasyon
- **JWT** - Authentication

### Kurulum

```bash
cd server
npm install
```

### Environment Variables

`.env.example` dosyasını `.env` olarak kopyalayın ve değerleri düzenleyin:

```bash
cp .env.example .env
```

### Veritabanı Kurulumu

```bash
# Prisma client oluştur
npm run db:generate

# Veritabanını migrate et
npm run db:push

# Seed data ekle
npm run db:seed
```

### Çalıştırma

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### API Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/auth/register` | Kayıt ol | ❌ |
| POST | `/auth/login` | Giriş yap | ❌ |
| GET | `/activities` | Aktiviteleri listele | ❌ |
| POST | `/recommend` | Öneri al | 📌 Opsiyonel |
| GET | `/favorites` | Favorileri listele | ✅ |
| POST | `/favorites/:activityId` | Favorilere ekle | ✅ |
| DELETE | `/favorites/:activityId` | Favorilerden sil | ✅ |
| GET | `/history` | Geçmişi listele | ✅ |
| POST | `/feedback` | Geri bildirim ver | ✅ |
| GET | `/health` | Sağlık kontrolü | ❌ |

### Swagger Docs

Uygulama çalışırken: http://localhost:3000/docs

## Mobile

Mobil uygulama kodları `mobile/` klasöründe yer alacak.
