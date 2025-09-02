/**
 * A class that provides methods for drawing on a canvas.
 */

import { EPositionUnit } from "../enum/EPositionUnit";
import { IColor } from "../Interfaces/IColor";
import { IDrawEngine } from "../Interfaces/IDrawEngine";
import IRectangle from "../Interfaces/IRectangle";
import IRectangleBase from "../Interfaces/IRectangleBase";
import IVector2D from "../Interfaces/IVector2D";
import IVector3D from "../Interfaces/IVector3D";
import Vector2D from "../Vector2D";

enum eAnalyticCallbackReason {
  start_root_method = "start_root_method",
  end_root_method = "end_root_method",
  start_sub_method = "start_sub_method",
  end_sub_method = "end_sub_method"
}
enum eDrawEngineMode {
  analytic = "analytic",
  simple = "simple"
}

export default class Canvas2dDrawEngine implements IDrawEngine {
  public static USE_GLOBAL_COLOR = -26071988;
  protected _rootPosition: number = -1;
  private _analyticStore = {
    callback: (reason: string, props: any) => {
      return;
    },
    currentRootMethod: "",
    startTimeRootMethod: 0,
    startTimeSubMethod: 0
  };
  private _mode: eDrawEngineMode = eDrawEngineMode.simple;
  private _drawCondition: boolean = true; // allow drawing?
  private _unit: EPositionUnit = EPositionUnit.px;
  private ctx?: CanvasRenderingContext2D;

  /**
   * Begins a new path in the current drawing context.
   *
   * @return {IDrawEngine} The current draw engine instance.
   */
  public beginPath(): IDrawEngine {
    if (!this._drawCondition) {
      return this;
    }
    this.ctx!.beginPath();
    return this;
  }
  /**
   * Clips the canvas context to the given rectangle(s).
   *
   * @param rect - The rectangle(s) to clip the context to. Can be a single rectangle or an array of rectangles.
   *
   * @returns The instance of the DrawEngine with the canvas context clipped.
   */
  public clipRect(rect: IRectangleBase | IRectangleBase[]): IDrawEngine {
    if (!this._drawCondition) {
      return this;
    }
    this.save().beginPath();
    if (Array.isArray(rect)) {
      rect.map(r => {
        this.selectRect(r);
      });
    } else {
      this.selectRect(rect);
    }
    this.ctx!.clip();
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
  public clipRoundRect(
    rect: IRectangleBase | IRectangleBase[],
    radius: number
  ): IDrawEngine {
    if (!this._drawCondition) {
      return this;
    }
    this.save().beginPath();
    if (Array.isArray(rect)) {
      rect.map(r => {
        this.selectRoundRect(r, radius);
      });
    } else {
      this.selectRoundRect(rect, radius);
    }
    this.ctx!.clip();

    return this;
  }
  /**
   * Closes the current path in the draw engine.
   *
   * @return {IDrawEngine} - The draw engine instance.
   */
  public closePath(): IDrawEngine {
    if (!this._drawCondition) {
      return this;
    }
    this.ctx!.closePath();
    return this;
  }
  /**
   * Clears the canvas if the draw condition is true.
   *
   * @return {DrawEngine} - The current instance of the DrawEngine.
   */
  public cls(): IDrawEngine {
    if (!this._drawCondition) {
      return this;
    }
    this.ctx!.clearRect(0, 0, this.ctx!.canvas.width, this.ctx!.canvas.height);
    return this;
  }
  /**
   * Fills the current drawing path on the canvas using the specified fill rule.
   *
   * @param {CanvasFillRule|undefined} fillRule - The fill rule to be applied. Can be either "nonzero" or "evenodd". If not specified, the default fill rule is used.
   * @returns {DrawEngine} - The DrawEngine instance for method chaining.
   */
  public fill(fillRule: CanvasFillRule | undefined): IDrawEngine {
    if (!this._drawCondition) {
      return this;
    }
    this._fill(fillRule || -1);
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
  public resetClip(): IDrawEngine {
    if (!this._drawCondition) {
      return this;
    }
    this.ctx!.restore();
    return this;
  }
  /**
   * Removes the draw condition for the DrawEngine.
   *
   * @return {DrawEngine} The modified DrawEngine object.
   */
  public removeDrawCondition(): IDrawEngine {
    this._drawCondition = true;
    return this;
  }

  /**
   * Saves the current state of the context.
   * @returns {IDrawEngine} - The current instance of the DrawEngine.
   */
  public save(): IDrawEngine {
    if (!this._drawCondition) {
      return this;
    }
    this.ctx!.save();
    return this;
  }
  /**
   * Selects a rectangle on the canvas.
   *
   * @param {IRectangleBase} rect - The rectangle object containing the coordinates and dimensions of the rectangle to be selected.
   * @returns {DrawEngine} - The current instance of the DrawEngine.
   */
  public selectRect(rect: IRectangleBase): IDrawEngine {
    const body = [rect.x, rect.y, rect.width, rect.height];
    this._selectRect(this._convertToAbsolutePixels(rect) as IRectangleBase);
    return this;
  }
  /**
   * Draws a rounded rectangle on the canvas.
   *
   * @param {IRectangleBase} rect - The rectangle object containing the position and dimensions of the rounded rectangle.
   * @param {number} borderRadius - The radius of the border corners of the rounded rectangle.
   * @returns {DrawEngine} - The DrawEngine instance for method chaining.
   */
  public selectRoundRect(
    rect: IRectangleBase,
    borderRadius: number
  ): IDrawEngine {
    const body = [rect.x, rect.y, rect.width, rect.height];
    // this._handleMethodStart('selectRoundRect', {rect, borderRadius, _propsOrder:['rect', 'borderRadius'], body});
    if (!this._drawCondition) {
      return this;
    }
    const _radius = {
      tl: borderRadius,
      tr: borderRadius,
      br: borderRadius,
      bl: borderRadius
    };

    this.ctx!.moveTo(rect.x + _radius.tl, rect.y);
    this.ctx!.lineTo(rect.x + rect.width - _radius.tr, rect.y);
    this.ctx!.quadraticCurveTo(
      rect.x + rect.width,
      rect.y,
      rect.x + rect.width,
      rect.y + _radius.tr
    );
    this.ctx!.lineTo(rect.x + rect.width, rect.y + rect.height - _radius.br);
    this.ctx!.quadraticCurveTo(
      rect.x + rect.width,
      rect.y + rect.height,
      rect.x + rect.width - _radius.br,
      rect.y + rect.height
    );
    this.ctx!.lineTo(rect.x + _radius.bl, rect.y + rect.height);
    this.ctx!.quadraticCurveTo(
      rect.x,
      rect.y + rect.height,
      rect.x,
      rect.y + rect.height - _radius.bl
    );
    this.ctx!.lineTo(rect.x, rect.y + _radius.tl);
    this.ctx!.quadraticCurveTo(rect.x, rect.y, rect.x + _radius.tl, rect.y);
    // this._handleMethodEnd('selectRoundRect', undefined);

    return this;
  }
  /**
   * Sets the context for drawing on a canvas.
   *
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   * @return {DrawEngine} - The DrawEngine instance with the updated context.
   */
  public setContext(ctx: CanvasRenderingContext2D): IDrawEngine {
    // this._handleMethodStart('setContext', {ctx, _propsOrder:['ctx']});
    this.ctx = ctx;
    // this._handleMethodEnd('setContext', undefined);
    return this;
  }
  /**
   * Sets the filter property of the canvas context.
   *
   * @param {string} filter - The filter to be applied to the canvas context.
   * @returns {IDrawEngine} - The modified IDrawEngine object.
   */
  public setFilter(filter: string): IDrawEngine {
    // this._handleMethodStart('setFilter', {filter, _propsOrder:['filter']});
    if (!this._drawCondition) {
      return this;
    }
    this.ctx!.filter = filter;
    // this._handleMethodEnd('setFilter', undefined);
    return this;
  }
  public setFillStyle(fillStyle: string): IDrawEngine {
    // this._handleMethodStart('setFillStyle', {fillStyle, _propsOrder:['fillStyle']},{mainFillStyle:fillStyle});
    if (!this._drawCondition) {
      return this;
    }
    this.ctx!.fillStyle = fillStyle;
    // this._handleMethodEnd('setFillStyle', undefined);
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
    // this._handleMethodStart('setConditionalFilter', {condition, filter, _propsOrder:['condition', 'filter']});
    if (condition) {
      this.setFilter(filter);
    }
    // this._handleMethodEnd('setConditionalFilter', undefined);
    return this;
  }
  /**
   * Sets the draw condition for the draw engine.
   *
   * @param {boolean} condition - The condition to be set for drawing.
   * @return {IDrawEngine} - The draw engine instance.
   */
  public setDrawCondition(condition: boolean): IDrawEngine {
    // this._handleMethodStart('setDrawCondition', {condition,_propsOrder:['condition']});
    this._drawCondition = condition;
    // this._handleMethodEnd('setDrawCondition', undefined);
    return this;
  }
  /**
   * Sets the font for the DrawEngine context.
   *
   * @param {string} font - The font to set. Must be a valid CSS font value.
   *
   * @return {DrawEngine} - The DrawEngine instance with the updated font.
   */
  public setFont(font: string): IDrawEngine {
    // this._handleMethodStart('setFont', {font, _propsOrder:['font']});
    this.ctx!.font = font;
    // this._handleMethodEnd('setFont', undefined);
    return this;
  }
  /**
   * Sets the global composite operation state of the DrawEngine.
   *
   * @param {GlobalCompositeOperation} newState - The new state to set for the global composite operation.
   * @return {DrawEngine} - The updated DrawEngine instance.
   */
  public setGlobalCompositeOperation(
    newState: GlobalCompositeOperation
  ): IDrawEngine {
    // this._handleMethodStart('setGlobalCompositeOperation', {newState, _propsOrder:['newState']});
    this.ctx!.globalCompositeOperation = newState;
    // this._handleMethodEnd('setGlobalCompositeOperation', undefined);
    return this;
  }
  public setStrokeStyle(strokeStyle: string): IDrawEngine {
    // this._handleMethodStart('setStrokeStyle', {strokeStyle, _propsOrder:['strokeStyle']},{mainStrokeStyle:strokeStyle});
    if (!this._drawCondition) {
      return this;
    }
    this.ctx!.strokeStyle = strokeStyle;
    // this._handleMethodEnd('setStrokeStyle', undefined);
    return this;
  }
  public setUnit(unit: EPositionUnit): IDrawEngine {
    // this._handleMethodStart('setUnit', {unit, _propsOrder:['unit']});
    this._unit = unit;
    // this._handleMethodEnd('setUnit', undefined);
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
  public circle(
    position: IVector2D,
    radius: number,
    strokeStyle: number | string = -1,
    fillStyle: number | string = -1
  ): IDrawEngine {
    const body = [
      position.x - radius,
      position.y - radius,
      position.x + radius,
      position.y + radius
    ];
    // this._handleMethodStart('circle', {position, radius, strokeStyle, fillStyle, _propsOrder:['position', 'radius', 'strokeStyle', 'fillStyle'], body});
    if (!this._drawCondition) {
      return this;
    }
    position = this._convertToAbsolutePixels(position) as IVector2D;
    this.ctx!.beginPath();
    this.ctx!.arc(position.x, position.y, radius, 0, Math.PI * 2);
    this.ctx!.closePath();

    this._fill(fillStyle);
    this._stroke(strokeStyle);

    // this._handleMethodEnd('circle', undefined);
    return this;
  }

  /**
   * Draws a cube on the canvas.
   *
   * @param {IRectangleBase} planeRect - The rectangle object containing the position and dimensions of the plane of the cube.
   * @param {number} [depth=-1] - The depth of the cube. Default is -1.
   * @param {{x:number, y:number, z:number}} [angles={x:0, y:0, z:30}] - The angles of the cube in degrees. Default is {x:0, y:0, z:30}
   * @param {number|string} [strokeStyle=-1] - The stroke style of the cube. Default is -1.
   * @param {number|string|number[]|string[]} [fillStyle=-1] - The fill style of the cube. Default is -1.
   * @returns {IDrawEngine} - The DrawEngine instance for method chaining.
   */
  public cube(
    planeRect: IRectangleBase,
    depth: number = -1,
    angles: { x: number; y: number; z: number } = { x: 0, y: 0, z: 30 },
    strokeStyle: number | string = -1,
    fillStyle: number | string | number[] | string[] = -1
  ): IDrawEngine {
    const body = [planeRect.x, planeRect.y, planeRect.width, planeRect.height];
    if (!this._drawCondition) {
      return this;
    }

    depth = depth === -1 ? planeRect.width / 2 : depth;
    const cosZ = Math.cos((angles.z * Math.PI) / 180);
    const sinZ = Math.sin((angles.z * Math.PI) / 180);

    this.lines(
      {
        ...planeRect,
        x: planeRect.x + cosZ * depth,
        y: planeRect.y - sinZ * depth
      },
      [
        {
          x: planeRect.x + cosZ * depth + planeRect.width,
          y: planeRect.y - sinZ * depth
        },
        {
          x: planeRect.x + cosZ * depth + planeRect.width,
          y: planeRect.y - sinZ * depth + planeRect.height
        },
        {
          x: planeRect.x + cosZ * depth,
          y: planeRect.y - sinZ * depth + planeRect.height
        }
      ],
      strokeStyle,
      typeof fillStyle === "number" || typeof fillStyle === "string"
        ? fillStyle
        : fillStyle[0]
    );
    this.lines(
      {
        ...planeRect,
        y: planeRect.y + planeRect.height
      },
      [
        {
          x: planeRect.x + cosZ * depth,
          y: planeRect.y + planeRect.height - sinZ * depth
        },
        {
          x: planeRect.x + cosZ * depth + planeRect.width,
          y: planeRect.y + planeRect.height - sinZ * depth
        },
        { x: planeRect.x + planeRect.width, y: planeRect.y + planeRect.height }
      ],
      strokeStyle,
      typeof fillStyle === "number" || typeof fillStyle === "string"
        ? fillStyle
        : fillStyle[1]
    );
    this.lines(
      {
        ...planeRect,
        x: planeRect.x + planeRect.width
      },
      [
        {
          x: planeRect.x + cosZ * depth + planeRect.width,
          y: planeRect.y - sinZ * depth
        },
        {
          x: planeRect.x + cosZ * depth + planeRect.width,
          y: planeRect.y - sinZ * depth + planeRect.height
        },
        { x: planeRect.x + planeRect.width, y: planeRect.y + planeRect.height },
        { x: planeRect.x + planeRect.width, y: planeRect.y }
      ],
      strokeStyle,
      typeof fillStyle === "number" || typeof fillStyle === "string"
        ? fillStyle
        : fillStyle[2]
    );
    this.lines(
      {
        ...planeRect,
        x: planeRect.x,
        y: planeRect.y - 0.5
      },
      [
        { x: planeRect.x + cosZ * depth - 1, y: planeRect.y - sinZ * depth },
        {
          x: planeRect.x + cosZ * depth,
          y: planeRect.y - sinZ * depth + planeRect.height
        },
        { x: planeRect.x, y: planeRect.y + planeRect.height },
        { x: planeRect.x, y: planeRect.y }
      ],
      strokeStyle,
      typeof fillStyle === "number" || typeof fillStyle === "string"
        ? fillStyle
        : fillStyle[3]
    );
    this.lines(
      planeRect,
      [
        { x: planeRect.x + cosZ * depth, y: planeRect.y - sinZ * depth },
        {
          x: planeRect.x + cosZ * depth + planeRect.width,
          y: planeRect.y - sinZ * depth
        },
        { x: planeRect.x + planeRect.width, y: planeRect.y },
        planeRect
      ],
      strokeStyle,
      typeof fillStyle === "number" || typeof fillStyle === "string"
        ? fillStyle
        : fillStyle[4]
    );
    this.lines(
      planeRect,
      [
        { x: planeRect.x + planeRect.width, y: planeRect.y },
        { x: planeRect.x + planeRect.width, y: planeRect.y + planeRect.height },
        { x: planeRect.x, y: planeRect.y + planeRect.height },
        { x: planeRect.x, y: planeRect.y }
      ],
      strokeStyle,
      typeof fillStyle === "number" || typeof fillStyle === "string"
        ? fillStyle
        : fillStyle[5]
    );

    return this;
  }

  /**
   * Draws a 3D cube on the canvas.
   * The cube is drawn in 3D space with perspective projection.
   *
   * @param {IRectangleBase} planeRect - The rectangle object containing the position and dimensions of the plane of the cube.
   * @param {number} [depth=-1] - The depth of the cube. Default is -1.
   * @param {IVector3D|IVector3D[]|number[]|number[][]} [angles={x:0, y:0, z:30}] - The angles of the cube in degrees. Default is {x:0, y:0, z:30}
   * @param {number|string} [strokeStyle=-1] - The stroke style of the cube. Default is -1.
   * @param {number|string|number[]|string[]} [fillStyle=-1] - The fill style of the cube. Default is -1.
   * @param {IVector3D} [pivot={x:0.5, y:0.5, z:0.5}] - The pivot point of the cube. Default is {x:0.5, y:0.5, z:0.5}.
   * @returns {IDrawEngine} - The DrawEngine instance for method chaining.
   */
  public cube3d(
    planeRect: IRectangleBase,
    depth: number = -1,
    angles: IVector3D | IVector3D[] | number[] | number[][] = {
      x: 0,
      y: 0,
      z: 30
    },
    strokeStyle: number | string = -1,
    fillStyle: number | string | number[] | string[] = -1,
    pivot: IVector3D = { x: 0.5, y: 0.5, z: 0.5 }
  ): IDrawEngine {
    const body = [planeRect.x, planeRect.y, planeRect.width, planeRect.height];
    if (!this._drawCondition) {
      return this;
    }

    depth = depth === -1 ? planeRect.width / 2 : depth;

    const centerX = planeRect.x + planeRect.width / 2;
    const centerY = planeRect.y + planeRect.height / 2;
    const centerZ = depth / 2;

    const pivot3D = {
      x: (pivot.x - 0.5) * planeRect.width,
      y: (pivot.y - 0.5) * planeRect.height,
      z: (pivot.z - 0.5) * depth
    };

    const vertices = [
      { x: -planeRect.width / 2, y: -planeRect.height / 2, z: -centerZ },
      { x: planeRect.width / 2, y: -planeRect.height / 2, z: -centerZ },
      { x: planeRect.width / 2, y: planeRect.height / 2, z: -centerZ },
      { x: -planeRect.width / 2, y: planeRect.height / 2, z: -centerZ },
      { x: -planeRect.width / 2, y: -planeRect.height / 2, z: centerZ },
      { x: planeRect.width / 2, y: -planeRect.height / 2, z: centerZ },
      { x: planeRect.width / 2, y: planeRect.height / 2, z: centerZ },
      { x: -planeRect.width / 2, y: planeRect.height / 2, z: centerZ }
    ];
    const rotate = (point: IVector3D, rotation: IVector3D) => {
      const radX = (rotation.x * Math.PI) / 180;
      const radY = (rotation.y * Math.PI) / 180;
      const radZ = (rotation.z * Math.PI) / 180;

      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);
      const cosZ = Math.cos(radZ);
      const sinZ = Math.sin(radZ);

      const x1 = cosY * (sinZ * point.y + cosZ * point.x) - sinY * point.z;
      const y1 =
        sinX * (cosY * point.z + sinY * (sinZ * point.y + cosZ * point.x)) +
        cosX * (cosZ * point.y - sinZ * point.x);
      const z1 =
        cosX * (cosY * point.z + sinY * (sinZ * point.y + cosZ * point.x)) -
        sinX * (cosZ * point.y - sinZ * point.x);

      return { x: x1, y: y1, z: z1 };
    };
    const project = (point: any) => {
      const scale = 500 / (500 + point.z);
      return {
        x: point.x * scale + centerX,
        y: point.y * scale + centerY,
        z: point.z
      };
    };

    let transformedVertices = vertices;

    this._convertToVector3D(angles).map(rotation => {
      transformedVertices = transformedVertices.map(v => {
        const relativeVertex = {
          x: v.x - pivot3D.x,
          y: v.y - pivot3D.y,
          z: v.z - pivot3D.z
        };
        const rotatedVertex = rotate(relativeVertex, rotation);
        return {
          x: rotatedVertex.x + pivot3D.x,
          y: rotatedVertex.y + pivot3D.y,
          z: rotatedVertex.z + pivot3D.z
        };
      });
    });

    transformedVertices = transformedVertices.map(v => project(v));

    const faces = [
      [0, 1, 2, 3], // front
      [4, 5, 6, 7], // back
      [0, 1, 5, 4], // top
      [2, 3, 7, 6], // bottom
      [0, 3, 7, 4], // left
      [1, 2, 6, 5] // right
    ];

    const faceDepths = faces.map((face, index) => ({
      depth:
        face.reduce((sum, i) => sum + transformedVertices[i].z, 0) /
        face.length,
      face,
      fillStyle:
        typeof fillStyle === "number" || typeof fillStyle === "string"
          ? fillStyle
          : fillStyle[index]
    }));

    faceDepths.sort((a, b) => b.depth - a.depth);

    // tslint:disable-next-line:no-shadowed-variable
    faceDepths.forEach(({ face, fillStyle }) => {
      this.lines(
        {
          x: transformedVertices[face[0]].x,
          y: transformedVertices[face[0]].y
        },
        face.map(i => ({
          x: transformedVertices[i].x,
          y: transformedVertices[i].y
        })),
        strokeStyle,
        fillStyle
      );
    });

    const edges = [
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7]
    ];

    edges.map(edge => {
      const [start, end] = edge;
      const startFace = faceDepths.find(({ face }) => face.includes(start))!;
      const endFace = faceDepths.find(({ face }) => face.includes(end))!;
      if (startFace.fillStyle === -1 || endFace.fillStyle === -1) {
        this.lines(
          { x: transformedVertices[start].x, y: transformedVertices[start].y },
          [{ x: transformedVertices[end].x, y: transformedVertices[end].y }],
          strokeStyle,
          -1
        );
      }
    });

    return this;
  }

  public start(): IDrawEngine {
    this._rootPosition = -1;
    return this;
  }
  public startAnalyse(
    callback: (reason: string, props: any) => void
  ): IDrawEngine {
    // tslint:disable-next-line:no-console
    console.warn(
      "Deprecated method startAnalyse() called. Use getDrawEngineAnalyzed() instead."
    );
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
  public donut(
    position: IVector2D,
    outerRadius: number,
    innerRadius: number,
    strokeStyle: number | string = -1,
    fillStyle: number | string = -1
  ): IDrawEngine {
    if (!this._drawCondition) {
      return this;
    }
    this.ctx!.beginPath();
    position = this._convertToAbsolutePixels(position) as IVector2D;
    this.ctx!.arc(position.x, position.y, outerRadius, 0, 2 * Math.PI);
    this.ctx!.arc(position.x, position.y, innerRadius, 0, 2 * Math.PI, true);

    this._fill(fillStyle);
    this._stroke(strokeStyle);
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
  public gradientLines(
    start: IVector2D,
    destinations: IVector2D[],
    colors: Array<IColor | string | number>,
    width: number = 1
  ): IDrawEngine {
    // this._handleMethodStart('gradientLines', {start, destinations, colors, width, _propsOrder:['start', 'destinations', 'colors', 'width']});
    start = this._convertToAbsolutePixels(start) as IVector2D;
    destinations = destinations.map(
      d => this._convertToAbsolutePixels(d) as IVector2D
    );
    const ctx = this.ctx!;
    // Gesamtlänge des Pfades berechnen
    let totalLength = 0;
    let currentPoint = start;
    for (const destination of destinations) {
      totalLength += new Vector2D(start.x, start.y)
        .doWithVector(new Vector2D(destination.x, destination.y))
        .calculateDistance();
      currentPoint = destination;
    }

    // Farbverlauf über den gesamten Pfad erstellen
    const gradient = ctx.createLinearGradient(
      start.x,
      start.y,
      currentPoint.x,
      currentPoint.y
    );
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
    // this._handleMethodEnd('gradientLines', undefined);
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
  public grid(
    gridSize: number,
    strokeStyle: string,
    area: IRectangle | undefined = undefined,
    angle: number = 0
  ): IDrawEngine {
    // this._handleMethodStart('grid', {gridSize, strokeStyle, area, angle, _propsOrder:['gridSize', 'strokeStyle', 'area', 'angle']});
    if (!this._drawCondition) {
      return this;
    }
    const startX = area === undefined ? 0 : area.x;
    const startY = area === undefined ? 0 : area.y;
    const stopX =
      area === undefined ? this.ctx!.canvas.width : area.x + area.width;
    const stopY =
      area === undefined ? this.ctx!.canvas.height : area.y + area.height;

    const width = stopX - startX;
    const height = stopY - startY;

    const maxExtentX =
      width * Math.abs(Math.cos(angle * (Math.PI / 180))) +
      height * Math.abs(Math.sin(angle * (Math.PI / 180)));
    const newGridSizeX = maxExtentX / Math.ceil(maxExtentX / gridSize);
    const maxExtentY =
      width * Math.abs(Math.sin(angle * (Math.PI / 180))) +
      height * Math.abs(Math.cos(angle * (Math.PI / 180)));
    const newGridSizeY = maxExtentY / Math.ceil(maxExtentY / gridSize);

    this.ctx!.save();
    this.ctx!.beginPath();
    this.ctx!.rect(startX, startY, stopX - startX, stopY - startY);
    this.ctx!.clip();

    this.ctx!.translate((startX + stopX) / 2, (startY + stopY) / 2);
    this.ctx!.rotate((angle * Math.PI) / 180);
    this.ctx!.translate(-((startX + stopX) / 2), -((startY + stopY) / 2));
    this.ctx!.beginPath();

    for (
      let i = -height;
      i <= Math.round(height / newGridSizeY) + height;
      i++
    ) {
      this.ctx!.moveTo(startX - width, startY + i * newGridSizeY);
      this.ctx!.lineTo(stopX + width, startY + i * newGridSizeY);
    }

    for (let i = -width; i <= Math.round(width / newGridSizeX) + width; i++) {
      this.ctx!.moveTo(startX + i * newGridSizeX, startY - height);
      this.ctx!.lineTo(startX + i * newGridSizeX, stopY + height);
    }

    this.ctx!.strokeStyle = strokeStyle;
    this.ctx!.stroke();
    this.ctx!.restore();
    // this._handleMethodEnd('grid', undefined);

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
   * @returns {IDrawEngine} The DrawEngine instance.
   */
  public hexagon(
    position: IVector2D,
    radius: number,
    strokeStyle: number | string = -1,
    fillStyle: number | string = -1,
    angle: number = 0
  ): IDrawEngine {
    return this.ngon(position, radius, 6, strokeStyle, fillStyle, angle);
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
   * @returns {IDrawEngine} Returns the DrawEngine instance for method chaining.
   */
  public lines(
    startPosition: IVector2D,
    destinations: IVector2D[],
    strokeStyle: number | string = -1,
    fillStyle: number | string = -1,
    lineWidth: number = 0.5
  ): IDrawEngine {
    if (!this._drawCondition) {
      return this;
    }
    startPosition = this._convertToAbsolutePixels(startPosition) as IVector2D;
    destinations = destinations.map(
      d => this._convertToAbsolutePixels(d) as IVector2D
    );
    this.ctx!.beginPath();
    this.ctx!.lineWidth = lineWidth;
    this.ctx!.moveTo(startPosition.x, startPosition.y);
    destinations.map(point => {
      this.ctx!.lineTo(point.x, point.y);
    });

    if (strokeStyle !== -1) {
      const resetStrokeStyle = this.ctx!.strokeStyle;
      this.ctx!.strokeStyle = strokeStyle.toString();
      this.ctx!.stroke();
      this.ctx!.strokeStyle = resetStrokeStyle;
    }
    if (fillStyle !== -1) {
      const resetFillStyle = this.ctx!.fillStyle;
      this.ctx!.fillStyle = fillStyle.toString();
      this.ctx!.closePath();
      this.ctx!.fill();
      this.ctx!.fillStyle = resetFillStyle;
    }
    return this;
  }
  /**
   * Moves the current drawing position to a new position.
   *
   * @param position - The new position to move to.
   * @returns {IDrawEngine} - The modified DrawEngine instance.
   */
  public moveTo(position: IVector2D): IDrawEngine {
    // this._handleMethodStart('moveTo', {position, _propsOrder:['position']});
    if (!this._drawCondition) {
      return this;
    }
    position = this._convertToAbsolutePixels(position) as IVector2D;
    this.ctx!.moveTo(position.x, position.y);
    // this._handleMethodEnd('moveTo', undefined);
    return this;
  }

  /**
   * Draws a polygon on the canvas.
   *
   * @param {IVector2D} position - The position of the center of the polygon.
   * @param {number} radius - The radius of the polygon.
   * @param {number} sides - The number of sides of the polygon.
   * @param {number|string} [strokeStyle=-1] - The stroke style of the polygon. Default is -1.
   * @param {number|string} [fillStyle=-1] - The fill style of the polygon. Default is -1.
   * @param {number} [angle=0] - The rotation angle of the polygon in degrees. Default is 0.
   */
  public ngon(
    position: IVector2D,
    radius: number,
    sides: number,
    strokeStyle: number | string = -1,
    fillStyle: number | string = -1,
    angle: number = 0
  ): IDrawEngine {
    if (!this._drawCondition) {
      return this;
    }

    position = this._convertToAbsolutePixels(position) as IVector2D;
    radius = this._convertToAbsolutePixels(radius) as number;

    const angleRad = (angle * Math.PI) / 180;
    const positions: IVector2D[] = [];

    for (let i = 0; i <= sides; i++) {
      const rotAngle = ((2 * Math.PI) / sides) * i;
      const x = position.x + radius * Math.cos(rotAngle + angleRad);
      const y = position.y + radius * Math.sin(rotAngle + angleRad);
      positions.push({ x, y });
    }

    this.save().lines(positions.shift()!, positions, strokeStyle, fillStyle);

    this.ctx!.restore();

    return this;
  }

  /**
   * Draws a quadratic curve from the current point to the given position, using the given control point.
   *
   * @param {IVector2D} controlPoint - The control point of the curve.
   * @param {IVector2D} position - The end position of the curve.
   *
   * @returns {IDrawEngine} - The updated DrawEngine object.
   */
  public quadraticCurveTo(
    controlPoint: IVector2D,
    position: IVector2D
  ): IDrawEngine {
    // this._handleMethodStart('quadraticCurveTo', {controlPoint, position, _propsOrder:['controlPoint', 'position']});
    if (!this._drawCondition) {
      return this;
    }
    controlPoint = this._convertToAbsolutePixels(controlPoint) as IVector2D;
    position = this._convertToAbsolutePixels(position) as IVector2D;
    this.ctx!.quadraticCurveTo(
      controlPoint.x,
      controlPoint.y,
      position.x,
      position.y
    );
    // this._handleMethodEnd('quadraticCurveTo', undefined);
    return this;
  }
  /**
   * Draws a rectangle on the canvas.
   *
   * @param {IRectangleBase|number[]} rect - The rectangle to be drawn.
   * @param {number | string} [strokeStyle=-1] - The stroke color of the rectangle. If -1, no stroke color will be applied.
   * @param {number | string} [fillStyle=-1] - The fill color of the rectangle. If -1, no fill color will be applied.
   * @param {number} [angle=0] - The angle (in degrees) by which the rectangle will be rotated.
   * @param {IVector2D} [pivot={x:.5, y:.5}] - The pivot point for the rotation of the rectangle.
   *
   * @returns {IDrawEngine} - The DrawEngine object for method chaining.
   */
  public rectangle(
    rect: IRectangleBase | number[],
    strokeStyle: number | string = "-1",
    fillStyle: number | string = "-1",
    angle: number = 0,
    pivot: IVector2D = { x: 0.5, y: 0.5 }
  ): IDrawEngine {
    // const body = [rect.x, rect.y, rect.width, rect.height];
    // this._handleMethodStart('rectangle', {rect, strokeStyle, fillStyle, angle, pivot, _propsOrder:['rect', 'strokeStyle', 'fillStyle', 'angle', 'pivot'], body});
    if (!this._drawCondition) {
      return this;
    }

    rect = this._convertToAbsolutePixels(rect) as IRectangleBase;

    if (angle !== 0) {
      this.ctx!.save();
      this.ctx!.translate(
        rect.x + rect.width * pivot.x,
        rect.y + rect.height * pivot.y
      );
      this.ctx!.rotate((angle * Math.PI) / 180);
      this.ctx!.translate(
        -rect.x - rect.width * pivot.x,
        -rect.y - rect.height * pivot.y
      );
    }

    (this.beginPath() as any)._selectRect(rect).closePath();

    this._fill(fillStyle);
    this._stroke(strokeStyle);

    if (angle !== 0) {
      this.ctx!.restore();
    }

    // this._handleMethodEnd('rectangle', undefined);
    return this;
  }
  /**
   * Draws a rounded rectangle on the canvas.
   *
   * @param {IRectangle} rect - The rectangle object defining the position and dimensions of the rounded rectangle.
   * @param {number} radius - The radius of the rounded corners.
   * @param {number | string} [strokeStyle=-1] - The stroke style used to outline the rounded rectangle. Defaults to -1.
   * @param {number | string} [fillStyle=-1] - The fill style used to color the inside of the rounded rectangle. Defaults to -1.
   * @returns {IDrawEngine} Returns the DrawEngine instance for chaining.
   */
  public roundRectangle(
    rect: IRectangleBase,
    radius: number,
    strokeStyle: number | string = -1,
    fillStyle: number | string = -1
  ): IDrawEngine {
    // this._handleMethodStart('roundRectangle', {rect, radius, strokeStyle, fillStyle, _propsOrder:['rect', 'radius', 'strokeStyle', 'fillStyle']});
    if (!this._drawCondition) {
      return this;
    }
    if (typeof radius === "undefined") {
      radius = 5;
    }

    rect = this._convertToAbsolutePixels(rect) as IRectangleBase;
    radius = this._convertToAbsolutePixels(radius) as number;

    this.ctx!.beginPath();
    this.selectRoundRect(rect, radius);
    this.ctx!.closePath();

    this._fill(fillStyle);
    this._stroke(strokeStyle);

    // this._handleMethodEnd('roundRectangle', undefined);
    return this;
  }
  public stroke(): IDrawEngine {
    // this._handleMethodStart('stroke');
    if (!this._drawCondition) {
      return this;
    }
    this.ctx!.stroke();
    // this._handleMethodEnd('stroke', undefined);
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
   * @returns {IDrawEngine} - The DrawEngine instance for chaining.
   */
  // tslint:disable-next-line:no-unnecessary-initializer
  public image(
    image: HTMLCanvasElement,
    sourceRect: IRectangleBase,
    destinationRect: IRectangleBase | undefined = undefined,
    angle: number = 0,
    pivot: IVector2D = { x: 0.5, y: 0.5 }
  ): IDrawEngine {
    // this._handleMethodStart('image', {image, sourceRect, destinationRect, angle, pivot, _propsOrder:['image', 'sourceRect', 'destinationRect', 'angle', 'pivot']});
    if (!this._drawCondition) {
      return this;
    }
    if (destinationRect === undefined) {
      destinationRect = sourceRect;
    }
    destinationRect = this._convertToAbsolutePixels(
      destinationRect
    ) as IRectangleBase;

    this.ctx!.save();
    this.ctx!.translate(
      destinationRect!.x + destinationRect!.width * pivot.x,
      destinationRect!.y + destinationRect!.height * pivot.y
    );
    this.ctx!.rotate((angle * Math.PI) / 180);
    this.ctx!.translate(
      -destinationRect!.x - destinationRect!.width * pivot.x,
      -destinationRect!.y - destinationRect!.height * pivot.y
    );

    this.ctx!.drawImage(
      image,
      sourceRect.x,
      sourceRect.y,
      sourceRect.width,
      sourceRect.height,
      destinationRect!.x,
      destinationRect!.y,
      destinationRect!.width,
      destinationRect!.height
    );

    this.ctx!.restore();
    // this._handleMethodEnd('image', undefined);
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
  public text(
    dim: IVector2D & {
      center?: boolean;
      lineHeight?: number;
      width?: number;
    },
    text: string,
    color: number | string = -1,
    font: string = ""
  ): IDrawEngine {
    // this._handleMethodStart('text', {dim, text, color, font, _propsOrder:['dim', 'text', 'color', 'font']});
    if (!this._drawCondition) {
      return this;
    }
    dim = this._convertToAbsolutePixels(dim) as IRectangleBase;

    const resetFillStyle = this.ctx!.fillStyle;
    if (color !== -1) {
      this.ctx!.fillStyle = color.toString();
    }
    if (font !== "") {
      this.ctx!.font = font;
    }
    if (!dim.lineHeight) {
      dim.lineHeight = this.ctx!.measureText("M").actualBoundingBoxAscent;
    }
    if (dim.width) {
      this._drawWrappedText(dim as any, text);
    } else {
      this.ctx!.fillText(text, dim.x, dim.y);
    }
    this.ctx!.fillStyle = resetFillStyle;
    // this._handleMethodEnd('text', undefined);
    return this;
  }

  private _convertToAbsolutePixels(
    objectToCalculate: any
  ): number | IVector2D | IRectangleBase {
    if (typeof objectToCalculate === "number") {
      return objectToCalculate * this._positionUnitMultiplier().x;
    } else {
      const result: any = {};
      objectToCalculate =
        Array.isArray(objectToCalculate) && objectToCalculate.length === 4
          ? {
              height: objectToCalculate[3],
              width: objectToCalculate[2],
              x: objectToCalculate[0],
              y: objectToCalculate[1]
            }
          : objectToCalculate;
      let updated = false;
      if (objectToCalculate.hasOwnProperty("x")) {
        result.x =
          objectToCalculate.x *
          this._positionUnitMultiplier(
            objectToCalculate.hasOwnProperty("positionUnit")
              ? objectToCalculate.positionUnit
              : undefined
          ).x;
        updated = true;
      }
      if (objectToCalculate.hasOwnProperty("y")) {
        result.y =
          objectToCalculate.y *
          this._positionUnitMultiplier(
            objectToCalculate.hasOwnProperty("positionUnit")
              ? objectToCalculate.positionUnit
              : undefined
          ).y;
        updated = true;
      }
      if (objectToCalculate.hasOwnProperty("width")) {
        result.width =
          objectToCalculate.width *
          this._positionUnitMultiplier(
            objectToCalculate.hasOwnProperty("positionUnit")
              ? objectToCalculate.positionUnit
              : undefined
          ).x;
        updated = true;
      }
      if (objectToCalculate.hasOwnProperty("height")) {
        result.height =
          objectToCalculate.height *
          this._positionUnitMultiplier(
            objectToCalculate.hasOwnProperty("positionUnit")
              ? objectToCalculate.positionUnit
              : undefined
          ).y;
        updated = true;
      }
      return updated ? result : objectToCalculate;
    }
  }
  private _convertToVector3D(
    input: IVector3D | IVector3D[] | number[] | number[][]
  ): IVector3D[] {
    if (Array.isArray(input)) {
      if (Array.isArray(input[0])) {
        return (input as number[][]).map(arr => ({
          x: arr[0],
          y: arr[1],
          z: arr[2]
        }));
      } else if (typeof input[0] === "number") {
        const arr = input as number[];
        if (arr.length === 3) {
          return [{ x: arr[0], y: arr[1], z: arr[2] }];
        } else {
          throw new Error("Invalid array length for Vector3D conversion.");
        }
      } else {
        return input as IVector3D[];
      }
    } else {
      return [input as IVector3D];
    }
  }
  private _fill(fillStyle: number | string): void {
    if (fillStyle.toString() !== "-1") {
      if (fillStyle === Canvas2dDrawEngine.USE_GLOBAL_COLOR) {
        this.ctx!.fill();
      } else {
        const resetFillStyle = this.ctx!.fillStyle;
        this.ctx!.fillStyle = fillStyle.toString();
        this.ctx!.fill();
        this.ctx!.fillStyle = resetFillStyle;
      }
    }
  }
  private _positionUnitMultiplier(ownType?: EPositionUnit): IVector2D {
    if (
      ownType === EPositionUnit.px ||
      (ownType === undefined && this._unit === EPositionUnit.px)
    ) {
      return { x: 1, y: 1 };
    }
    return {
      x: this.ctx!.canvas.width / 100,
      y: this.ctx!.canvas.height / 100
    };
  }
  private _stroke(strokeStyle: number | string): void {
    if (strokeStyle.toString() !== "-1") {
      if (strokeStyle === Canvas2dDrawEngine.USE_GLOBAL_COLOR) {
        this.ctx!.stroke();
      } else {
        const resetStrokeStyle = this.ctx!.strokeStyle;
        this.ctx!.strokeStyle = strokeStyle.toString();
        this.ctx!.stroke();
        this.ctx!.strokeStyle = resetStrokeStyle;
      }
    }
  }
  private _handleMethodStart(
    methodName: string,
    props: any = {},
    overrideProps: any = {}
  ) {
    if (this._mode === eDrawEngineMode.simple) {
      return;
    }
    try {
      if (this._analyticStore.currentRootMethod === "") {
        this._analyticStore.currentRootMethod = methodName;
        this._analyticStore.startTimeRootMethod = performance.now();
        this._analyticStore.callback(
          eAnalyticCallbackReason.start_root_method,
          {
            methodName,
            props,
            mainFillStyle: this.ctx ? this.ctx.fillStyle : "",
            mainStrokeStyle: this.ctx ? this.ctx.strokeStyle : "",
            ...overrideProps
          }
        );
      } else {
        this._analyticStore.startTimeSubMethod = performance.now();
        this._analyticStore.callback(eAnalyticCallbackReason.start_sub_method, {
          methodName,
          props,
          mainFillStyle: this.ctx ? this.ctx.fillStyle : "",
          mainStrokeStyle: this.ctx ? this.ctx.strokeStyle : "",
          ...overrideProps
        });
      }
    } catch (e) {
      // console.error(e);
    }
  }
  private _handleMethodEnd(methodName: string, props: any) {
    if (this._mode === eDrawEngineMode.simple) {
      return;
    }
    try {
      if (methodName === this._analyticStore.currentRootMethod) {
        this._analyticStore.currentRootMethod = "";
        this._analyticStore.callback(eAnalyticCallbackReason.end_root_method, {
          methodName,
          duration: performance.now() - this._analyticStore.startTimeRootMethod,
          props
        });
      } else {
        this._analyticStore.callback(eAnalyticCallbackReason.end_sub_method, {
          methodName,
          duration: performance.now() - this._analyticStore.startTimeSubMethod,
          props
        });
      }
    } catch (e) {
      // console.error(e);
    }
  }
  private _drawWrappedText(
    dim: IVector2D & { lineHeight: number; width: number; center: boolean },
    text: string
  ) {
    this._handleMethodStart("_drawWrappedText", { dim, text });
    if (!this._drawCondition) {
      return this;
    }

    const lines = this._getProcessedLines(text, dim);
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
    this._handleMethodEnd("_drawWrappedText", { lines, text, dim });
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
  private _getProcessedLines(
    text: string,
    dim: IVector2D & { lineHeight: number; width: number }
  ): string[] {
    const words = text.split(" ");
    // tslint:disable-next-line:prefer-const one-variable-per-declaration
    let line = "",
      lines = [];

    for (const word of words) {
      const testLine = line + word + " ";
      const metrics = this.ctx!.measureText(testLine);
      const textWidth = metrics.width;

      if (textWidth > dim.width && line !== "") {
        lines.push(line);
        line = word + " ";
      } else {
        line = testLine;
      }
    }

    lines.push(line);
    return lines;
  }
  private _selectRect(absoluteRectInPx: IRectangleBase): IDrawEngine {
    this.ctx!.rect(
      absoluteRectInPx.x,
      absoluteRectInPx.y,
      absoluteRectInPx.width,
      absoluteRectInPx.height
    );
    return this;
  }
}
