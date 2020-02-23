import IService from "../../src/Interfaces/IService";
import ComponentBaseService from "../../src/service/ComponentBaseService";
import ComponentStarter from "../../src/service/ComponentStarter";

let componentStarterInstance:ComponentStarter|any = {};

const testService = class extends ComponentBaseService {
    public getName(): string {
        return "test";
    }
};

beforeEach(()=>{
   componentStarterInstance = new ComponentStarter();
});

describe("Basics",()=>{
    test('Local variable "componentStarterInstance" should be instance of ComponentStarter',()=>{
        expect(componentStarterInstance).toBeInstanceOf(ComponentStarter);
    });

    test('There should be 0 registered services after create new ComponentStarter',()=>{
        expect(componentStarterInstance.getAllServices().length).toBe(0);
    });
});

describe('Servicebasics',()=>{

    test('Trying to add just an instance of IService should throw "Unknown Type" Exception',()=>{
        const iServiceInstance:IService = {
            getName(): string {
                return "";
            }
        }
        expect(()=>{
            componentStarterInstance.registerComponent(iServiceInstance);
        }).toThrowError("Unknown Type");
    });

    test('There should be 1 registered services after register new service',()=>{

        componentStarterInstance.registerComponent(new testService());

        expect(componentStarterInstance.getAllServices().length).toBe(1);

    });

    test('When register new service and try to get service by the name of the new service, the result should be the new registered service',()=>{
        const testServiceInstance =  new testService();

        componentStarterInstance.registerComponent(testServiceInstance);

        expect(componentStarterInstance.getService(testServiceInstance.getName())).toBeInstanceOf(ComponentBaseService);
    });

    test('When register new service and try to get service by unknown name, the result should be undefined',()=>{
        const testServiceInstance = new testService();

        componentStarterInstance.registerComponent(testServiceInstance);

        expect(componentStarterInstance.getService(testServiceInstance.getName()+'!'))
            .toBeUndefined();
    });

    test('Register same service twice should throw Exception "Service X already exist"',()=>{

        componentStarterInstance.registerComponent(new testService());

        expect(()=>{
            componentStarterInstance.registerComponent(new testService());
        }).toThrowError('Service test already exist');
    });

    test('Register same services twice (but the second with a different name) should throw an "Service X already exist" exception too',()=>{
        // Name of Services are always readonly defined in service.getName()

        componentStarterInstance.registerComponent(new testService());

        expect(()=>{
            componentStarterInstance.registerComponent(new testService(),'test2');
        }).toThrowError('Service test already exist');
    });

    test("After register two different services, there should be 2 registered services",()=>{
        // tslint:disable-next-line:max-classes-per-file
        const testService2 = class extends ComponentBaseService {
            public getName(): string {
                return "test2";
            }
        };
        componentStarterInstance.registerComponent(new testService());
        componentStarterInstance.registerComponent(new testService2());

        expect(componentStarterInstance.getAllServices().length).toBe(2);
    });
});