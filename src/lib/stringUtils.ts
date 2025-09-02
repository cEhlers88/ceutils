/**
 * String utility functions for slug and folder name generation
 * Provides TypeScript implementations for URL-friendly slugs and PSR-compliant folder names
 */

/**
 * Map of German umlauts and accented characters to ASCII equivalents
 */
const ACCENT_MAP: { [key: string]: string } = {
  // German umlauts
  'ä': 'ae',
  'ö': 'oe',
  'ü': 'ue',
  'Ä': 'Ae',
  'Ö': 'Oe',
  'Ü': 'Ue',
  'ß': 'ss',
  // Common accented characters
  'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'å': 'a',
  'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Å': 'A',
  'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
  'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
  'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
  'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
  'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o',
  'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O',
  'ù': 'u', 'ú': 'u', 'û': 'u',
  'Ù': 'U', 'Ú': 'U', 'Û': 'U',
  'ç': 'c', 'Ç': 'C',
  'ñ': 'n', 'Ñ': 'N'
};

/**
 * Normalizes German umlauts and accented characters to ASCII equivalents
 * @param input - String to normalize
 * @returns String with umlauts and accents replaced by ASCII equivalents
 */
function normalizeAccents(input: string): string {
  return input.replace(/[àáâãåèéêëìíîïòóôõùúûüçñäöüÄÖÜßÀÁÂÃÅÈÉÊËÌÍÎÏÒÓÔÕÙÚÛÇÑ]/g, (match) => ACCENT_MAP[match] || match);
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
  return input
    // Handle acronyms followed by words (HTTPServer → HTTP-Server)
    .replace(/([A-Z]{2,})([A-Z][a-z])/g, '$1-$2')
    // Handle lowercase/digit followed by acronym (SpielnameTEST → Spielname-TEST)
    .replace(/([a-z0-9])([A-Z]{2,})/g, '$1-$2')
    // Handle standard camelCase (spielName → spiel-Name)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2');
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
  if (!input || typeof input !== 'string') {
    return '';
  }

  let result = input;
  
  // Normalize German umlauts and accented characters first
  result = result.replace(/[àáâãåèéêëìíîïòóôõùúûüçñäöüÄÖÜßÀÁÂÃÅÈÉÊËÌÍÎÏÒÓÔÕÙÚÛÇÑ]/g, (match) => ACCENT_MAP[match] || match);
  
  // Handle acronyms followed by words (HTTPServer → HTTP-Server)
  result = result.replace(/([A-Z]{2,})([A-Z][a-z]+)/g, '$1-$2');
  
  // Handle lowercase/digit followed by acronym (SpielnameTEST → Spielname-TEST)
  result = result.replace(/([a-z0-9])([A-Z]{2,})/g, '$1-$2');
  
  // Handle standard camelCase (spielName → spiel-Name)
  result = result.replace(/([a-z0-9])([A-Z])/g, '$1-$2');
  
  // Replace non-alphanumeric characters with hyphens
  result = result.replace(/[^a-zA-Z0-9-]/g, '-');
  
  // Collapse multiple hyphens into one
  result = result.replace(/-+/g, '-');
  
  // Convert to lowercase
  result = result.toLowerCase();
  
  // Trim leading and trailing hyphens
  result = result.replace(/^-+|-+$/g, '');
  
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
  if (!input || typeof input !== 'string') {
    return '';
  }

  let result = input
    // Normalize German umlauts and accented characters
    .replace(/[àáâãåèéêëìíîïòóôõùúûüçñäöüÄÖÜßÀÁÂÃÅÈÉÊËÌÍÎÏÒÓÔÕÙÚÛÇÑ]/g, (match) => ACCENT_MAP[match] || match)
    // Replace invalid characters with spaces
    .replace(/[^a-zA-Z0-9]/g, ' ')
    // Split into words, filter empty strings, and convert to PascalCase
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  // If result starts with a digit, prefix with underscore
  if (result.length > 0 && /^\d/.test(result)) {
    result = '_' + result;
  }

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