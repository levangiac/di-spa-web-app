# Data Layer & Folder Structure — Di Spa Web App

## Cấu trúc thư mục (domain-driven, không phải "feature" thuần UI)

```
src/
├─ app/                          # Next.js App Router — CHỈ routing + layout,
│                                 # KHÔNG chứa business logic
│  ├─ (auth)/login, register, otp, forgot-password
│  ├─ (main)/
│  │  ├─ page.tsx                # Home
│  │  ├─ spa/[id]/
│  │  ├─ booking/[spaId]/
│  │  ├─ promotions/
│  │  ├─ history/[bookingId]?
│  │  ├─ search/
│  │  ├─ notifications/
│  │  └─ account/
│  ├─ error.tsx, not-found.tsx   # global
│  └─ layout.tsx
│
├─ domains/                      # BUSINESS LOGIC — không phụ thuộc React/UI
│  ├─ auth/
│  │  ├─ actions.ts              # Server Actions: login, register, verifyOtp...
│  │  ├─ schema.ts               # Zod schema validate input
│  │  └─ types.ts
│  ├─ spa/
│  │  ├─ actions.ts
│  │  ├─ queries.ts              # hàm fetch dùng chung cho Server Component
│  │  ├─ utils/getSpaStatus.ts   # tính open/closed từ openingHours
│  │  └─ types.ts
│  ├─ booking/
│  │  ├─ actions.ts              # createBooking, previewBooking, cancelBooking
│  │  ├─ store.ts                # Zustand: useBookingDraftStore
│  │  └─ types.ts
│  ├─ promotion/                 # Promotion + Voucher
│  ├─ membership/
│  ├─ review/
│  ├─ favorite/
│  ├─ notification/
│  └─ account/                   # Profile, FAQ, Support, Language
│
├─ components/
│  ├─ ui/                        # shadcn primitives (button, card, dialog...)
│  └─ shared/                    # SpaCard, CategoryPill, BookingStepper,
│                                 # PromotionBanner — composite, dùng nhiều domain
│
├─ lib/
│  ├─ api/client.ts               # fetch wrapper + interceptor (xem dưới)
│  ├─ auth/                       # NextAuth config
│  └─ utils.ts
│
└─ messages/vi.json, en.json, ja.json   # next-intl
```

**Quy tắc cứng**: component trong `app/` và `components/` KHÔNG được tự viết
business rule (tính giá, điều kiện voucher, format trạng thái booking...) —
luôn import hàm từ `domains/<tên-domain>`. Nếu logic dùng ở >1 nơi mà chưa có
trong domain layer, thêm vào domain trước, không copy-paste.

## Mutation: thứ tự ưu tiên bắt buộc

```
1. Server Actions      (mặc định cho MỌI mutation: login, booking, review...)
2. React Query mutation (khi cần optimistic update / retry / cache invalidation
                          phức tạp ở client — wrap Server Action bên trong
                          useMutation, KHÔNG gọi fetch thủ công)
3. API Route Handler    (CHỈ khi cần proxy webhook, OAuth callback, hoặc
                          3rd-party service không hỗ trợ Server Action)
```

❌ **Cấm tuyệt đối**: gọi `fetch("/api/...", { method: "POST" })` trực tiếp
trong component để tạo booking, gửi review, đổi mật khẩu, v.v.

✅ **Đúng**:
```ts
// domains/booking/actions.ts
'use server'
export async function createBooking(input: CreateBookingInput) {
  const parsed = createBookingSchema.parse(input)
  // gọi backend API thật ở đây, qua lib/api/client.ts (server-side fetch)
  return apiClient.post('/bookings', parsed)
}

// components/BookingConfirmButton.tsx (Client Component)
'use client'
import { useMutation } from '@tanstack/react-query'
import { createBooking } from '@/domains/booking/actions'

const { mutate, isPending } = useMutation({ mutationFn: createBooking })
```

## Data Fetching: Server Component vs Client

```
Server Component  → fetch initial data trực tiếp (await trong component),
                     dùng cho SSR/SEO (Home, Spa Detail, Search kết quả ban đầu)
Client Component   → hydrate bằng React Query (useQuery), dùng khi cần
                     refetch, pagination, realtime (notification list,
                     booking slot khi đổi ngày)
```

❌ **Cấm tuyệt đối**:
```ts
useEffect(() => {
  fetch('/api/spas').then(...)
}, [])
```
Đây luôn là dấu hiệu sai kiến trúc — thay bằng Server Component fetch trực
tiếp, hoặc nếu bắt buộc client-side thì dùng `useQuery`.

✅ Pattern chuẩn cho trang cần SSR + sau đó client refetch (ví dụ Spa Detail
review list có thể load thêm):
```ts
// Server Component — app/spa/[id]/page.tsx
const spa = await getSpaDetail(id)   // domains/spa/queries.ts
return <SpaDetailClient initialData={spa} />

// Client Component nhận initialData, dùng làm initialData cho useQuery
const { data } = useQuery({
  queryKey: ['spa', id],
  queryFn: () => getSpaDetail(id),
  initialData,
})
```

## React Query vs Zustand — ranh giới rõ

```
React Query  → BẤT KỲ data nào có nguồn gốc từ server: spa list, booking
                history, notification, voucher list, user profile
Zustand       → BẤT KỲ state chỉ tồn tại tạm thời ở client, chưa/không lưu
                server: booking draft đang điền (service đã chọn, slot đang
                chọn trước khi submit), filter/sort đang áp ở UI, tab active,
                trạng thái mở/đóng của sheet/dialog phức tạp
```

Không dùng Zustand để cache lại data đã có trong React Query (tránh 2 nguồn
sự thật). Không dùng React Query để lưu state UI thuần (ví dụ tab đang chọn).

## API Client layer (`lib/api/client.ts`)

Tương đương `ApiService` (Dio) bên mobile — 1 instance fetch wrapper duy nhất,
mọi domain `actions.ts`/`queries.ts` đều gọi qua đây, không gọi `fetch` rời rạc:

- Tự gắn `Authorization: Bearer <token>` từ session (server-side: đọc cookie
  httpOnly; client-side: không cần vì mọi mutation đi qua Server Action).
- Interceptor 401 → thử refresh token 1 lần; nếu fail → clear session, throw
  lỗi đặc biệt `UnauthorizedError` để UI bắt và redirect `/auth/login`.
- Interceptor network error → throw `NetworkError` riêng để UI hiện banner
  "Mất kết nối" thay vì error chung.
- Interceptor 5xx → throw `ServerError`, log lại (console hoặc Sentry nếu có),
  UI hiện toast lỗi chung, không hiện message kỹ thuật cho user.
