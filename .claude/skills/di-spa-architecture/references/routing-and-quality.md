# Routing, Quality & Delivery Standards — Di Spa Web App

## Error Architecture

Mọi route segment trong `app/(main)/` PHẢI có đủ:

```
app/(main)/spa/[id]/
├─ page.tsx
├─ loading.tsx       # skeleton riêng cho route này, không dùng spinner chung
├─ error.tsx         # 'use client', nhận error + reset, UI thân thiện
└─ not-found.tsx     # khi spaId không tồn tại
```

Global bắt buộc có:

```
app/error.tsx        # fallback cuối cùng toàn app
app/not-found.tsx    # 404 toàn app
```

`error.tsx` không hiện stack trace/message kỹ thuật cho user — hiện message
thân thiện tiếng Việt + nút "Thử lại" (`reset()`) + nút "Về trang chủ". Booking
là nghiệp vụ tiền bạc nên `error.tsx` ở route `booking/` phải có thêm note rõ:
"Giao dịch của bạn chưa bị mất, vui lòng kiểm tra Lịch sử đặt lịch trước khi
đặt lại" để tránh user đặt trùng vì tưởng lỗi.

## Accessibility — WCAG AA bắt buộc

- Mọi element tương tác (button, link, input, card có thể click) phải
  keyboard-navigable (`tab` tới được, `Enter`/`Space` kích hoạt được).
- Icon-only button PHẢI có `aria-label` (ví dụ nút yêu thích, nút share, nút
  đóng dialog).
- Dùng `focus-visible:ring-2 focus-visible:ring-primary` (hoặc token tương
  đương) cho mọi element focusable — không tắt outline focus mà không thay
  thế.
- Carousel/slider phải có nút điều hướng thực sự (không chỉ swipe) để hỗ trợ
  keyboard + screen reader, kèm `aria-label` "Xem spa tiếp theo/trước".
- Form input liên kết đúng `<label>` (qua `htmlFor`/`id`), error message gắn
  `aria-describedby`.
- Ảnh luôn có `alt` mô tả nội dung thật (tên spa, tên dịch vụ), không để rỗng
  trừ ảnh decorative (khi đó dùng `alt=""` + `aria-hidden="true"` có chủ đích).
- Contrast màu: với token đã định nghĩa (`design-tokens.md`), `--color-primary`
  trên nền trắng/`--color-background` đạt AA cho text; nếu thêm màu mới phải
  tự kiểm tra contrast ratio ≥ 4.5:1 (text thường) / ≥ 3:1 (text lớn ≥18px bold).

## SEO Strategy

Mọi page trong `app/(main)/` (trừ trang yêu cầu auth như `/account`,
`/history`) PHẢI export `generateMetadata()`:

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const spa = await getSpaDetail(params.id)
  return {
    title: `${spa.name} | DISPA`,
    description: spa.description.slice(0, 160),
    openGraph: {
      title: spa.name,
      description: spa.description.slice(0, 160),
      images: [spa.images[0]],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: spa.name,
      images: [spa.images[0]],
    },
  }
}
```

`/spa/[id]` là trang SEO quan trọng nhất (nguồn traffic tổ chức) — bắt buộc:
- Server Component fetch data thật cho metadata (không placeholder).
- Có structured data `LocalBusiness` (JSON-LD) gồm tên, địa chỉ, rating, giờ
  mở cửa — giúp Google hiển thị rich snippet.
- URL slug thân thiện nếu backend hỗ trợ (`/spa/hexagone-salon-spa-abc123`),
  nếu chỉ có ID thì giữ ID nhưng vẫn tối ưu metadata.

`/share/[token]` (deep link resolve) cũng cần OG tag đầy đủ vì link này được
share trực tiếp lên Messenger/Zalo/Facebook (xem prompt module Share).

## Performance Budget

Mục tiêu Lighthouse (đo trên trang Home và Spa Detail — 2 trang nặng nhất):

```
Performance     >= 90
Accessibility   >= 95
Best Practices  >= 95
SEO             >= 95
```

Quy tắc bắt buộc để đạt mục tiêu trên:
- Mọi ảnh dùng `next/image`, ưu tiên định dạng AVIF/WebP (Next.js tự convert
  nếu ảnh gốc là JPEG/PNG qua `next/image` — không cần convert tay).
- `priority` chỉ đặt cho ảnh hero/above-the-fold đầu tiên, còn lại lazy load
  (mặc định của `next/image`).
- Carousel/list dài dùng virtualization hoặc pagination/infinite-scroll, không
  render toàn bộ data 1 lần.
- Font (`Playfair Display`, `Be Vietnam Pro`) load qua `next/font` (tự
  optimize, tự subset), không load qua `<link>` Google Fonts CDN thủ công.
- Tránh Client Component không cần thiết — mỗi `'use client'` thêm vào bundle
  JS gửi về browser.

## Testing Strategy

Viết test **song song** mỗi feature, trong cùng PR — không để dồn sau.

```
Unit Test         → Vitest (domain logic: getSpaStatus, tính voucher hợp lệ,
                     schema Zod validate)
Component Test    → Testing Library (render component, test interaction:
                     click, keyboard nav, error state, loading state)
E2E               → Playwright (luồng quan trọng: login, booking flow đầy đủ
                     từ search → payment → success, huỷ booking)
```

Coverage mục tiêu: **≥ 80%** cho `src/domains/` (business logic — ưu tiên cao
nhất, vì đây là phần dễ gây lỗi tiền bạc/booking sai) và cho component dùng
chung trong `components/shared/`.

Mỗi domain action/util quan trọng (`previewBooking`, `getSpaStatus`,
`isVoucherApplicable`, schema Zod) cần ít nhất: 1 test case happy path + 1
test case edge case (input rỗng/invalid) + 1 test case lỗi backend trả về.

## Storybook

Setup Storybook 8. Mọi component trong `components/ui/` và
`components/shared/` PHẢI có file `.stories.tsx` tương ứng, tối thiểu các
component sau (do dùng lặp lại nhiều nơi, dễ lệch UI nếu không có story để
review riêng):

```
Button, Input, Card                  (shadcn base, đã áp token)
SpaCard                              (3 state: default, loading skeleton, no-image)
CategoryPill                          (active/inactive)
PromotionBanner                       (với/không badge giảm giá)
BookingCard                           (3 trạng thái: upcoming/completed/cancelled)
VoucherCard                           (available/used/expired)
BookingStepper                        (4 bước, step hiện tại khác nhau)
```

Story phải cover đủ state thật sẽ gặp (loading, empty, error, đầy dữ liệu) —
không chỉ 1 story "default" duy nhất.
