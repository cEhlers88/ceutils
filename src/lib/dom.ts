const config = {
  magicProperties: {
    childNodes: (targetElement: HTMLElement, childs: HTMLElement[]) => {
      appendChilds(targetElement, childs);
    },
    innertText: (targetElement: HTMLElement, value: string) => {
      targetElement.appendChild(document.createTextNode(value));
    }
  }
};
const appendChilds = (targetElement: HTMLElement, childs: HTMLElement[]) => {
  if (Array.isArray(childs)) {
    childs.map((childElement: HTMLElement, index: number) => {
      targetElement.appendChild(childElement);
    });
  } else {
    targetElement.appendChild(childs);
  }
  return targetElement;
};
const createElement = (tagname: string, properties?: any) => {
  const resultElement = document.createElement(tagname);

  if (properties) {
    /*for(const name in properties){
            const magicProperty: any = config.magicProperties[name];
            if(config.magicProperties.hasOwnProperty(name)){
                magicProperty(resultElement,properties[name]);
            }else{
                resultElement.setAttribute(name, properties[name]);
            }
        }*/
  }

  return resultElement;
};
const getElement = (elementNeedle: string) => {
  switch (elementNeedle.charAt(0)) {
    case ".":
      return document.getElementsByClassName(elementNeedle.substr(1));
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
const removeAllChilds = (targetElement: HTMLElement) => {
  while (targetElement.firstChild) {
    targetElement.removeChild(targetElement.firstChild);
  }
};

export default {
  appendChilds,
  createElement,
  getElement,
  removeAllChilds
};
