import Canvas2dDrawEngine from "../Engine/Canvas2dDrawEngine";
import {EAnalyzeReason} from "../enum/EAnalyzeReason";
import IVector2D from "../Interfaces/IVector2D";
import * as domLib from "../lib/dom";
import {drawEngine2dMeta} from "../lib/drawEngine2dMeta";

export default class CanvasEngineAnalyzer extends Canvas2dDrawEngine {
    private _activeDebugPointer: boolean = false;
    private _analyzerStartedAt: number = -1;
    private _analyzerFinishedCheckTimeout: NodeJS.Timeout | undefined;
    private _bodies: Array<Array<number|IVector2D>> = [];
    private _config: {
        _analyzingDepthReset: number;
        _showBodies: boolean;
        analyzingDepthMax: number;
        analyzingDepthMin: number;
        checkForEndlessLoop: boolean;
        checkForStartTrigger: boolean;
        checkLoopEnd: boolean;
        useOnlyDebugPointer: boolean;
    } = {
        _analyzingDepthReset: -1, // internal managed
        _showBodies: false,
        analyzingDepthMax: 0, // 0 = root method only, -1 = no limit
        analyzingDepthMin: 0,
        checkForEndlessLoop: true,
        checkForStartTrigger: true,
        checkLoopEnd: true,
        useOnlyDebugPointer: true
    };
    private _detailPointers: number[][] = [];
    private _flgDebugDraw: boolean = false;
    private _listener?: (reason: EAnalyzeReason, props: {}) => void;
    private _methodStack: Array<{
        arguments: any[];
        errors: Array<{
            number?: number;
            message: string;
        }>;
        methodName: string;
        startTime: number;
    }> = [];
    private _mousePosition: IVector2D = {x: 0, y: 0};
    constructor(canvas: HTMLCanvasElement, listener?: (reason: EAnalyzeReason, props: {}) => void) {
        super();
        canvas.addEventListener('mousemove', (e) => {
            this._mousePosition = {
                x: e.offsetX,
                y: e.offsetY
            };
        });
        this.setContext(canvas.getContext('2d')!);

        this._wrapParentMethods();
    }
    public analyze(reason: EAnalyzeReason, props: {
        arguments?: any[],
        duration?: number,
        endTime?: number,
        errMessage?: string,
        errNumber?: number,
        methodName: string,
        startTime?: number,
    }): void {
        if(this._flgDebugDraw){ return ;}
        const additionalInfos: {
            depth: number,
            rootPosition: number
        } = {
            depth: -1,
            rootPosition: this._rootPosition
        };
        let _ignore = false;

        switch (reason) {
            case EAnalyzeReason.METHOD_START:
                additionalInfos.depth = this._methodStack.filter(m=>m.methodName!=='start').length;
                if (additionalInfos.depth===0) {
                    this._rootPosition++;
                }
                this._methodStack.push({
                    arguments: props.arguments!,
                    errors: [],
                    methodName: props.methodName,
                    startTime: props.startTime!
                });

                if(props.methodName !== 'start') {
                    _ignore = !((this._config.analyzingDepthMax < 0 || additionalInfos.depth <= this._config.analyzingDepthMax) &&
                        (!this._config.useOnlyDebugPointer || this._activeDebugPointer)
                    );
                }

                break;
            case EAnalyzeReason.METHOD_END:
                const method = this._methodStack.pop();
                additionalInfos.depth = this._methodStack.filter(m=>m.methodName!=='start').length; // After pop !

                if (!method || method.methodName !== props.methodName) {
                    throw new Error('Method stack is not in sync');
                }else if(method.methodName !== 'start') {
                    _ignore = !((this._config.analyzingDepthMax < 0 || additionalInfos.depth <= this._config.analyzingDepthMax) &&
                        (!this._config.useOnlyDebugPointer || this._activeDebugPointer)
                    );
                }else{
                    _ignore = true;
                    this._handleStartEnd(performance.now());
                }

                this._flgDebugDraw = true; // !important
                this._bodies.map((bodyDef) => {
                    switch (bodyDef[0]) {
                        case 0:
                            bodyDef.shift();
                            const pos = bodyDef.shift() as IVector2D;

                            this.lines(pos, [...(bodyDef as IVector2D[])], '#ff000000',-1, 3);

                            [pos,...bodyDef].map((v) => {
                                const mouseDistance = this._getMouseDistance(v as IVector2D);
                                if(mouseDistance > 50){
                                    return;
                                }
                                this
                                    .image(this._positionInfoLabel(),
                                        {x:0,y:(mouseDistance<10?70:0),width:100,height:70},
                                        {x:(v as IVector2D).x-30,y:(v as IVector2D).y-35,width:60,height:30}
                                    )
                                ;
                            });

                            break;
                        case 1:
                            this.circle(bodyDef[1] as IVector2D, bodyDef[2] as number, 'red', -1);
                            break;
                    }
                });

                this._bodies = [];
                this._flgDebugDraw = false; // !important

                break;
            case EAnalyzeReason.METHOD_ERROR:
                this._methodStack[this._methodStack.length - 1].errors.push({
                    message: props.errMessage!,
                    number: props.errNumber!
                });
                break;
        }

        if(!_ignore) {
            this._doSelfCheck();
            if(this._listener){
                this._listener(reason, { ...props, ...additionalInfos });
            }
        }
    }

    /**
     * Set the listener for the analyzer
     * @param {(reason:EAnalyzeReason, props:{})=>void}listener The listener function to be called
     * @returns {CanvasEngineAnalyzer}
     */
    public setAnalyticListener(listener: (reason: EAnalyzeReason, props: {}) => void): CanvasEngineAnalyzer {
        this._listener = listener;
        return this;
    }

    public start(name:string = ''): CanvasEngineAnalyzer {
        super.start(name);
        this._analyzerStartedAt = performance.now();

        return this;
    }
    public startDebug(debugOptions:{
        depth?: number;
        showBodies?: boolean;
    }={}): CanvasEngineAnalyzer {
        if(this._analyzerStartedAt === -1){
            this.start();
        }

        if(debugOptions.depth){
            this._config._analyzingDepthReset = this._config.analyzingDepthMax;
            this._config.analyzingDepthMax = debugOptions.depth;
        }

        this._activeDebugPointer = true;
        return this;
    }
    public stopDebug(): CanvasEngineAnalyzer {
        this._activeDebugPointer = false;
        this._config.analyzingDepthMax = this._config._analyzingDepthReset;
        this._config._showBodies = false;

        return this;
    }
    protected handleMethodDetails(details: any) {
        if(this._flgDebugDraw){ return ;}

        if(this._listener){
            this._listener(EAnalyzeReason.RECEIVED_DETAILS, details);
        }

        if(details.body){
            this._bodies.push(details.body);
        }
    }

    private _doSelfCheck(): void {
        const _now:number = performance.now();

        if (this._config.checkForStartTrigger && this._rootPosition > 0 && this._analyzerStartedAt===-1) {
            throw new Error('Analyzer was not started');
        }
        if (this._config.checkForEndlessLoop && this._rootPosition > 5000) {
            throw new Error('Analyzer seems to be in an endless loop');
        }
        if(this._config.checkLoopEnd && this._methodStack.length === 0) {
            clearTimeout(this._analyzerFinishedCheckTimeout);
            this._analyzerFinishedCheckTimeout = setTimeout(() => {
                this._handleStartEnd(_now);
            }, 100);
        }
    }
    private _getMouseDistance(point:IVector2D): number {
        return Math.sqrt(Math.pow(point.x - this._mousePosition.x, 2) + Math.pow(point.y - this._mousePosition.y, 2));
    }
    private _handleStartEnd(endTime:number){
        if(this._listener){
            this._listener(EAnalyzeReason.METHOD_END, {methodName: 'start', endTime, duration: endTime - this._analyzerStartedAt});
        }
    }
    private _positionInfoLabel(): HTMLCanvasElement {
        const buffer = domLib.createElement('canvas', {width: '100px', height: '140px'}) as HTMLCanvasElement;
        const ctx = buffer.getContext('2d')!;

        new Canvas2dDrawEngine()
            .setContext(ctx)
            .rectangle([0, 0, 100, 70], 'black', 'white')
            .rectangle([0, 70, 100, 70], 'black', 'red')
        ;

        this._positionInfoLabel = () => buffer;
        return buffer;
    }
    private _wrapParentMethods(): void {
        const parentPrototype = Object.getPrototypeOf(this);
        Object.keys(drawEngine2dMeta).map((methodName) => {
            const originalMethod = parentPrototype[methodName];
            const wrappedMethod = (...args: any[]) => {
                const startTime = performance.now();

                this.analyze(EAnalyzeReason.METHOD_START, {
                    arguments: args,
                    methodName,
                    startTime,
                });

                const result = originalMethod.apply(this, args);

                this.analyze(EAnalyzeReason.METHOD_END, {
                    arguments: args,
                    duration: performance.now() - startTime,
                    endTime: performance.now(),
                    methodName,
                });

                return result;
            };

            Object.defineProperty(this, methodName, {
                configurable: true,
                value: wrappedMethod,
                writable: true,
            });
        });
    }
}