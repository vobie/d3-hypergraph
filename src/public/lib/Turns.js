const Turns = {}
Turns.toDegrees = function (turns) {
  return turns * 360
}

Turns.toRadians = function (turns) {
  return turns * 2 * Math.PI
}

export { Turns }
