/**
 *  Library for drawing on canvas
 *  Created 01.10.24
 *
 *  @author Christoph Ehlers
 */
import {EPositionUnit} from "../enum/EPositionUnit";
import {IColor} from "../Interfaces/IColor";
import {IDrawEngine} from "../Interfaces/IDrawEngine";
import IRectangle from "../Interfaces/IRectangle";
import IRectangleBase from "../Interfaces/IRectangleBase";
import IVector2D from "../Interfaces/IVector2D";
import Vector2D from "../Vector2D";

enum eAnalyticCallbackReason {
    start_root_method = 'start_root_method',
    end_root_method = 'end_root_method',
    start_sub_method = 'start_sub_method',
    end_sub_method = 'end_sub_method',
}
enum eDrawEngineMode {
    analytic = 'analytic',
    simple = 'simple',
}
/**
 * A class that provides methods for drawing on a canvas.
 */
class DrawEngine implements IDrawEngine{
    private _analyticStore = {
        callback: (reason:string, props:any) => {
            // comment to ignore "no-empty" rule
        },
        currentRootMethod: '',
        startTimeRootMethod: 0,
        startTimeSubMethod: 0,
    };
    private _mode: eDrawEngineMode = eDrawEngineMode.simple;
    private _drawCondition:boolean = true; // allow drawing?
    private _unit:EPositionUnit = EPositionUnit.px;
    private ctx?:CanvasRenderingContext2D;
    /**
     * Begins a new path in the current drawing context.
     *
     * @return {IDrawEngine} The current draw engine instance.
     */
    public beginPath(): IDrawEngine {
        this._handleMethodStart('beginPath')
        if(!this._drawCondition){return this;}
        this.ctx!.beginPath();
        this._handleMethodEnd('beginPath', undefined);
        return this;
    }
    /**
     * Clips the canvas context to the given rectangle(s).
     *
     * @param rect - The rectangle(s) to clip the context to. Can be a single rectangle or an array of rectangles.
     *
     * @returns The instance of the DrawEngine with the canvas context clipped.
     */
    public clipRect(rect: IRectangleBase|IRectangleBase[]): DrawEngine {
        this._handleMethodStart('clipRect', {rect,_propsOrder:['rect']});
        if(!this._drawCondition){return this;}
        this.ctx!.save();
        this.ctx!.beginPath();
        if(Array.isArray(rect)){
            rect.map(r=>{
                this.selectRect(r);
            });
        }else{
            this.selectRect(rect);
        }
        this.ctx!.clip();
        this._handleMethodEnd('clipRect', undefined);
        return this;
    }
    /**
     * Clips a rounded rectangle on the canvas.
     *
     * @param {IRectangleBase|IRectangleBase[]} rect - The rectangle(s) to clip. Can be a single rectangle or an array of rectangles.
     * @param {number} radius - The radius of the rounded corners.
     *
     * @returns {DrawEngine} - The DrawEngine object for method chaining.
     */
    public clipRoundRect(rect: IRectangleBase|IRectangleBase[], radius:number): DrawEngine {
        this._handleMethodStart('clipRoundRect', {rect, radius, _propsOrder:['rect', 'radius']});
        if(!this._drawCondition){return this;}
        this.ctx!.save();
        this.ctx!.beginPath();
        if(Array.isArray(rect)){
            rect.map(r=>{
                this.selectRoundRect(r, radius);
            });
        }else{
            this.selectRoundRect(rect, radius);
        }
        this.ctx!.clip();
        this._handleMethodEnd('clipRoundRect', undefined);

        return this;
    }
    /**
     * Closes the current path in the draw engine.
     *
     * @return {IDrawEngine} - The draw engine instance.
     */
    public closePath(): IDrawEngine {
        this._handleMethodStart('closePath');
        if(!this._drawCondition){return this;}
        this.ctx!.closePath();
        this._handleMethodEnd('closePath', undefined);
        return this;
    }
    /**
     * Clears the canvas if the draw condition is true.
     *
     * @return {DrawEngine} - The current instance of the DrawEngine.
     */
    public cls():DrawEngine{
        this._handleMethodStart('cls');
        if(!this._drawCondition){return this;}
        this.ctx!.clearRect(0,0,this.ctx!.canvas.width,this.ctx!.canvas.height);
        this._handleMethodEnd('cls', undefined);
        return this;
    }
    /**
     * Fills the current drawing path on the canvas using the specified fill rule.
     *
     * @param {CanvasFillRule|undefined} fillRule - The fill rule to be applied. Can be either "nonzero" or "evenodd". If not specified, the default fill rule is used.
     * @returns {DrawEngine} - The DrawEngine instance for method chaining.
     */
    public fill(fillRule:CanvasFillRule|undefined): DrawEngine {
        this._handleMethodStart('fill', {fillRule, _propsOrder:['fillRule']});
        if(!this._drawCondition){return this;}
        this.ctx!.fill(fillRule);
        this._handleMethodEnd('fill', undefined);
        return this;
    }
    /**
     * Retrieves the canvas rendering context for drawing on the canvas.
     *
     * @returns {CanvasRenderingContext2D} The rendering context for drawing on the canvas.
     */
    public getContext(): CanvasRenderingContext2D {
        return this.ctx!;
    }
    /**
     * Resets the clipping region of the DrawEngine.
     *
     * @return {DrawEngine} - The DrawEngine instance.
     */
    public resetClip(): DrawEngine {
        this._handleMethodStart('resetClip');
        if(!this._drawCondition){return this;}
        this.ctx!.restore();
        this._handleMethodEnd('resetClip', undefined);
        return this;
    }
    /**
     * Removes the draw condition for the DrawEngine.
     *
     * @return {DrawEngine} The modified DrawEngine object.
     */
    public removeDrawCondition(): DrawEngine {
        this._handleMethodStart('removeDrawCondition');
        this._drawCondition = true;
        this._handleMethodEnd('removeDrawCondition', undefined);
        return this;
    }
    /**
     * Selects a rectangle on the canvas.
     *
     * @param {IRectangleBase} rect - The rectangle object containing the coordinates and dimensions of the rectangle to be selected.
     * @returns {DrawEngine} - The current instance of the DrawEngine.
     */
    public selectRect(rect: IRectangleBase): DrawEngine {
        this._handleMethodStart('selectRect', {rect, _propsOrder:['rect']});
        this._selectRect(this._convertToAbsolutePixels(rect));
        this._handleMethodEnd('selectRect', undefined);
        return this;
    }
    /**
     * Draws a rounded rectangle on the canvas.
     *
     * @param {IRectangleBase} rect - The rectangle object containing the position and dimensions of the rounded rectangle.
     * @param {number} borderRadius - The radius of the border corners of the rounded rectangle.
     * @returns {DrawEngine} - The DrawEngine instance for method chaining.
     */
    public selectRoundRect(rect: IRectangleBase, borderRadius:number): DrawEngine {
        this._handleMethodStart('selectRoundRect', {rect, borderRadius, _propsOrder:['rect', 'borderRadius']});
        if(!this._drawCondition){return this;}
        const _radius = {tl: borderRadius, tr: borderRadius, br: borderRadius, bl: borderRadius};

        this.ctx!.moveTo(rect.x + _radius.tl, rect.y);
        this.ctx!.lineTo(rect.x + rect.width - _radius.tr, rect.y);
        this.ctx!.quadraticCurveTo(rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + _radius.tr);
        this.ctx!.lineTo(rect.x + rect.width, rect.y + rect.height - _radius.br);
        this.ctx!.quadraticCurveTo(rect.x + rect.width, rect.y + rect.height, rect.x + rect.width - _radius.br, rect.y + rect.height);
        this.ctx!.lineTo(rect.x + _radius.bl, rect.y + rect.height);
        this.ctx!.quadraticCurveTo(rect.x, rect.y + rect.height, rect.x, rect.y + rect.height - _radius.bl);
        this.ctx!.lineTo(rect.x, rect.y + _radius.tl);
        this.ctx!.quadraticCurveTo(rect.x, rect.y, rect.x + _radius.tl, rect.y);
        this._handleMethodEnd('selectRoundRect', undefined);

        return this;
    }
    /**
     * Sets the context for drawing on a canvas.
     *
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @return {DrawEngine} - The DrawEngine instance with the updated context.
     */
    public setContext(ctx:CanvasRenderingContext2D):DrawEngine {
        this._handleMethodStart('setContext', {ctx, _propsOrder:['ctx']});
        this.ctx = ctx;
        this._handleMethodEnd('setContext', undefined);
        return this;
    }
    /**
     * Sets the filter property of the canvas context.
     *
     * @param {string} filter - The filter to be applied to the canvas context.
     * @returns {IDrawEngine} - The modified IDrawEngine object.
     */
    public setFilter(filter: string): IDrawEngine {
        this._handleMethodStart('setFilter', {filter, _propsOrder:['filter']});
        if(!this._drawCondition){return this;}
        this.ctx!.filter = filter;
        this._handleMethodEnd('setFilter', undefined);
        return this;
    }
    public setFillStyle(fillStyle: string): IDrawEngine {
        this._handleMethodStart('setFillStyle', {fillStyle, _propsOrder:['fillStyle']},{mainFillStyle:fillStyle});
        if(!this._drawCondition){return this;}
        this.ctx!.fillStyle = fillStyle;
        this._handleMethodEnd('setFillStyle', undefined);
        return this;
    }
    /**
     * Sets a conditional filter based on the given condition.
     * If the condition is true, the specified filter will be set.
     *
     * @param {boolean} condition - The condition to evaluate.
     * @param {string} filter - The filter to set.
     * @return {IDrawEngine} - The updated draw engine object.
     */
    public setConditionalFilter(condition: boolean, filter: string): IDrawEngine {
        this._handleMethodStart('setConditionalFilter', {condition, filter, _propsOrder:['condition', 'filter']});
        if(condition){
            this.setFilter(filter);
        }
        this._handleMethodEnd('setConditionalFilter', undefined);
        return this;
    }
    /**
     * Sets the draw condition for the draw engine.
     *
     * @param {boolean} condition - The condition to be set for drawing.
     * @return {IDrawEngine} - The draw engine instance.
     */
    public setDrawCondition(condition: boolean): IDrawEngine {
        this._handleMethodStart('setDrawCondition', {condition,_propsOrder:['condition']});
        this._drawCondition = condition;
        this._handleMethodEnd('setDrawCondition', undefined);
        return this;
    }
    /**
     * Sets the font for the DrawEngine context.
     *
     * @param {string} font - The font to set. Must be a valid CSS font value.
     *
     * @return {DrawEngine} - The DrawEngine instance with the updated font.
     */
    public setFont(font:string):DrawEngine {
        this._handleMethodStart('setFont', {font, _propsOrder:['font']});
        this.ctx!.font = font;
        this._handleMethodEnd('setFont', undefined);
        return this;
    }
    /**
     * Sets the global composite operation state of the DrawEngine.
     *
     * @param {GlobalCompositeOperation} newState - The new state to set for the global composite operation.
     * @return {DrawEngine} - The updated DrawEngine instance.
     */
    public setGlobalCompositeOperation(newState: GlobalCompositeOperation): DrawEngine {
        this._handleMethodStart('setGlobalCompositeOperation', {newState, _propsOrder:['newState']});
        this.ctx!.globalCompositeOperation = newState;
        this._handleMethodEnd('setGlobalCompositeOperation', undefined);
        return this;
    }
    public setStrokeStyle(strokeStyle: string): IDrawEngine {
        this._handleMethodStart('setStrokeStyle', {strokeStyle, _propsOrder:['strokeStyle']},{mainStrokeStyle:strokeStyle});
        if(!this._drawCondition){return this;}
        this.ctx!.strokeStyle = strokeStyle;
        this._handleMethodEnd('setStrokeStyle', undefined);
        return this;
    }
    public setUnit(unit: EPositionUnit): DrawEngine {
        this._handleMethodStart('setUnit', {unit, _propsOrder:['unit']});
        this._unit = unit;
        this._handleMethodEnd('setUnit', undefined);
        return this;
    }
    public startAnalyse(callback: (reason:string, props:any)=>void): DrawEngine {
        this._mode = eDrawEngineMode.analytic;
        this._analyticStore.callback = callback;
        return this;
    }
    /**
     * Draws a circle on the canvas.
     *
     * @param {IVector2D} position - The position of the center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {number|string} [strokeStyle=-1] - The stroke style of the circle.
     * @param {number|string} [fillStyle=-1] - The fill style of the circle.
     * @returns {DrawEngine} - The DrawEngine instance.
     */
    public circle(position:IVector2D, radius:number, strokeStyle:number|string=-1, fillStyle:number|string=-1): DrawEngine{
        this._handleMethodStart('circle', {position, radius, strokeStyle, fillStyle, _propsOrder:['position', 'radius', 'strokeStyle', 'fillStyle']});
        if(!this._drawCondition){return this;}
        this.ctx!.beginPath();
        this.ctx!.arc(position.x, position.y, radius, 0, Math.PI * 2);
        this.ctx!.closePath();
        if(fillStyle.toString()!=='-1'){
            const resetFillStyle = this.ctx!.fillStyle;
            this.ctx!.fillStyle = fillStyle.toString();
            this.ctx!.fill();
            this.ctx!.fillStyle = resetFillStyle;
        }
        if(strokeStyle.toString()!=='-1'){
            const resetStrokeStyle = this.ctx!.strokeStyle;
            this.ctx!.strokeStyle = strokeStyle.toString();
            this.ctx!.stroke();
            this.ctx!.strokeStyle = resetStrokeStyle;
        }
        this._handleMethodEnd('circle', undefined);
        return this;
    }
    /**
     * Draws a donut shape on the canvas.
     *
     * @param position - The position of the center of the donut.
     * @param outerRadius - The radius of the outer circle of the donut.
     * @param innerRadius - The radius of the inner circle of the donut.
     * @param strokeStyle - The color or style of the donut's stroke. Default is -1.
     * @param fillStyle - The color or style of the donut's fill. Default is -1.
     * @returns The DrawEngine instance for method chaining.
     */
    public donut(position:IVector2D,outerRadius:number, innerRadius:number, strokeStyle:number|string=-1, fillStyle:number|string=-1):DrawEngine {
        this._handleMethodStart('donut', {position, outerRadius, innerRadius, strokeStyle, fillStyle, _propsOrder:['position', 'outerRadius', 'innerRadius', 'strokeStyle', 'fillStyle']});
        if(!this._drawCondition){return this;}
        this.ctx!.beginPath();
        this.ctx!.arc(position.x, position.y, outerRadius, 0, 2 * Math.PI);
        this.ctx!.arc(position.x, position.y, innerRadius, 0, 2 * Math.PI, true);
        if(fillStyle!==-1){
            const resetFillStyle = this.ctx!.fillStyle;
            this.ctx!.fillStyle = fillStyle.toString();
            this.ctx!.fill();
            this.ctx!.fillStyle = resetFillStyle;
        }
        if(strokeStyle!==-1){
            const resetStrokeStyle = this.ctx!.strokeStyle;
            this.ctx!.strokeStyle = strokeStyle.toString();
            this.ctx!.stroke();
            this.ctx!.strokeStyle = resetStrokeStyle;
        }
        this._handleMethodEnd('donut', undefined);
        return this;
    }
    /**
     * Draws gradient lines on the canvas.
     *
     * @param {IVector2D} start - The starting point of the lines.
     * @param {IVector2D[]} destinations - An array of points that represent the destinations of the lines.
     * @param {(IColor | string | number)[]} colors - An array of colors to create the gradient with.
     * @param {number} [width=1] - The width of the lines to be drawn.
     * @returns {DrawEngine} The DrawEngine instance for method chaining.
     */
    public gradientLines(start: IVector2D, destinations: IVector2D[], colors: Array<IColor | string | number>, width: number = 1): DrawEngine {
        this._handleMethodStart('gradientLines', {start, destinations, colors, width, _propsOrder:['start', 'destinations', 'colors', 'width']});
        const ctx = this.ctx!;
        // Gesamtlänge des Pfades berechnen
        let totalLength = 0;
        let currentPoint = start;
        for (const destination of destinations) {
            totalLength += new Vector2D(start.x,start.y).doWithVector(new Vector2D(destination.x,destination.y)).calculateDistance();
            currentPoint = destination;
        }

        // Farbverlauf über den gesamten Pfad erstellen
        const gradient = ctx.createLinearGradient(start.x, start.y, currentPoint.x, currentPoint.y);
        for (let i = 0; i < colors.length; i++) {
            const stop = i / (colors.length - 1);
            gradient.addColorStop(stop, colors[i].toString());
        }

        const resetStrokeStyle = ctx.strokeStyle;
        // Den Farbverlauf als Strichstil verwenden und Linien zeichnen
        ctx.strokeStyle = gradient;
        ctx.lineWidth = width;
        currentPoint = start;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        for (const destination of destinations) {
            ctx.lineTo(destination.x, destination.y);
            currentPoint = destination;
        }
        ctx.stroke();
        ctx.strokeStyle = resetStrokeStyle;
        this._handleMethodEnd('gradientLines', undefined);
        return this;
    }
    /**
     * Draws a grid on the canvas.
     *
     * @param {number} gridSize - The size of each grid cell.
     * @param {string} strokeStyle - The style of the grid lines.
     * @param {IRectangle} [area=undefined] - The area in which to draw the grid.
     * @param {number} [angle=0] - The rotation angle of the grid lines in degrees.
     * @returns {DrawEngine} - The DrawEngine instance.
     */
    // tslint:disable-next-line:no-unnecessary-initializer
    public grid (gridSize:number, strokeStyle:string, area:IRectangle|undefined=undefined, angle:number=0): DrawEngine{
        this._handleMethodStart('grid', {gridSize, strokeStyle, area, angle, _propsOrder:['gridSize', 'strokeStyle', 'area', 'angle']});
        if(!this._drawCondition){return this;}
        const startX = (area===undefined?0:area.x);
        const startY = (area===undefined?0:area.y);
        const stopX = (area===undefined ? this.ctx!.canvas.width : area.x+area.width);
        const stopY = (area===undefined ? this.ctx!.canvas.height : area.y+area.height);

        const width = stopX - startX;
        const height = stopY - startY;

        const maxExtentX = width * Math.abs(Math.cos(angle* (Math.PI / 180))) + height * Math.abs(Math.sin(angle* (Math.PI / 180)));
        const newGridSizeX = maxExtentX / Math.ceil(maxExtentX / gridSize);
        const maxExtentY = width * Math.abs(Math.sin(angle* (Math.PI / 180))) + height * Math.abs(Math.cos(angle* (Math.PI / 180)));
        const newGridSizeY = maxExtentY / Math.ceil(maxExtentY / gridSize);

        this.ctx!.save();
        this.ctx!.beginPath();
        this.ctx!.rect(startX, startY, stopX - startX, stopY - startY);
        this.ctx!.clip();

        this.ctx!.translate((startX + stopX) / 2, (startY + stopY) / 2);
        this.ctx!.rotate(angle * Math.PI / 180);
        this.ctx!.translate(-((startX + stopX) / 2), -((startY + stopY) / 2));
        this.ctx!.beginPath();

        for (let i = -height; i <= Math.round(height / newGridSizeY)+height; i++) {
            this.ctx!.moveTo(startX-width, startY + (i * newGridSizeY));
            this.ctx!.lineTo(stopX+width, startY + (i * newGridSizeY));
        }

        for (let i = -width; i <= Math.round(width / newGridSizeX)+width; i++) {
            this.ctx!.moveTo(startX + (i * newGridSizeX), startY-height);
            this.ctx!.lineTo(startX + (i * newGridSizeX), stopY+height);
        }

        this.ctx!.strokeStyle = strokeStyle;
        this.ctx!.stroke();
        this.ctx!.restore();
        this._handleMethodEnd('grid', undefined);

        return this;
    }
    /**
     * Draws a hexagon on the canvas.
     *
     * @param {IVector2D} position - The center position of the hexagon.
     * @param {number} radius - The radius of the hexagon.
     * @param {number|string} [strokeStyle=-1] - The stroke style of the hexagon. Provide a number for stroke color or a string for CSS color values. Default is -1 which means no stroke.
     * @param {number|string} [fillStyle=-1] - The fill style of the hexagon. Provide a number for fill color or a string for CSS color values. Default is -1 which means no fill.
     * @param {number} [angle=0] - The rotation angle of the hexagon in degrees. Default is 0.
     *
     * @returns {DrawEngine} The DrawEngine instance.
     */
    public hexagon(position:IVector2D, radius:number, strokeStyle:number|string=-1, fillStyle:number|string=-1, angle:number=0): DrawEngine {
        this._handleMethodStart('hexagon', {position, radius, strokeStyle, fillStyle, angle, _propsOrder:['position', 'radius', 'strokeStyle', 'fillStyle', 'angle']});
        if(!this._drawCondition){return this;}
        this.ctx!.save(); // save the current state before rotation
        this.ctx!.translate(position.x, position.y); // translate the context to the center of the hexagon
        this.ctx!.rotate(angle * Math.PI / 180); // rotate the context by the given angle
        this.ctx!.translate(-position.x, -position.y); // translate back
        this.ctx!.beginPath();
        for (let i = 0; i <= 6; i++) {
            const rotAngle = (2 * Math.PI / 6) * i;
            const x = position.x + radius * Math.cos(rotAngle);
            const y = position.y + radius * Math.sin(rotAngle);
            if (i === 0) {
                this.ctx!.moveTo(x, y);
            } else {
                this.ctx!.lineTo(x, y);
            }
        }
        this.ctx!.closePath();
        if(strokeStyle!==-1){
            const resetStrokeStyle = this.ctx!.strokeStyle;
            this.ctx!.strokeStyle = strokeStyle.toString();
            this.ctx!.stroke();
            this.ctx!.strokeStyle = resetStrokeStyle;
        }
        if(fillStyle!==-1){
            const resetFillStyle = this.ctx!.fillStyle;
            this.ctx!.fillStyle = fillStyle.toString();
            this.ctx!.fill();
            this.ctx!.fillStyle = resetFillStyle;
        }
        this.ctx!.restore();
        this._handleMethodEnd('hexagon', undefined);
        return this;
    }
    /**
     * Draws lines on the canvas.
     *
     * @param {IVector2D} startPosition - The starting position (x, y) of the line.
     * @param {IVector2D[]} destinations - An array of destination points (x, y) for the line.
     * @param {number|string} [strokeStyle=-1] - The stroke style to be used for the line.
     *                                           If set to -1, no stroke will be applied.
     * @param {number|string} [fillStyle=-1] - The fill style to be used for the line.
     *                                         If set to -1, no fill will be applied.
     * @param {number} [lineWidth=0.5] - The line width.
     *
     * @returns {DrawEngine} Returns the DrawEngine instance for method chaining.
     */
    public lines(startPosition:IVector2D, destinations:IVector2D[], strokeStyle:number|string=-1, fillStyle:number|string=-1, lineWidth:number=.5): DrawEngine {
        this._handleMethodStart('lines', {startPosition, destinations, strokeStyle, fillStyle, lineWidth, _propsOrder:['startPosition', 'destinations', 'strokeStyle', 'fillStyle', 'lineWidth']});
        if(!this._drawCondition){return this;}
        this.ctx!.beginPath();
        this.ctx!.lineWidth = lineWidth;
        this.ctx!.moveTo(startPosition.x,startPosition.y);
        destinations.map(point=>{
            this.ctx!.lineTo(point.x, point.y);
        });

        if(strokeStyle!==-1){
            const resetStrokeStyle = this.ctx!.strokeStyle;
            this.ctx!.strokeStyle = strokeStyle.toString();
            this.ctx!.stroke();
            this.ctx!.strokeStyle = resetStrokeStyle;
        }
        if(fillStyle!==-1){
            const resetFillStyle = this.ctx!.fillStyle;
            this.ctx!.fillStyle = fillStyle.toString();
            this.ctx!.closePath();
            this.ctx!.fill();
            this.ctx!.fillStyle = resetFillStyle;
        }
        this._handleMethodEnd('lines', undefined);
        return this;
    }
    /**
     * Moves the current drawing position to a new position.
     *
     * @param position - The new position to move to.
     * @returns {DrawEngine} - The modified DrawEngine instance.
     */
    public moveTo(position:IVector2D): DrawEngine {
        this._handleMethodStart('moveTo', {position, _propsOrder:['position']});
        if(!this._drawCondition){return this;}
        this.ctx!.moveTo(position.x,position.y);
        this._handleMethodEnd('moveTo', undefined);
        return this;
    }
    /**
     * Draws a quadratic curve from the current point to the given position, using the given control point.
     *
     * @param {IVector2D} controlPoint - The control point of the curve.
     * @param {IVector2D} position - The end position of the curve.
     *
     * @returns {DrawEngine} - The updated DrawEngine object.
     */
    public quadraticCurveTo(controlPoint:IVector2D, position:IVector2D): DrawEngine {
        this._handleMethodStart('quadraticCurveTo', {controlPoint, position, _propsOrder:['controlPoint', 'position']});
        if(!this._drawCondition){return this;}
        this.ctx!.quadraticCurveTo(controlPoint.x, controlPoint.y, position.x, position.y);
        this._handleMethodEnd('quadraticCurveTo', undefined);
        return this;
    }
    /**
     * Draws a rectangle on the canvas.
     *
     * @param {IRectangleBase} rect - The rectangle to be drawn.
     * @param {number | string} [strokeStyle=-1] - The stroke color of the rectangle. If -1, no stroke color will be applied.
     * @param {number | string} [fillStyle=-1] - The fill color of the rectangle. If -1, no fill color will be applied.
     * @param {number} [angle=0] - The angle (in degrees) by which the rectangle will be rotated.
     * @param {IVector2D} [pivot={x:.5, y:.5}] - The pivot point for the rotation of the rectangle.
     *
     * @returns {DrawEngine} - The DrawEngine object for method chaining.
     */
    public rectangle(rect:IRectangleBase, strokeStyle:number|string='-1', fillStyle:number|string='-1', angle:number=0, pivot:IVector2D={x:.5,y:.5}):DrawEngine {
        this._handleMethodStart('rectangle', {rect, strokeStyle, fillStyle, angle, pivot, _propsOrder:['rect', 'strokeStyle', 'fillStyle', 'angle', 'pivot']});
        if(!this._drawCondition){return this;}

        rect = this._convertToAbsolutePixels(rect);

        if(angle!==0){
            this.ctx!.save();
            this.ctx!.translate((rect.x+(rect.width*pivot.x)), rect.y+(rect.height*pivot.y));
            this.ctx!.rotate(angle * Math.PI / 180);
            this.ctx!.translate(-rect.x-(rect.width*pivot.x), -rect.y-(rect.height*pivot.y));
        }

        (this.beginPath() as any)
            ._selectRect(rect)
            .closePath()
        ;

        if (fillStyle.toString() !== '-1') {
            const resetFillStyle:any = this.ctx!.fillStyle;
            this
                .setFillStyle(fillStyle.toString())
                .fill()
                .setFillStyle(resetFillStyle)
            ;
        }
        if (strokeStyle.toString() !== '-1') {
            const resetStrokeStyle:any = this.ctx!.strokeStyle;
            this
                .setStrokeStyle(strokeStyle.toString())
                .stroke()
                .setStrokeStyle(resetStrokeStyle)
            ;
        }

        if(angle!==0){
            this.ctx!.restore();
        }

        this._handleMethodEnd('rectangle', undefined);
        return this;
    }
    /**
     * Draws a rounded rectangle on the canvas.
     *
     * @param {IRectangle} rect - The rectangle object defining the position and dimensions of the rounded rectangle.
     * @param {number} radius - The radius of the rounded corners.
     * @param {number | string} [strokeStyle=-1] - The stroke style used to outline the rounded rectangle. Defaults to -1.
     * @param {number | string} [fillStyle=-1] - The fill style used to color the inside of the rounded rectangle. Defaults to -1.
     * @returns {DrawEngine} Returns the DrawEngine instance for chaining.
     */
    public roundRectangle(rect: IRectangle, radius: number, strokeStyle: number | string=-1, fillStyle: number | string=-1): DrawEngine {
        this._handleMethodStart('roundRectangle', {rect, radius, strokeStyle, fillStyle, _propsOrder:['rect', 'radius', 'strokeStyle', 'fillStyle']});
        if(!this._drawCondition){return this;}
        if (typeof radius === 'undefined') {
            radius = 5;
        }

        this.ctx!.beginPath();
        this.selectRoundRect(rect, radius);
        this.ctx!.closePath();

        if (fillStyle!==-1) {
            const fillStyleReset = this.ctx!.fillStyle;
            this.ctx!.fillStyle = fillStyle.toString();
            this.ctx!.fill();
            this.ctx!.fillStyle = fillStyleReset;
        }

        if (strokeStyle!==-1) {
            const strokeStyleReset = this.ctx!.strokeStyle;
            this.ctx!.strokeStyle = strokeStyle.toString();
            this.ctx!.stroke();
            this.ctx!.strokeStyle = strokeStyleReset;
        }
        this._handleMethodEnd('roundRectangle', undefined);
        return this;
    }
    public stroke(): DrawEngine {
        this._handleMethodStart('stroke');
        if(!this._drawCondition){return this;}
        this.ctx!.stroke();
        this._handleMethodEnd('stroke', undefined);
        return this;
    }
    /**
     * Draws an image onto the canvas.
     *
     * @param {HTMLCanvasElement} image - The image to be drawn.
     * @param {IRectangleBase} sourceRect - The rectangular region of the image to be drawn.
     * @param {IRectangleBase|undefined} [destinationRect=undefined] - The rectangular region where the image will be drawn on the canvas. If not provided, the entire image will be drawn.
     * @param {number} [angle=0] - The rotation angle in degrees.
     * @param {IVector2D} [pivot={x:.5,y:.5}] - The pivot point for rotation.
     * @returns {DrawEngine} - The DrawEngine instance for chaining.
     */
    // tslint:disable-next-line:no-unnecessary-initializer
    public image(image:HTMLCanvasElement, sourceRect:IRectangleBase,destinationRect:IRectangleBase|undefined=undefined, angle:number=0, pivot:IVector2D={x:.5,y:.5}):DrawEngine {
        this._handleMethodStart('image', {image, sourceRect, destinationRect, angle, pivot, _propsOrder:['image', 'sourceRect', 'destinationRect', 'angle', 'pivot']});
        if(!this._drawCondition){return this;}
        if(destinationRect===undefined){destinationRect=sourceRect;}
        this.ctx!.save();
        this.ctx!.translate(destinationRect.x+(destinationRect.width*pivot.x), destinationRect.y+(destinationRect.height*pivot.y));
        this.ctx!.rotate(angle * Math.PI / 180);
        this.ctx!.translate(-destinationRect.x-(destinationRect.width*pivot.x), -destinationRect.y-(destinationRect.height*pivot.y));

        this.ctx!.drawImage(
            image,
            sourceRect.x,sourceRect.y,sourceRect.width,sourceRect.height,
            destinationRect.x,destinationRect.y,destinationRect.width,destinationRect.height
        );

        this.ctx!.restore();
        this._handleMethodEnd('image', undefined);
        return this;
    }
    /**
     * Draws text on the canvas using the provided dimensions, text, color, and font.
     *
     * @param dim - The dimensions for positioning the text on the canvas.
     *              - center (optional): Set to true to center the text horizontally and vertically within the dimensions.
     *              - lineHeight (optional): The line height for the text. If not provided, it will be determined based on the font size.
     *              - width (optional): The width of the text box. If provided, the text will be wrapped within the specified width.
     * @param text - The text to be drawn on the canvas.
     * @param color - The color of the text. It can be either a number or a string representing the color.
     *               If set to -1, the default color will be used.
     * @param font - The font style of the text. If not provided, the default font will be used.
     *
     * @returns The DrawEngine instance for method chaining.
     */
    public text(dim:IVector2D&{
        center?:boolean,
        lineHeight?:number,
        width?:number
    },text:string, color:number|string=-1, font:string=''):DrawEngine {
        this._handleMethodStart('text', {dim, text, color, font, _propsOrder:['dim', 'text', 'color', 'font']});
        if(!this._drawCondition){return this;}
        const resetFillStyle = this.ctx!.fillStyle;
        if(color!==-1){
            this.ctx!.fillStyle = color.toString();
        }
        if(font!==''){
            this.ctx!.font = font;
        }
        if (!dim.lineHeight) {
            dim.lineHeight = this.ctx!.measureText('M').actualBoundingBoxAscent;
        }
        if(dim.width){
            this._drawWrappedText((dim as any),text);
        }else{
            this.ctx!.fillText(text, dim.x, dim.y);
        }
        this.ctx!.fillStyle = resetFillStyle;
        this._handleMethodEnd('text', undefined);
        return this;
    }

    private _convertToAbsolutePixels(objectToCalculate:any):any {
        if(objectToCalculate.hasOwnProperty('x')){
            objectToCalculate.x = objectToCalculate.x * this._positionUnitMultiplicator().x;
        }
        if(objectToCalculate.hasOwnProperty('y')){
            objectToCalculate.y = objectToCalculate.y * this._positionUnitMultiplicator().y;
        }
        if(objectToCalculate.hasOwnProperty('width')){
            objectToCalculate.width = objectToCalculate.width * this._positionUnitMultiplicator().x;
        }
        if(objectToCalculate.hasOwnProperty('height')){
            objectToCalculate.height = objectToCalculate.height * this._positionUnitMultiplicator().y;
        }
        return objectToCalculate;
    }
    private _positionUnitMultiplicator():IVector2D {
        if(this._unit === EPositionUnit.px){
            return {x:1, y:1};
        }
        return {x:this.ctx!.canvas.width/100, y:this.ctx!.canvas.height/100};
    }
    private _handleMethodStart(methodName:string, props:any= {}, overrideProps:any= {}){
        if(this._mode === eDrawEngineMode.simple){
            return;
        }
        try {
            if(this._analyticStore.currentRootMethod === ''){
                this._analyticStore.currentRootMethod = methodName;
                this._analyticStore.startTimeRootMethod = performance.now();
                this._analyticStore.callback(eAnalyticCallbackReason.start_root_method, {methodName, props, mainFillStyle: (this.ctx ? this.ctx.fillStyle : ''), mainStrokeStyle: (this.ctx ? this.ctx.strokeStyle : ''), ...overrideProps});
            }else{
                this._analyticStore.startTimeSubMethod = performance.now();
                this._analyticStore.callback(eAnalyticCallbackReason.start_sub_method, {methodName, props, mainFillStyle:(this.ctx ? this.ctx.fillStyle : ''), mainStrokeStyle: (this.ctx ? this.ctx.strokeStyle : ''), ...overrideProps});
            }
        }catch (e) {
            // console.error(e);
        }
    }
    private _handleMethodEnd(methodName:string, props:any){
        if(this._mode === eDrawEngineMode.simple){
            return;
        }
        try{
            if(methodName === this._analyticStore.currentRootMethod){
                this._analyticStore.currentRootMethod = '';
                this._analyticStore.callback(eAnalyticCallbackReason.end_root_method, {methodName, duration: performance.now()-this._analyticStore.startTimeRootMethod, props});
            }else{
                this._analyticStore.callback(eAnalyticCallbackReason.end_sub_method, {methodName, duration: performance.now()-this._analyticStore.startTimeSubMethod, props});
            }
        }catch (e) {
            // console.error(e);
        }
    }
    private _drawWrappedText(
        dim: IVector2D & { lineHeight: number, width: number, center: boolean },
        text: string
    ) {
        this._handleMethodStart('_drawWrappedText', {dim, text});
        if (!this._drawCondition) {
            return this;
        }

        const lines = this.getProcessedLines(text, dim);
        lines.forEach((line: string, index: number) => {
            const y = dim.y + index * dim.lineHeight;
            let x = dim.x;
            if (dim.center) {
                const lineWidth = this.ctx!.measureText(line).width;
                const center = dim.x + dim.width / 2;
                x = center - lineWidth / 2;
            }
            this.ctx!.fillText(line, x, y);
        });
        this._handleMethodEnd('_drawWrappedText', {lines, text, dim});
        return this;
    }
    /**
     * Processes the input text and splits it into lines of a specified dimension.
     *
     * @param {string} text - The input text to be processed.
     * @param {Object} dim - An object representing the dimension of the lines. It should be of type IVector2D, which has properties `lineHeight` and `width`.
     * @return {string[]} - An array of strings representing the processed lines.
     * @private
     */
    private getProcessedLines(text: string, dim: IVector2D & { lineHeight: number, width: number }): string[] {
        this._handleMethodStart('getProcessedLines', {text, dim});
        const words = text.split(' ');
        // tslint:disable-next-line:prefer-const one-variable-per-declaration
        let line = '', lines = [];

        for (const word of words) {
            const testLine = line + word + ' ';
            const metrics = this.ctx!.measureText(testLine);
            const textWidth = metrics.width;

            if (textWidth > dim.width && line !== '') {
                lines.push(line);
                line = word + ' ';
            } else {
                line = testLine;
            }
        }

        lines.push(line);
        this._handleMethodEnd('getProcessedLines', {lines});
        return lines;
    }
    private _selectRect(absoluteRectInPx: IRectangleBase): DrawEngine {
        this._handleMethodStart('_selectRect', {rectForCurrentUnit: absoluteRectInPx, _propsOrder:['absoluteRectInPx']});
        if(!this._drawCondition){return this;}
        this.ctx!.rect(absoluteRectInPx.x,absoluteRectInPx.y,absoluteRectInPx.width,absoluteRectInPx.height);
        this._handleMethodEnd('_selectRect', undefined);
        return this;
    }
}

export default {
    getDrawEngine: (canvas: HTMLCanvasElement): IDrawEngine => {
        return (new DrawEngine()).setContext(canvas.getContext('2d')!);
    }
};