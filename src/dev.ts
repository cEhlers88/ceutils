/**
 *
 */
import './dev.scss';
import * as ceutils from './index';
import {IDrawEngine} from "./Interfaces/IDrawEngine";
import dom from "./lib/dom";

(window as any).ceutils = {
    ...ceutils,
    buildExampleContainer:(props:{
        drawEngine: IDrawEngine,
        title: string,
    })=>{
        const _canvas = dom.createElement('canvas',{
            height: 300,
            style: 'background-color: #f0f000; margin: 10px;',
            width: 300
        }) as HTMLCanvasElement;
        const _currentPropsElement = dom.createElement('p');
        const _container = dom.createElement('div', {
                childNodes: [
                    dom.createElement('h2', { innerText: props.title }),
                    _currentPropsElement,
                    _canvas,
                ],
                class: 'example-container',
            });

        const _resultObject = {
            canvas: _canvas,
            container: _container,
            context: _canvas.getContext('2d')!,
            currentProps: props,
        }

        return new Proxy(_resultObject, {
            get: (target, prop, receiver) =>{
                return Reflect.get(target, prop, receiver);
            },
            set: (target, prop, value, receiver) =>{
                if(prop === 'currentProps') {
                    const _stringified = JSON.stringify(value);
                    _currentPropsElement.innerText = _stringified.substring(1, _stringified.length-1);
                }
                return Reflect.set(target, prop, value, receiver);
            }
        });
    }
};