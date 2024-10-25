import React from "react";
import IComponentService from "../Interfaces/IComponentService";

export default abstract class ReactComponent extends React.Component{
    public state:{services:any} = {services:[]};
    protected constructor(props:any) {
        super(props);
    }

    public abstract getComponentname():string
    public abstract getNamespace():string

    public bindService(service:IComponentService): ReactComponent {
        return this;
    }

    public componentDidMount(): void {
        const self = this;
        this.getRequiredServices().map(servicename=>{
            try{
                self.bindService(self.getService(servicename));
            }catch(e){
                // placeholder
            }
        });
    }

    public getRequiredServices():string[]{
        return [];
    }

    public getService(serviceName:string):IComponentService|any {
        if(this.getRequiredServices().indexOf(serviceName)>-1){
            return this.state.services[serviceName];
        }
    }

    public unbindService(service:IComponentService):ReactComponent {
        return this;
    }
}