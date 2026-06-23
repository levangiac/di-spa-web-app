# Di Spa Web App

Web app đặt lịch spa & wellness, xây dựng song song với Flutter mobile app "Di Spa App".

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript strict
- **UI:** Tailwind CSS v4 + shadcn/ui + Phosphor Icons (thin weight)
- **State:** TanStack Query (server state) + Zustand (client state)
- **Auth:** NextAuth.js v5 — Credentials (phone+password) + Google OAuth
- **i18n:** next-intl (vi / en / ja)
- **Forms:** React Hook Form + Zod

## Routes

| Route | Mô tả |
|---|---|
| `/home` | Trang chủ |
| `/search` | Tìm kiếm spa |
| `/spa/[id]` | Chi tiết spa + dịch vụ |
| `/booking` | Đặt lịch |
| `/promotions` | Ưu đãi |
| `/history` | Lịch sử đặt lịch |
| `/account` | Tài khoản |

## Getting Started

```bash
cp .env.local.example .env.local   # điền API keys
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).
