# Design Token Contract — Di Spa Web App

## Nguyên tắc tuyệt đối

**KHÔNG bao giờ** dùng Tailwind color mặc định trực tiếp trong code:

```
❌ bg-pink-500   text-gray-500   border-slate-200   bg-rose-100   text-zinc-600
```

**CHỈ dùng** semantic token đã map vào CSS variable:

```
✅ bg-primary           text-foreground         border-border
✅ bg-secondary         text-muted-foreground    border-input
✅ bg-background        text-primary-foreground  bg-surface-muted
✅ bg-accent            text-accent-foreground    bg-rating (badge rating)
```

Nếu cần 1 sắc độ chưa có token (ví dụ hover state đậm hơn), **thêm token mới**
vào `globals.css` + `tailwind.config`, không dùng số Tailwind có sẵn để "tiện".

## Token đầy đủ (đồng bộ với app mobile DISPA)

```css
:root {
  --color-primary: #B96B78;            /* hồng đào - CTA chính, active state */
  --color-primary-dark: #A85A66;       /* hover/pressed primary */
  --color-primary-foreground: #FFFFFF;

  --color-secondary: #6F8E7A;          /* xanh sage - nút search, icon lá */
  --color-secondary-foreground: #FFFFFF;

  --color-accent: #8B4A56;             /* mauve đậm - pill nổi bật, badge nhấn */
  --color-accent-foreground: #FFFFFF;

  --color-background: #FCEEEC;         /* nền app, hồng-kem rất nhạt */
  --color-surface: #FFFFFF;            /* card, input, sheet */
  --color-surface-muted: #F3DCE0;      /* pill category nhạt, badge nhẹ */

  --color-foreground: #3A2A2E;         /* heading, body text chính */
  --color-muted-foreground: #8A7478;   /* subtext, địa chỉ, khoảng cách */

  --color-rating: #D6486A;             /* badge rating sao */
  --color-border: #EAD9DA;             /* viền input, divider nhẹ */
  --color-input: #EAD9DA;

  --color-destructive: #C0392B;
  --color-destructive-foreground: #FFFFFF;

  --radius: 1.25rem;                   /* card, button, dialog */
  --radius-pill: 9999px;               /* category pill, bottom-nav, search bar */

  --font-display: "Playfair Display"; /* heading lớn */
  --font-body: "Be Vietnam Pro";       /* body text, hỗ trợ dấu tiếng Việt tốt */
}
```

Map vào `tailwind.config.ts` qua `theme.extend.colors` dùng `hsl(var(--...))`
hoặc trực tiếp hex tuỳ setup shadcn — giữ tên biến giống bảng trên để mọi
component dùng class Tailwind chuẩn (`bg-primary`, `text-primary`, v.v.) mà
không cần style inline.

## Đặc điểm thị giác bắt buộc giữ (đồng bộ mobile)

- **Category**: pill tròn lớn, icon line-art mảnh (outline weight thin). Lucide
  default quá đậm/filled cho phong cách này — ưu tiên Phosphor Icons (weight
  `thin` hoặc `light`), hoặc dùng SVG icon gốc do team design mobile xuất ra
  nếu có (đặt ở `public/icons/`).
- **Spa Card**: ảnh bo góc lớn (`rounded-[var(--radius)]`), KHÔNG viền cứng,
  chỉ `shadow-sm` rất nhẹ. Badge rating (`bg-rating text-white`) đặt góc
  trên-trái của ảnh, dạng pill nhỏ kèm icon sao.
- **Banner khuyến mãi**: gradient `from-primary to-accent`, text trắng, hoa
  văn lá cây decorative SVG opacity 0.15–0.2 phía sau, badge "%" tròn nổi.
- **Bottom navigation** (mobile/tablet <1024px): pill nổi cách đáy ~12px, nút
  giữa (Booking) nổi tròn to hơn các nút khác, màu `bg-secondary`. Desktop
  (≥1024px): thay bằng sidebar/header ngang, không dùng bottom nav.
- **Search input**: dạng pill (`rounded-[var(--radius-pill)]`), icon outline
  mảnh bên trái, `border-input`.

## Self-check trước khi xuất code

Trước khi trả về bất kỳ class Tailwind nào liên quan màu, tự hỏi:
- Class này có nằm trong danh sách token ở trên không?
- Nếu là số Tailwind mặc định (50–950) → STOP, thay bằng token hoặc thêm
  token mới vào `globals.css`.
