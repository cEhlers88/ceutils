import AbstractGeometryDrawer, {ERotateType, IGeometryArgs, IGeometryStore} from "./AbstractGeometryDrawer";
import IVector2D from "../../Interfaces/IVector2D";
import IVector3D from "../../Interfaces/IVector3D";

interface INgonGeometryArgs extends IGeometryArgs {
    position: IVector2D|IVector3D;
    radius?: number;
    sides: number;
}

export default class NgonGeometryDrawer extends AbstractGeometryDrawer {
    protected _create(creationArgs: INgonGeometryArgs): IGeometryStore {
        const _initPivot = (creationArgs.pivot[0] as IVector2D) ? creationArgs.pivot[0] as IVector2D : this.getDefaultPivot();

        const result: IGeometryStore = {
            bodyType: 'ngon',
            edges: [],
            fillStyle: creationArgs.fillStyle || -1,
            height: creationArgs.height || (creationArgs.radius! * 2),
            pivot: _initPivot,
            position: creationArgs.position,
            strokeStyle: creationArgs.strokeStyle || -1,
            width: creationArgs.width || (creationArgs.radius! * 2)
        };
        const angleRad = (creationArgs.angles![0] as number || 0) * Math.PI / 180;
        const pivotCenterDiff = {
            x: .5 - _initPivot.x,
            y: .5 - _initPivot.y
        };

        for (let i = 0; i <= creationArgs.sides; i++) {
            const rotAngle = (2 * Math.PI / creationArgs.sides) * i;
            const _radius = creationArgs.radius as number;
            result.edges.push({
                x: _radius * Math.cos(rotAngle + angleRad) + (pivotCenterDiff.x * result.width),
                y: _radius * Math.sin(rotAngle + angleRad) + (pivotCenterDiff.y * result.height),
                z: ('z' in creationArgs.position) ? (creationArgs.position as IVector3D).z : 0
            });
        }

        return result;
    }
    protected _draw(drawArgs: IGeometryStore): void {
        const ctx = this.getContext() as CanvasRenderingContext2D;
        ctx.beginPath();
        ctx.moveTo(Math.floor(drawArgs.edges[0].x),Math.floor(drawArgs.edges[0].y));
        for (let i = 1; i < drawArgs.edges.length; i++) {
            ctx.lineTo(Math.floor(drawArgs.edges[i].x),Math.floor(drawArgs.edges[i].y));
        }
        ctx.closePath();

        if(drawArgs.strokeStyle!==-1){
            ctx.strokeStyle = drawArgs.strokeStyle.toString();
            ctx.stroke();
        }
        if(drawArgs.fillStyle!==-1) {
            ctx.fillStyle = drawArgs.fillStyle.toString();
            ctx.fill();
        }
    }
}