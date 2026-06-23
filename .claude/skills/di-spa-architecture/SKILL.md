---
name: di-spa-architecture
description: Kiến trúc và quy chuẩn bắt buộc khi xây dựng/sửa code cho "Di Spa Web App" (Next.js 15 + shadcn/ui), web app song song với app mobile Flutter "Di Spa App". PHẢI dùng skill này bất cứ khi nào tạo route, component, server action, API call, form, hoặc bất kỳ file code nào trong dự án Di Spa — kể cả khi user chỉ yêu cầu một phần nhỏ (ví dụ "thêm nút yêu thích", "sửa trang booking", "tạo component SpaCard"). Cũng dùng khi user hỏi về domain model (Spa/Service/Booking/Voucher/Membership...), data fetching, design token, accessibility, SEO, testing, hoặc cấu trúc thư mục của dự án này. Không bỏ qua skill này dù task có vẻ nhỏ — vi phạm 1 rule nhỏ (ví dụ dùng bg-pink-500 thay vì bg-primary, hoặc fetch trong useEffect) sẽ làm mất parity với mobile và phải sửa lại toàn bộ sau.
---

# Di Spa Web App — Architecture Skill

Skill này là nguồn sự thật duy nhất (single source of truth) cho kiến trúc kỹ
thuật của Di Spa Web App. Đọc đúng phần cần trước khi viết code — không đoán.

## Cách dùng skill này

1. Luôn áp dụng **Core Principles** và **Hard Bans** ở dưới cho MỌI code viết ra,
   không cần đọc gì thêm.
2. Trước khi tạo/sửa domain model, entity, hoặc booking flow → đọc
   `references/domain-model.md`.
3. Trước khi style bất kỳ component → đọc `references/design-tokens.md`.
4. Trước khi viết data fetching / mutation / server action → đọc
   `references/data-layer.md`.
5. Trước khi tạo route mới → đọc `references/routing-and-quality.md` (error
   boundary, SEO, a11y, performance, testing, storybook — mọi route mới đều
   cần các file này).
6. Nếu user yêu cầu việc không nằm trong các domain đã định nghĩa (ví dụ thêm
   tính năng Spa Owner, Admin) → DỪNG và hỏi lại, vì domain hiện tại CHỈ phục
   vụ role Customer + Guest (xem domain-model.md), không tự mở rộng phạm vi.

## Core Principles (bắt buộc, không ngoại lệ)

- **Feature-first + Domain-driven**: business logic nằm trong `src/domains/`,
  hoàn toàn không phụ thuộc UI. UI (`app/`, `components/`) chỉ gọi vào domain
  layer, không tự chứa business rule (ví dụ công thức tính giá, điều kiện
  voucher hợp lệ).
- **Server Components mặc định**, Client Component chỉ khi cần interactivity
  (form, carousel, dialog, real-time state).
- **Mutation order**: Server Actions → React Query mutation → API Route (chỉ
  khi cần proxy 3rd-party/webhook). Xem chi tiết `data-layer.md`.
- **React Query** chỉ quản lý server state (data từ API). **Zustand** chỉ
  quản lý transient UI state (booking draft đang điền, filter đang chọn, tab
  active). Không trộn 2 việc này vào nhau.
- **Design token only** — không hardcode màu Tailwind mặc định. Xem
  `design-tokens.md`.
- **WCAG AA bắt buộc** trên mọi component tương tác.
- **SEO-first**: mọi page public phải có `generateMetadata()`.
- **Mobile parity là ưu tiên số 1** — khi không chắc UI/behavior nên làm sao,
  ưu tiên giống Flutter app hiện có hơn là "best practice web" chung.
- **Test song song feature**: mỗi feature merge phải kèm unit/component test
  tương ứng trong cùng PR, không để dồn lại làm sau. Xem
  `routing-and-quality.md`.

## Hard Bans (Claude tự kiểm tra trước khi xuất code)

| Cấm | Dùng thay |
|---|---|
| `fetch()` POST trực tiếp trong component | Server Action hoặc React Query mutation |
| `useEffect(() => { fetch(...) }, [])` để load data | Server Component fetch trực tiếp, hoặc `useQuery` |
| `bg-pink-500`, `text-gray-500`, `border-slate-200`, bất kỳ Tailwind color mặc định | `bg-primary`, `text-muted-foreground`, `border-border` (xem design-tokens.md) |
| Tự nghĩ ra entity/field mới ngoài domain model đã định nghĩa | Đọc `domain-model.md`, nếu thiếu thì hỏi user |
| Route mới không có `loading.tsx`/`error.tsx` | Luôn tạo đủ 3 file theo `routing-and-quality.md` |
| Thêm bước "chọn nhân viên" (Select Staff) vào booking flow | Flow chỉ có: chọn dịch vụ → chọn chi nhánh & slot giờ → voucher → thanh toán → xác nhận (KHÔNG có staff selection — đã xác nhận với business) |
| Dựng UI cho Spa Owner hoặc Admin | Web app này CHỈ phục vụ Customer + Guest |

## Reference files

- `references/domain-model.md` — Toàn bộ entity, quan hệ, booking flow, user
  role, business rule (voucher, membership, slot).
- `references/design-tokens.md` — Bảng token màu/font/radius đầy đủ + quy tắc
  Tailwind class hợp lệ/cấm.
- `references/data-layer.md` — Quy chuẩn Server Actions, React Query, Zustand,
  cấu trúc `src/domains/`, error handling.
- `references/routing-and-quality.md` — Error architecture, accessibility,
  SEO, performance budget, testing strategy, Storybook.
