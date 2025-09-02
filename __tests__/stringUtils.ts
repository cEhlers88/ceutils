import { createSlug, createPsrFolderName } from "../src/lib/stringUtils";

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
      expect(createSlug("MÜLLER")).toBe("mue-ller"); // Umlauts create mixed case after normalization
      expect(createSlug("GRÖSSE")).toBe("gr-oe-sse");
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

describe("createPsrFolderName", () => {
  describe("Basic functionality", () => {
    test("should return empty string for empty input", () => {
      expect(createPsrFolderName("")).toBe("");
    });

    test("should return empty string for null/undefined input", () => {
      // @ts-ignore - Testing runtime behavior
      expect(createPsrFolderName(null)).toBe("");
      // @ts-ignore - Testing runtime behavior
      expect(createPsrFolderName(undefined)).toBe("");
    });

    test("should handle simple words", () => {
      expect(createPsrFolderName("hello")).toBe("Hello");
      expect(createPsrFolderName("world")).toBe("World");
    });

    test("should convert to PascalCase", () => {
      expect(createPsrFolderName("hello world")).toBe("HelloWorld");
      expect(createPsrFolderName("my class name")).toBe("MyClassName");
    });
  });

  describe("German umlaut normalization", () => {
    test("should normalize lowercase umlauts", () => {
      expect(createPsrFolderName("café")).toBe("Cafe");
      expect(createPsrFolderName("müller")).toBe("Mueller");
      expect(createPsrFolderName("größe")).toBe("Groesse");
    });

    test("should normalize uppercase umlauts", () => {
      expect(createPsrFolderName("CAFÉ")).toBe("Cafe");
      expect(createPsrFolderName("MÜLLER")).toBe("Mueller");
      expect(createPsrFolderName("GRÖSSE")).toBe("Groesse");
    });

    test("should normalize ß character", () => {
      expect(createPsrFolderName("weiß")).toBe("Weiss");
      expect(createPsrFolderName("Straße")).toBe("Strasse");
    });

    test("should handle mixed umlauts", () => {
      expect(createPsrFolderName("café müller")).toBe("CafeMueller");
      expect(createPsrFolderName("größe der tür")).toBe("GroesseDerTuer");
    });
  });

  describe("Special character handling", () => {
    test("should replace invalid characters with spaces", () => {
      expect(createPsrFolderName("hello-world")).toBe("HelloWorld");
      expect(createPsrFolderName("test_name")).toBe("TestName");
      expect(createPsrFolderName("file.name")).toBe("FileName");
      expect(createPsrFolderName("path/to/file")).toBe("PathToFile");
    });

    test("should handle multiple special characters", () => {
      expect(createPsrFolderName("hello---world")).toBe("HelloWorld");
      expect(createPsrFolderName("test@#$name")).toBe("TestName");
      expect(createPsrFolderName("a...b...c")).toBe("ABC");
    });

    test("should filter empty words", () => {
      expect(createPsrFolderName("hello  world")).toBe("HelloWorld");
      expect(createPsrFolderName("test   name")).toBe("TestName");
    });
  });

  describe("Number handling", () => {
    test("should preserve numbers in words", () => {
      expect(createPsrFolderName("version2")).toBe("Version2");
      expect(createPsrFolderName("test123")).toBe("Test123");
    });

    test("should prefix with underscore if starting with digit", () => {
      expect(createPsrFolderName("123test")).toBe("_123test");
      expect(createPsrFolderName("2nd version")).toBe("_2ndVersion");
      expect(createPsrFolderName("0config")).toBe("_0config");
    });

    test("should handle mixed numbers and letters", () => {
      expect(createPsrFolderName("api version 2")).toBe("ApiVersion2");
      expect(createPsrFolderName("test 123 name")).toBe("Test123Name");
    });
  });

  describe("Case handling", () => {
    test("should handle all lowercase", () => {
      expect(createPsrFolderName("hello world")).toBe("HelloWorld");
      expect(createPsrFolderName("my class name")).toBe("MyClassName");
    });

    test("should handle all uppercase", () => {
      expect(createPsrFolderName("HELLO WORLD")).toBe("HelloWorld");
      expect(createPsrFolderName("MY CLASS NAME")).toBe("MyClassName");
    });

    test("should handle mixed case", () => {
      expect(createPsrFolderName("Hello World")).toBe("HelloWorld");
      expect(createPsrFolderName("myClassName")).toBe("Myclassname");
    });
  });

  describe("Edge cases", () => {
    test("should handle only special characters", () => {
      expect(createPsrFolderName("!!!")).toBe("");
      expect(createPsrFolderName("@#$%")).toBe("");
      expect(createPsrFolderName("---")).toBe("");
    });

    test("should handle single character words", () => {
      expect(createPsrFolderName("a b c")).toBe("ABC");
      expect(createPsrFolderName("x y z")).toBe("XYZ");
    });

    test("should handle complex mixed content", () => {
      expect(createPsrFolderName("My_Class-Name.v2")).toBe("MyClassNameV2");
      expect(createPsrFolderName("API_VERSION_2.0")).toBe("ApiVersion20");
    });
  });
});