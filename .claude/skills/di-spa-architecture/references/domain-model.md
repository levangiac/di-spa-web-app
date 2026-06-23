# Domain Model — Di Spa Web App

Nguồn sự thật cho toàn bộ entity, quan hệ, flow nghiệp vụ. Nếu cần entity/field
không có ở đây, KHÔNG tự bịa — hỏi lại user.

## User Roles (phạm vi web app này)

```
Guest      — chưa đăng nhập, xem được Home/Search/Spa Detail, không đặt được lịch
Customer   — đã đăng nhập, full quyền: booking, review, favorite, voucher, profile
```

> Spa Owner và Admin KHÔNG thuộc phạm vi web app này — họ dùng hệ thống quản
> trị riêng. Không dựng UI/route cho 2 role này trừ khi user yêu cầu rõ và xác
> nhận mở rộng phạm vi dự án.

## Entities

```
Spa
├─ id, name, description
├─ branches: Branch[]            // 1 spa có thể nhiều chi nhánh
├─ categories: Category[]        // danh mục dịch vụ spa cung cấp
├─ services: Service[]
├─ rating: number, reviewCount: number
├─ images: string[]
├─ openingHours: OpeningHour[]   // theo từng ngày trong tuần
└─ status: 'open' | 'closed'     // tính realtime từ openingHours + giờ hiện tại

Branch
├─ id, spaId, address, lat, lng
├─ phone
└─ openingHours: OpeningHour[]   // có thể khác giờ của Spa cha nếu chi nhánh riêng

Category
├─ id, name, icon               // icon line-art mảnh, xem design-tokens.md
└─ parentId?: string            // hỗ trợ category con nếu cần

Service
├─ id, spaId, categoryId
├─ name, description, durationMinutes
├─ price: number                // giá gốc, KHÔNG tính giảm giá ở entity này
└─ images: string[]

Promotion                        // banner khuyến mãi hiển thị (membership, campaign)
├─ id, title, description
├─ discountPercent?: number, discountAmount?: number
├─ startAt, endAt
└─ bannerImage

Voucher                          // coupon người dùng sở hữu
├─ id, code, title
├─ discountType: 'percent' | 'amount'
├─ discountValue: number
├─ minOrderAmount?: number
├─ applicableSpaIds?: string[]   // null = áp dụng toàn bộ
├─ expiredAt
└─ status: 'available' | 'used' | 'expired'   // tính từ expiredAt + usedAt

Membership                        // gói thành viên Dispa Membership (xem banner mobile)
├─ id, tier, benefits: string[]
└─ discountPercent

BookingSlot                       // slot giờ trống của 1 branch trong 1 ngày
├─ branchId, date, startTime, endTime
└─ status: 'available' | 'full'

Booking
├─ id, userId, spaId, branchId
├─ services: BookingService[]    // có thể đặt nhiều dịch vụ 1 lần
├─ slot: BookingSlot
├─ voucherId?: string
├─ subtotal, discount, total     // PHẢI tính từ API preview, không hardcode công thức ở FE
├─ paymentMethod: 'bank_transfer' | 'card' | 'pay_at_spa'
├─ status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
└─ createdAt

BookingService                    // dòng dịch vụ trong 1 booking
├─ serviceId, quantity, priceAtBooking

Review
├─ id, userId, spaId, bookingId?
├─ rating: 1-5, comment
├─ images?: string[]
└─ createdAt

Favorite
├─ userId, spaId, createdAt

Notification
├─ id, userId, type: 'booking' | 'promotion' | 'system'
├─ title, body, deepLink?
├─ isRead: boolean
└─ createdAt

UserProfile
├─ id, phone, name, avatar, gender?, birthday?
├─ locale: 'vi' | 'en' | 'ja'
└─ membershipTier?: string
```

## Booking Flow (CHÍNH XÁC — đã xác nhận với business, không thêm bước)

```
1. Search/Browse Spa
2. View Spa Detail → chọn 1 hoặc nhiều Service
3. Chọn Branch (nếu spa có nhiều chi nhánh) + chọn BookingSlot (ngày + giờ)
4. Preview booking (gọi API tính tiền: subtotal, discount nếu có voucher, total)
5. Áp Voucher (optional, ở bước preview hoặc bước riêng trước payment)
6. Chọn Payment Method (bank_transfer hiện QR + countdown giữ chỗ, card, pay_at_spa)
7. Xác nhận → tạo Booking → màn Success (mã booking)
```

KHÔNG có bước "Select Staff" — đây KHÁC với pattern phổ biến của app spa khác,
đã xác nhận app mobile hiện tại không có tính năng chọn nhân viên.

## Business Rules cần biết khi code

- **Giá/giảm giá**: luôn lấy từ API preview (`POST /booking/preview`), frontend
  không tự cộng trừ % giảm giá để tránh sai lệch với business logic backend
  (ví dụ voucher có `minOrderAmount`, membership tier có discount riêng có thể
  cộng dồn hoặc không cộng dồn với voucher — rule này do backend quyết định).
- **Slot giữ chỗ**: khi chọn `bank_transfer`, booking ở trạng thái `pending`
  có thời gian giữ chỗ giới hạn (countdown hiển thị FE, hết giờ tự huỷ — do
  backend xử lý, FE chỉ hiển thị đồng hồ và poll/refetch trạng thái).
- **Voucher hợp lệ**: chỉ hiển thị voucher có `status: available` và (nếu có
  `applicableSpaIds`) khớp với spa đang đặt — filter này nên làm ở
  `domains/promotion`, không lặp logic ở từng component.
- **Spa status (open/closed)**: tính từ `openingHours` của Branch đang chọn +
  giờ hiện tại, không phải field tĩnh trong DB — tính ở domain layer
  (`domains/spa/utils/getSpaStatus.ts`), không tính lặp ở UI component.
