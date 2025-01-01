/**
 * Interface IDrawEngine
 * Created 01.10.24
 *
 * @author Christoph Ehlers
 */

import {EPositionUnit} from "../enum/EPositionUnit";
import {IColor} from "./IColor";
import IRectangleBase from "./IRectangleBase";
import IVector2D from "./IVector2D";
import IVector3D from "./IVector3D";

export interface IDrawEngine {
    beginPath():IDrawEngine;
    circle(position:IVector2D, radius:number, strokeStyle?:number|string, fillStyle?:number|string): IDrawEngine;
    clipRect(rect:IRectangleBase|IRectangleBase[]): IDrawEngine;
    clipRoundRect(rect:IRectangleBase|IRectangleBase[], radius:number): IDrawEngine;
    closePath():IDrawEngine;
    cls():IDrawEngine;
    cube(planeRect: IRectangleBase, depth?: number, angles?: { x:number, y:number, z:number }, strokeStyle?:number|string, fillStyle?:number|string|number[]|string[]): IDrawEngine;
    cube3d(planeRect: IRectangleBase, depth?: number, angles?: IVector3D|IVector3D[]|number[]|number[][], strokeStyle?:number|string, fillStyle?:number|string|number[]|string[], pivot?:IVector3D): IDrawEngine;
    getContext():CanvasRenderingContext2D;
    gradientLines(start:IVector2D, destinations:IVector2D[], colors:Array<IColor|string|number>, width?:number):IDrawEngine;
    removeDrawCondition():IDrawEngine;
    restore():IDrawEngine;
    setContext(ctx:CanvasRenderingContext2D):IDrawEngine;
    setDrawCondition(condition:boolean):IDrawEngine;
    setFillStyle(fillStyle:number|string):IDrawEngine;
    setFilter(filter:string):IDrawEngine;
    setConditionalFilter(condition:boolean, filter:string):IDrawEngine;
    setFont(font:string):IDrawEngine;
    setGlobalCompositeOperation(newState:GlobalCompositeOperation):IDrawEngine;
    setStrokeStyle(strokeStyle:number|string):IDrawEngine;
    donut(position:IVector2D,outerRadius:number, innerRadius:number, strokeStyle?:number|string, fillStyle?:number|string):IDrawEngine;
    fill(fillRule?:CanvasFillRule|any):IDrawEngine;
    grid (gridSize:number, strokeStyle:string, area?:IRectangleBase|undefined, angle?:number): IDrawEngine;
    hexagon(position:IVector2D, radius:number, strokeStyle?:number|string, fillStyle?:number|string, angle?:number): IDrawEngine
    image(canvas:HTMLCanvasElement, sourceRect:IRectangleBase, destinationRect?:IRectangleBase, angle?:number, pivot?:IVector2D):IDrawEngine;
    lines(startPosition:IVector2D, destinations:IVector2D[], strokeStyle?:number|string, fillStyle?:number|string, lineWidth?:number, autoClose?:boolean): IDrawEngine;
    moveTo(position:IVector2D):IDrawEngine;
    ngon(position:IVector2D, radius:number, sides:number, strokeStyle?:number|string, fillStyle?:number|string, angle?:number):IDrawEngine;
    quadraticCurveTo(controlPoint:IVector2D, position:IVector2D):IDrawEngine;
    rectangle(rect:IRectangleBase|number[], strokeStyle?:number|string, fillStyle?:number|string, angle?:number, pivot?:IVector2D):IDrawEngine;
    resetClip():IDrawEngine;
    roundRectangle(
        rect:IRectangleBase,
        radius:number,
        strokeStyle?:number|string,
        fillStyle?:number|string
    ):IDrawEngine;
    save():IDrawEngine;
    selectRect(rect:IRectangleBase):IDrawEngine;
    selectRoundRect(rect:IRectangleBase, borderRadius:number):IDrawEngine;
    setUnit(unit:EPositionUnit):IDrawEngine;
    start(name:string):IDrawEngine;
    startAnalyse(callback: (reason:string, props:any)=>void): IDrawEngine;
    stroke():IDrawEngine;
    text(
        dim:IVector2D & {
            width?:number
            lineHeight?:number
        },
        text:string,
        color?:number|string,
        font?:string
    ):IDrawEngine;
}