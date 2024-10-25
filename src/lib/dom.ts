import {ICreateElementProperties} from "../Interfaces/ICreateElementProperties";
import {IMagicProperties} from "../Interfaces/IMagicProperties";

const lib = (()=>{
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
                _appendChildren(targetElement, children);
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
    const _extendHtmlElementPrototype = () => {
        /**
         * Append multiple children to the current element
         * @param children
         */
        HTMLElement.prototype.appendChilds = function (children){
            return _appendChildren(this, children);
        };
        /**
         * Create a new element and append it to the current element
         * @param tagName
         * @param properties
         */
        HTMLElement.prototype.createChild = function (tagName:keyof HTMLElementTagNameMap | string, properties={}): HTMLElement {
            return this.appendChild(createElement(tagName, properties));
        };
        /**
         * Get parent element by a condition
         * @param condition
         */
        HTMLElement.prototype.getParentByCondition = function (condition:(parent:HTMLElement)=>boolean): HTMLElement | undefined {
            return _getParentByCondition(this, condition);
        }
        /**
         * Get parent element with a specific class
         * @param className
         */
        HTMLElement.prototype.getParentWithClass = function (
            className: string
        ): HTMLElement | undefined {
            return _getParentWithClass(this, className);
        };
        /**
         * Remove all child elements from current element
         */
        HTMLElement.prototype.removeAllChilds = function (): HTMLElement {
            return _removeAllChilds(this);
        };
    }

    /**
     * Append multiple children to a parent element
     * @param targetElement The parent element
     * @param childs The children to append
     */
    const _appendChildren = (
        targetElement: HTMLElement,
        childs: HTMLElement | SVGSVGElement | Text | HTMLElement[] | SVGSVGElement[] | Text[]
    ): HTMLElement => {
        if (Array.isArray(childs)) {
            childs.map((childElement: HTMLElement | SVGSVGElement | Text, index: number) => {
                _appendChildren(targetElement, childElement);
            });
        } else {
            if (childs instanceof HTMLElement || childs instanceof SVGSVGElement || childs instanceof Text) {
                targetElement.appendChild(childs);
            }
        }
        return targetElement;
    };

    /**
     * Create a new element
     * @param tagName The tag name of the element
     * @param properties The properties of the element
     */
    const _createElement = (
        tagName: keyof HTMLElementTagNameMap | string,
        properties?: ICreateElementProperties
    ): HTMLElement => {
        const resultElement = document.createElement(tagName);
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
    };

    /**
     * Get an element by id, class or querySelector
     * @param elementNeedle The id, class or querySelector of the element to get
     */
    const _getElement = (
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
                return _getElement(elementNeedle.substr(1));
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
    };

    /**
     * Get a parent element by a condition
     * @param element The element to start from
     * @param condition The condition to check
     */
    const _getParentByCondition = (element: HTMLElement, condition: (parent: HTMLElement) => boolean): HTMLElement | undefined => {
        while (element.parentNode) {
            if (condition(element.parentNode as HTMLElement)) {
                return (element.parentNode as HTMLElement);
            }
            element = (element.parentNode as HTMLElement);
        }
        return undefined;
    }

    /**
     * Get a parent element with a specific class
     * @param element The element to start from
     * @param className The class to search for
     */
    const _getParentWithClass = (element: HTMLElement | any, className: string): HTMLElement | undefined => {
        return _getParentByCondition(element, (parent: HTMLElement) => {
            return parent.classList && parent.classList.contains(className);
        });
    };

    /**
     * Remove all child elements from a parent element
     * @param targetElement The parent element
     * @returns {HTMLElement}
     */
    const _removeAllChilds = (targetElement: HTMLElement): HTMLElement => {
        while (targetElement.firstChild) {
            targetElement.removeChild(targetElement.firstChild);
        }
        return targetElement;
    };

    _extendHtmlElementPrototype();

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

    return {
        appendChilds: _appendChildren,
        createElement: _createElement,
        getElement: _getElement,
        getParentByCondition: _getParentByCondition,
        getParentWithClass: _getParentWithClass,
        removeAllChilds: _removeAllChilds
    };
})();

export default lib;
export const createElement = lib.createElement;
export const getElement = lib.getElement;
