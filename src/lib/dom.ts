import {ICreateElementProperties} from "../Interfaces/ICreateElementProperties";
import {IMagicProperties} from "../Interfaces/IMagicProperties";
/* tslint:disable */
declare global {
  interface HTMLElement {
    appendChilds: CallableFunction,
    createChild: CallableFunction,
    getParentWithClass: CallableFunction,
    removeAllChilds: CallableFunction,
  }
}
/* tslint:enable */

const config:{
  magicProperties: IMagicProperties & {
    [name:string]:any
  }
} = {
  magicProperties: {
    childNodes: (targetElement: HTMLElement, children: HTMLElement[]|Text[]) => {
      functions.appendChilds(targetElement, children);
    },
    data: (targetElement: HTMLElement, value: {[name:string]:string}) => {
      for(const key in value){
        if(value.hasOwnProperty(key)){
          targetElement.dataset[key] = value[key];
        }
      }
    },
    innerText: (targetElement: HTMLElement, value: string) => {
      targetElement.appendChild(document.createTextNode(value));
    }
  }
};

const functions = {
  appendChilds: (targetElement: HTMLElement, childs: HTMLElement|Text|HTMLElement[]|Text[]):HTMLElement => {
    if (Array.isArray(childs)) {
      childs.map((childElement: HTMLElement|Text, index: number) => {
        functions.appendChilds(targetElement, childElement);
      });
    } else {
      if(childs instanceof HTMLElement || childs instanceof Text){
        targetElement.appendChild(childs);
      }
    }
    return targetElement;
  },
  createElement: (tagname: string, properties?: ICreateElementProperties):HTMLElement => {
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
  getElement: (elementNeedle: string):
      Element|
      HTMLElement|
      HTMLCollectionOf<Element>|
      NodeListOf<Element>|
      null => {
    switch (elementNeedle.charAt(0)) {
      case ".":
        return document.getElementsByClassName(elementNeedle.substr(1));
        break;
      case "#":
        return functions.getElement(elementNeedle.substr(1));
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
  }
};

[
  {propName:'onBlur',jsName:'blur'},
  {propName:'onChange',jsName:'change'},
  {propName:'onClick',jsName:'click'},
  {propName:'onFocus',jsName:'focus'},
  {propName:'onKeyDown',jsName:'keydown'},
  {propName:'onKeyUp',jsName:'keyup'},
  {propName:'onSubmit',jsName:'submit'},
].map((def:{propName:string,jsName:string})=>{
  config.magicProperties[def.propName] = (targetElement:HTMLElement, listener:any) => {
    targetElement.addEventListener(def.jsName,listener);
  }
});

const getParentWithClass= ( element:HTMLElement|any, className:string ) => {
  while (element.parentNode){
    if(element.parentNode.classList && element.parentNode.classList.contains(className)){
      return element.parentNode;
    }
    element = element.parentNode;
  }
  return false;
}

const removeAllChilds = (targetElement: HTMLElement):HTMLElement => {
  while (targetElement.firstChild) {
    targetElement.removeChild(targetElement.firstChild);
  }
  return targetElement;
};

HTMLElement.prototype.appendChilds = function(childs: HTMLElement|HTMLElement[]):HTMLElement {
  return functions.appendChilds(this,childs);
}
HTMLElement.prototype.createChild = function(tagName:string, properties?: any):HTMLElement{
  return functions.appendChilds(this,createElement(tagName,properties));
}
HTMLElement.prototype.getParentWithClass = function(className:string):HTMLElement{
  return getParentWithClass(this,className);
}
HTMLElement.prototype.removeAllChilds = function():HTMLElement{
  return removeAllChilds(this);
}

export default {
  appendChilds:functions.appendChilds,
  createElement: functions.createElement,
  getElement: functions.getElement,
  getParentWithClass,
  removeAllChilds
};

export const createElement = functions.createElement;
export const getElement = functions.getElement;
