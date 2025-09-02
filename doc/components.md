# Components Documentation

This document covers the advanced components available in ceutils library.

## Vector2D Class

The `Vector2D` class provides a comprehensive 2D vector implementation with mathematical operations, positioning, and utility methods.

### Installation and Import

```javascript
import { Vector2D } from "@cehlers88/ceutils";
```

### Constructor

```javascript
const vector = new Vector2D(x, y);
```

**Parameters:**
- `x` (number): X coordinate
- `y` (number): Y coordinate

### Properties

#### Basic Coordinates
- `x` (number): X coordinate (rounded to 3 decimal places)
- `y` (number): Y coordinate (rounded to 3 decimal places)
- `left` (number): Alias for x coordinate
- `top` (number): Alias for y coordinate
- `notRoundedX` (number): Raw x coordinate without rounding
- `notRoundedY` (number): Raw y coordinate without rounding

#### Vector Mathematics
- `magnitude` (number): Length/magnitude of the vector
- `length` (number): Alias for magnitude
- `normalized` (IVector2D): Normalized vector (unit vector)

#### Position and Rotation
- `rotation` (number): Rotation angle in degrees
- `positionType` (EPositionType): Position type (absolute or camera relative)
- `PositionUnit` (EPositionUnit): Unit type (px, percent_global, percent_local)

#### Camera-Related
- `cameraSaveX` (number): X coordinate relative to camera
- `cameraSaveY` (number): Y coordinate relative to camera
- `positionSaveX` (number): Safe X coordinate based on position type
- `positionSaveY` (number): Safe Y coordinate based on position type

### Methods

#### Core Operations

##### `addVector(vector: IVector2D): Vector2D`
Adds another vector to this vector (modifies current vector).

```javascript
const vector1 = new Vector2D(10, 20);
const vector2 = new Vector2D(5, 15);
vector1.addVector(vector2); // vector1 is now (15, 35)
```

##### `calcSubtractVector(vector: IVector2D): Vector2D`
Calculates subtraction without modifying the current vector.

```javascript
const vector1 = new Vector2D(10, 20);
const vector2 = new Vector2D(5, 15);
const result = vector1.calcSubtractVector(vector2); // result is (5, 5)
```

##### `scale(factor: number): Vector2D`
Scales the vector by a factor.

```javascript
const vector = new Vector2D(10, 20);
vector.scale(2); // vector is now (20, 40)
```

##### `rotate(angle: number, anchor: IVector2D): Vector2D`
Rotates the vector around an anchor point.

```javascript
const vector = new Vector2D(10, 0);
const anchor = new Vector2D(0, 0);
vector.rotate(90, anchor); // Rotate 90 degrees around origin
```

##### `update(deltaTime: number): void`
Updates direction tracking based on movement since last frame.

```javascript
vector.update(16.67); // Update with 60fps delta time
```

#### Advanced Vector Operations

##### `doWithVector(otherVector: IVector2D)`
Returns an object with chainable operations between two vectors.

```javascript
const vector1 = new Vector2D(0, 0);
const vector2 = new Vector2D(10, 10);

// Calculate distance
const distance = vector1.doWithVector(vector2).calculateDistance();

// Get normalized movement vector
const moveVector = vector1.doWithVector(vector2).getNomalizedMoveVector({ x: 2, y: 2 });

// Get angle in radians
const angle = vector1.doWithVector(vector2).getAngleRadians();

// Get angle vector (direction)
const angleVector = vector1.doWithVector(vector2).getAngleVector();

// Add vectors
vector1.doWithVector(vector2).add();

// Subtract vectors
vector1.doWithVector(vector2).subtract();
```

**Available operations:**
- `add()`: Adds the other vector to this vector
- `subtract()`: Subtracts the other vector from this vector
- `calculateDistance()`: Returns distance between vectors
- `getAngleRadians()`: Returns angle in radians between vectors
- `getAngleVector()`: Returns normalized direction vector
- `getNomalizedMoveVector(speed?)`: Returns movement vector with speed limit

### Examples

#### Basic Vector Math

```javascript
// Create vectors
const position = new Vector2D(100, 200);
const velocity = new Vector2D(5, -3);

// Add velocity to position
position.addVector(velocity);

// Calculate distance between two points
const player = new Vector2D(0, 0);
const enemy = new Vector2D(30, 40);
const distance = player.doWithVector(enemy).calculateDistance(); // 50

// Normalize a vector
const direction = new Vector2D(3, 4);
const normalized = direction.normalized; // Vector with magnitude 1
```

#### Game Development Example

```javascript
class GameObject {
    constructor(x, y) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.speed = 100; // pixels per second
    }
    
    moveTowards(target, deltaTime) {
        // Get normalized movement vector
        const moveVector = this.position.doWithVector(target)
            .getNomalizedMoveVector({ x: this.speed * deltaTime, y: this.speed * deltaTime });
        
        // Apply movement
        this.position.addVector(new Vector2D(moveVector.x, moveVector.y));
    }
    
    update(deltaTime) {
        // Update position tracking
        this.position.update(deltaTime);
        
        // Apply velocity
        const frame_velocity = new Vector2D(
            this.velocity.x * deltaTime,
            this.velocity.y * deltaTime
        );
        this.position.addVector(frame_velocity);
    }
}
```

## Dialog Class

The `Dialog` class provides an abstract base for creating modal dialogs and popup interfaces.

### Installation and Import

```javascript
import { Dialog } from "@cehlers88/ceutils";
```

### Creating a Custom Dialog

```javascript
class MyDialog extends Dialog {
    constructor(props) {
        super();
        this.name = "MyDialog";
        this.props = props;
    }
    
    getAcceptations() {
        return ["ok", "cancel"];
    }
    
    getDefaultProviderOptions() {
        return {
            abortAble: true,
            modal: true,
            backdrop: true
        };
    }
    
    validate() {
        // Custom validation logic
        const isValid = this.props.username && this.props.username.length > 0;
        
        return {
            hadError: !isValid,
            errorMessage: isValid ? "" : "Username is required",
            props: this.props,
            reOpen: !isValid
        };
    }
    
    render() {
        // Custom rendering logic
        return domLib.createElement("div", {
            class: "dialog-content",
            childNodes: [
                domLib.createElement("h2", { innerText: "User Input" }),
                domLib.createElement("input", {
                    type: "text",
                    value: this.props.username || "",
                    onChange: (e) => this.props.username = e.target.value
                }),
                domLib.createElement("div", {
                    class: "dialog-buttons",
                    childNodes: [
                        domLib.createElement("button", {
                            innerText: "OK",
                            onClick: () => this.dispatch("accept", "ok")
                        }),
                        domLib.createElement("button", {
                            innerText: "Cancel",
                            onClick: () => this.dispatch("accept", "cancel")
                        })
                    ]
                })
            ]
        });
    }
}
```

### Methods

#### `getName(): string`
Returns the dialog name for identification.

#### `getAcceptations(): string[]`
Returns array of possible acceptance values (e.g., ["ok", "cancel"]).

#### `getDefaultProviderOptions(): object`
Returns default options for the dialog provider.

#### `validate(): object`
Validates dialog state and returns validation result.

**Returns:**
```javascript
{
    hadError: boolean,
    errorMessage: string,
    props: any,
    reOpen: boolean
}
```

### Usage with DialogProvider

```javascript
import { DialogProvider } from "@cehlers88/ceutils";

const dialogProvider = new DialogProvider();

// Show dialog
dialogProvider.showDialog(new MyDialog({ username: "" }))
    .then(result => {
        if (result.acceptance === "ok") {
            console.log("User entered:", result.props.username);
        }
    });
```

## ObjectStoreProvider Class

The `ObjectStoreProvider` provides a global object storage system for managing shared instances across your application.

### Installation and Import

```javascript
import { ObjectStoreProvider } from "@cehlers88/ceutils";
```

### Constructor

```javascript
const store = new ObjectStoreProvider();
```

### Methods

#### `addObject(instance: any, name?: string, additionalInfo?: object): IStoredObject`

Adds an object to the global store.

**Parameters:**
- `instance` (any): The object to store
- `name` (string, optional): Name for the object (auto-generated if not provided)
- `additionalInfo` (object, optional): Additional metadata

**Example:**
```javascript
const store = new ObjectStoreProvider();

// Add a simple object
const myService = new MyService();
store.addObject(myService, "mainService", {
    group: "services",
    priority: 1
});

// Add with auto-generated name
store.addObject(new Logger(), null, { group: "utilities" });
```

#### `getObject(name: string): IStoredObject | undefined`

Retrieves an object by name.

```javascript
const storedService = store.getObject("mainService");
if (storedService) {
    const service = storedService.instance;
    // Use the service
}
```

#### `getObjectsByGroup(group: string): IStoredObject[]`

Retrieves all objects in a specific group.

```javascript
const services = store.getObjectsByGroup("services");
services.forEach(stored => {
    console.log(`Service: ${stored.name}`, stored.instance);
});
```

#### `removeObject(name: string): boolean`

Removes an object from the store.

```javascript
const removed = store.removeObject("mainService");
console.log("Object removed:", removed);
```

#### `clear(): void`

Clears all objects from the store.

```javascript
store.clear();
```

### Interface: IStoredObject

```typescript
interface IStoredObject {
    group: string;
    name: string;
    instance: any;
    [key: string]: any; // Additional metadata
}
```

### Usage Examples

#### Service Registry Pattern

```javascript
class ServiceRegistry extends ObjectStoreProvider {
    registerService(service, name, metadata = {}) {
        return this.addObject(service, name, {
            group: "services",
            ...metadata
        });
    }
    
    getService(name) {
        const stored = this.getObject(name);
        return stored ? stored.instance : null;
    }
    
    getAllServices() {
        return this.getObjectsByGroup("services")
            .map(stored => stored.instance);
    }
}

// Usage
const registry = new ServiceRegistry();
registry.registerService(new DatabaseService(), "database");
registry.registerService(new AuthService(), "auth");

const dbService = registry.getService("database");
```

#### Plugin System

```javascript
class PluginManager extends ObjectStoreProvider {
    loadPlugin(plugin, name) {
        return this.addObject(plugin, name, {
            group: "plugins",
            loaded: Date.now(),
            active: true
        });
    }
    
    getActivePlugins() {
        return this.getObjectsByGroup("plugins")
            .filter(stored => stored.active)
            .map(stored => stored.instance);
    }
    
    deactivatePlugin(name) {
        const stored = this.getObject(name);
        if (stored) {
            stored.active = false;
            return true;
        }
        return false;
    }
}
```

#### Singleton Pattern Enhancement

```javascript
class SingletonStore extends ObjectStoreProvider {
    getSingleton(Constructor, name = Constructor.name) {
        let stored = this.getObject(name);
        
        if (!stored) {
            const instance = new Constructor();
            stored = this.addObject(instance, name, {
                group: "singletons",
                created: Date.now()
            });
        }
        
        return stored.instance;
    }
}

// Usage
const store = new SingletonStore();
const logger1 = store.getSingleton(Logger);
const logger2 = store.getSingleton(Logger);
console.log(logger1 === logger2); // true
```

## Best Practices

### Vector2D
1. **Use for game development** - Perfect for position, velocity, and direction calculations
2. **Cache normalized vectors** - Store frequently used normalized vectors to avoid recalculation
3. **Use doWithVector for complex operations** - Leverages the fluent interface for readable code
4. **Update regularly** - Call `update()` each frame for direction tracking

### Dialog
1. **Extend for custom dialogs** - Always extend the base Dialog class
2. **Implement validation** - Use the validate() method for user input validation
3. **Handle events properly** - Use the Eventhandler base class for clean event management
4. **Design for reusability** - Make dialogs configurable through props

### ObjectStoreProvider
1. **Use groups for organization** - Organize objects into logical groups
2. **Avoid memory leaks** - Clean up unused objects with removeObject()
3. **Use for singletons** - Excellent for managing singleton instances
4. **Add metadata** - Use additional properties for object management

## Browser Compatibility

All components work in modern browsers supporting:
- ES6+ classes and features
- TypeScript (if using TypeScript)
- Modern DOM APIs
- Standard JavaScript object handling