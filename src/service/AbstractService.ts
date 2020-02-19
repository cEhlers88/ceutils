import IService from "../Interfaces/IService";

export default abstract class AbstractService implements IService {
  public getName(): string {
    throw new Error("Method 'getName' not implemented.");
  }
}
