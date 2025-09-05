import IVector2D from "../../Interfaces/IVector2D";
import IVector3D from "../../Interfaces/IVector3D";
export enum ERotateType {
  complete,
  center
}
export interface IGeometryArgs {
  angles: number[] | IVector2D[] | IVector3D[];
  fillStyle?: number | string | number[] | string[];
  height?: number;
  pivot: number[] | IVector2D[] | IVector3D[];
  position?: IVector2D | IVector3D;
  radius?: number | number[];
  rotateType: ERotateType;
  strokeStyle?: number | string | number[] | string[];
  width?: number;
}
export interface IGeometryStore {
  bodyType: "ngon" | "circle";
  edges: IVector2D[] | IVector3D[];
  fillStyle: number | string | number[] | string[];
  height: number;
  pivot: IVector2D | IVector3D;
  position: IVector2D | IVector3D;
  strokeStyle: number | string | number[] | string[];
  width: number;
}
export interface IGeometryDrawerCreation {
  draw: () => void;
  update: (geometryArgs: IGeometryArgs) => IGeometryDrawerCreation;
}
export default abstract class AbstractGeometryDrawer {
  protected _context:
    | CanvasRenderingContext2D
    | WebGL2RenderingContext
    | null = null;
  protected _helpers: {
    rotate: (
      points: IVector2D[] | IVector3D[],
      rotationPoint: IVector2D | IVector3D,
      angle: number | IVector2D | IVector3D
    ) => IVector2D[] | IVector3D[];
  } = {
    rotate: (
      points: IVector2D[] | IVector3D[],
      rotationPoint: IVector2D | IVector3D,
      angle: number | IVector2D | IVector3D
    ) => {
      return points;
    }
  };
  public create(geometryArgs: IGeometryArgs): IGeometryDrawerCreation {
    const _buildReturnObject = (
      currentArgs: IGeometryArgs,
      currentStore: IGeometryStore
    ) => {
      return {
        draw: () => {
          this._handleDraw(currentStore);
        },
        update: (updateArgs: IGeometryArgs) => {
          return _buildReturnObject(
            updateArgs,
            this._update(currentStore, updateArgs)
          );
        }
      };
    };

    return _buildReturnObject(geometryArgs, this._create(geometryArgs));
  }
  public getContext():
    | CanvasRenderingContext2D
    | WebGL2RenderingContext
    | null {
    return this._context;
  }
  public getDefaultPivot(): IVector3D {
    return {
      x: 0.5,
      y: 0.5,
      z: 0
    };
  }
  public getParallelEdges(
    edges: IVector2D[] | IVector3D[],
    edge: IVector2D | IVector3D | null = null
  ): IVector2D[] | IVector3D[] {
    const result: any = [];
    const _pushResult = (sEdge: IVector2D | IVector3D) => {
      if (
        !result.some(
          (currentEdge: any) =>
            currentEdge.x === sEdge.x && currentEdge.y === sEdge.y
        )
      ) {
        result.push(edge);
      }
    };

    edges.map(currentEdge => {
      if (edge === null) {
        this.getParallelEdges(edges, currentEdge).map(_pushResult);
      } else {
        if (
          Math.round(currentEdge.x) === Math.round(edge.x) ||
          Math.round(currentEdge.y) === Math.round(edge.y)
        ) {
          result.push(currentEdge);
        }
      }
    });

    return result;
  }
  public setContext(
    context: CanvasRenderingContext2D | WebGL2RenderingContext
  ): AbstractGeometryDrawer {
    this._context = context;
    if (this._context! instanceof WebGL2RenderingContext) {
      return this;
    } else {
      this._handleDraw = (store: IGeometryStore) => {
        (this._context! as CanvasRenderingContext2D).save();
        this._draw(store);
        (this._context! as CanvasRenderingContext2D).restore();
      };
      this._helpers.rotate = (
        points: IVector2D[],
        rotationPoint: IVector2D,
        angle: number | IVector2D
      ) => {
        const _angle: IVector2D = {
          x: ((typeof angle === "number" ? angle : angle.x) * Math.PI) / 180,
          y: ((typeof angle === "number" ? angle : angle.y) * Math.PI) / 180
        };

        return points.map(point => {
          const _x = point.x - rotationPoint.x;
          const _y = point.y - rotationPoint.y;
          return {
            x:
              _x * Math.cos(_angle.x) -
              _y * Math.sin(_angle.x) +
              rotationPoint.x,
            y:
              _x * Math.sin(_angle.y) +
              _y * Math.cos(_angle.y) +
              rotationPoint.y
          };
        });
      };
    }
    return this;
  }

  protected abstract _create(creationArgs: IGeometryArgs): IGeometryStore;
  protected abstract _draw(drawArgs: IGeometryStore): void;
  protected _update(
    store: IGeometryStore,
    updateArgs: IGeometryArgs
  ): IGeometryStore {
    if (updateArgs.angles.length > 0) {
      const _angles = updateArgs.angles;
      let _pivot: IVector2D = store.pivot as IVector2D;

      _angles.map((angle, index) => {
        if (updateArgs.pivot[index]) {
          _pivot = updateArgs.pivot[index] as IVector2D;
        }
        if (updateArgs.rotateType === ERotateType.center) {
          const movedCenter = this._helpers.rotate(
            [{ x: store.width / 2, y: store.height / 2 }],
            {
              x: _pivot.x * store.width,
              y: _pivot.y * store.height
            },
            angle
          );
          const diff = {
            x: movedCenter[0].x - store.width / 2,
            y: movedCenter[0].y - store.height / 2
          };
          store.edges = store.edges.map(edge => {
            return {
              x: edge.x + diff.x,
              y: edge.y + diff.y
            };
          });
        } else {
          store.edges = this._helpers.rotate(
            store.edges,
            {
              x: _pivot.x * store.width,
              y: _pivot.y * store.height
            },
            angle
          );
        }
      });
    }

    store.edges.map(edge => {
      edge.x += updateArgs.position!.x;
      edge.y += updateArgs.position!.y;
    });

    return store;
  }
  private _handleDraw: (drawArgs: IGeometryStore) => void = (
    store: IGeometryStore
  ) => {
    return;
  };
}
