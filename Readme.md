# CEUTILS

A comprehensive TypeScript/JavaScript utility library providing DOM manipulation, canvas drawing, data handling, vector mathematics, and component management tools for modern web development.

[![npm version](https://badge.fury.io/js/%40cehlers88%2Fceutils.svg)](https://badge.fury.io/js/%40cehlers88%2Fceutils)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Features

- **DOM Library**: Simplified DOM manipulation with extended HTMLElement methods
- **Canvas Library**: Easy-to-use 2D canvas drawing utilities
- **Vector2D**: Comprehensive 2D vector mathematics for game development
- **Data Handling**: Event-driven data management with caching
- **Dialog System**: Abstract dialog management for modals and popups
- **Object Store**: Global object storage and singleton management
- **Component System**: React-like component management
- **TypeScript Support**: Full TypeScript definitions included

## Installation

```bash
npm install @cehlers88/ceutils
```

## Quick Start

```javascript
// Import specific utilities
import { domLib, canvasLib, Vector2D, Datahandler } from "@cehlers88/ceutils";

// Or import the entire library
import ceutils from "@cehlers88/ceutils";
```

## Core Libraries

### DOM Library

Simplifies DOM manipulation with extended methods and utility functions.

```javascript
import { domLib } from "@cehlers88/ceutils";

// Create elements with properties and events
const button = domLib.createElement("button", {
    innerText: "Click me!",
    class: "btn-primary",
    onClick: () => console.log("Button clicked!")
});

// Extended HTMLElement methods
document.body.appendChilds([button]);
const parent = button.getParentWithClass("container");
```

**[→ See complete DOM Library documentation](./doc/domLib.md)**

### Canvas Library

Simplified 2D canvas drawing with a clean API.

```javascript
import { canvasLib } from "@cehlers88/ceutils";

const canvas = document.getElementById("myCanvas");
const drawEngine = canvasLib.getDrawEngine(canvas);

// Draw a rectangle with fill and stroke
drawEngine.rectangle({
    x: 10, y: 10,
    width: 100, height: 100
}, "black", "yellow");
```

**[→ See complete Canvas Library documentation](./doc/canvasLib.md)**

### Vector2D

Comprehensive 2D vector mathematics for game development and animations.

```javascript
import { Vector2D } from "@cehlers88/ceutils";

const position = new Vector2D(100, 200);
const target = new Vector2D(300, 400);

// Calculate distance and movement
const distance = position.doWithVector(target).calculateDistance();
const moveVector = position.doWithVector(target).getNomalizedMoveVector({ x: 5, y: 5 });

// Apply movement
position.addVector(new Vector2D(moveVector.x, moveVector.y));
```

## Advanced Components

### Data Handler

Event-driven data management with automatic change detection.

```javascript
import { Datahandler } from "@cehlers88/ceutils";

const dataHandler = new Datahandler();

// Set and get data
dataHandler.setData("user", { name: "John", age: 30 });
console.log(dataHandler.getData("user")); // { name: "John", age: 30 }

// Listen for changes
dataHandler.addListener("dataChanged", (data) => {
    console.log("Data changed:", data);
});
```

### Cached Data Provider

Reduces API calls by caching responses.

```javascript
import { CachedDataProvider } from "@cehlers88/ceutils";

const provider = new CachedDataProvider();

// Fetch data (cached automatically)
provider.fetch({
    url: "https://api.example.com/users",
    evalJson: true
}).then(data => {
    console.log("User data:", data);
});

// Clear cache when needed
provider.clearCache();
```

### Dialog System

Abstract dialog management for modals and popups.

```javascript
import { Dialog, DialogProvider } from "@cehlers88/ceutils";

class ConfirmDialog extends Dialog {
    constructor(message) {
        super();
        this.name = "ConfirmDialog";
        this.props = { message };
    }
    
    getAcceptations() {
        return ["yes", "no"];
    }
}

const dialogProvider = new DialogProvider();
dialogProvider.showDialog(new ConfirmDialog("Are you sure?"))
    .then(result => {
        console.log("User chose:", result.acceptance);
    });
```

### Object Store Provider

Global object storage and singleton management.

```javascript
import { ObjectStoreProvider } from "@cehlers88/ceutils";

const store = new ObjectStoreProvider();

// Store objects globally
store.addObject(new MyService(), "mainService", { group: "services" });

// Retrieve objects
const service = store.getObject("mainService").instance;
const allServices = store.getObjectsByGroup("services");
```

**[→ See complete Components documentation](./doc/components.md)**

## Event Handler

Provides event-driven architecture with listener management.

```javascript
import { Eventhandler } from "@cehlers88/ceutils";

class MyComponent extends Eventhandler {
    constructor() {
        super();
        this.value = 0;
    }
    
    increment() {
        this.value++;
        this.dispatch("valueChanged", this.value);
    }
}

const component = new MyComponent();
component.addListener("valueChanged", (value) => {
    console.log("New value:", value);
});
```

## API Reference

### Available Exports

```javascript
// Main exports
import {
    // Core libraries
    domLib,
    canvasLib,
    
    // Classes
    Vector2D,
    Datahandler,
    Eventhandler,
    Dialog,
    CachedDataProvider,
    DialogProvider,
    ObjectStoreProvider,
    
    // Utilities
    createStore
} from "@cehlers88/ceutils";

// Default export (contains all above)
import ceutils from "@cehlers88/ceutils";
```

### TypeScript Support

Full TypeScript definitions are included. Key interfaces:

- `IVector2D` - Vector interface
- `ICreateElementProperties` - DOM element properties
- `IDataEntry` - Data handler entry
- `IDialog` - Dialog interface
- `IStoredObject` - Object store entry

## Browser Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 60+, Safari 12+, Edge 79+
- **Node.js**: 12+ (for server-side usage)
- **Dependencies**: React 17+ (for React components)

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

**Christoph Ehlers** - [webmaster@c-ehlers.de](mailto:webmaster@c-ehlers.de)

## Changelog

### Version 1.2.77
- Enhanced TypeScript support
- Improved documentation
- Added Vector2D class
- Extended canvas utilities
- Bug fixes and optimizations

## Support

- 📖 [Documentation](./doc/)
- 🐛 [Issues](https://github.com/cEhlers88/ceutils/issues)
- 💬 [Discussions](https://github.com/cEhlers88/ceutils/discussions)