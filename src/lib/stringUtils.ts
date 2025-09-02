/**
 * String utility functions for slug and folder name generation
 * Provides TypeScript implementations for URL-friendly slugs and PSR-compliant folder names
 */

/**
 * Map of German umlauts to ASCII equivalents (always lowercase)
 */
const GERMAN_UMLAUT_MAP: { [key: string]: string } = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  Ä: "ae",
  Ö: "oe",
  Ü: "ue",
  ß: "ss"
};

/**
 * Map of accented characters to ASCII equivalents (preserve case)
 */
const ACCENT_MAP: { [key: string]: string } = {
  // Lowercase accented characters
  à: "a",
  á: "a",
  â: "a",
  ã: "a",
  å: "a",
  è: "e",
  é: "e",
  ê: "e",
  ë: "e",
  ì: "i",
  í: "i",
  î: "i",
  ï: "i",
  ò: "o",
  ó: "o",
  ô: "o",
  õ: "o",
  ù: "u",
  ú: "u",
  û: "u",
  ç: "c",
  ñ: "n",
  // Uppercase accented characters
  À: "A",
  Á: "A",
  Â: "A",
  Ã: "A",
  Å: "A",
  È: "E",
  É: "E",
  Ê: "E",
  Ë: "E",
  Ì: "I",
  Í: "I",
  Î: "I",
  Ï: "I",
  Ò: "O",
  Ó: "O",
  Ô: "O",
  Õ: "O",
  Ù: "U",
  Ú: "U",
  Û: "U",
  Ç: "C",
  Ñ: "N"
};

/**
 * Normalizes German umlauts and accented characters to ASCII equivalents
 * @param input - String to normalize
 * @returns String with umlauts and accents normalized
 */
function normalizeAccents(input: string): string {
  return input.replace(
    /[àáâãåèéêëìíîïòóôõùúûüçñäöüÄÖÜßÀÁÂÃÅÈÉÊËÌÍÎÏÒÓÔÕÙÚÛÇÑ]/g,
    match => {
      // German umlauts always become lowercase
      if (GERMAN_UMLAUT_MAP[match]) {
        return GERMAN_UMLAUT_MAP[match];
      }
      // Other accents preserve case
      return ACCENT_MAP[match] || match;
    }
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

  // Normalize German umlauts and accented characters first
  result = normalizeAccents(result);

  // Convert to lowercase before processing camelCase to avoid mixed case issues
  result = result.toLowerCase();

  // Handle camelCase in the original input before normalization
  let originalForCamelCase = input;

  // Handle acronyms followed by words (HTTPServer → HTTP-Server)
  originalForCamelCase = originalForCamelCase.replace(
    /([A-Z]{2,})([A-Z][a-z]+)/g,
    "$1-$2"
  );

  // Handle lowercase/digit followed by acronym (SpielnameTEST → Spielname-TEST)
  originalForCamelCase = originalForCamelCase.replace(
    /([a-z0-9])([A-Z]{2,})/g,
    "$1-$2"
  );

  // Handle standard camelCase (spielName → spiel-Name)
  originalForCamelCase = originalForCamelCase.replace(
    /([a-z0-9])([A-Z])/g,
    "$1-$2"
  );

  // If camelCase processing changed the input, apply normalization to the processed version
  if (originalForCamelCase !== input) {
    result = normalizeAccents(originalForCamelCase).toLowerCase();
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
 * Generates a PascalCase string from the given input
 *
 * @param input - The input string to convert to PascalCase
 * @returns PascalCase string suitable for class/folder names
 *
 * @example
 * ```typescript
 * pascalCase("hello world") // "HelloWorld"
 * pascalCase("café-müller") // "CafeMueller"
 * pascalCase("123test") // "123test"
 * pascalCase("my_class_name") // "MyClassName"
 * ```
 */
export function pascalCase(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  let result = input
    // Normalize German umlauts and accented characters
    .replace(
      /[àáâãåèéêëìíîïòóôõùúûüçñäöüÄÖÜßÀÁÂÃÅÈÉÊËÌÍÎÏÒÓÔÕÙÚÛÇÑ]/g,
      match => {
        // German umlauts always become lowercase
        if (GERMAN_UMLAUT_MAP[match]) {
          return GERMAN_UMLAUT_MAP[match];
        }
        // Other accents preserve case
        return ACCENT_MAP[match] || match;
      }
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
 * Generates a snake_case string from the given input
 *
 * @param input - The input string to convert to snake_case
 * @returns snake_case string with lowercase letters, numbers, and underscores only
 *
 * @example
 * ```typescript
 * snailCase("HTTPServer") // "http_server"
 * snailCase("SpielnameTEST") // "spielname_test"
 * snailCase("Café & Müller") // "cafe_mueller"
 * snailCase("Hello World!") // "hello_world"
 * ```
 */
export function snailCase(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  let result = input;

  // Normalize German umlauts and accented characters first
  result = normalizeAccents(result);

  // Convert to lowercase before processing camelCase to avoid mixed case issues
  result = result.toLowerCase();

  // Handle camelCase in the original input before normalization
  let originalForCamelCase = input;

  // Handle acronyms followed by words (HTTPServer → HTTP_Server)
  originalForCamelCase = originalForCamelCase.replace(
    /([A-Z]{2,})([A-Z][a-z]+)/g,
    "$1_$2"
  );

  // Handle lowercase/digit followed by acronym (SpielnameTEST → Spielname_TEST)
  originalForCamelCase = originalForCamelCase.replace(
    /([a-z0-9])([A-Z]{2,})/g,
    "$1_$2"
  );

  // Handle standard camelCase (spielName → spiel_Name)
  originalForCamelCase = originalForCamelCase.replace(
    /([a-z0-9])([A-Z])/g,
    "$1_$2"
  );

  // If camelCase processing changed the input, apply normalization to the processed version
  if (originalForCamelCase !== input) {
    result = normalizeAccents(originalForCamelCase).toLowerCase();
  }

  // Replace non-alphanumeric characters with underscores
  result = result.replace(/[^a-zA-Z0-9_]/g, "_");

  // Collapse multiple underscores into one
  result = result.replace(/_+/g, "_");

  // Trim leading and trailing underscores
  result = result.replace(/^_+|_+$/g, "");

  return result;
}

/**
 * Default export containing all string utility functions
 */
const stringUtils = {
  createSlug,
  pascalCase,
  snailCase
};

export default stringUtils;
