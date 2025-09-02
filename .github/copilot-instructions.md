# ceutils - TypeScript DOM/Canvas Utilities Library

ceutils is a TypeScript utility library providing DOM manipulation, 2D/3D canvas drawing, React components, and data/event handling services. The project builds as both TypeScript declaration files and Webpack-bundled JavaScript for browser usage.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

Bootstrap, build, and test the repository:
- Prerequisites: Node.js v20+ and NPM v10+ (already available in environment)
- `npm install` -- installs dependencies and runs full build. Takes 10-15 seconds. NEVER CANCEL.
- `npm run build` -- TypeScript compilation + Webpack production build. Takes 8-10 seconds. NEVER CANCEL.
- `npm run build:dev` -- TypeScript + Webpack development build. Takes 6-8 seconds. NEVER CANCEL.
- `npm test` -- Jest test suite with 32 tests. Takes 5-6 seconds. NEVER CANCEL.

Development workflow:
- `npm start` -- Webpack dev server on port 9000. Takes 3-4 seconds to start. NEVER CANCEL.
  - If port 9000 is busy, use: `npx webpack serve --mode development --port 9001`
  - Serves demo at http://localhost:9000/ with live reload
- `npm run format` -- Prettier code formatting. Takes 1-2 seconds. Always run before commits.
- `npm run lint` -- TSLint code checking. Takes 2-3 seconds. May show style errors.

Build outputs (dist/ directory):
- `index.js`, `canvasLib.js`, `domLib.js` -- UMD bundles for browser usage
- TypeScript declaration files (.d.ts) for all modules
- `index.html` -- Demo page with canvas examples

Additional commands:
- `npm run build:styles` -- SASS compilation. BROKEN: use `npx sass ./src/styles/Dialog.scss ./dist/styles/Dialog.css --style compressed` instead. Takes < 1 second.
- `npm run minify` -- Webpack production build only (no TypeScript)
- `npm run prepare` -- Automatic build hook (runs on npm install)

## Validation

ALWAYS validate your changes with the following workflow:
1. `npm run format && npm run lint` -- Fix code style first
2. `npm test` -- Ensure all tests pass
3. `npm run build` -- Verify production build works
4. Start dev server and test manually at http://localhost:9000/

Manual validation scenarios:
- Test DOM manipulation: Open dev server demo, check browser console for ceutils object
- Test canvas drawing: Demo includes animated hexagon and 3D cube examples
- Test React components: Import and test CachedDataProvider, ComponentStarter
- For new canvas features: Add test drawing commands to src/index.html demo
- For DOM utilities: Test createElement, appendChilds, getElement functions in browser

Performance expectations:
- Builds complete in under 10 seconds -- NEVER CANCEL before 30 seconds
- Tests complete in under 6 seconds -- NEVER CANCEL before 15 seconds
- Dev server starts in under 5 seconds -- NEVER CANCEL before 10 seconds

## Common Tasks

The following are outputs from frequently run commands. Reference them instead of viewing, searching, or running bash commands to save time.

### Repository structure
```
src/
├── index.ts              # Main library entry point
├── dev.ts               # Development/demo entry point
├── lib/                 # Core libraries
│   ├── dom.ts          # DOM manipulation utilities
│   ├── canvas.ts       # Canvas drawing engine
│   ├── Dialog.ts       # Dialog component
│   └── createStore.ts  # State management
├── handler/            # Event and data handlers
├── Provider/           # Data provider services
├── Component/          # React components
├── service/            # Service classes
├── Engine/             # Canvas drawing engine
├── Interfaces/         # TypeScript interfaces
└── styles/             # SCSS stylesheets
```

### Key npm scripts
```json
{
  "build": "tsc -p tsconfig.build.json && npm run minify",
  "build:dev": "tsc -p tsconfig.build.json && webpack --mode development", 
  "start": "webpack serve --mode development",
  "test": "jest --config jestconfig.json",
  "format": "prettier --write \"src/**/*.ts\" \"src/**/*.js\"",
  "lint": "tslint -p tsconfig.json"
}
```

### Library usage examples
```javascript
// DOM utilities
import {domLib} from "@cehlers88/ceutils";
const element = domLib.createElement("div", {id: "myDiv", class: "myClass"});
document.body.appendChild(element);

// Canvas drawing
import {canvasLib} from "@cehlers88/ceutils";
const canvas = document.getElementById("canvas");
const drawEngine = canvasLib.getDrawEngine(canvas);
drawEngine.rectangle({x: 10, y: 10, width: 100, height: 100}, "black", "yellow");

// React components
import {CachedDataProvider} from "@cehlers88/ceutils";
const dataProvider = new CachedDataProvider();
```

## Known Issues and Workarounds

- TSLint shows style errors but doesn't break builds -- run `npm run format` to fix most issues
- SASS build script has wrong syntax -- use `npx sass` command directly instead of `npm run build:styles`
- Port 9000 may be busy -- use alternative port with `npx webpack serve --mode development --port 9001`
- Linting errors are style-related (object key sorting, const vs let) -- not functional issues

## Testing Strategy

Unit tests (Jest):
- 3 test suites: Datahandler, Eventhandler, ComponentStarter
- 32 total tests covering core functionality
- Tests run in TypeScript with ts-jest
- Located in `__tests__/` directory

Integration testing:
- Use demo page at `src/index.html` for manual testing
- Canvas drawing examples with animations
- DOM manipulation utilities testing
- Browser console provides ceutils global object for testing

## Architecture Notes

Core libraries:
- **domLib**: Extends HTMLElement with utility methods (appendChilds, createChild, getParentWithClass)
- **canvasLib**: 2D/3D drawing engine with simplified API for shapes, text, animations
- **Providers**: CachedDataProvider for API caching, DialogProvider for modal management
- **Handlers**: Eventhandler for custom events, Datahandler for data management

Build system:
- TypeScript compilation to ES6 modules with declarations
- Webpack bundling to UMD format for browser compatibility
- Multiple entry points: main library, canvas-only, DOM-only, development demo
- Development server with hot reload and source maps

The library is designed for browser usage with both module imports and global object access.