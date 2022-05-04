/**
 * Library DialogProvider
 * Created 21.03.22
 *
 * @author Christoph Ehlers <ce@construktiv.de> | Construktiv GmbH
 */
import Eventhandler from "../handler/Eventhandler";
import Dialog from "../lib/Dialog";
import {createElement} from "../lib/dom";
/* tslint:disable */
declare global {
    interface Window {
        _ceDialogStore: {
            name: string,
            dialog: Dialog
        }[]
    }
};
/* tslint:enable */
const providerProps:{
    defaultDialog: string,
    keepDomClear: boolean,
    nodeCreated: boolean,
    rootNode: HTMLElement | null,
    textAbort: string,
    textAccept: string,
    textError: string,
} = {
    defaultDialog: 'simple_request',
    keepDomClear:true,
    nodeCreated: false,
    rootNode: null,
    textAbort: 'Abort',
    textAccept: 'OK',
    textError: 'Error',
};

const eventName = {
    dialogAdded: 'dialogAdded',
    dialogClosed: 'dialogClosed', // not implemented
    dialogOpened: 'dialogOpened', // not implemented
};

const domInteraction:{
    createRootNode:CallableFunction,
    disableRootNode:CallableFunction,
    getRootNode:()=>HTMLElement
} = {
    createRootNode: () => {
        providerProps.rootNode = createElement('div',{class:'dialog-provider'});
        document.body.appendChild(providerProps.rootNode);
        providerProps.nodeCreated = true;
    },
    disableRootNode: () => {
        if(providerProps.rootNode){
            if(providerProps.keepDomClear){
                document.body.removeChild(providerProps.rootNode);
                providerProps.nodeCreated = false;
            }else{
                providerProps.rootNode.setAttribute('class','dialog-provider');
                // @ts-ignore
                providerProps.rootNode.removeAllChilds();
            }
        }

        document.getElementById('wpwrap')?.setAttribute('style','');
    },
    // @ts-ignore
    getRootNode: () => {
        if(!providerProps.nodeCreated){
            domInteraction.createRootNode();
        }

        return providerProps.rootNode;
    }
};

const renderDialogFooter = (props:{
    abortAble:boolean,
    onAccept:CallableFunction,
    additionalButtons:[]
}) => {
    const element = createElement('div',{class:'dialog-footer'});
    const buttons = [{class:'button--accept', onClick:()=>{
            props.onAccept();
            domInteraction.disableRootNode();
        },text:providerProps.textAccept}]

    if(props.abortAble){
        buttons.push({class:'button--abort', onClick:()=>{
                domInteraction.disableRootNode();
            },text:providerProps.textAbort});
    }

    [...buttons,...props.additionalButtons].map(buttonDef=>{
        element.appendChild(createElement('button',{
            class:'button '+buttonDef.class??'',
            innerText:buttonDef.text,
            onClick:buttonDef.onClick
        }));
    });

    return element;
};

export default new class DialogProvider extends Eventhandler {

    constructor() {
        super();

        if(!window._ceDialogStore){window._ceDialogStore = [];}
    }

    public conditionalOpen(condition:CallableFunction|boolean, name:string, dialogProperties:any={}, providerOptions:any=null){
        if(condition instanceof Function){
            condition = condition();
        }
        if(condition){
            window._ceDialogStore.map(storedDialog=>{
                if(providerOptions && storedDialog.name.toLowerCase() === name.toLowerCase()){
                    const _onAccept = providerOptions.onAccept ? providerOptions.onAccept : ()=>null;
                    _onAccept(storedDialog.dialog.getAcceptations());
                    storedDialog.dialog.reset();
                }
            });
        }else{
            this.open(name, dialogProperties, providerOptions);
        }
    }

    public open(name:string, dialogProperties:any={}, providerOptions:any= {}){
        let found = false;

        window._ceDialogStore.map(storedDialog=>{
            if(!found && storedDialog.name.toLowerCase() === name.toLowerCase()){
                found = true;
                const _onAccept = providerOptions.onAccept ? providerOptions.onAccept : ()=>null;
                const _providerOptions = {
                    ...(storedDialog.dialog.getDefaultProviderOptions && typeof storedDialog.dialog.getDefaultProviderOptions ===  'function' ?
                        storedDialog.dialog.getDefaultProviderOptions() : {}),
                    ...providerOptions,
                    onAccept:()=>{
                        const validation = storedDialog.dialog.validate();

                        if(!validation.hadError){
                            _onAccept(storedDialog.dialog.getAcceptations());
                        }else{
                            setTimeout(()=>{
                                this.open(providerOptions.defaultDialog,{
                                    text: validation.errorMessage,
                                    title: _providerOptions.textError,
                                },{
                                    onAccept: ()=>{
                                        if(validation.reOpen) {
                                            setTimeout(() => {
                                                this.open(storedDialog.dialog.getName(),dialogProperties, providerOptions);
                                            }, 50);
                                        }
                                    }
                                });
                            },50);
                        }
                        storedDialog.dialog.reset();
                        return validation;
                    }
                };
                providerOptions = _providerOptions;

                const dialog = document.createElement('div');
                dialog.setAttribute('class','dialog dialog--'+name.toLowerCase());

                const renderDialog = (props:any) =>{
                    const renderedDialogContent = storedDialog.dialog.render(props);
                    dialog.removeAllChilds();
                    domInteraction.getRootNode().removeAllChilds();

                    dialog.appendChilds([
                        createElement('div',{class:'dialog-header'}),
                        createElement('div',{class:'dialog-content'}),
                        renderDialogFooter({
                            ...providerOptions,
                            additionalButtons: storedDialog.dialog.getAdditionalFooterButtons()
                        })
                    ]);

                    if(providerOptions.title){
                        dialog.childNodes[0].appendChild(document.createTextNode(providerOptions.title));
                    }

                    dialog.childNodes[1].appendChild(renderedDialogContent);
                    domInteraction.getRootNode().appendChild(dialog);
                    storedDialog.dialog.onRendered(renderedDialogContent);
                }

                storedDialog.dialog.on('propsUpdated',renderDialog);
                renderDialog(dialogProperties);
            }
        });
        return this;
    }

    public register(dialog:Dialog, name:string=''){
        if(name===''){name=dialog.getName();}
        let found = false;
        window._ceDialogStore.map(def=>{
            if(def.name.toLowerCase() === name.toLowerCase()){
                found = true;
            }
        });

        if(!found){
            window._ceDialogStore.push({name,dialog});
        }

        this.dispatch(eventName.dialogAdded,{name, dialog});
        return this;
    }

}
