/**
 * Library Vector2D
 * Created 15.04.22
 *
 * @author Christoph Ehlers <webmaster@c-ehlers.de>
 */
import {EPositionType} from "./enum/EPositionType";
import {EPositionUnit} from "./enum/EPositionUnit";
import IVector2D from "./Interfaces/IVector2D";

const mainCamera = {x:0,y:0};

export default class Vector2D implements IVector2D {

    public get x():number {
        return Number((this._x===-0?0:this._x).toFixed(3));
    }
    public set x(newX:number){
        this._magnitude = undefined;
        this._x = newX;
    }
    public get left():number {
        return this.x;
    }

    public get y():number {
        return Number((this._y===-0?0:this._y).toFixed(3));
    }
    public set y(newY:number){
        this._magnitude = undefined;
        this._y = newY;
    }
    public get top():number {
        return this.y;
    }

    public get cameraSaveX():number {
        return Math.floor(this.x - mainCamera.x);
    }
    public get cameraSaveY():number {
        return Math.floor(this.y - mainCamera.y);
    }

    public get positionSaveX():number {
        return this.positionType === EPositionType.absolute ? this.x : this.cameraSaveX;
    }
    public get positionSaveY():number {
        return this.positionType === EPositionType.absolute ? this.y : this.cameraSaveY;
    }

    public get PositionUnit():EPositionUnit {
        return this._positionUnit;
    }
    public set PositionUnit(newPositionUnit:EPositionUnit){
        this._positionUnit = newPositionUnit;
    }

    public get notRoundedX():number {
        return this._x;
    }
    public get notRoundedY():number {
        return this._y;
    }
    public get magnitude(){
        if(this._magnitude === undefined){
            this._magnitude = this.calcMagnitude(this);
        }
        return this._magnitude;
    }
    public get length(){
        return this.magnitude;
    }
    public get normalized():IVector2D {
        return new Vector2D( this.x / this.magnitude,this.y / this.magnitude);
    }

    public get rotation():number {
        return this._rotation;
    }
    public set rotation(newRotation:number){
        this._rotation = newRotation;
    }

    public positionType:EPositionType = EPositionType.absolute;
    protected previousX:number;
    protected previousY:number;
    protected directionX:number;
    protected directionY:number;
    private _magnitude:number|undefined = undefined;
    private _positionUnit:EPositionUnit = EPositionUnit.px;
    private _rotation:number = 0;
    private _x:number;
    private _y:number;
    public constructor(x:number, y:number) {
        this._x = x || 0;
        this._y = y || 0;

        this.previousX = this.x;
        this.previousY = this.y;
        this.directionX = 1;
        this.directionY = 1;
    }

    public update(deltaTime:number){
        this.directionX = (this.previousX>this.x?-1:this.previousX<this.x?1:this.directionX);

        this.directionY = (this.previousY>this.y?-1:this.previousY<this.y?1:this.directionY)
        this.previousX = this.x;
        this.previousY = this.y;
    }

    public addVector(vector:IVector2D):Vector2D{
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    public calcSubtractVector(vector:IVector2D):Vector2D {
        return new Vector2D(this.x-vector.x,this.y-vector.y);
    }
    public scale(factor:number):Vector2D {
        this.x*=factor;
        this.y*=factor;
        return this;
    }
    public doWithVector(otherVector:IVector2D): {
        add: () => Vector2D;
        calculateDistance: () => number;
        getNomalizedMoveVector: (speed?: IVector2D) => ({ x: number; y: number });
        getAngleRadians: () => number;
        subtract: () => Vector2D;
        getAngleVector(): Vector2D
    } {
        const self = this;
        const otherVectorObj = new Vector2D(otherVector.x,otherVector.y);
        const getAngleRadians = () => {
            const subVector = self.calcSubtractVector(otherVector).normalized;
            let angle = Math.atan2(-subVector.y, subVector.x);

            if (angle < 0) {
                angle += 2 * Math.PI; // Wandelt negative Winkel in positive um
            }

            return angle===-0?0:angle;
        }

        return {
            add:()=>{
                return this.addVector(otherVector);
            },
            calculateDistance:()=>{
                return this.calcMagnitude(this.calcSubtractVector(otherVector));
            },
            getAngleRadians,
            getAngleVector():Vector2D {
                const subVector = otherVectorObj.doWithVector(self).subtract();// (self);
                const magnitude = subVector.magnitude;

                return new Vector2D(subVector.x / magnitude, subVector.y / magnitude);
            },
            getNomalizedMoveVector:(speed:IVector2D={x:1,y:1})=>{
                let distance = this.doWithVector(otherVector).calculateDistance();
                distance = distance<0?-distance:distance;
                if(otherVector.x === this.x){return {x:0,y:(otherVector.y>this.y ? 1 : -1)*Math.min(speed.y, distance)};}
                if(otherVector.y === this.y){return {x:(otherVector.x>this.x ? 1 : -1)*Math.min(speed.x, distance),y:0};}

                const movementVector = {x: otherVector.x - this.x, y: otherVector.y - this.y};
                const vectorLength = Math.sqrt(Math.pow(movementVector.x, 2) + Math.pow(movementVector.y, 2));
                const normalizedVector = {
                    x: (movementVector.x / vectorLength)*speed.x,
                    y: (movementVector.y / vectorLength)*speed.y
                };
                return {
                    x: normalizedVector.x > 0 ? Math.min(normalizedVector.x, otherVector.x-this.x) : Math.min(normalizedVector.x, this.x-otherVector.x),
                    y: normalizedVector.y > 0 ? Math.min(normalizedVector.y, otherVector.y-this.y) : Math.min(normalizedVector.y, this.y-otherVector.y)
                };
            },
            subtract:()=>{
                const newVector = this.calcSubtractVector(otherVector);
                this.x = newVector.x;
                this.y = newVector.y;
                return this;
            }
        }
    }
    public rotate(angle:number, anchor:IVector2D):Vector2D {
        this._rotation += angle;

        const radians = (Math.PI / 180) * -this._rotation;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        const newX = (cos * (this.x - anchor.x)) + (sin * (this.y - anchor.y)) + anchor.x;
        const newY = (cos * (this.y - anchor.y)) - (sin * (this.x - anchor.x)) + anchor.y;

        this._x = newX;
        this._y = newY;

        return this;
    }

    private calcMagnitude(vector:IVector2D):number{
        return Math.sqrt(vector.x*vector.x+vector.y*vector.y);
    }
}
