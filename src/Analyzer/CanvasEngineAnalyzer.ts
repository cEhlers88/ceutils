import IProcessAnalyzer from "../Interfaces/IProcessAnalyzer";

export default class CanvasEngineAnalyzer implements IProcessAnalyzer {
    private _startTimeoutRootMethod:number = 0;

    public handle(reason: string, props: {
        methodName: string;
    }) {
        return;
    }
}