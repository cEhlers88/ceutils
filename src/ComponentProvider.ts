export default class ComponentProvider {
  public registerComponent(
    componentClass: any,
    componentName: any
  ): ComponentProvider {
    return this;
  }

  public execute(): ComponentProvider {
    return this;
  }
}
