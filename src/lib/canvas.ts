/**
 *  Library for Canvas2D drawing
 *  Created 01.10.24
 *
 *  @author Christoph Ehlers <Webmaster@c-ehlers.de>
 */
import CanvasEngineAnalyzer from "../Analyzer/CanvasEngineAnalyzer";
import Canvas2dDrawEngine from "../Engine/Canvas2dDrawEngine";
import { IDrawEngine } from "../Interfaces/IDrawEngine";
import { drawEngine2dMeta } from "./drawEngine2dMeta";
const getDrawEngine = (
  canvas: HTMLCanvasElement,
  global: boolean = false
): IDrawEngine => {
  let engine: IDrawEngine;
  if (global) {
    if (!window.__CE_CANVAS_DRAW_2D_ENGINE__) {
      window.__CE_CANVAS_DRAW_2D_ENGINE__ = new Canvas2dDrawEngine();
    }
    engine = window.__CE_CANVAS_DRAW_2D_ENGINE__;
  } else {
    engine = new Canvas2dDrawEngine();
  }

  return engine.setContext(canvas.getContext("2d")!);
};
const getDrawEngineAnalyzed = (
  canvas: HTMLCanvasElement,
  global: any = undefined
): CanvasEngineAnalyzer => {
  return new CanvasEngineAnalyzer(canvas);
};
export default {
  DrawEngine2D: Canvas2dDrawEngine,
  drawEngine2dMeta,
  getDrawEngine,
  getDrawEngineAnalyzed
};
