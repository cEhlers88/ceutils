/**
 * Library Dialog
 * Created 21.03.22
 *
 * @author Christoph Ehlers <ce@construktiv.de> | Construktiv GmbH
 */
import {createElement} from "./dom";
import {IDialog} from "../Interfaces/IDialog";

export default abstract class Dialog implements IDialog{
    name:string;

    constructor() {
        this.name = '';
    }

    getAcceptations():[]{
        return [];
    }

    getDefaultProviderOptions(){
        return {
            abortAble: false
        }
    }

    getName(){
        return this.name;
    }

    onRendered(element:HTMLElement){}

    validate(){
        return {
            hadError: false,
            errorMessage: '',
            reOpen: false
        }
    }

    render(props: any): HTMLElement {
        return createElement('div');
    }

    reset(): void {
    }
}
