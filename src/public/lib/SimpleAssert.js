const successAssertReturn = { elseThrow () {}, elseWarn () {} }
const failAssertReturn = { elseThrow (msg) { throw new Error(msg) }, elseWarn (msg) { console.warn(msg) } }
function assertTrue (bool) { return bool ? successAssertReturn : failAssertReturn }
function assertFalse (bool) { return assertTrue(!bool) }

export { assertTrue, assertFalse }
