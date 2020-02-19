import { eComponentType } from "../lib/enums";
export default interface IComponentRegisterEntry {
  component: any;
  name: string;
  namespace: string;
  requiredServices: string[];
  type: eComponentType;
}
