import IVector3D from "../Interfaces/IVector3D";
import Geometry from "./Geometry";

export default class Cube3d extends Geometry {
    private _transformedVertices: IVector3D[] = [];

    public draw(ctx: CanvasRenderingContext2D): Cube3d {
        const { x, y, z } = this.getPosition() as IVector3D;
        const { x: sx, y: sy, z: sz } = this.getProperty('size');
        const { x: px, y: py, z: pz } = this.getProperty('pivot');
        const fillStyle = this.getProperty('fillStyle');
        const strokeStyle = this.getProperty('strokeStyle');
        const rotation = this.getRotation() as IVector3D | IVector3D[];

        const vertices: IVector3D[] = [
            { x: -0.5, y: -0.5, z: -0.5 },
            { x:  0.5, y: -0.5, z: -0.5 },
            { x:  0.5, y:  0.5, z: -0.5 },
            { x: -0.5, y:  0.5, z: -0.5 },
            { x: -0.5, y: -0.5, z:  0.5 },
            { x:  0.5, y: -0.5, z:  0.5 },
            { x:  0.5, y:  0.5, z:  0.5 },
            { x: -0.5, y:  0.5, z:  0.5 },
        ].map(v => ({
            x: (v.x * sx) - px,
            y: (v.y * sy) - py,
            z: (v.z * sz) - pz
        }));

        const rotationMatrices = Array.isArray(rotation)
            ? rotation.map(r => this.getRotationMatrix(r.x, r.y, r.z))
            : [this.getRotationMatrix(rotation.x, rotation.y, rotation.z)];

        this._transformedVertices = vertices.map(v => {
            let transformed = { ...v };
            rotationMatrices.forEach(matrix => {
                transformed = this.applyMatrix(transformed, matrix);
            });
            return { x: transformed.x + x, y: transformed.y + y, z: transformed.z + z };
        });

        const projectedVertices = this._transformedVertices.map(v => ({
            x: v.x / (v.z + 4) * 200,
            y: v.y / (v.z + 4) * 200
        }));

        const faces = [
            [0, 1, 2, 3], // front
            [4, 5, 6, 7], // back
            [0, 1, 5, 4], // top
            [2, 3, 7, 6], // bottom
            [0, 3, 7, 4], // left
            [1, 2, 6, 5]  // right
        ];

        const faceDepths = faces.map((face, index) => ({
            depth: face.reduce((sum, i) => sum + this._transformedVertices[i].z, 0) / face.length,
            face,
            fillStyle: Array.isArray(fillStyle) ? fillStyle[index] : fillStyle
        }));

        faceDepths.sort((a, b) => b.depth - a.depth);

        faceDepths.forEach(({ face, fillStyle }) => {
            ctx.beginPath();
            ctx.moveTo(projectedVertices[face[0]].x, projectedVertices[face[0]].y);
            face.slice(1).forEach(index => {
                ctx.lineTo(projectedVertices[index].x, projectedVertices[index].y);
            });
            ctx.closePath();

            if (fillStyle !== undefined && fillStyle !== -1) {
                ctx.fillStyle = fillStyle;
                ctx.fill();
            }

            ctx.strokeStyle = strokeStyle;
            ctx.stroke();
        });
        return this;
    }

    public getTransformedVertices(): IVector3D[] {
        return this._transformedVertices;
    }

    public getBody(): number[] {
        return [/*EBodyType.NGON*/0, ...this.getTransformedVertices() as any];
    }

    private getRotationMatrix(rx: number, ry: number, rz: number, ) {
        const cosX = Math.cos(rx), sinX = Math.sin(rx);
        const cosY = Math.cos(ry), sinY = Math.sin(ry);
        const cosZ = Math.cos(rz), sinZ = Math.sin(rz);

        const rotX = [
            [1, 0, 0],
            [0, cosX, -sinX],
            [0, sinX, cosX]
        ];
        const rotY = [
            [cosY, 0, sinY],
            [0, 1, 0],
            [-sinY, 0, cosY]
        ];
        const rotZ = [
            [cosZ, -sinZ, 0],
            [sinZ, cosZ, 0],
            [0, 0, 1]
        ];

        return this.multiplyMatrices(this.multiplyMatrices(rotX, rotY), rotZ);
    }

    private applyMatrix(vertex: IVector3D, matrix: number[][]): IVector3D {
        const { x, y, z } = vertex;
        return {
            x: x * matrix[0][0] + y * matrix[0][1] + z * matrix[0][2],
            y: x * matrix[1][0] + y * matrix[1][1] + z * matrix[1][2],
            z: x * matrix[2][0] + y * matrix[2][1] + z * matrix[2][2]
        };
    }

    private multiplyMatrices(a: number[][], b: number[][]): number[][] {
        const result: number[][] = Array(3).fill(null).map(() => Array(3).fill(0));
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    result[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return result;
    }
}