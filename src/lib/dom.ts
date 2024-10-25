import {ICreateElementProperties} from "../Interfaces/ICreateElementProperties";
import {IMagicProperties} from "../Interfaces/IMagicProperties";

const config: {
    magicProperties: IMagicProperties & {
        [name: string]: any;
    };
} = {
    magicProperties: {
        childNodes: (
            targetElement: HTMLElement,
            children: HTMLElement[] | SVGSVGElement[] | Text[]
        ) => {
            domFunctions.appendChilds(targetElement, children);
        },
        data: (targetElement: HTMLElement, value: { [name: string]: string }) => {
            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    targetElement.dataset[key] = value[key];
                }
            }
        },
        innerText: (targetElement: HTMLElement, value: string) => {
            targetElement.appendChild(document.createTextNode(value));
        }
    }
};

const domFunctions = {
    appendChilds: (
        targetElement: HTMLElement,
        childs: HTMLElement | SVGSVGElement | Text | HTMLElement[] | SVGSVGElement[] | Text[]
    ): HTMLElement => {
        if (Array.isArray(childs)) {
            childs.map((childElement: HTMLElement | SVGSVGElement | Text, index: number) => {
                domFunctions.appendChilds(targetElement, childElement);
            });
        } else {
            if (childs instanceof HTMLElement || childs instanceof SVGSVGElement || childs instanceof Text) {
                targetElement.appendChild(childs);
            }
        }
        return targetElement;
    },
    createElement: (
        tagname: string,
        properties?: ICreateElementProperties
    ): HTMLElement => {
        const resultElement = document.createElement(tagname);
        if (properties) {
            for (const name in properties) {
                if (config.magicProperties.hasOwnProperty(name)) {
                    // @ts-ignore
                    config.magicProperties[name](resultElement, properties[name]);
                } else {
                    resultElement.setAttribute(name, properties[name]);
                }
            }
        }

        return resultElement;
    },
    getElement: (
        elementNeedle: string
    ):
        Element
        | HTMLElement
        | HTMLCollectionOf<Element>
        | NodeListOf<Element>
        | null => {
        switch (elementNeedle.charAt(0)) {
            case ".":
                return document.getElementsByClassName(elementNeedle.substr(1));
                break;
            case "#":
                return domFunctions.getElement(elementNeedle.substr(1));
                break;
            case "?":
                switch (elementNeedle.charAt(1)) {
                    case "*":
                        return document.querySelectorAll(elementNeedle.substr(2));
                        break;
                    default:
                        return document.querySelector(elementNeedle.substr(1));
                        break;
                }
                break;
            default:
                return document.getElementById(elementNeedle);
                break;
        }
    },
    removeAllChilds: (targetElement: HTMLElement): HTMLElement => {
        while (targetElement.firstChild) {
            targetElement.removeChild(targetElement.firstChild);
        }
        return targetElement;
    }
};

[
    {propName: "onBlur", jsName: "blur"},
    {propName: "onChange", jsName: "change"},
    {propName: "onClick", jsName: "click"},
    {propName: "onDragStart", jsName: "dragstart"},
    {propName: "onDragEnd", jsName: "dragend"},
    {propName: "onDragOver", jsName: "dragover"},
    {propName: "onDragEnter", jsName: "dragenter"},
    {propName: "onDragLeave", jsName: "dragleave"},
    {propName: "onDrop", jsName: "drop"},
    {propName: "onFocus", jsName: "focus"},
    {propName: "onKeyDown", jsName: "keydown"},
    {propName: "onKeyUp", jsName: "keyup"},
    {propName: "onSubmit", jsName: "submit"},
    {propName: "onMouseOver", jsName: "mouseover"},
    {propName: "onMouseOut", jsName: "mouseout"},
    {propName: "onMouseDown", jsName: "mousedown"},
    {propName: "onMouseUp", jsName: "mouseup"},
    {propName: "onMouseEnter", jsName: "mouseenter"},
    {propName: "onMouseLeave", jsName: "mouseleave"},
    {propName: "onMouseMove", jsName: "mousemove"},
    {propName: "onLoad", jsName: "load"}
].map((def: { propName: string; jsName: string }) => {
    config.magicProperties[def.propName] = (
        targetElement: HTMLElement,
        listener: any
    ) => {
        targetElement.addEventListener(def.jsName, listener);
    };
});
const _extendHtmlElementPrototype = () => {
    HTMLElement.prototype.appendChilds = function (childs){
        return domFunctions.appendChilds(this, childs);
    };
    HTMLElement.prototype.createChild = function (tagName, properties={}): HTMLElement {
        return this.appendChild(createElement(tagName, properties));
    };
    HTMLElement.prototype.getParentByCondition = function (condition){
        return getParentByCondition(this, condition);
    }
    HTMLElement.prototype.getParentWithClass = function (
        className: string
    ): HTMLElement | undefined {
        return getParentWithClass(this, className);
    };
    HTMLElement.prototype.removeAllChilds = function (): HTMLElement {
        return domFunctions.removeAllChilds(this);
    };
}
const getParentByCondition = (element: HTMLElement, condition: (parent: HTMLElement) => boolean): HTMLElement | undefined => {
    while (element.parentNode) {
        if (condition(element.parentNode as HTMLElement)) {
            return (element.parentNode as HTMLElement);
        }
        element = (element.parentNode as HTMLElement);
    }
    return undefined;
}
const getParentWithClass = (element: HTMLElement | any, className: string): HTMLElement | undefined => {
    return getParentByCondition(element, (parent: HTMLElement) => {
        return parent.classList && parent.classList.contains(className);
    });
};

_extendHtmlElementPrototype();

export default {
    appendChilds: domFunctions.appendChilds,
    createElement: domFunctions.createElement,
    getElement: domFunctions.getElement,
    getParentWithClass,
    removeAllChilds: domFunctions.removeAllChilds,
};

export const createElement = domFunctions.createElement;
export const getElement = domFunctions.getElement;
