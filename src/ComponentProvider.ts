/**
 * Library ComponentProvider
 * Created 27.09.21
 *
 * @author Christoph Ehlers <ce@construktiv.de> | Construktiv GmbH
 */

export default class ComponentProvider{
    public registerComponent(componentClass:any, componentName:any):ComponentProvider{

        return this;
    }

    public execute():ComponentProvider{
        console.log('EXECUTE!!');
        return this;
    }
}