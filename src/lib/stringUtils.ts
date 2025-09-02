/**
 * String utility functions for slug and folder name generation
 * Provides TypeScript implementations for URL-friendly slugs and PSR-compliant folder names
 */

/**
 * Map of German umlauts and accented characters to ASCII equivalents for slugs (lowercase)
 */
const SLUG_ACCENT_MAP: { [key: string]: string } = {
  // German umlauts
  ä: "ae",
  ö: "oe",
  ü: "ue",
  Ä: "ae",
  Ö: "oe",
  Ü: "ue",
  ß: "ss",
  // Common accented characters
  à: "a",
  á: "a",
  â: "a",
  ã: "a",
  å: "a",
  À: "a",
  Á: "a",
  Â: "a",
  Ã: "a",
  Å: "a",
  è: "e",
  é: "e",
  ê: "e",
  ë: "e",
  È: "e",
  É: "e",
  Ê: "e",
  Ë: "e",
  ì: "i",
  í: "i",
  î: "i",
  ï: "i",
  Ì: "i",
  Í: "i",
  Î: "i",
  Ï: "i",
  ò: "o",
  ó: "o",
  ô: "o",
  õ: "o",
  Ò: "o",
  Ó: "o",
  Ô: "o",
  Õ: "o",
  ù: "u",
  ú: "u",
  û: "u",
  Ù: "u",
  Ú: "u",
  Û: "u",
  ç: "c",
  Ç: "c",
  ñ: "n",
  Ñ: "n"
};

/**
 * Map of German umlauts and accented characters to ASCII equivalents for PSR names (preserve case)
 */
const PSR_ACCENT_MAP: { [key: string]: string } = {
  // German umlauts
  ä: "ae",
  ö: "oe",
  ü: "ue",
  Ä: "Ae",
  Ö: "Oe",
  Ü: "Ue",
  ß: "ss",
  // Common accented characters
  à: "a",
  á: "a",
  â: "a",
  ã: "a",
  å: "a",
  À: "A",
  Á: "A",
  Â: "A",
  Ã: "A",
  Å: "A",
  è: "e",
  é: "e",
  ê: "e",
  ë: "e",
  È: "E",
  É: "E",
  Ê: "E",
  Ë: "E",
  ì: "i",
  í: "i",
  î: "i",
  ï: "i",
  Ì: "I",
  Í: "I",
  Î: "I",
  Ï: "I",
  ò: "o",
  ó: "o",
  ô: "o",
  õ: "o",
  Ò: "O",
  Ó: "O",
  Ô: "O",
  Õ: "O",
  ù: "u",
  ú: "u",
  û: "u",
  Ù: "U",
  Ú: "U",
  Û: "U",
  ç: "c",
  Ç: "C",
  ñ: "n",
  Ñ: "N"
};

/**
 * Normalizes German umlauts and accented characters to ASCII equivalents for slugs
 * @param input - String to normalize
 * @returns String with umlauts and accents replaced by ASCII equivalents (lowercase)
 */
function normalizeAccentsForSlug(input: string): string {
  return input.replace(
    /[àáâãåèéêëìíîïòóôõùúûüçñäöüÄÖÜßÀÁÂÃÅÈÉÊËÌÍÎÏÒÓÔÕÙÚÛÇÑ]/g,
    match => SLUG_ACCENT_MAP[match] || match
  );
}

/**
 * Normalizes German umlauts and accented characters to ASCII equivalents for PSR names
 * @param input - String to normalize
 * @returns String with umlauts and accents replaced by ASCII equivalents (preserve case)
 */
function normalizeAccentsForPsr(input: string): string {
  return input.replace(
    /[àáâãåèéêëìíîïòóôõùúûüçñäöüÄÖÜßÀÁÂÃÅÈÉÊËÌÍÎÏÒÓÔÕÙÚÛÇÑ]/g,
    match => PSR_ACCENT_MAP[match] || match
  );
}

/**
 * Splits camelCase and handles acronyms in strings
 * Examples:
 * - HTTPServer → HTTP-Server
 * - SpielnameTEST → Spielname-TEST
 * - spielName → spiel-Name
 * @param input - String to split
 * @returns String with words separated by hyphens
 */
function splitCamelCase(input: string): string {
  return (
    input
      // Handle acronyms followed by words (HTTPServer → HTTP-Server)
      .replace(/([A-Z]{2,})([A-Z][a-z])/g, "$1-$2")
      // Handle lowercase/digit followed by acronym (SpielnameTEST → Spielname-TEST)
      .replace(/([a-z0-9])([A-Z]{2,})/g, "$1-$2")
      // Handle standard camelCase (spielName → spiel-Name)
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
  );
}

/**
 * Generates a URL-friendly slug from the given string
 *
 * @param input - The input string to convert to a slug
 * @returns URL-friendly slug with lowercase letters, numbers, and hyphens only
 *
 * @example
 * ```typescript
 * createSlug("HTTPServer") // "http-server"
 * createSlug("SpielnameTEST") // "spielname-test"
 * createSlug("Café & Müller") // "cafe-mueller"
 * createSlug("Hello World!") // "hello-world"
 * ```
 */
export function createSlug(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  let result = input;

  // Normalize German umlauts and accented characters first (to lowercase)
  result = normalizeAccentsForSlug(result);

  // Convert to lowercase before processing camelCase to avoid mixed case issues
  result = result.toLowerCase();

  // Handle camelCase in the original input before normalization
  let originalForCamelCase = input;
  
  // Handle acronyms followed by words (HTTPServer → HTTP-Server)
  originalForCamelCase = originalForCamelCase.replace(/([A-Z]{2,})([A-Z][a-z]+)/g, "$1-$2");

  // Handle lowercase/digit followed by acronym (SpielnameTEST → Spielname-TEST)
  originalForCamelCase = originalForCamelCase.replace(/([a-z0-9])([A-Z]{2,})/g, "$1-$2");

  // Handle standard camelCase (spielName → spiel-Name)
  originalForCamelCase = originalForCamelCase.replace(/([a-z0-9])([A-Z])/g, "$1-$2");

  // If camelCase processing changed the input, apply normalization to the processed version
  if (originalForCamelCase !== input) {
    result = normalizeAccentsForSlug(originalForCamelCase).toLowerCase();
  }

  // Replace non-alphanumeric characters with hyphens
  result = result.replace(/[^a-zA-Z0-9-]/g, "-");

  // Collapse multiple hyphens into one
  result = result.replace(/-+/g, "-");

  // Trim leading and trailing hyphens
  result = result.replace(/^-+|-+$/g, "");

  return result;
}

/**
 * Generates a PSR-compliant folder/class name from the given string
 *
 * @param input - The input string to convert to a PSR-compliant name
 * @returns PSR-compliant folder name in PascalCase, prefixed with _ if starting with digit
 *
 * @example
 * ```typescript
 * createPsrFolderName("hello world") // "HelloWorld"
 * createPsrFolderName("café-müller") // "CafeMueller"
 * createPsrFolderName("123test") // "_123test"
 * createPsrFolderName("my_class_name") // "MyClassName"
 * ```
 */
export function createPsrFolderName(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  let result = input
    // Normalize German umlauts and accented characters (preserve case)
    .replace(
      /[àáâãåèéêëìíîïòóôõùúûüçñäöüÄÖÜßÀÁÂÃÅÈÉÊËÌÍÎÏÒÓÔÕÙÚÛÇÑ]/g,
      match => PSR_ACCENT_MAP[match] || match
    )
    // Replace invalid characters with spaces
    .replace(/[^a-zA-Z0-9]/g, " ")
    // Split into words, filter empty strings, and convert to PascalCase
    .split(" ")
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  return result;
}

/**
 * Default export containing all string utility functions
 */
const stringUtils = {
  createSlug,
  createPsrFolderName
};

export default stringUtils;
