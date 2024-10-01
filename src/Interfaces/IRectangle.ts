/**
 * Library IRectangle
 * Created 01.10.24
 *
 * @author Christoph Ehlers
 */
import IVector2D from "./IVector2D";

export default interface IRectangle extends IVector2D{
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
