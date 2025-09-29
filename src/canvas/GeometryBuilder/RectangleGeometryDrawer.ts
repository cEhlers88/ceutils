import AbstractGeometryDrawer, {
  IGeometryArgs,
  IGeometryStore
} from "./AbstractGeometryDrawer";
import IVector2D from "../../Interfaces/IVector2D";
import IVector3D from "../../Interfaces/IVector3D";

interface IRectangleGeometryArgs extends IGeometryArgs {
  depth?: number;
  height: number;
  position: IVector2D | IVector3D;
  width: number;
}

export default class RectangleGeometryDrawer extends AbstractGeometryDrawer {
  public getDefaultPivot(): IVector3D {
    return {
      x: 1,
      y: 0,
      z: 0
    };
  }

  protected _create(creationArgs: IRectangleGeometryArgs): IGeometryStore {
    const _initPivot = (creationArgs.pivot[0] as IVector2D)
      ? (creationArgs.pivot[0] as IVector2D)
      : this.getDefaultPivot();
    return {
      bodyType: "ngon",
      edges: this._helpers.rotate(
        [
          { x: 0, y: 0 },
          { x: creationArgs.width, y: 0 },
          { x: creationArgs.width, y: creationArgs.height },
          { x: 0, y: creationArgs.height },
          { x: 0, y: 0 }
        ],
        {
          x: _initPivot.x * creationArgs.width,
          y: _initPivot.y * creationArgs.height
        },
        creationArgs.angles[0] || 0
      ),
      fillStyle: creationArgs.fillStyle || -1,
      height: creationArgs.height,
      pivot: _initPivot,
      position: creationArgs.position,
      strokeStyle: creationArgs.strokeStyle || -1,
      width: creationArgs.width
    };
  }
  protected _draw(drawArgs: IGeometryStore): void {
    const ctx = this.getContext() as CanvasRenderingContext2D;
    ctx.beginPath();
    ctx.moveTo(
      Math.floor(drawArgs.edges[0].x),
      Math.floor(drawArgs.edges[0].y)
    );
    for (let i = 1; i < drawArgs.edges.length; i++) {
      ctx.lineTo(
        Math.floor(drawArgs.edges[i].x),
        Math.floor(drawArgs.edges[i].y)
      );
    }
    ctx.closePath();

    if (drawArgs.strokeStyle !== -1) {
      ctx.strokeStyle = drawArgs.strokeStyle.toString();
      ctx.stroke();
    }
    if (drawArgs.fillStyle !== -1) {
      ctx.fillStyle = drawArgs.fillStyle.toString();
      ctx.fill();
    }
  }
  protected _update(
    currentStore: IGeometryStore,
    updateArgs: IRectangleGeometryArgs
  ): IGeometryStore {
    return super._update(currentStore, updateArgs);
  }
}
