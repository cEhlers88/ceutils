/**
 * Library Dialog
 * Created 21.03.22
 *
 * @author Christoph Ehlers <ce@construktiv.de> | Construktiv GmbH
 */
import {IDialog} from "../Interfaces/IDialog";
import {createElement} from "./dom";

export default abstract class Dialog implements IDialog{
    protected name:string;

    constructor() {
        this.name = '';
    }

    public getAcceptations():[]{
        return [];
    }

    public getDefaultProviderOptions(){
        return {
            abortAble: false
        }
    }

    public getName(){
        return this.name;
    }

    public validate(){
        return {
            errorMessage: '',
            hadError: false,
            reOpen: false
        }
    }

    public abstract render(props: any): HTMLElement ;
    public abstract reset():void;
    public abstract onRendered(element:HTMLElement):void;
}
