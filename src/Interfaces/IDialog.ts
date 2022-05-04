/**
 * Interface IDialog
 * Created 21.03.22
 *
 * @author Christoph Ehlers <ce@construktiv.de> | Construktiv GmbH
 */
export interface IDialog {
    reset:()=>void,
    getAcceptations:()=>[],
    getDefaultProviderOptions:()=> {
        abortAble: boolean
    },
    getName:()=>string,
    onRendered:(element:HTMLElement)=>void,
    render:(props:any)=>HTMLElement,
    updateProps:(newProps:any)=>void,
    validate:()=>{
        hadError: boolean,
        errorMessage: string,
        reOpen: boolean
    }
}
