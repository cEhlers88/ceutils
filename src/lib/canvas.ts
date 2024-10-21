/**
 *  Library for drawing on canvas
 *  Created 01.10.24
 *
 *  @author Christoph Ehlers
 */
import Canvas2dDrawEngine from "../Engine/Canvas2dDrawEngine";
import {IDrawEngine} from "../Interfaces/IDrawEngine";

export default {
    DrawEngine2D: Canvas2dDrawEngine,
    getDrawEngine: (canvas: HTMLCanvasElement): IDrawEngine => {
        return (new Canvas2dDrawEngine()).setContext(canvas.getContext('2d')!);
    }
};