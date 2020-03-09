// NOTE: Does not work on Object.create(null) for obvious reasons
const PrototypeExtension = {}
const _o = Symbol.for('_o')
PrototypeExtension.pass = function (func, args = []) {
  return func(this, ...args)
}
PrototypeExtension.passAt = function (func, args = []) {
  args = args.map((arg) => arg === _o ? this : arg)
  return func(...args)
}
PrototypeExtension.boundCall = function (func, args = []) {
  return func.bind(this)(...args)
}
const extendPassable = function (obj) {
  Object.assign(obj, PrototypeExtension)
}
export { extendPassable, PrototypeExtension as PassableExtension, _o }
