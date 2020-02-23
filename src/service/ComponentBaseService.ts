import IService from "../Interfaces/IService";

export default class ComponentBaseService implements IService {
  public getName(): string {
    throw new Error("Method 'getName' not implemented.");
  }
}
