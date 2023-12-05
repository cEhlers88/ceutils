/**
 * Library ObjectStoreProvider
 * Created 24.09.23
 *
 * @author Christoph Ehlers <Christoph.Ehlers1988@gmx.de>
 */

declare global {
    // tslint:disable-next-line:interface-name
    interface Window {
        // tslint:disable-next-line:array-type
        __ObjectStore: Array<IStoredObject>;
    }
}

export interface IStoredObject {
    group: string;
    name: string;
    instance: any;
    [key: string]: any;
}

export default class ObjectStoreProvider {
    constructor() {
        if (!window.__ObjectStore) {
            window.__ObjectStore = [];
        }
    }
    public addObject(instance: any, name: null | string = null, additionalHeadinfo:{
        [key:string]: any,
        group: string
    }={
        group:  'default'
    }): IStoredObject {
        if (name === null) {
            name = 'obj';
        }

        let _storedObject: IStoredObject | undefined = window.__ObjectStore.find(storedObject => storedObject.name === name);
        while(_storedObject){
            const _split = this.splitByLastNumbers(_storedObject.name);
            name = _split.name + (_split.number + 1);
            _storedObject = window.__ObjectStore.find(storedObject => storedObject.name === name)
        }

        const _newStoredObject: IStoredObject = {
            ...additionalHeadinfo,
            instance,
            name: name!
        };

        window.__ObjectStore.push(_newStoredObject);
        return _newStoredObject;
    }

    public getObject(name: string): any {
        const _storedObject: IStoredObject | undefined = window.__ObjectStore.find(storedObject => storedObject.name === name);
        if (_storedObject) {
            return _storedObject.instance;
        }
        return null;
    }

    public getObjectsByGroup(group: string = 'default'): any[] {
        return window.__ObjectStore.filter(storedObject => storedObject.group === group).map(storedObject => storedObject.instance);
    }
    public getStore():any[]{
        return window.__ObjectStore;
    }
    public getStoreInfo(objectName:string):any{
        const _storeIndex = window.__ObjectStore.findIndex(storedObject => storedObject.name === objectName);
        return {
            ...window.__ObjectStore[_storeIndex],
            storeIndex: _storeIndex
        };
    }
    public removeObject(name: string): ObjectStoreProvider {
        window.__ObjectStore = window.__ObjectStore.filter(storedObject => storedObject.name !== name);
        return this;
    }

    public setObject(name: string, instance: any): IStoredObject {
        let _storedObject: IStoredObject | undefined = window.__ObjectStore.find(storedObject => storedObject.name === name);
        if (_storedObject) {
            _storedObject.instance = instance;
        } else {
            _storedObject = this.addObject(instance, name);
        }
        return _storedObject;
    }

    private splitByLastNumbers(value: string) {
        const matches = value.match(/^(.*?)(\d+)$/);
        if (matches) {
            return {
                name: matches[1],
                number: Number(matches[2])
            }
        } else {
            return {
                name: value,
                number: 1
            }
        }
    }
}