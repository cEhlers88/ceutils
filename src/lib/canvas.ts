/**
 *  Library for Canvas2D drawing
 *  Created 01.10.24
 *
 *  @author Christoph Ehlers <Webmaster@c-ehlers.de>
 */
import CanvasEngineAnalyzer from "../Analyzer/CanvasEngineAnalyzer";
import Canvas2dDrawEngine from "../Engine/Canvas2dDrawEngine";
import {IDrawEngine} from "../Interfaces/IDrawEngine";
import { drawEngine2dMeta } from "./drawEngine2dMeta";
import Canvas3dDrawEngine from "../Engine/Canvas3dDrawEngine";

const exportObj:{
    [name:string]: any
} = {
    DrawEngine2D: Canvas2dDrawEngine,
    drawEngine2dMeta,
    getDrawEngineAnalyzed: (canvas: HTMLCanvasElement, global: any = undefined):CanvasEngineAnalyzer => {
        return new CanvasEngineAnalyzer(canvas);
    }
};

[
    {name: 'DrawEngine', class: Canvas2dDrawEngine, contextType: '2d'},
    {name: 'DrawEngine3d', class: Canvas3dDrawEngine, contextType: 'webgl'}
].map((item)=>{
    exportObj['get'+item.name] = (canvas: HTMLCanvasElement|undefined=undefined, global:boolean = false): IDrawEngine => {
        let engine:IDrawEngine;
        if(global) {
            if(!window['__CE_CANVAS_' + item.name + '__']) {
                window['__CE_CANVAS_' + item.name + '__'] = new item.class();
            }
            engine = window['__CE_CANVAS_' + item.name + '__'];
        }else{
            engine = (new item.class() as IDrawEngine);
        }
        if(canvas) {
            engine.setContext(canvas.getContext(item.contextType)!);
        }
        return engine;
    }
});

export default exportObj;