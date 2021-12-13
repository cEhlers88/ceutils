import {ICreateElementProperties} from "../Interfaces/ICreateElementProperties";

const config:{
  magicProperties: {
    childNodes:(targetElement:HTMLElement, children:HTMLElement[])=>void,
    innerText:(targetElement:HTMLElement, value:string)=>void,
    onClick?:(targetElement:HTMLElement, listener:CallableFunction)=>void,
    onKeyDown?:(targetElement:HTMLElement, listener:CallableFunction)=>void,
    onKeyUp?:(targetElement:HTMLElement, listener:CallableFunction)=>void,
    onSubmit?:(targetElement:HTMLElement, listener:CallableFunction)=>void,
    [name:string]:any
  }
} = {
  magicProperties: {
    childNodes: (targetElement: HTMLElement, children: HTMLElement[]) => {
      appendChilds(targetElement, children);
    },
    innerText: (targetElement: HTMLElement, value: string) => {
      targetElement.appendChild(document.createTextNode(value));
    }
  }
};

[
  {propName:'onClick',jsName:'click'},
  {propName:'onKeyDown',jsName:'keyDown'},
  {propName:'onKeyUp',jsName:'keyUp'},
  {propName:'onSubmit',jsName:'submit'},
].map((def:{propName:string,jsName:string})=>{
  config.magicProperties[def.propName] = (targetElement:HTMLElement, listener:any) => {
    targetElement.addEventListener(def.jsName,listener);
  }
});

const appendChilds = (targetElement: HTMLElement, childs: HTMLElement|HTMLElement[]):HTMLElement => {
  if (Array.isArray(childs)) {
    childs.map((childElement: HTMLElement, index: number) => {
      appendChilds(targetElement, childElement);
    });
  } else {
    if(childs instanceof HTMLElement){
      targetElement.appendChild(childs);
    }
  }
  return targetElement;
};

const createElement = (tagname: string, properties?: ICreateElementProperties):HTMLElement => {
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
};

const getElement = (elementNeedle: string):
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
      return getElement(elementNeedle.substr(1));
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

const removeAllChilds = (targetElement: HTMLElement):HTMLElement => {
  while (targetElement.firstChild) {
    targetElement.removeChild(targetElement.firstChild);
  }
  return targetElement;
};

// @ts-ignore
HTMLElement.prototype.appendChilds = function(childs: HTMLElement|HTMLElement[]):HTMLElement {
  return appendChilds(this,childs);
}
// @ts-ignore
HTMLElement.prototype.createChild = function(tagName:string, properties?: any):HTMLElement{
  return appendChilds(this,createElement(tagName,properties));
}
// @ts-ignore
HTMLElement.prototype.removeAllChilds = function():HTMLElement{
  return removeAllChilds(this);
}

export default {
  appendChilds,
  createElement,
  getElement,
  removeAllChilds
};
