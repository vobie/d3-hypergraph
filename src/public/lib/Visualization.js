/*
  IMPORTANT TERMINOLOGY NOTE:
  To aid readability, where "margin" is used it refers to distance to origo (what would ordinarily be called radius)
  The word radius is instead reserved for the radius of the various discs in the visualization
*/

import { HyperGraph } from './HyperGraph.js'
import { Turns } from './Turns.js' // Working with turns is a lot easier
import { extendPassable } from './Passable.js' // Chaining function calls for any object

// Stops linter from complaining
const d3 = window.d3

/*
* Endow any instance of `Object` with the pass(), passAt() and boundCall() functions
*
* Pollutes global scope: Generally considered bad practice
* However, this addition aids readability a lot by placing operations in left-to-right order and is highly unlikely to interfere with anything
*
* Only pass() is used. It is similar to Array.prototype.map(), but for a single `Object` of any kind.
*
* The following lines of code all produce the same result:
* let result = someFunction2(someFunction1(someObject))
* let result = [someObject].map(someFunction1).map(someFunction2)[0]
* let result = someObject.pass(someFunction1).pass(someFunction2)
*/
extendPassable(Object.prototype)

/**
* Key variables relating to data
*/
const graph = HyperGraph.testGraph()

/* test code
[...Array(14).keys()].forEach((i) => {
  graph.createEdge({ nodes: [graph.nodes[i], graph.nodes[i + 1]] })
})
graph.createEdge({ nodes: [graph.nodes[14], graph.nodes[0]] })
graph.createEdge({ nodes: [graph.nodes[13], graph.nodes[1]] }) */
let nodeSort = new Map(graph.nodes.map((node, index) => [node, index]))
let numNodes = graph.nodes.length
let edgeSort = new Map(graph.edges.map((edge, index) => [edge, index]))
let numEdges = graph.edges.length

/**
* Key variables relating to DOM/SVG
*/
const selector = '#hyper-container'
const tooltip = d3.select(selector).append('div')
  .property('hidden', true)
  .classed('vis-tooltip', true)
  .style('position', 'fixed')
const svg = d3.select(selector).append('svg').classed('hypervis', true)
const vis = svg.append('g').classed('vis', true)

/**
* Persistent svg groups. Order is important as it determines z-index (stacking)
*/
const gRadialAxis = vis.append('g').classed('group-radial-axis', true)
const gAngularAxis = vis.append('g').classed('group-angular-axis', true)
const gNodes = vis.append('g').classed('group-nodes', true)
const gArcs = vis.append('g').classed('group-arcs', true)
const gIncidences = vis.append('g').classed('group-incidences', true)

/**
* Config
*/
const visConf = {
  // Background, coordinate system etc
  get 'axis.angular.n' () { return graph.order },
  get 'axis.angular.length' () { return this['node.radius'] / 2 + 25 + graph.size * this['edge.arc.spaceBetween'] },
  get 'axis.angular.margin' () { return this['node.margin'] },

  get 'axis.radial.n' () { return graph.size },
  'axis.radial.colorFunction': (sortIndex) => ['#000000', '#ffffff'][sortIndex % 2],
  // 'axis.radial.colorFunction': (sortIndex) => d3.schemePaired[sortIndex % d3.schemePaired.length], // Color scheme that is easily distinguishable, wraps around, and does not imply order
  'axis.radial.opacity': 0.08,

  // Nodes
  'node.margin': 50,
  'node.radius': 5,

  // Edges
  get 'edge.arc.margin' () { return this['node.margin'] + this['node.radius'] / 2 + 25 },
  'edge.arc.spaceBetween': 10,
  'edge.arc.thickness': 2,
  'edge.incidence.radius': 3
}

/**
* Set up standard d3 zoom/pan
*/
const zoom = d3.zoom().on('zoom', () => { vis.attr('transform', d3.event.transform) })
svg.call(zoom).call(
  zoom.transform,
  d3.zoomIdentity.translate(
    svg.node().clientWidth / 2,
    svg.node().clientHeight / 2
  )
)

/**
* Debug colors
*/
const debugColor1 = (d, i, sel) => d3.interpolateReds(1 - 0.75 * (i / sel.length))
const debugColor1R01 = (r01) => d3.interpolateReds(1 - 0.75 * r01)
const debugColor2 = (d, i, sel) => '#000000'// d3.interpolateGreens(1 - 0.75 * (i / sel.length))

/**
* Frequent calculations
*/
const DrawCalc = {
  edgeMargin: (graphEdge) => visConf['edge.arc.margin'] + visConf['edge.arc.spaceBetween'] * edgeSort.get(graphEdge),
  edgeMarginByIndex: (index) => visConf['edge.arc.margin'] + visConf['edge.arc.spaceBetween'] * index,
  nodeAngle: (graphNode) => nodeSort.get(graphNode) / numNodes
}

/**
* Calculates the minimal range (in a modular system) to cover an array of values
*
* Takes:
*   array of values < modulus
*   modulus
*
* Returns:
*   [startValue, endValue] - the minimal range that covers all input values. Note: startValue is not necessarily < endValue
*
* Examples:
* modulus = 10, values = [1,9] => [9,1]
* modulus = 10, values = [9,1] => [9,1]
* modulus = 10, values = [0,1,2,3] => [0,3]
* modulus = 10, values = [2,9,3,1] => [9,3]
* modulus = 10, values = [1,2,3,4,6,7,8,9] => [6,4]
*/
function circularMinimalExtent (valueArr, modulus) {
  const largestDist = [...valueArr].sort((a, b) => a - b) // 4 hours of debugging later.... Default sort is lexicographic even for Numbers.
    .reduce(
      (acc, value, index, arr) => {
        const current = value
        const next = (index + 1 !== arr.length ? arr[index + 1] : modulus + arr[0]) // if 'value' is the last one in the array, compare it to the first one
        const dist = next - current
        return dist > acc.dist ? { dist, current, next } : acc
      },
      { dist: -1, current: -1, next: -1 }
    )
  return [largestDist.next % modulus, largestDist.current]
}

/**
*  Draw angular axis (rays)
*/
function drawAngularAxis () {
  gAngularAxis.selectAll('line')
    .data(d3.range(0, 1, 1 / visConf['axis.angular.n']).map(Turns.toDegrees))
    .enter()
    .append('line').attr('x2', visConf['axis.angular.length'])
    .attr('transform', d => `rotate(-${d}) translate(${visConf['axis.angular.margin']})`)
}
/**
*  Draw radial axis (circles)
*/
function drawRadialAxis () {
  const axis = gRadialAxis.selectAll('path')
    .data(d3.range(0, visConf['axis.radial.n']))
    .enter()
    .append('path')

  axis.attr('fill', visConf['axis.radial.colorFunction'])
    .attr('d', (index) => {
      const [startAngle, endAngle] = [0, 1]
      const margin = DrawCalc.edgeMarginByIndex(index)
      const thickness = visConf['edge.arc.spaceBetween']
      return arcPath({ startAngle, endAngle, margin, thickness })
    })
    .attr('opacity', visConf['axis.radial.opacity'])
}

/**
* Core shapes
*/
/**
* Node discs
*/
function drawNodes (graph) {
  const circles = gNodes.selectAll('circle')
    .data(graph.nodes)
    .enter()
    .append('circle')

  circles
    .attr('r', visConf['node.radius'])
    .attr('fill', debugColor1)
    .attr('transform', (graphNode) => `rotate(-${DrawCalc.nodeAngle(graphNode).pass(Turns.toDegrees)}) translate(${visConf['node.margin']})`)
}

/**
* Edge arcs
*/
/**
* Arc svg path generator
*
* d3.arc:
* works with radians
* works with angles that are clockwise-positive and start at "12 o'clock"
*
* This function:
* uses turns (nonstandard but convenient)
* angle=0 at x>0, y=0 (standard)
* anticlockwise positive angle (standard)
* thickness/margin rather than inner/outer radius
* considers direction: if startAngle > endAngle, then draw the arc clockwise
*/
const arcPath = ({ startAngle, endAngle, margin, thickness }) => {
  if (startAngle > endAngle) {
    startAngle -= 1 // FIXME make more robust. -1 is not sufficient for values like [5,1]
  }

  startAngle = Turns.toRadians(-startAngle + 1 / 4)
  endAngle = Turns.toRadians(-endAngle + 1 / 4)

  const innerRadius = margin - thickness / 2
  const outerRadius = margin + thickness / 2
  return d3.arc()({ startAngle, endAngle, innerRadius, outerRadius })
}

function drawArcs (graph) {
  const arcs = gArcs.selectAll('path')
    .data(graph.edges)
    .enter()
    .append('path')

  arcs.attr('fill', debugColor2)
    .attr('d', (graphEdge, index) => {
      const [startAngle, endAngle] = graphEdge.nodes // Edge -> [incident Node]
        .map(graphNode => nodeSort.get(graphNode)) // [Node] -> [Sort index]
        .pass(circularMinimalExtent, [numNodes]) // [Sort index] => [minIndex, maxIndex]
        .map(sortPosition => sortPosition / numNodes) // [minIndex,maxIndex] => scaled to range [0,1]
      const margin = DrawCalc.edgeMargin(graphEdge)
      const thickness = visConf['edge.arc.thickness']

      return arcPath({ startAngle, endAngle, margin, thickness })
    })
}

/**
* Incidences
* the small discs on top of the arcs that signify that an edge is incident to a node
*/
function drawIncidences (graph) {
  const circles = gIncidences.selectAll('circle')
    .data(graph.incidences)
    .enter()
    .append('circle')

  circles
    .attr('r', visConf['edge.incidence.radius'])
    .attr('fill', (incidentPair) => DrawCalc.nodeAngle(incidentPair.graphNode).pass(debugColor1R01))
    .attr('transform', (incidentPair) => `rotate(-${DrawCalc.nodeAngle(incidentPair.graphNode).pass(Turns.toDegrees)}) translate(${DrawCalc.edgeMargin(incidentPair.graphEdge)})`)
}

/**
* Interactive features
*/
/**
* Simple template, just enumerate props
*/
function tooltipHTML (edgeOrNode) {
  return `<b>${edgeOrNode.edges ? 'Node' : 'Edge'} (id: ${edgeOrNode.id})</b>
    <table>
      ${Object.entries(edgeOrNode.props).map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`)}
    </table>`
}
function setupTooltipListeners (sel) {
  sel.on('mouseenter', (data) => {
    tooltip.property('hidden', false).html(tooltipHTML(data))
  })
    .on('mousemove', function () {
      tooltip.style('top', `${d3.event.clientY - tooltip.node().offsetHeight - 1}px`)
      tooltip.style('left', `${d3.event.clientX}px`)
    })
    .on('mouseleave', (data) => {
      tooltip.property('hidden', true)
    })
}

drawAngularAxis()
drawRadialAxis()
drawNodes(graph)
drawArcs(graph)
drawIncidences(graph)
setupTooltipListeners(gArcs.selectAll('path'))
setupTooltipListeners(gNodes.selectAll('circle'))
