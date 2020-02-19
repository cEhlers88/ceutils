import React from "react";
import IComponentService from "../Interfaces/componentService";

export default abstract class extends React.Component{
    protected constructor(props:any) {
        super(props);
    }

    public abstract getComponentname():string
    public abstract getNamespace():string

    // tslint:disable-next-line:no-empty
    public bindService(service:IComponentService):void{}

    public componentDidMount(): void {
        const self = this;
        this.getRequiredServices().map(servicename=>{
            try{
                self.bindService(self.getService(servicename))
                // tslint:disable-next-line:no-empty
            }catch(e){}
        });
    }
    public getRequiredServices():string[]{
        return [];
    }
    public getService(serviceName:string):IComponentService|any {
        if(this.getRequiredServices().indexOf(serviceName)>-1){
            // @ts-ignore
            return this.state.services[serviceName];
        }
    }
    // tslint:disable-next-line:no-empty
    public unbindService(service:IComponentService):void{}
}