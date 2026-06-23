/** Format tiền VND: 150000 → "150.000 ₫" */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format thời lượng dịch vụ: 90 phút → "1 giờ 30 phút" */
export function formatDuration(minutes: number, locale = "vi"): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (locale === "vi") {
    if (h === 0) return `${m} phút`;
    if (m === 0) return `${h} giờ`;
    return `${h} giờ ${m} phút`;
  }
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

/** Format khoảng cách: 1500m → "1.5 km" / "800 m" */
export function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

/** Chuyển rating 4.5 → "4.5" với 1 chữ số thập phân */
export function formatRating(value: number): string {
  return value.toFixed(1);
}
