# API Reference

Complete API documentation for ceutils library components and utilities.

## Table of Contents

- [Installation](#installation)
- [Core Libraries](#core-libraries)
  - [DOM Library](#dom-library)
  - [Canvas Library](#canvas-library)
- [Components](#components)
  - [Vector2D](#vector2d)
  - [Datahandler](#datahandler)
  - [Eventhandler](#eventhandler)
  - [CachedDataProvider](#cacheddataprovider)
  - [Dialog](#dialog)
  - [DialogProvider](#dialogprovider)
  - [ObjectStoreProvider](#objectstoreprovider)
- [Utilities](#utilities)
  - [createStore](#createstore)
- [TypeScript Interfaces](#typescript-interfaces)

## Installation

```bash
npm install @cehlers88/ceutils
```

## Core Libraries

### DOM Library

**Import:**
```javascript
import { domLib } from "@cehlers88/ceutils";
```

**Extended HTMLElement Methods:**

#### `HTMLElement.appendChilds(children: Array<HTMLElement | SVGSVGElement | Text>): HTMLElement`
Appends multiple children to an element.

#### `HTMLElement.createChild(tagName: string, properties?: ICreateElementProperties): HTMLElement`
Creates and appends a child element.

#### `HTMLElement.getParentByCondition(condition: (element: HTMLElement) => boolean): HTMLElement | undefined`
Finds parent element matching condition.

#### `HTMLElement.getParentWithClass(className: string): HTMLElement | undefined`
Finds parent element with specific CSS class.

#### `HTMLElement.removeAllChilds(): HTMLElement`
Removes all child elements.

**Static Methods:**

#### `domLib.createElement(tagName: string, properties?: ICreateElementProperties): HTMLElement`
Creates an element with properties and event handlers.

#### `domLib.getElement(selector: string): Element | HTMLElement | HTMLCollectionOf<Element> | NodeListOf<Element> | null`
Flexible element selector supporting:
- `"id"` - getElementById
- `"#id"` - getElementById
- `".class"` - getElementsByClassName
- `"?.selector"` - querySelector
- `"?*.selector"` - querySelectorAll

### Canvas Library

**Import:**
```javascript
import { canvasLib } from "@cehlers88/ceutils";
```

#### `canvasLib.getDrawEngine(canvas: HTMLCanvasElement): IDrawEngine`
Creates a draw engine for the canvas.

**Draw Engine Methods:**

#### `rectangle(rect: IRectangleBase, strokeColor?: string | number, fillColor?: string | number, angle?: number, pivot?: IVector2D): void`
Draws a rectangle with optional rotation.

#### `beginPath(): void`
Begins a new path.

## Components

### Vector2D

**Import:**
```javascript
import { Vector2D } from "@cehlers88/ceutils";
```

#### `constructor(x: number, y: number)`
Creates a new 2D vector.

**Properties:**
- `x: number` - X coordinate
- `y: number` - Y coordinate
- `magnitude: number` - Vector length
- `normalized: IVector2D` - Unit vector
- `rotation: number` - Rotation in degrees

**Methods:**

#### `addVector(vector: IVector2D): Vector2D`
Adds another vector to this vector.

#### `scale(factor: number): Vector2D`
Scales the vector by a factor.

#### `rotate(angle: number, anchor: IVector2D): Vector2D`
Rotates vector around an anchor point.

#### `doWithVector(otherVector: IVector2D): VectorOperations`
Returns object with vector operations:
- `add()` - Add vectors
- `subtract()` - Subtract vectors
- `calculateDistance()` - Get distance
- `getAngleRadians()` - Get angle in radians
- `getAngleVector()` - Get direction vector
- `getNomalizedMoveVector(speed?)` - Get movement vector

### Datahandler

**Import:**
```javascript
import { Datahandler } from "@cehlers88/ceutils";
```

#### `constructor()`
Creates a new data handler with proxy-based access.

**Methods:**

#### `setData(key: string, value: any): void`
Sets data value and dispatches change event.

#### `getData(key: string): any`
Gets data value by key.

#### `getDataSave(key: string, defaultValue?: any): any`
Gets data value with default fallback.

#### `clearData(): void`
Clears all data.

#### `getAll(): IDataEntry[]`
Returns all data entries.

**Events:**
- `dataChanged` - Fired when data changes

### Eventhandler

**Import:**
```javascript
import { Eventhandler } from "@cehlers88/ceutils";
```

#### `constructor()`
Creates a new event handler.

**Methods:**

#### `addListener(eventName: string, listener: Function): void`
Adds event listener.

#### `removeListener(eventName: string, listener: Function): void`
Removes event listener.

#### `dispatch(eventName: string, data?: any): void`
Dispatches an event.

#### `on(eventName: string, listener: Function): void`
Alias for addListener.

#### `setErrorHandler(handler: Function): void`
Sets global error handler.

### CachedDataProvider

**Import:**
```javascript
import { CachedDataProvider } from "@cehlers88/ceutils";
```

#### `constructor()`
Creates a new cached data provider.

**Methods:**

#### `fetch(options: ICachedDataProviderFetchOptions): Promise<any>`
Fetches data with caching.

#### `clearCache(): void`
Clears the cache.

**Options Interface:**
```typescript
interface ICachedDataProviderFetchOptions {
    url: string;
    evalJson?: boolean;
    method?: string;
    data?: {[key: string]: any};
}
```

### Dialog

**Import:**
```javascript
import { Dialog } from "@cehlers88/ceutils";
```

#### `constructor()`
Abstract base class for dialogs.

**Abstract Methods:**

#### `getName(): string`
Returns dialog name.

#### `getAcceptations(): string[]`
Returns possible acceptance values.

#### `getDefaultProviderOptions(): object`
Returns default options.

#### `validate(): object`
Validates dialog state.

### DialogProvider

**Import:**
```javascript
import { DialogProvider } from "@cehlers88/ceutils";
```

#### `constructor()`
Creates a dialog provider.

**Methods:**

#### `showDialog(dialog: IDialog): Promise<any>`
Shows a dialog and returns promise.

### ObjectStoreProvider

**Import:**
```javascript
import { ObjectStoreProvider } from "@cehlers88/ceutils";
```

#### `constructor()`
Creates an object store provider.

**Methods:**

#### `addObject(instance: any, name?: string, additionalInfo?: object): IStoredObject`
Adds object to global store.

#### `getObject(name: string): IStoredObject | undefined`
Gets object by name.

#### `getObjectsByGroup(group: string): IStoredObject[]`
Gets all objects in a group.

#### `removeObject(name: string): boolean`
Removes object from store.

#### `clear(): void`
Clears all objects.

## Utilities

### createStore

**Import:**
```javascript
import { createStore } from "@cehlers88/ceutils";
```

#### `createStore(): object`
Creates a reactive store with proxy-based property access.

**Store Methods:**
- `on(eventName, listener)` - Listen for changes
- Direct property access for get/set

**Store Events:**
- `updateStore` - When any property updates
- `update_${propertyName}` - When specific property updates
- `set_${propertyName}` - When property is set

## TypeScript Interfaces

### IVector2D
```typescript
interface IVector2D {
    x: number;
    y: number;
    z?: number;
    postionType?: EPositionType;
    positionUnit?: EPositionUnit;
    rotation?: number;
}
```

### ICreateElementProperties
```typescript
interface ICreateElementProperties {
    [key: string]: any;
    childNodes?: (HTMLElement | SVGSVGElement | Text)[];
    innerText?: string;
    data?: { [name: string]: string };
    // Event handlers
    onClick?: (event: Event) => void;
    onChange?: (event: Event) => void;
    // ... other event handlers
}
```

### IDataEntry
```typescript
interface IDataEntry {
    key: string;
    value: any;
}
```

### IDialog
```typescript
interface IDialog {
    getName(): string;
    getAcceptations(): string[];
    getDefaultProviderOptions(): object;
    validate(): object;
}
```

### IStoredObject
```typescript
interface IStoredObject {
    group: string;
    name: string;
    instance: any;
    [key: string]: any;
}
```

### IRectangleBase
```typescript
interface IRectangleBase {
    x: number;
    y: number;
    width: number;
    height: number;
}
```

### ICachedDataProviderFetchOptions
```typescript
interface ICachedDataProviderFetchOptions {
    url: string;
    evalJson?: boolean;
    method?: string;
    data?: {[key: string]: any};
}
```

## Enums

### EPositionType
```typescript
enum EPositionType {
    absolute = "absolute",
    cameraRelative = "cameraRelative"
}
```

### EPositionUnit
```typescript
enum EPositionUnit {
    px = "px",
    percent_global = "percent_global",
    percent_local = "percent_local"
}
```

## Error Handling

All components include built-in error handling:

- **Eventhandler**: Use `setErrorHandler()` to catch errors
- **CachedDataProvider**: Promise rejections for fetch errors
- **Dialog**: Validation errors in `validate()` method
- **ObjectStoreProvider**: Safe undefined returns for missing objects

## Browser Support

- **ES6+ Browsers**: Chrome 60+, Firefox 60+, Safari 12+, Edge 79+
- **TypeScript**: 4.5+
- **React**: 17+ (for React components)

## Contributing

When extending ceutils:

1. **Extend base classes**: Use Eventhandler for event-driven components
2. **Follow TypeScript**: Use proper interfaces and type definitions
3. **Test thoroughly**: Add tests for new functionality
4. **Document**: Update API documentation for new features