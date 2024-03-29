export const withInstall = (component, alias) => {
  const comp = component
  comp.install = (app) => {
    app.component(comp.name, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component
}
