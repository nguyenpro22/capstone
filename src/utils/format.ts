// Format date for better readability
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString();
}

// Format price in Vietnamese currency
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

// Format price range in Vietnamese currency
export function formatPriceRange(minPrice: number, maxPrice: number): string {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  }
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}

// Calculate discounted price
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercent: number
): number {
  return originalPrice * (1 - discountPercent / 100);
}

// Get service category icon
export function getCategoryIcon(categoryName?: string): string {
  if (!categoryName) return "🧖";

  const name = categoryName.toLowerCase();
  if (name.includes("facial")) return "✨";
  if (name.includes("massage")) return "💆";
  if (name.includes("hair")) return "💇";
  if (name.includes("nail")) return "💅";
  return "🧖";
}
