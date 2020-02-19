export default interface IScriptElementInformations {
    element:HTMLScriptElement;
    isEnabled:boolean;
    componentName:string;
    componentNamespace:string;
    componentProperties:any;
    renderElement:HTMLElement|null;
}