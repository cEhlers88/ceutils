import { createSlug, pascalCase, snailCase, sprintf } from "../src/lib/stringUtils";

describe("createSlug", () => {
  describe("Basic functionality", () => {
    test("should return empty string for empty input", () => {
      expect(createSlug("")).toBe("");
    });

    test("should return empty string for null/undefined input", () => {
      // @ts-ignore - Testing runtime behavior
      expect(createSlug(null)).toBe("");
      // @ts-ignore - Testing runtime behavior
      expect(createSlug(undefined)).toBe("");
    });

    test("should handle simple words", () => {
      expect(createSlug("hello")).toBe("hello");
      expect(createSlug("world")).toBe("world");
    });

    test("should convert to lowercase", () => {
      expect(createSlug("HELLO")).toBe("hello");
      expect(createSlug("Hello")).toBe("hello");
      expect(createSlug("HeLLo")).toBe("he-llo"); // Mixed case gets split at boundaries
    });
  });

  describe("German umlaut normalization", () => {
    test("should normalize lowercase umlauts", () => {
      expect(createSlug("café")).toBe("cafe");
      expect(createSlug("müller")).toBe("mueller");
      expect(createSlug("größe")).toBe("groesse");
    });

    test("should normalize uppercase umlauts", () => {
      expect(createSlug("CAFÉ")).toBe("cafe");
      expect(createSlug("MÜLLER")).toBe("mueller");
      expect(createSlug("GRÖSSE")).toBe("groesse");
    });

    test("should normalize ß character", () => {
      expect(createSlug("weiß")).toBe("weiss");
      expect(createSlug("Straße")).toBe("strasse");
    });

    test("should handle mixed umlauts", () => {
      expect(createSlug("Café & Müller")).toBe("cafe-mueller");
      expect(createSlug("Größe der Tür")).toBe("groesse-der-tuer");
    });
  });

  describe("CamelCase and acronym handling", () => {
    test("should split standard camelCase", () => {
      expect(createSlug("spielName")).toBe("spiel-name");
      expect(createSlug("userName")).toBe("user-name");
      expect(createSlug("myVariableName")).toBe("my-variable-name");
    });

    test("should handle acronyms followed by words", () => {
      expect(createSlug("HTTPServer")).toBe("http-server");
      expect(createSlug("XMLParser")).toBe("xml-parser");
      expect(createSlug("APIClient")).toBe("api-client");
    });

    test("should handle lowercase/digit followed by acronym", () => {
      expect(createSlug("SpielnameTEST")).toBe("spielname-test");
      expect(createSlug("version2API")).toBe("version2-api");
      expect(createSlug("dataDML")).toBe("data-dml");
    });

    test("should handle complex mixed cases", () => {
      expect(createSlug("HTTPSAPIClient")).toBe("httpsapi-client"); // Complex acronym combinations
      expect(createSlug("myHTTPServer")).toBe("my-http-server");
    });
  });

  describe("Special character handling", () => {
    test("should replace spaces with hyphens", () => {
      expect(createSlug("hello world")).toBe("hello-world");
      expect(createSlug("multiple   spaces")).toBe("multiple-spaces");
    });

    test("should replace special characters with hyphens", () => {
      expect(createSlug("hello@world")).toBe("hello-world");
      expect(createSlug("test&more")).toBe("test-more");
      expect(createSlug("file.name")).toBe("file-name");
      expect(createSlug("path/to/file")).toBe("path-to-file");
    });

    test("should collapse multiple hyphens", () => {
      expect(createSlug("hello---world")).toBe("hello-world");
      expect(createSlug("test  &  more")).toBe("test-more");
      expect(createSlug("a...b...c")).toBe("a-b-c");
    });

    test("should trim leading and trailing hyphens", () => {
      expect(createSlug("-hello-")).toBe("hello");
      expect(createSlug("--test--")).toBe("test");
      expect(createSlug("...word...")).toBe("word");
    });
  });

  describe("Numbers handling", () => {
    test("should preserve numbers", () => {
      expect(createSlug("version2")).toBe("version2");
      expect(createSlug("test123")).toBe("test123");
      expect(createSlug("123test")).toBe("123test");
    });

    test("should handle numbers with camelCase", () => {
      expect(createSlug("version2API")).toBe("version2-api");
      expect(createSlug("test123Name")).toBe("test123-name");
    });
  });

  describe("Edge cases", () => {
    test("should handle only special characters", () => {
      expect(createSlug("!!!")).toBe("");
      expect(createSlug("@#$%")).toBe("");
      expect(createSlug("---")).toBe("");
    });

    test("should handle mixed content", () => {
      expect(createSlug("Hello World! This is a test.")).toBe("hello-world-this-is-a-test");
      expect(createSlug("API_VERSION_2.0")).toBe("api-version-2-0");
    });
  });
});

describe("pascalCase", () => {
  describe("Basic functionality", () => {
    test("should return empty string for empty input", () => {
      expect(pascalCase("")).toBe("");
    });

    test("should return empty string for null/undefined input", () => {
      // @ts-ignore - Testing runtime behavior
      expect(pascalCase(null)).toBe("");
      // @ts-ignore - Testing runtime behavior
      expect(pascalCase(undefined)).toBe("");
    });

    test("should handle simple words", () => {
      expect(pascalCase("hello")).toBe("Hello");
      expect(pascalCase("world")).toBe("World");
    });

    test("should convert to PascalCase", () => {
      expect(pascalCase("hello world")).toBe("HelloWorld");
      expect(pascalCase("my class name")).toBe("MyClassName");
    });
  });

  describe("German umlaut normalization", () => {
    test("should normalize lowercase umlauts to lowercase", () => {
      expect(pascalCase("café")).toBe("Cafe");
      expect(pascalCase("müller")).toBe("Mueller");
      expect(pascalCase("größe")).toBe("Groesse");
    });

    test("should normalize uppercase umlauts to lowercase", () => {
      expect(pascalCase("CAFÉ")).toBe("Cafe");
      expect(pascalCase("MÜLLER")).toBe("Mueller");
      expect(pascalCase("GRÖSSE")).toBe("Groesse");
    });

    test("should normalize ß character", () => {
      expect(pascalCase("weiß")).toBe("Weiss");
      expect(pascalCase("Straße")).toBe("Strasse");
    });

    test("should handle mixed umlauts", () => {
      expect(pascalCase("café müller")).toBe("CafeMueller");
      expect(pascalCase("größe der tür")).toBe("GroesseDerTuer");
    });
  });

  describe("Accent normalization (preserve case)", () => {
    test("should preserve case for non-German accents", () => {
      expect(pascalCase("Émile")).toBe("Emile");
      expect(pascalCase("émile")).toBe("Emile");
      expect(pascalCase("ÉMILE")).toBe("Emile");
      expect(pascalCase("Ê test")).toBe("ETest");
      expect(pascalCase("ê test")).toBe("ETest");
    });
  });

  describe("Special character handling", () => {
    test("should replace invalid characters with spaces", () => {
      expect(pascalCase("hello-world")).toBe("HelloWorld");
      expect(pascalCase("test_name")).toBe("TestName");
      expect(pascalCase("file.name")).toBe("FileName");
      expect(pascalCase("path/to/file")).toBe("PathToFile");
    });

    test("should handle multiple special characters", () => {
      expect(pascalCase("hello---world")).toBe("HelloWorld");
      expect(pascalCase("test@#$name")).toBe("TestName");
      expect(pascalCase("a...b...c")).toBe("ABC");
    });

    test("should filter empty words", () => {
      expect(pascalCase("hello  world")).toBe("HelloWorld");
      expect(pascalCase("test   name")).toBe("TestName");
    });
  });

  describe("Number handling", () => {
    test("should preserve numbers in words", () => {
      expect(pascalCase("version2")).toBe("Version2");
      expect(pascalCase("test123")).toBe("Test123");
    });

    test("should handle names starting with digit", () => {
      expect(pascalCase("123test")).toBe("123test");
      expect(pascalCase("2nd version")).toBe("2ndVersion");
      expect(pascalCase("0config")).toBe("0config");
    });

    test("should handle mixed numbers and letters", () => {
      expect(pascalCase("api version 2")).toBe("ApiVersion2");
      expect(pascalCase("test 123 name")).toBe("Test123Name");
    });
  });

  describe("Case handling", () => {
    test("should handle all lowercase", () => {
      expect(pascalCase("hello world")).toBe("HelloWorld");
      expect(pascalCase("my class name")).toBe("MyClassName");
    });

    test("should handle all uppercase", () => {
      expect(pascalCase("HELLO WORLD")).toBe("HelloWorld");
      expect(pascalCase("MY CLASS NAME")).toBe("MyClassName");
    });

    test("should handle mixed case", () => {
      expect(pascalCase("Hello World")).toBe("HelloWorld");
      expect(pascalCase("myClassName")).toBe("Myclassname");
    });
  });

  describe("Edge cases", () => {
    test("should handle only special characters", () => {
      expect(pascalCase("!!!")).toBe("");
      expect(pascalCase("@#$%")).toBe("");
      expect(pascalCase("---")).toBe("");
    });

    test("should handle single character words", () => {
      expect(pascalCase("a b c")).toBe("ABC");
      expect(pascalCase("x y z")).toBe("XYZ");
    });

    test("should handle complex mixed content", () => {
      expect(pascalCase("My_Class-Name.v2")).toBe("MyClassNameV2");
      expect(pascalCase("API_VERSION_2.0")).toBe("ApiVersion20");
    });
  });
});

describe("snailCase", () => {
  describe("Basic functionality", () => {
    test("should return empty string for empty input", () => {
      expect(snailCase("")).toBe("");
    });

    test("should return empty string for null/undefined input", () => {
      // @ts-ignore - Testing runtime behavior
      expect(snailCase(null)).toBe("");
      // @ts-ignore - Testing runtime behavior
      expect(snailCase(undefined)).toBe("");
    });

    test("should handle simple words", () => {
      expect(snailCase("hello")).toBe("hello");
      expect(snailCase("world")).toBe("world");
    });

    test("should convert to lowercase", () => {
      expect(snailCase("HELLO")).toBe("hello");
      expect(snailCase("Hello")).toBe("hello");
      expect(snailCase("HeLLo")).toBe("he_llo"); // Mixed case gets split at boundaries
    });
  });

  describe("German umlaut normalization", () => {
    test("should normalize lowercase umlauts", () => {
      expect(snailCase("café")).toBe("cafe");
      expect(snailCase("müller")).toBe("mueller");
      expect(snailCase("größe")).toBe("groesse");
    });

    test("should normalize uppercase umlauts", () => {
      expect(snailCase("CAFÉ")).toBe("cafe");
      expect(snailCase("MÜLLER")).toBe("mueller");
      expect(snailCase("GRÖSSE")).toBe("groesse");
    });

    test("should normalize ß character", () => {
      expect(snailCase("weiß")).toBe("weiss");
      expect(snailCase("Straße")).toBe("strasse");
    });

    test("should handle mixed umlauts", () => {
      expect(snailCase("Café & Müller")).toBe("cafe_mueller");
      expect(snailCase("Größe der Tür")).toBe("groesse_der_tuer");
    });
  });

  describe("Accent normalization (case preserved for non-German)", () => {
    test("should preserve case for non-German accents in lowercase result", () => {
      expect(snailCase("Émile")).toBe("emile");
      expect(snailCase("émile")).toBe("emile");
      expect(snailCase("Ê test")).toBe("e_test");
      expect(snailCase("ê test")).toBe("e_test");
    });
  });

  describe("CamelCase and acronym handling", () => {
    test("should split standard camelCase", () => {
      expect(snailCase("spielName")).toBe("spiel_name");
      expect(snailCase("userName")).toBe("user_name");
      expect(snailCase("myVariableName")).toBe("my_variable_name");
    });

    test("should handle acronyms followed by words", () => {
      expect(snailCase("HTTPServer")).toBe("http_server");
      expect(snailCase("XMLParser")).toBe("xml_parser");
      expect(snailCase("APIClient")).toBe("api_client");
    });

    test("should handle lowercase/digit followed by acronym", () => {
      expect(snailCase("SpielnameTEST")).toBe("spielname_test");
      expect(snailCase("version2API")).toBe("version2_api");
      expect(snailCase("dataDML")).toBe("data_dml");
    });

    test("should handle complex mixed cases", () => {
      expect(snailCase("HTTPSAPIClient")).toBe("httpsapi_client"); // Complex acronym combinations
      expect(snailCase("myHTTPServer")).toBe("my_http_server");
    });
  });

  describe("Special character handling", () => {
    test("should replace spaces with underscores", () => {
      expect(snailCase("hello world")).toBe("hello_world");
      expect(snailCase("multiple   spaces")).toBe("multiple_spaces");
    });

    test("should replace special characters with underscores", () => {
      expect(snailCase("hello@world")).toBe("hello_world");
      expect(snailCase("test&more")).toBe("test_more");
      expect(snailCase("file.name")).toBe("file_name");
      expect(snailCase("path/to/file")).toBe("path_to_file");
    });

    test("should collapse multiple underscores", () => {
      expect(snailCase("hello___world")).toBe("hello_world");
      expect(snailCase("test  &  more")).toBe("test_more");
      expect(snailCase("a...b...c")).toBe("a_b_c");
    });

    test("should trim leading and trailing underscores", () => {
      expect(snailCase("_hello_")).toBe("hello");
      expect(snailCase("__test__")).toBe("test");
      expect(snailCase("...word...")).toBe("word");
    });
  });

  describe("Numbers handling", () => {
    test("should preserve numbers", () => {
      expect(snailCase("version2")).toBe("version2");
      expect(snailCase("test123")).toBe("test123");
      expect(snailCase("123test")).toBe("123test");
    });

    test("should handle numbers with camelCase", () => {
      expect(snailCase("version2API")).toBe("version2_api");
      expect(snailCase("test123Name")).toBe("test123_name");
    });
  });

  describe("Edge cases", () => {
    test("should handle only special characters", () => {
      expect(snailCase("!!!")).toBe("");
      expect(snailCase("@#$%")).toBe("");
      expect(snailCase("___")).toBe("");
    });

    test("should handle mixed content", () => {
      expect(snailCase("Hello World! This is a test.")).toBe("hello_world_this_is_a_test");
      expect(snailCase("API_VERSION_2.0")).toBe("api_version_2_0");
    });
  });
});

describe("sprintf", () => {
  describe("Basic functionality", () => {
    test("should return empty string for empty format", () => {
      expect(sprintf("")).toBe("");
    });

    test("should return format string if no placeholders", () => {
      expect(sprintf("hello world")).toBe("hello world");
    });

    test("should handle null/undefined format gracefully", () => {
      // @ts-ignore - Testing runtime behavior
      expect(sprintf(null)).toBe("");
      // @ts-ignore - Testing runtime behavior
      expect(sprintf(undefined)).toBe("");
    });
  });

  describe("String formatting (%s)", () => {
    test("should format basic string", () => {
      expect(sprintf("Hello %s", "World")).toBe("Hello World");
      expect(sprintf("%s %s", "Hello", "World")).toBe("Hello World");
    });

    test("should handle null/undefined arguments", () => {
      expect(sprintf("Hello %s", null)).toBe("Hello null");
      expect(sprintf("Hello %s", undefined)).toBe("Hello ");
    });

    test("should handle precision for strings", () => {
      expect(sprintf("%.3s", "HelloWorld")).toBe("Hel");
      expect(sprintf("%.0s", "Hello")).toBe("");
      expect(sprintf("%.10s", "Hi")).toBe("Hi");
    });

    test("should handle width for strings", () => {
      expect(sprintf("%5s", "Hi")).toBe("   Hi");
      expect(sprintf("%-5s", "Hi")).toBe("Hi   ");
    });

    test("should handle width and precision together", () => {
      expect(sprintf("%10.3s", "HelloWorld")).toBe("       Hel");
      expect(sprintf("%-10.3s", "HelloWorld")).toBe("Hel       ");
    });
  });

  describe("Integer formatting (%d, %i, %u)", () => {
    test("should format basic integers", () => {
      expect(sprintf("%d", 42)).toBe("42");
      expect(sprintf("%i", -123)).toBe("-123");
      expect(sprintf("%u", -42)).toBe("42"); // unsigned
    });

    test("should handle zero", () => {
      expect(sprintf("%d", 0)).toBe("0");
      expect(sprintf("%u", 0)).toBe("0");
    });

    test("should handle non-numeric input", () => {
      expect(sprintf("%d", "abc")).toBe("0");
      expect(sprintf("%d", null)).toBe("0");
      expect(sprintf("%d", undefined)).toBe("0");
    });

    test("should handle sign flags", () => {
      expect(sprintf("%+d", 42)).toBe("+42");
      expect(sprintf("%+d", -42)).toBe("-42");
      expect(sprintf("% d", 42)).toBe(" 42");
      expect(sprintf("% d", -42)).toBe("-42");
    });

    test("should handle width and zero padding", () => {
      expect(sprintf("%5d", 42)).toBe("   42");
      expect(sprintf("%05d", 42)).toBe("00042");
      expect(sprintf("%-5d", 42)).toBe("42   ");
      expect(sprintf("%+05d", 42)).toBe("+0042");
    });
  });

  describe("Floating point formatting (%f, %F)", () => {
    test("should format basic floats", () => {
      expect(sprintf("%f", 3.14159)).toBe("3.141590");
      expect(sprintf("%F", 3.14159)).toBe("3.141590");
    });

    test("should handle precision", () => {
      expect(sprintf("%.2f", 3.14159)).toBe("3.14");
      expect(sprintf("%.0f", 3.14159)).toBe("3");
      expect(sprintf("%.4f", 3.1)).toBe("3.1000");
    });

    test("should handle width and precision", () => {
      expect(sprintf("%8.2f", 3.14159)).toBe("    3.14");
      expect(sprintf("%08.2f", 3.14159)).toBe("00003.14");
      expect(sprintf("%-8.2f", 3.14159)).toBe("3.14    ");
    });

    test("should handle sign flags", () => {
      expect(sprintf("%+.2f", 3.14)).toBe("+3.14");
      expect(sprintf("% .2f", 3.14)).toBe(" 3.14");
      expect(sprintf("%+.2f", -3.14)).toBe("-3.14");
    });

    test("should handle non-numeric input", () => {
      expect(sprintf("%.2f", "abc")).toBe("0.00");
      expect(sprintf("%.2f", null)).toBe("0.00");
    });
  });

  describe("Scientific notation (%e, %E)", () => {
    test("should format in scientific notation", () => {
      expect(sprintf("%e", 1234.5)).toBe("1.234500e+3");
      expect(sprintf("%E", 1234.5)).toBe("1.234500E+3");
    });

    test("should handle precision", () => {
      expect(sprintf("%.2e", 1234.5)).toBe("1.23e+3");
      expect(sprintf("%.0e", 1234.5)).toBe("1e+3");
    });

    test("should handle small numbers", () => {
      expect(sprintf("%.2e", 0.00123)).toBe("1.23e-3");
      expect(sprintf("%.2E", 0.00123)).toBe("1.23E-3");
    });

    test("should handle sign flags", () => {
      expect(sprintf("%+.2e", 123.45)).toBe("+1.23e+2");
      expect(sprintf("% .2e", 123.45)).toBe(" 1.23e+2");
    });
  });

  describe("General format (%g, %G)", () => {
    test("should choose shortest representation", () => {
      expect(sprintf("%.4g", 1234)).toBe("1234");
      expect(sprintf("%.4g", 0.00001234)).toBe("1.234e-5");
      expect(sprintf("%.4G", 0.00001234)).toBe("1.234E-5");
    });

    test("should remove trailing zeros", () => {
      expect(sprintf("%.6g", 1.2300)).toBe("1.23");
      expect(sprintf("%.6g", 1000.0)).toBe("1000");
    });

    test("should handle sign flags", () => {
      expect(sprintf("%+g", 123.0)).toBe("+123");
      expect(sprintf("% g", 123.0)).toBe(" 123");
    });
  });

  describe("Hexadecimal formatting (%x, %X)", () => {
    test("should format in hexadecimal", () => {
      expect(sprintf("%x", 255)).toBe("ff");
      expect(sprintf("%X", 255)).toBe("FF");
      expect(sprintf("%x", 0)).toBe("0");
    });

    test("should handle negative numbers", () => {
      expect(sprintf("%x", -255)).toBe("ff");
      expect(sprintf("%X", -255)).toBe("FF");
    });

    test("should handle alternate form", () => {
      expect(sprintf("%#x", 255)).toBe("0xff");
      expect(sprintf("%#X", 255)).toBe("0XFF");
      expect(sprintf("%#x", 0)).toBe("0");
    });

    test("should handle width and padding", () => {
      expect(sprintf("%4x", 255)).toBe("  ff");
      expect(sprintf("%04x", 255)).toBe("00ff");
      expect(sprintf("%-4x", 255)).toBe("ff  ");
    });
  });

  describe("Octal formatting (%o)", () => {
    test("should format in octal", () => {
      expect(sprintf("%o", 64)).toBe("100");
      expect(sprintf("%o", 0)).toBe("0");
    });

    test("should handle negative numbers", () => {
      expect(sprintf("%o", -64)).toBe("100");
    });

    test("should handle alternate form", () => {
      expect(sprintf("%#o", 64)).toBe("0100");
      expect(sprintf("%#o", 0)).toBe("0");
    });

    test("should handle width and padding", () => {
      expect(sprintf("%5o", 64)).toBe("  100");
      expect(sprintf("%05o", 64)).toBe("00100");
    });
  });

  describe("Character formatting (%c)", () => {
    test("should format character codes", () => {
      expect(sprintf("%c", 65)).toBe("A");
      expect(sprintf("%c", 97)).toBe("a");
      expect(sprintf("%c %c", 72, 105)).toBe("H i");
    });

    test("should handle zero and non-numeric", () => {
      expect(sprintf("%c", 0)).toMatch(/\x00/);
      expect(sprintf("%c", "abc")).toBe("\x00");
    });
  });

  describe("Literal percent (%%) ", () => {
    test("should output literal percent", () => {
      expect(sprintf("100%%")).toBe("100%");
      expect(sprintf("%%d", 42)).toBe("%d");
      expect(sprintf("Progress: %d%%", 50)).toBe("Progress: 50%");
    });
  });

  describe("Dynamic width and precision (*)", () => {
    test("should handle dynamic width", () => {
      expect(sprintf("%*s", 5, "Hi")).toBe("   Hi");
      expect(sprintf("%-*s", 5, "Hi")).toBe("Hi   ");
    });

    test("should handle dynamic precision", () => {
      expect(sprintf("%.*s", 3, "HelloWorld")).toBe("Hel");
      expect(sprintf("%.*f", 2, 3.14159)).toBe("3.14");
    });

    test("should handle both dynamic width and precision", () => {
      expect(sprintf("%*.*s", 10, 3, "HelloWorld")).toBe("       Hel");
      expect(sprintf("%*.*f", 8, 2, 3.14159)).toBe("    3.14");
    });

    test("should handle negative or zero dynamic values", () => {
      expect(sprintf("%*s", -5, "Hi")).toBe("Hi");
      expect(sprintf("%*s", 0, "Hi")).toBe("Hi");
      expect(sprintf("%.*s", -3, "Hello")).toBe("Hello");
      expect(sprintf("%.*f", -2, 3.14159)).toBe("3.141590");
    });
  });

  describe("Complex format strings", () => {
    test("should handle multiple placeholders", () => {
      expect(sprintf("Hello %s, you have %d messages and %.1f%% battery", "John", 5, 78.9))
        .toBe("Hello John, you have 5 messages and 78.9% battery");
    });

    test("should handle mixed formatting options", () => {
      expect(sprintf("%s: %+08.2f (%#x)", "Value", 42.5, 255))
        .toBe("Value: +0042.50 (0xff)");
    });

    test("should handle edge case with no arguments", () => {
      expect(sprintf("No placeholders here")).toBe("No placeholders here");
      expect(sprintf("%s %d")).toBe(" 0"); // Missing arguments: %s->empty, %d->0
    });
  });

  describe("Edge cases and error handling", () => {
    test("should handle unknown format specifiers", () => {
      expect(sprintf("%z", 42)).toBe("%z");
      expect(sprintf("%q test %s", "hello")).toBe("%q test hello");
    });

    test("should handle malformed format strings", () => {
      expect(sprintf("%%% test")).toBe("%% test");
      expect(sprintf("%")).toBe("%");
    });

    test("should handle more arguments than placeholders", () => {
      expect(sprintf("Hello %s", "World", "Extra")).toBe("Hello World");
    });

    test("should handle fewer arguments than placeholders", () => {
      expect(sprintf("Hello %s %d")).toBe("Hello  0");
    });
  });
});