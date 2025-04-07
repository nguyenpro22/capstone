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
