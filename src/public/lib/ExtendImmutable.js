function extendImmutable (obj, extender) {
  Object
    .entries(extender)
    .forEach(([propName, value]) => {
      Object.defineProperty(obj, propName, { value, writable: false, configurable: false, enumerable: false })
    })
}

export { extendImmutable }
