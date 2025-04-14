import {
  InvalidFormatError,
  InvalidNumberError,
  NotEnoughUnitError,
  ReadingConfig,
  doReadNumber,
} from "read-vietnamese-number";

const config = new ReadingConfig();
config.unit = ["đồng"];

export const numberToWords = (value: string) => {
  try {
    // Đọc số và chuyển đổi thành chữ với đơn vị là "đồng"
    const result = doReadNumber(config, value);
    return result.toUpperCase();
  } catch (err) {
    // Handle errors
    if (err instanceof InvalidFormatError) {
      return "Định dạng input không hợp lệ";
    } else if (err instanceof InvalidNumberError) {
      return "Số không hợp lệ";
    } else if (err instanceof NotEnoughUnitError) {
      return "Không đủ đơn vị đọc số";
    } else {
      return "Lỗi không xác định";
    }
  }
};

/**
 * Ensures proper rendering of Unicode characters, especially for Vietnamese text
 * @param text The text to normalize
 * @returns Properly formatted text with correct diacritical marks
 */
export function normalizeVietnameseText(
  text: string | undefined | null
): string {
  if (!text) return "";

  try {
    // First try to normalize the text using the Normalization Form Canonical Composition
    return text.normalize("NFC");
  } catch (e) {
    // Fallback method if normalize isn't supported
    return text;
  }
}
