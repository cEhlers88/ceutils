export interface IHtmlElementExtensions {
    appendChilds: (childs: HTMLElement | HTMLElement[] | SVGSVGElement | SVGSVGElement[]) => HTMLElement;
    createChild: (tagName: string, properties?: any) => HTMLElement;
    getParentByCondition: (condition: (element: HTMLElement) => boolean) => HTMLElement | undefined;
    getParentWithClass: (className: string) => HTMLElement | undefined;
    removeAllChilds: () => HTMLElement;
}