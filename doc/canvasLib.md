# Why canvasLib?
By using canvasLib, drawing objects on a canvas element is simplified. An interface is provided that allows drawing texts and geometric shapes. The interface is designed to be easy to use while offering a high level of flexibility. Here is an example of how to draw a rectangle with canvasLib compared to using basic canvas methods:
## Beispiel "Zeichne ein gelbes Rechteck mit schwarzem Rahmen ohne canvasLib":
```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "yellow";
ctx.strokeStyle = "black";
ctx.strokeRect(10, 10, 100, 100);
ctx.fillRect(10, 10, 100, 100);
```
## Beispiel "Zeichne ein gelbes Rechteck mit schwarzem Rahmen mit canvasLib":
```javascript
const canvas = document.getElementById("canvas");
canvasLib.getDrawEngine(canvas).rectangle({
    x: 10, 
    y: 10,
    width: 100,
    height: 100,
}, "black", "yellow");
```
# Initialize canvasLib
```javascript
import {canvasLib} from "@cehlers88/ceutils";

const canvas = document.getElementById("canvas");
const drawEngine = canvasLib.getDrawEngine(canvas);
```
# Interfaces
## IPosition
```typescript
interface IPosition {
    x: number,
    y: number,
    z?: number
}
```
## IRectangle
```typescript
interface IRectangle extends IVector2D {
    color?:string|number;
    height: number;
    highlightColor?:string|number;
    width: number;
    right?: number;
    top?:number;
    left?:number;
    bottom?:number;
    centerX?:number;
    centerY?:number;
    getAttribute(attributeName:string, defaultValue?:any):any;
    getAttributes():{[name:string]:any};
}
```
## IRectangleBase
```typescript
interface IRectangleBase extends IPosition {
    width: number,
    height: number
}
```
## IVector2D
```typescript
interface IVector2D extends IPosition {
    postionType?: EPositionType, // absolute / cameraRelative
    positionUnit?: EPositionUnit, // px / percennt_global / percent_local
    rotation?: number
}
```
# Reference
## Beging new path
`beginPath()`
```javascript
drawEngine.beginPath();
```

## Draw a rectangle
`rectangle(rect:IRectangleBase, strokeColor:string|Number, fillColor:string|Number, angle:number, pivot:IVector2D)`

| Argument    |       Type       | Description                                     |
|-------------|:----------------:|-------------------------------------------------|
| rect        |  IRectangleBase  | The rectangle to draw                           |
| strokeColor | string \| Number | The color of the outline                        |
| fillColor   | string \| Number | The color of the fill                           |
| angle       |      number      | Specify the rotation angle in degrees           |
| pivot       |    IVector2D     | Specify the x and y position of the pivot point |

```javascript
const rect = {
    x: 10,
    y: 10,
    width: 100,
    height: 100
};
const strokeColor = "black"; // black outline
const fillColor = "#FF0000"; // red fill
const angle = 45; // rotation angle in degrees
const pivot = { // center pivot (default)
    x: .5, 
    y: .5
};

// Draw a rectangle
drawEngine.rectangle(
    rect, 
    strokeColor, 
    fillColor, 
    angle, 
    pivot
);
```