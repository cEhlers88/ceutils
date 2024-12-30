import Canvas2dDrawEngine from "../Engine/Canvas2dDrawEngine";
import {EAnalyzeReason} from "../enum/EAnalyzeReason";
import IVector2D from "../Interfaces/IVector2D";
import {drawEngine2dMeta} from "../lib/drawEngine2dMeta";

export default class CanvasEngineAnalyzer extends Canvas2dDrawEngine {
    private _activeDebugPointer: boolean = false;
    private _analyzerStartedAt: number = -1;
    private _analyzerFinishedCheckTimeout: NodeJS.Timeout | undefined;
    private _config: {
        analyzingDepth: number;
        checkForEndlessLoop: boolean;
        checkForStartTrigger: boolean;
        checkLoopEnd: boolean;
        useOnlyDebugPointer: boolean;
    } = {
        analyzingDepth: 0,
        checkForEndlessLoop: true,
        checkForStartTrigger: true,
        checkLoopEnd: true,
        useOnlyDebugPointer: true
    };
    private _detailPointers: number[][] = [];
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
    constructor(canvas: HTMLCanvasElement, listener?: (reason: EAnalyzeReason, props: {}) => void) {
        super();
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
        const additionalInfos: {
            depth: number
        } = {
            depth: -1
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
                    _ignore = !((this._config.analyzingDepth < 0 || additionalInfos.depth <= this._config.analyzingDepth) &&
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
                    _ignore = !((this._config.analyzingDepth < 0 || additionalInfos.depth <= this._config.analyzingDepth) &&
                        (!this._config.useOnlyDebugPointer || this._activeDebugPointer)
                    );
                }else{
                    _ignore = !this._config.useOnlyDebugPointer;
                }
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
    public start(): CanvasEngineAnalyzer {
        super.start();
        this._analyzerStartedAt = performance.now();
        return this;
    }
    public startDebug(): CanvasEngineAnalyzer {
        this._activeDebugPointer = true;
        return this;
    }
    public stopDebug(): CanvasEngineAnalyzer {
        this._activeDebugPointer = false;
        return this;
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
                if(this._listener){
                    this._listener(EAnalyzeReason.METHOD_END, {methodName: 'start', endTime: _now, duration: _now - this._analyzerStartedAt});
                }
            }, 100);
        }
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