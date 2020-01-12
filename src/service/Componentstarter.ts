import IComponentstarterConfig from "../Interfaces/componentstarterConfig";
import {eDebugLevel} from "../lib/enums";
import React from "react";
import ReactDOM from "react-dom"

export default new class Componentstarter {
    private config:IComponentstarterConfig={
        debugLevel: eDebugLevel.none,
        typeNeedle: 'text/x-init'
    };
    public execute(domEntryPoint:HTMLElement=document.body):void {
        this.getScriptsToEvaluate(domEntryPoint).forEach((script)=>{
            console.log('ELEMENT',script);
        });
    }

    public getDebugLevel():eDebugLevel {
        return this.config.debugLevel;
    }
    public getScriptsToEvaluate(domEntryPoint:HTMLElement):NodeListOf<Element> {
        return domEntryPoint.querySelectorAll("script[type='"+this.config.typeNeedle+"']");
    }

    public getTypeneedle():string {
        return this.config.typeNeedle;
    }
    public setDebugLevel(newValue:eDebugLevel):Componentstarter {
        this.config.debugLevel = newValue;
        return this;
    }
    public setTypeneedle(newValue:string):Componentstarter {
        this.config.typeNeedle = newValue;
        return this;
    }
}