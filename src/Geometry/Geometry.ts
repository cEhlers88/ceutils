import IVector2D from "../Interfaces/IVector2D";
import IVector3D from "../Interfaces/IVector3D";

export default abstract class Geometry {
  private _properties: {
    [key: string]: any;
    fillStyle?: string | number | string[] | number[];
    position: IVector2D | IVector3D;
    rotation: number | IVector3D[];
    strokeStyle?: string | number | string[] | number[];
  } = {
    fillStyle: -1,
    position: { x: 0, y: 0 },
    rotation: 0,
    strokeStyle: -1
  };

  public abstract getBody(): number[] | IVector2D[] | IVector3D[];
  public configure(props: { [name: string]: any }): Geometry {
    this._properties = { ...this._properties, ...props };
    return this;
  }
  public draw(ctx: CanvasRenderingContext2D): Geometry {
    return this;
  }

  public getProperty(name: string): any {
    return this._properties[name];
  }
  public getPosition(): IVector2D | IVector3D {
    return this._properties.position;
  }
  public getRotation(): number | IVector3D[] {
    return this._properties.rotation;
  }

  public update(props: { [name: string]: any }): Geometry {
    return this.configure(props);
  }
}
