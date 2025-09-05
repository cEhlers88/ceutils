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

  const result = input
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
 * TypeScript implementation of PHP's sprintf function
 * Formats a string with placeholders replaced by corresponding arguments
 *
 * @param format - Format string containing placeholders like %s, %d, %f, etc.
 * @param args - Arguments to substitute into the format string
 * @returns Formatted string with placeholders replaced
 *
 * @example
 * ```typescript
 * sprintf("Hello %s, you have %d messages", "John", 5) // "Hello John, you have 5 messages"
 * sprintf("Temperature: %.2f°C", 23.456) // "Temperature: 23.46°C"
 * sprintf("Hex: %x, Oct: %o", 255, 255) // "Hex: ff, Oct: 377"
 * sprintf("%05d", 42) // "00042"
 * ```
 */
export function sprintf(format: string, ...args: any[]): string {
  if (!format || typeof format !== "string") {
    return "";
  }

  let argIndex = 0;

  return format.replace(
    /%%|%([+\-0# ]*)(\*|\d+)?(?:\.(\*|\d+))?([diouxXeEfFgGaAcsp])|%/g,
    (match, flags, width, precision, specifier) => {
      // Handle literal %%
      if (match === "%%") {
        return "%";
      }

      // Handle lone % (invalid format specifier)
      if (match === "%") {
        return "%";
      }

      // Parse flags
      const leftAlign = flags.includes("-");
      const forceSign = flags.includes("+");
      const padWithZeros = flags.includes("0") && !leftAlign;
      const spaceForPositive = flags.includes(" ") && !forceSign;
      const alternateForm = flags.includes("#");

      // Parse width
      let fieldWidth = 0;
      if (width === "*") {
        fieldWidth = Math.max(0, parseInt(args[argIndex++], 10) || 0);
      } else if (width) {
        fieldWidth = Math.max(0, parseInt(width, 10) || 0);
      }

      // Parse precision
      let precisionValue = -1;
      if (precision === "*") {
        const dynPrec = parseInt(args[argIndex++], 10) || 0;
        precisionValue = dynPrec < 0 ? -1 : dynPrec;
      } else if (precision !== undefined) {
        precisionValue = Math.max(0, parseInt(precision, 10) || 0);
      }

      // Get the current argument
      const arg = args[argIndex++];

      // Format based on specifier
      let result = "";

      switch (specifier) {
        case "s": // String
          if (arg === null) {
            result = "null";
          } else if (arg === undefined) {
            result = "";
          } else {
            result = String(arg);
          }
          if (precisionValue >= 0) {
            result = result.substring(0, precisionValue);
          }
          break;

        case "d":
        case "i": // Signed decimal integer
          {
            const num = parseInt(String(arg), 10) || 0;
            result = String(num);
            if (forceSign && num >= 0) {
              result = "+" + result;
            } else if (spaceForPositive && num >= 0) {
              result = " " + result;
            }
          }
          break;

        case "u": // Unsigned decimal integer
          {
            const num = Math.abs(parseInt(String(arg), 10) || 0);
            result = String(num);
          }
          break;

        case "o": // Octal
          {
            const num = parseInt(String(arg), 10) || 0;
            result = Math.abs(num).toString(8);
            if (alternateForm && result !== "0") {
              result = "0" + result;
            }
          }
          break;

        case "x": // Hexadecimal lowercase
          {
            const num = parseInt(String(arg), 10) || 0;
            result = Math.abs(num).toString(16);
            if (alternateForm && result !== "0") {
              result = "0x" + result;
            }
          }
          break;

        case "X": // Hexadecimal uppercase
          {
            const num = parseInt(String(arg), 10) || 0;
            result = Math.abs(num)
              .toString(16)
              .toUpperCase();
            if (alternateForm && result !== "0") {
              result = "0X" + result;
            }
          }
          break;

        case "f":
        case "F": // Floating point
          {
            const num = parseFloat(String(arg)) || 0;
            const fPrecision = precisionValue >= 0 ? precisionValue : 6;
            result = num.toFixed(fPrecision);
            if (forceSign && num >= 0) {
              result = "+" + result;
            } else if (spaceForPositive && num >= 0) {
              result = " " + result;
            }
          }
          break;

        case "e": // Scientific notation lowercase
          {
            const num = parseFloat(String(arg)) || 0;
            const ePrecision = precisionValue >= 0 ? precisionValue : 6;
            result = num.toExponential(ePrecision);
            if (forceSign && num >= 0) {
              result = "+" + result;
            } else if (spaceForPositive && num >= 0) {
              result = " " + result;
            }
          }
          break;

        case "E": // Scientific notation uppercase
          {
            const num = parseFloat(String(arg)) || 0;
            const EPrecision = precisionValue >= 0 ? precisionValue : 6;
            result = num.toExponential(EPrecision).toUpperCase();
            if (forceSign && num >= 0) {
              result = "+" + result;
            } else if (spaceForPositive && num >= 0) {
              result = " " + result;
            }
          }
          break;

        case "g": // Shortest representation of e or f
          {
            const num = parseFloat(String(arg)) || 0;
            const gPrecision =
              precisionValue >= 0 ? Math.max(1, precisionValue) : 6;

            // Implement %g logic: use exponential if exponent < -4 or >= precision
            const absNum = Math.abs(num);
            let useExponential = false;

            if (absNum !== 0) {
              const exponent = Math.floor(Math.log10(absNum));
              useExponential = exponent < -4 || exponent >= gPrecision;
            }

            if (useExponential) {
              result = num.toExponential(gPrecision - 1);
              // Remove trailing zeros from mantissa
              result = result.replace(/\.?0+e/, "e");
            } else {
              const decimalPlaces = Math.max(
                0,
                gPrecision - Math.floor(Math.log10(Math.abs(num) || 1)) - 1
              );
              result = num.toFixed(decimalPlaces);
              // Remove trailing zeros and decimal point if not needed
              result = result.replace(/\.?0+$/, "");
            }

            if (forceSign && num >= 0) {
              result = "+" + result;
            } else if (spaceForPositive && num >= 0) {
              result = " " + result;
            }
          }
          break;

        case "G": // Shortest representation of E or F
          {
            const num = parseFloat(String(arg)) || 0;
            const GPrecision =
              precisionValue >= 0 ? Math.max(1, precisionValue) : 6;

            // Implement %G logic: use exponential if exponent < -4 or >= precision
            const absNum = Math.abs(num);
            let useExponential = false;

            if (absNum !== 0) {
              const exponent = Math.floor(Math.log10(absNum));
              useExponential = exponent < -4 || exponent >= GPrecision;
            }

            if (useExponential) {
              result = num.toExponential(GPrecision - 1).toUpperCase();
              // Remove trailing zeros from mantissa
              result = result.replace(/\.?0+E/, "E");
            } else {
              const decimalPlaces = Math.max(
                0,
                GPrecision - Math.floor(Math.log10(Math.abs(num) || 1)) - 1
              );
              result = num.toFixed(decimalPlaces);
              // Remove trailing zeros and decimal point if not needed
              result = result.replace(/\.?0+$/, "");
            }

            if (forceSign && num >= 0) {
              result = "+" + result;
            } else if (spaceForPositive && num >= 0) {
              result = " " + result;
            }
          }
          break;

        case "c": // Character
          {
            const charCode = parseInt(String(arg), 10) || 0;
            result = String.fromCharCode(charCode);
          }
          break;

        default:
          return match; // Unknown specifier, return as-is
      }

      // Apply width padding
      if (fieldWidth > 0 && result.length < fieldWidth) {
        const paddingLength = fieldWidth - result.length;

        if (leftAlign) {
          // Left align: pad with spaces on the right
          result = result + " ".repeat(paddingLength);
        } else if (
          padWithZeros &&
          (/^[+-]?[\da-fA-F]/.test(result) || /^0[xX]/.test(result))
        ) {
          // Zero padding for numbers: insert zeros after sign/prefix
          if (result.startsWith("0x") || result.startsWith("0X")) {
            // Hex with prefix
            const prefix = result.substring(0, 2);
            const number = result.substring(2);
            result = prefix + "0".repeat(paddingLength) + number;
          } else {
            // Regular number with optional sign
            const signMatch = result.match(/^([+-]?)/);
            const sign = signMatch ? signMatch[1] : "";
            const number = result.substring(sign.length);
            result = sign + "0".repeat(paddingLength) + number;
          }
        } else {
          // Right align: pad with spaces on the left
          result = " ".repeat(paddingLength) + result;
        }
      }

      return result;
    }
  );
}

/**
 * Default export containing all string utility functions
 */
const stringUtils = {
  createSlug,
  pascalCase,
  snailCase,
  sprintf
};

export default stringUtils;
