# DOM Library Documentation

The DOM library (`domLib`) provides a comprehensive set of utilities for DOM manipulation, simplifying common tasks like creating, appending, removing, and finding elements. It extends the native HTML element prototype with useful methods and provides a set of utility functions.

## Installation and Import

```javascript
import { domLib } from "@cehlers88/ceutils";
```

## Extended HTMLElement Methods

The DOM library automatically extends the HTMLElement prototype with the following methods:

### appendChilds(children: HTMLElement[] | SVGSVGElement[] | Text[]): HTMLElement

Appends multiple child elements to the current element.

**Parameters:**
- `children` - Array of elements, SVG elements, or text nodes to append

**Example:**
```javascript
const nodes = [
    document.createElement("div"),
    document.createTextNode("Hello World"),
    document.createElement("span")
];
document.body.appendChilds(nodes);
```

### createChild(tagName: string, properties?: ICreateElementProperties): HTMLElement

Creates a new element and appends it as a child to the current element.

**Parameters:**
- `tagName` - The HTML tag name for the new element
- `properties` - Optional properties object (see createElement for details)

**Example:**
```javascript
// Creates a new div with ID and class, appends it to body
const newDiv = document.body.createChild("div", {
    id: "myDiv",
    class: "myClass",
    innerText: "Hello World"
});
```

### getParentByCondition(condition: (element: HTMLElement) => boolean): HTMLElement | undefined

Traverses up the DOM tree to find the first parent element that meets the specified condition.

**Parameters:**
- `condition` - A function that returns true when the desired parent is found

**Example:**
```javascript
// Find the first parent div element
const parentDiv = element.getParentByCondition(parent => 
    parent.tagName.toLowerCase() === "div"
);
```

### getParentWithClass(className: string): HTMLElement | undefined

Finds the first parent element that has the specified CSS class.

**Parameters:**
- `className` - The CSS class to search for

**Example:**
```javascript
// Find the first parent with class "container"
const container = element.getParentWithClass("container");
```

### removeAllChilds(): HTMLElement

Removes all child elements from the current element.

**Example:**
```javascript
// Clear all content from the body
document.body.removeAllChilds();
```

## Library Functions

All functions are available through the `domLib` object:

### domLib.appendChilds(parent: HTMLElement, children: HTMLElement[] | SVGSVGElement[] | Text[]): HTMLElement

Static version of the appendChilds method.

**Example:**
```javascript
domLib.appendChilds(document.body, [
    domLib.createElement("div"),
    domLib.createElement("span")
]);
```

### domLib.createElement(tagName: string, properties?: ICreateElementProperties): HTMLElement

Creates a new HTML element with the specified properties.

**Parameters:**
- `tagName` - The HTML tag name
- `properties` - Optional configuration object

**Supported Properties:**
- **Element Structure:**
  - `childNodes` - Array of child elements to append
  - `innerText` - Text content for the element
  
- **Data Attributes:**
  - `data` - Object with key-value pairs for data-* attributes
  
- **Event Handlers:**
  - `onBlur`, `onChange`, `onClick`, `onFocus`
  - `onKeyDown`, `onKeyUp`, `onSubmit`
  - `onMouseOver`, `onMouseOut`, `onMouseDown`, `onMouseUp`
  - `onMouseEnter`, `onMouseLeave`, `onMouseMove`
  - `onDragStart`, `onDragEnd`, `onDragOver`, `onDragEnter`, `onDragLeave`, `onDrop`
  - `onLoad`
  
- **Standard Attributes:**
  - Any standard HTML attribute (id, class, style, etc.)

**Examples:**

Basic element creation:
```javascript
const div = domLib.createElement("div", {
    id: "myDiv",
    class: "container",
    style: "color: red;"
});
```

Element with text content:
```javascript
const paragraph = domLib.createElement("p", {
    innerText: "This is a paragraph",
    class: "text-content"
});
```

Element with child nodes:
```javascript
const container = domLib.createElement("div", {
    class: "container",
    childNodes: [
        domLib.createElement("h1", { innerText: "Title" }),
        domLib.createElement("p", { innerText: "Content" })
    ]
});
```

Element with event handlers:
```javascript
const button = domLib.createElement("button", {
    innerText: "Click me!",
    class: "btn",
    onClick: (event) => {
        console.log("Button clicked!", event);
    },
    onMouseEnter: () => {
        console.log("Mouse entered button");
    }
});
```

Element with data attributes:
```javascript
const dataElement = domLib.createElement("div", {
    class: "data-container",
    data: {
        userId: "123",
        role: "admin",
        timestamp: "2024-01-01"
    }
});
// Creates: <div class="data-container" data-user-id="123" data-role="admin" data-timestamp="2024-01-01"></div>
```

Complex example:
```javascript
const complexElement = domLib.createElement("form", {
    id: "userForm",
    class: "form-container",
    onSubmit: (e) => {
        e.preventDefault();
        console.log("Form submitted");
    },
    childNodes: [
        domLib.createElement("input", {
            type: "text",
            name: "username",
            placeholder: "Enter username",
            onChange: (e) => console.log("Username changed:", e.target.value)
        }),
        domLib.createElement("button", {
            type: "submit",
            innerText: "Submit",
            class: "submit-btn"
        })
    ]
});
```

### domLib.getElement(elementNeedle: string): Element | HTMLElement | HTMLCollectionOf<Element> | NodeListOf<Element> | null

A flexible element selector that supports multiple query types.

**Parameters:**
- `elementNeedle` - The selector string

**Selector Types:**
- `"myId"` - Gets element by ID (equivalent to `document.getElementById`)
- `"#myId"` - Gets element by ID
- `".myClass"` - Gets elements by class name (equivalent to `document.getElementsByClassName`)
- `"?.mySelector"` - Uses querySelector
- `"?*.mySelector"` - Uses querySelectorAll

**Examples:**
```javascript
// Get by ID
const element1 = domLib.getElement("myDiv");
const element2 = domLib.getElement("#myDiv");

// Get by class
const elements = domLib.getElement(".myClass");

// Use querySelector
const firstMatch = domLib.getElement("?.container > .item");

// Use querySelectorAll
const allMatches = domLib.getElement("?*.item");
```

### domLib.getParentByCondition(element: HTMLElement, condition: (parent: HTMLElement) => boolean): HTMLElement | undefined

Static version of the getParentByCondition method.

**Example:**
```javascript
const parentForm = domLib.getParentByCondition(inputElement, parent => 
    parent.tagName.toLowerCase() === "form"
);
```

### domLib.getParentWithClass(element: HTMLElement, className: string): HTMLElement | undefined

Static version of the getParentWithClass method.

**Example:**
```javascript
const modalContainer = domLib.getParentWithClass(closeButton, "modal");
```

### domLib.removeAllChilds(element: HTMLElement): HTMLElement

Static version of the removeAllChilds method.

**Example:**
```javascript
domLib.removeAllChilds(containerElement);
```

## TypeScript Interfaces

### ICreateElementProperties

Defines the structure for element properties when creating elements.

```typescript
interface ICreateElementProperties {
    // Standard HTML attributes
    [key: string]: any;
    
    // Special properties
    childNodes?: (HTMLElement | SVGSVGElement | Text)[];
    innerText?: string;
    data?: { [name: string]: string };
    
    // Event handlers
    onBlur?: (event: Event) => void;
    onChange?: (event: Event) => void;
    onClick?: (event: Event) => void;
    onFocus?: (event: Event) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    onKeyUp?: (event: KeyboardEvent) => void;
    onSubmit?: (event: Event) => void;
    onLoad?: (event: Event) => void;
    onMouseOver?: (event: MouseEvent) => void;
    onMouseOut?: (event: MouseEvent) => void;
    onMouseDown?: (event: MouseEvent) => void;
    onMouseUp?: (event: MouseEvent) => void;
    onMouseEnter?: (event: MouseEvent) => void;
    onMouseLeave?: (event: MouseEvent) => void;
    onMouseMove?: (event: MouseEvent) => void;
    onDragStart?: (event: DragEvent) => void;
    onDragEnd?: (event: DragEvent) => void;
    onDragOver?: (event: DragEvent) => void;
    onDragEnter?: (event: DragEvent) => void;
    onDragLeave?: (event: DragEvent) => void;
    onDrop?: (event: DragEvent) => void;
}
```

## Usage Patterns

### Chaining Operations

```javascript
document.body
    .createChild("div", { class: "container" })
    .createChild("h1", { innerText: "Welcome" })
    .getParentWithClass("container")
    .createChild("p", { innerText: "Content paragraph" });
```

### Building Complex UI

```javascript
const buildUserCard = (user) => {
    return domLib.createElement("div", {
        class: "user-card",
        data: { userId: user.id },
        childNodes: [
            domLib.createElement("img", {
                src: user.avatar,
                alt: user.name,
                class: "avatar"
            }),
            domLib.createElement("div", {
                class: "user-info",
                childNodes: [
                    domLib.createElement("h3", { 
                        innerText: user.name,
                        class: "user-name"
                    }),
                    domLib.createElement("p", { 
                        innerText: user.email,
                        class: "user-email"
                    })
                ]
            }),
            domLib.createElement("button", {
                innerText: "Contact",
                class: "contact-btn",
                onClick: () => contactUser(user.id)
            })
        ]
    });
};
```

### Event Delegation

```javascript
// Create a list with event delegation
const todoList = domLib.createElement("ul", {
    class: "todo-list",
    onClick: (event) => {
        const target = event.target;
        if (target.classList.contains("delete-btn")) {
            const todoItem = target.getParentWithClass("todo-item");
            todoItem.remove();
        }
    }
});
```

## Best Practices

1. **Use createElement for dynamic content** - It's safer and more maintainable than innerHTML
2. **Leverage event delegation** - Attach events to parent containers when possible
3. **Use data attributes** - For storing metadata that needs to be accessible via CSS or JavaScript
4. **Chain operations** - Take advantage of method chaining for cleaner code
5. **Type safety** - Use TypeScript interfaces for better development experience

## Browser Compatibility

The DOM library works in all modern browsers that support:
- ES6+ JavaScript features
- Standard DOM APIs
- HTMLElement prototype extension

For older browser support, ensure appropriate polyfills are included in your project.