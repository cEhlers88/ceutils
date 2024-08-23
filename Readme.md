# CEUTILS - 23.08.2024

## Installation
```bash
npm install @cehlers88/ceutils
```

## DOM-Utilities
After installation, the DOM-Library can be used via the following import:
```javascript
import {domLib} from "@cehlers88/ceutils";
```

### Element-Methods
By using the DOM-Library, a number of new element methods are automatically available:

#### appendChilds(nodes:Elements[]):Element
Adds a list of elements as child elements to the current element.
Example:
```javascript
const nodes = [
    document.createTextNode("Hello"),
    document.createTextNode("World")
];
document.body.appendChilds(nodes);
```

#### createChild(tagName:string, properties:{[key:string]:any}):Element
Creates a new element and adds it as a child element to the current element.
Example:
```javascript
// Creates a new div element with the ID "myDiv" and the CSS class "myClass" and adds it as a child element to the body
document.body.createChild("div", {id: "myDiv", class: "myClass"}); // (see Library-Functions/createElement for all possible properties)
```

#### getParentByCondition(condition:(element:Element)=>boolean):?Element
Returns the first parent element that meets the defined condition. If no parent element is found, "undefined" is returned.
Example:
```javascript
// Returns the first parent element that has the tag name "div"
const result = document.body.getParentByCondition(element => element.tagName.toUpperCase() === "DIV");
```

#### getParentWithClass(className:string):?Element
Returns the first parent element that has the specified CSS class. If no parent element is found, "undefined" is returned.
Example:
```javascript
// Returns the first parent element that has the CSS class "myClass"
const result = document.body.getParentWithClass("myClass");
```

#### removeAllChilds():Element
Removes all child elements of the current element.
Example:
```javascript
document.body.removeAllChilds();
```

### Library-Functions
All functions of the DOM-Library are accessible through the "domLib" object.

#### appendChilds(parent:Element, nodes:Elements[]):Element
Adds a list of elements as child elements to the specified parent element.
Example:
```javascript
domLib.appendChilds(document.body, [domLib.createElement("div"), domLib.createElement("div")]);
```

#### createElement(tagName:string, properties:{[key:string]:any}):Element
Creates a new element with the specified properties and returns it.
Example:
```javascript
// Creates a new div element with the ID "myDiv" and the CSS class "myClass"
const element = domLib.createElement("div", {id: "myDiv", class: "myClass"});
// It can now be appended to a parent element using appendChild:
document.body.appendChild(element);
```
Example 2:
```javascript
// Creates a new div element with the ID "myDiv", the CSS class "myClass", a child span with text and adds it as a child element to the body
document.body.appendChild(domLib.createElement("div", {
    id: "myDiv", 
    class: "myClass",
    childNodes: [
        domLib.createElement("span", {innerText: "Hello World"})
    ]
}));
// Add button with click event listener to the body
document.body.appendChild(domLib.createElement("button", {
    innerText: "Click me!",
    onClick: () => {
        console.log("Button clicked!");
    }
}));

// Or do it in one step:
document.body.appendChilds([ // ...s !
  domLib.createElement("div", {
    id: "myDiv",
    class: "myClass",
    childNodes: [
      domLib.createElement("span", {innerText: "Hello World"})
    ]
  }),
  domLib.createElement("button", {
    innerText: "Click me!",
    onClick: () => {
      console.log("Button clicked!");
    }
  })
]);

```
The following properties can be defined optionally:
- "childNodes": an array of elements to be added as child elements.
- "data": an object with data to be added as "data-*" attributes.
- "innerText": the text content of the element.
- "onBlur": an event listener for the "blur" event.
- "onChange": an event listener for the "change" event.
- "onClick": an event listener for the "click" event.
- "onFocus": an event listener for the "focus" event.
- "onKeyDown": an event listener for the "keydown" event.
- "onKeyUp": an event listener for the "keyup" event.
- "onSubmit": an event listener for the "submit" event.
- "onLoad": an event listener for the "load" event.
- "onMouseOver": an event listener for the "mouseover" event.
- "onMouseDown": an event listener for the "mousedown" event.
- "onMouseEnter": an event listener for the "mouseenter" event.
- "onMouseLeave": an event listener for the "mouseleave" event.
- "onMouseUp": an event listener for the "mouseup" event.
- "onMouseMove": an event listener for the "mousemove" event.
- "onMouseOut": an event listener for the "mouseout" event.
- as well as all common element attributes.

if there is a property that is not listed here, it can be added as an attribute to the element:
```javascript
const element = domLib.createElement("div", {id: "myDiv", class: "myClass"});
element.setAttribute("missing-attribute", "myValue");
// same as event listeners:
element.addEventListener("missing-event", () => {
    // do something cool
});
```

#### getElement(elementNeedle:string):any
Returns the element(s) that match(es) the specified selector.
Example:
```javascript
// Returns the element with the ID "myDiv"
const element_Example01 = domLib.getElement("myDiv"); // means: document.getElementById("myDiv")
const element_Example02 = domLib.getElement("#myDiv"); // means: document.getElementById("myDiv") too
const element_Example03 = domLib.getElement(".myDiv"); // means: document.getElementsByClassName("myDiv")
const element_Example04 = domLib.getElement("?.myDiv"); // means: document.querySelector(".myDiv")
const element_Example05 = domLib.getElement("?*.myDiv"); // means: document.querySelectorAll(".myDiv")

```

#### getParentWithClass(element:Element, className:string):?Element
Returns the first parent element that has the specified CSS class. If no parent element is found, "undefined" is returned.
Example:
```javascript
// Returns the first parent element that has the CSS class "myClass"
const result = domLib.getParentWithClass(document.body, "myClass");
```

#### removeAllChilds(element:Element):Element
Removes all child elements of the specified element.
Example:
```javascript
domLib.removeAllChilds(document.body);
```

## Components

### CachedDataProvider
The "CachedDataProvider" reduces the number of API calls by caching the data and retrieving it from the cache when needed. 
Each instance of a CachedDataProvider object has its own cache that can be manually cleared.

#### Usage 
```javascript
// Create a new instance of CachedDataProvider
import CachedDataProvider from "@cehlers88/ceutils/build/Provider/CachedDataProvider";
const dataProvider = new CachedDataProvider();

// Using the dataProvider to fetch data
dataProvider.fetch({
  url: "https://xyz.net",
  evalJson: true, // Optional
  method: "GET", // Optional
  data: { // Optional
  }
}).then(v=>{
    // handle response data
});

// Clear the cache
dataProvider.clearCache();
```

### ComponentStarter

#### Register service 
`service.js`
```javascript
import ComponentBaseService from "./ComponentBaseService";
export default class MyService extends ComponentBaseService {
...
    getName() {
        return "MyService";
    }
...
}
```
`app.js`
```typescript
import ComponentStarter from "./src/service/ComponentStarter";
import MyService from "./service"

const componentStarter = new ComponentStarter();
componentStarter.registerComponent(MyService);
```

#### Start React-Component
```typescript
import ComponentStarter from "./src/service/ComponentStarter";
const test = new ComponentStarter();
test.registerComponent()
```

```html
...
    <script >
    
    </script>
...
```

### Eventhandler

	- addListener
	- dispatch
	- setErrorHandler
	- on

### Interfaces
- ICachedDataProviderFetchOptions
  - url:string
  - evalJson:?boolean
  - method:?string
  - data:?{[key:string]:any}
  
- IDataEntry
  - key:string
  - value:any


	
