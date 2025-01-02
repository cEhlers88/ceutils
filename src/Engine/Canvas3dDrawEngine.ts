import { EPositionUnit } from "../enum/EPositionUnit";
import { IColor } from "../Interfaces/IColor";
import {IDrawEngine} from "../Interfaces/IDrawEngine";
import IRectangleBase from "../Interfaces/IRectangleBase";
import IVector2D from "../Interfaces/IVector2D";
import IVector3D from "../Interfaces/IVector3D";

export default class Canvas3dDrawEngine implements IDrawEngine {
    private ctx: WebGLRenderingContext | null = null;
    private _drawCondition: boolean = true;
    beginPath(): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    public circle(
        position: { x: number; y: number },
        radius: number,
        strokeStyle: string = '#ffffff',
        fillStyle: string = ''
    ): IDrawEngine {
        const canvasWidth = this.ctx!.canvas.width;
        const canvasHeight = this.ctx!.canvas.height;

        const glX = (2 * position.x / canvasWidth) - 1;
        const glY = 1 - (2 * position.y / canvasHeight);
        const glRadius = radius / Math.max(canvasWidth, canvasHeight);

        const [r, g, b] = this._hexToRgb(fillStyle || strokeStyle);

        const vertices = this._createCircleVertices(glX, glY, glRadius);
        this._drawCircle(vertices, r, g, b);

        return this;
    }

    clipRect(rect: IRectangleBase | IRectangleBase[]): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    clipRoundRect(rect: IRectangleBase | IRectangleBase[], radius: number): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    closePath(): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    public cls(): IDrawEngine {
        if (!this._drawCondition || !this.ctx!) return this;
        this.ctx!.clear(this.ctx!.COLOR_BUFFER_BIT | this.ctx!.DEPTH_BUFFER_BIT);
        return this;
    }
    cube(planeRect: IRectangleBase, depth?: number | undefined, angles?: { x: number; y: number; z: number; } | undefined, strokeStyle?: string | number | undefined, fillStyle?: string | number | number[] | string[] | undefined): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    cube3d(planeRect: IRectangleBase, depth?: number | undefined, angles?: number[] | IVector3D | IVector3D[] | number[][] | undefined, strokeStyle?: string | number | undefined, fillStyle?: string | number | number[] | string[] | undefined, pivot?: IVector3D | undefined): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    getContext(): CanvasRenderingContext2D {
        throw new Error("Method not implemented.");
    }
    gradientLines(start: IVector2D, destinations: IVector2D[], colors: (string | number | IColor)[], width?: number | undefined): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    removeDrawCondition(): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    restore(): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    public setContext(context: WebGLRenderingContext): IDrawEngine {
        this.ctx = context;
        this.ctx!.clearColor(0.0, 0.0, 0.0, 1.0);
        this.ctx!.clear(this.ctx!.COLOR_BUFFER_BIT | this.ctx!.DEPTH_BUFFER_BIT);

        return this;
    }
    public setDrawCondition(condition: boolean): IDrawEngine {
        this._drawCondition = condition;
        return this;
    }
    public setFillStyle(color: string): IDrawEngine {

        return this;
    }
    setFilter(filter: string): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    setConditionalFilter(condition: boolean, filter: string): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    setFont(font: string): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    setGlobalCompositeOperation(newState: GlobalCompositeOperation): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    setStrokeStyle(strokeStyle: string | number): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    donut(position: IVector2D, outerRadius: number, innerRadius: number, strokeStyle?: string | number | undefined, fillStyle?: string | number | undefined): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    fill(fillRule?: any): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    grid(gridSize: number, strokeStyle: string, area?: IRectangleBase | undefined, angle?: number | undefined): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    hexagon(position: IVector2D, radius: number, strokeStyle?: string | number | undefined, fillStyle?: string | number | undefined, angle?: number | undefined): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    image(canvas: HTMLCanvasElement, sourceRect: IRectangleBase, destinationRect?: IRectangleBase | undefined, angle?: number | undefined, pivot?: IVector2D | undefined): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    lines(startPosition: IVector2D, destinations: IVector2D[], strokeStyle?: string | number | undefined, fillStyle?: string | number | undefined, lineWidth?: number | undefined, autoClose?: boolean | undefined): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    moveTo(position: IVector2D): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    ngon(position: IVector2D, radius: number, sides: number, strokeStyle?: string | number | undefined, fillStyle?: string | number | undefined, angle?: number | undefined): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    quadraticCurveTo(controlPoint: IVector2D, position: IVector2D): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    rectangle(rect: IRectangleBase | number[], strokeStyle?: string | number | undefined, fillStyle?: string | number | undefined, angle?: number | undefined, pivot?: IVector2D | undefined): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    resetClip(): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    roundRectangle(rect: IRectangleBase, radius: number, strokeStyle?: string | number | undefined, fillStyle?: string | number | undefined): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    save(): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    selectRect(rect: IRectangleBase): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    selectRoundRect(rect: IRectangleBase, borderRadius: number): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    setUnit(unit: EPositionUnit): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    start(name: string): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    startAnalyse(callback: (reason: string, props: any) => void): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    stroke(): IDrawEngine {
        throw new Error("Method not implemented.");
    }
    text(dim: IVector2D & { width?: number | undefined; lineHeight?: number | undefined; }, text: string, color?: string | number | undefined, font?: string | undefined): IDrawEngine {
        throw new Error("Method not implemented.");
    }

    private _createCircleVertices(centerX: number, centerY: number, radius: number): Float32Array {
        const vertices = [];
        const numSegments = 50;
        for (let i = 0; i <= numSegments; i++) {
            const angle = (i / numSegments) * 2 * Math.PI;
            vertices.push(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
        }
        return new Float32Array(vertices);
    }

    private _drawCircle(vertices: Float32Array, r: number, g: number, b: number): void {
        const gl = this.ctx as WebGLRenderingContext;

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const vertexShaderSource = `
        attribute vec2 aPosition;
        void main() {
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
    `;
        const fragmentShaderSource = `
        precision mediump float;
        uniform vec3 uColor;
        void main() {
            gl_FragColor = vec4(uColor, 1.0);
        }
    `;

        const program = this._createProgram(gl, vertexShaderSource, fragmentShaderSource);
        gl.useProgram(program);

        const aPosition = gl.getAttribLocation(program, 'aPosition');
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        const uColor = gl.getUniformLocation(program, 'uColor');
        gl.uniform3f(uColor, r, g, b);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 2);

        gl.deleteBuffer(vertexBuffer);
    }

    private _createProgram(gl: WebGLRenderingContext, vertexSrc: string, fragmentSrc: string): WebGLProgram {
        const vertexShader = this._compileShader(gl, vertexSrc, gl.VERTEX_SHADER);
        const fragmentShader = this._compileShader(gl, fragmentSrc, gl.FRAGMENT_SHADER);

        const program = gl.createProgram()!;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error('Failed to link WebGL program: ' + gl.getProgramInfoLog(program));
        }

        return program;
    }

    private _compileShader(gl: WebGLRenderingContext, source: string, type: number): WebGLShader {
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error('Failed to compile shader: ' + gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    private _hexToRgb(hex: string): [number, number, number] {
        if (typeof hex !== 'string') {
            throw new Error(`Expected a string for color, but got ${typeof hex}`);
        }
        if (!/^#([0-9A-Fa-f]{3}){1,2}$/.test(hex)) {
            throw new Error(`Invalid hex color format: ${hex}`);
        }
        let normalizedHex = hex.length === 4
            ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
            : hex;
        const bigint = parseInt(normalizedHex.slice(1), 16);
        const r = ((bigint >> 16) & 255) / 255;
        const g = ((bigint >> 8) & 255) / 255;
        const b = (bigint & 255) / 255;
        return [r, g, b];
    }
}