import React from "react";
import ReactDOM from "react-dom";
import ReactComponent from "../Component/ReactComponent";
import IComponentstarterConfig from "../Interfaces/componentstarterConfig";
import IComponentRegisterEntry from "../Interfaces/IComponentRegisterEntry";
import IScriptElementInformations from "../Interfaces/IScriptElementInformations";
import IScriptElementValidationResult from "../Interfaces/IScriptElementValidationResult";
import IService from "../Interfaces/IService";
import { eComponentType, eDebugLevel } from "../lib/enums";
import ComponentBaseService from "./ComponentBaseService";

export default class ComponentStarter {
  public static DEFAULT_NAMESPACE: string = "general";

  private config: IComponentstarterConfig = {
    debugLevel: eDebugLevel.none,
    typeNeedle: "text/x-init"
  };

  private componentRegister: IComponentRegisterEntry[] = [];

  private servicePool: IService[] = [];

  /**
   *
   * @param domEntryPoint
   */
  public execute(domEntryPoint: HTMLElement = document.body): ComponentStarter {
    const self = this;
    this.getScriptsToEvaluate(domEntryPoint).map(
      self.renderComponent.bind(self)
    );
    return this;
  }

  public getAllServices(): IService[] {
    return this.servicePool;
  }

  public getDebugLevel(): eDebugLevel {
    return this.config.debugLevel;
  }

  public getService(serviceName: string): IService | undefined {
    return this.servicePool.find(
      (service: IService) => serviceName === service.getName()
    );
  }

  /**
   *
   * @param domEntryPoint
   */
  public getScriptsToEvaluate(
    domEntryPoint: HTMLElement = document.body
  ): HTMLScriptElement[] {
    const resultScriptElements: HTMLScriptElement[] = [];
    const searchElements: HTMLElement[] | any = domEntryPoint.querySelectorAll(
      "script[type='" + this.config.typeNeedle + "']"
    );
    // @ts-ignore
    searchElements.forEach((element: HTMLScriptElement) => {
      const checkResult = this.isScriptElementEvaluatable(element);
      if (checkResult.validationResult) {
        resultScriptElements.push(element);
      } else {
        this.debug(checkResult.validationResultMessage, element, "warn");
      }
    });
    return resultScriptElements;
  }

  public getTypeneedle(): string {
    return this.config.typeNeedle;
  }

  /**
   *
   * @param component
   * @param componentName
   * @param namespace
   */
  public registerComponent(
    component: any,
    componentName: string = "",
    namespace: string = ComponentStarter.DEFAULT_NAMESPACE
  ): ComponentStarter {
    if (component instanceof ComponentBaseService) {
      this.doRegisterService(component);
    } else {
      try {
        this.doRegisterComponent(
          new component({}),
          component,
          componentName,
          namespace
        );
      } catch (e:any) {
        if (1 < String(e).indexOf("not a constructor")) {
          throw Error("Unknown Type");
        }

        throw Error(e);
      }
    }

    return this;
  }

  /**
   *
   * @param newValue
   */
  public setDebugLevel(newValue: eDebugLevel): ComponentStarter {
    this.config.debugLevel = newValue;
    return this;
  }

  /**
   *
   * @param newValue
   */
  public setTypeNeedle(newValue: string): ComponentStarter {
    this.config.typeNeedle = newValue;
    return this;
  }

  /**
   *
   * @param message
   * @param additions
   * @param type
   */
  private debug(
    message: any,
    additions: any = null,
    type: string = "log"
  ): void {
    if (this.getDebugLevel() === eDebugLevel.debug) {
      // tslint:disable-next-line:no-eval
      eval(`console.${type}(message,additionals)`);
    } else {
      if ("error" === type) {
        throw Error(message);
      }
    }
  }

  private doRegisterComponent(
    componentInstance: ReactComponent | any,
    component: any,
    componentName: string,
    namespace: string
  ) {
    let type: eComponentType;
    let requiredServices: string[] = [];

    if (componentInstance instanceof ComponentBaseService) {
      throw Error(
        "Services needs to be initialized before they can add to the ComponentStarter"
      );
    }
    if (componentInstance instanceof ReactComponent) {
      componentName = componentInstance.getComponentname();
      namespace = componentInstance.getNamespace();
      type = eComponentType.managedReactComponent;
      requiredServices = componentInstance.getRequiredServices();
    } else {
      type =
        componentInstance instanceof React.Component
          ? eComponentType.reactComponent
          : eComponentType.function;
    }
    this.componentRegister.push({
      component,
      name: componentName,
      namespace,
      requiredServices,
      type
    });
  }

  private doRegisterService(newService: IService) {
    if (this.getService(newService.getName())) {
      throw Error(`Service ${newService.getName()} already exist`);
    }
    this.servicePool.push(newService);
  }

  /**
   *
   * @param componentName
   * @param namespace
   */
  private getRegisteredComponentEntry(
    componentName: string,
    namespace: string = ComponentStarter.DEFAULT_NAMESPACE
  ): IComponentRegisterEntry | undefined {
    return this.componentRegister.find((entry: IComponentRegisterEntry) => {
      return entry.name === componentName && entry.namespace === namespace;
    });
  }

  /**
   *
   * @param element
   */
  private getScriptElementInfos(
    element: HTMLScriptElement
  ): IScriptElementInformations {
    let props = {};
    try {
      if (element.innerText) {
        props = JSON.parse(element.innerText);
      }
    } catch (e) {
      this.debug(
        "Error while parsing componentsettings",
        { e, element },
        "warn"
      );
    }
    return {
      componentName: element.hasAttribute("component")
        ? element.getAttribute("component") || ""
        : "",
      componentNamespace: element.hasAttribute("namespace")
        ? element.getAttribute("namespace") ||
          ComponentStarter.DEFAULT_NAMESPACE
        : ComponentStarter.DEFAULT_NAMESPACE,
      componentProperties: props,
      element,
      isEnabled: !(
        element.hasAttribute("disabled") &&
        element.getAttribute("disabled") === "true"
      ),
      renderElement: element.hasAttribute("renderElement")
        ? document.getElementById(element.getAttribute("renderElement") || "")
        : null
    };
  }

  /**
   *
   * @param element
   */
  private isScriptElementEvaluatable(
    element: HTMLScriptElement
  ): IScriptElementValidationResult {
    const elementInfos: IScriptElementInformations = this.getScriptElementInfos(
      element
    );
    const result: IScriptElementValidationResult = {
      validationResult: true,
      validationResultMessage: ""
    };

    if (elementInfos.isEnabled) {
      if (
        !this.getRegisteredComponentEntry(
          elementInfos.componentName,
          elementInfos.componentNamespace
        )
      ) {
        result.validationResult = false;
        result.validationResultMessage = `Component ${elementInfos.componentNamespace}\\${elementInfos.componentName} doesnt exist`;
      }
    } else {
      result.validationResult = false;
      result.validationResultMessage = `Component is disabled`;
    }

    return result;
  }

  /**
   *
   * @param scriptElement
   */
  private renderComponent(scriptElement: HTMLScriptElement): void {
    const scriptinfos = this.getScriptElementInfos(scriptElement);
    const self = this;

    const componentEntry = this.getRegisteredComponentEntry(
      scriptinfos.componentName,
      scriptinfos.componentNamespace
    );
    const renderInScriptElement: boolean = scriptinfos.renderElement === null;

    if (componentEntry!.requiredServices.length > 0) {
      scriptinfos.componentProperties.services = {};
      componentEntry!.requiredServices.map((serviceName: string) => {
        const tmpService: IService | undefined = self.getService(serviceName);
        if (tmpService) {
          scriptinfos.componentProperties.services[serviceName] = tmpService;
        } else {
          self.debug(
            `Missing required service "${serviceName}" to render component "${
              componentEntry!.namespace
            }\\${componentEntry!.name}"`,
            { scriptinfos, componentEntry },
            "warn"
          );
        }
      });
    }

    if (
      eComponentType.reactComponent === componentEntry!.type ||
      eComponentType.managedReactComponent === componentEntry!.type
    ) {
      if (renderInScriptElement) {
        scriptinfos.renderElement = document.createElement("div");
      }
      ReactDOM.render(
        React.createElement(
          componentEntry!.component,
          scriptinfos.componentProperties
        ),
        scriptinfos.renderElement
      );
      if (renderInScriptElement) {
        try {
          const domEntryParent = scriptinfos!.element!.parentNode!;
          const newElement = scriptinfos!.renderElement!.firstChild!;
          domEntryParent.replaceChild(newElement, scriptinfos.element);
          const firstSibling = newElement.nextSibling;
          if (scriptinfos.renderElement!.childNodes!.length > 0) {
            while (scriptinfos.renderElement!.firstChild) {
              domEntryParent.insertBefore(
                scriptinfos.renderElement!.firstChild!,
                firstSibling
              );
            }
          }
        } catch (e) {
          this.debug(
            "Error while rendering component",
            {
              componentEntry,
              e,
              scriptinfos
            },
            "error"
          );
        }
      }
    } else if (componentEntry!.type === eComponentType.domElement) {
      if (renderInScriptElement) {
        scriptinfos.element.parentNode!.replaceChild(
          componentEntry!.component,
          scriptinfos.element
        );
      } else {
        scriptinfos.renderElement!.parentNode!.replaceChild(
          componentEntry!.component,
          scriptinfos.renderElement!
        );
      }
    } else {
      this.debug(`new Service ${componentEntry!.component.name}`);
      const newService = new componentEntry!.component(
        scriptinfos.componentProperties
      );
    }
  }
}
