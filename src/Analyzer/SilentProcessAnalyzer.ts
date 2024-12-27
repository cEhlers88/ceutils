import IProcessAnalyzer from "../Interfaces/IProcessAnalyzer";

export default class SilentProcessAnalyzer implements IProcessAnalyzer {
    public handle(reason: string, props: any) {
        return;
    }
}