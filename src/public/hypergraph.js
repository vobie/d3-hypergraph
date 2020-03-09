const _ = window._

function randomId () {
  return Math.random().toString(36).substr(2)
}
// helper: if given an id, returns it. if given node or edge, returns its id
function id (thing) {
  return _.isObjectLike(thing) ? thing.id : thing
}

function isValidId (id) {
  return _.isString(id) || _.isFinite(id)
}
function validateNewEdge (edge, nodes) {
  console.log(edge)
  let graph = edge.graph

  // We allow both ids and Edge/Node objects
  let edgeId = id(edge)
  let nodeIds = _.map(nodes, id)

  // Graph cannot contain edge with that id already
  // Graph has to contain all nodes the edge joins
  // Graph cannot contain an identical edge (containing the same nodes)
  let noDupeEdgeId = !graph.hasEdge(edgeId)
  let atLeasOneNodeInEdge = nodeIds.length > 0
  let graphHasAllNodes = nodeIds.every((id) => graph.hasNode(id))
  // FIXME: not likely to work due to _.isEqual working on ordered arrays, not sets
  // let noIdenticalEdge = _(nodeIds).map((id) => graph._nodeToEdges.get(id)).some((edgesNodeIdList) => _.isEqual(edgesNodeIdList, nodeIds)).value()

  if (!noDupeEdgeId) { console.warn('Validation for new edge failed: Duplicate ID') }
  if (!atLeasOneNodeInEdge) { console.warn('Validation for new edge failed: Not at least one node in edge') }
  if (!graphHasAllNodes) { console.warn('Validation for new edge failed: Not all nodes referenced exist') }

  return atLeasOneNodeInEdge && noDupeEdgeId && graphHasAllNodes
}

function validateNewNode (node) {
  let graph = node.graph

  // We allow both ids and Edge/Node objects
  let nodeId = id(node)
  let noDupeNodeId = !graph.hasNode(nodeId)
  if (!noDupeNodeId) { console.warn('Validation for new node failed: Duplicate ID') }

  return noDupeNodeId
}

class Edge {
  constructor (graph, edgeData) {
    if (!(graph instanceof HyperGraph)) {
      throw new Error('No graph, or invalid object, specified when creating node')
    }
    let _isValidId = isValidId(edgeData.id)
    if (!_isValidId) {
      console.warn('No id passed with edge creation. A random one will be generated.')
    }

    Object.assign(this, edgeData)
    this._graph = graph
    this._id = _isValidId ? edgeData.id : randomId()
  }
  get graph () { return this._graph }
  get id () { return this._id }
  get nodes () { return this.graph.getNodes(this) }
}
class Node {
  constructor (graph, nodeData) {
    if (!(graph instanceof HyperGraph)) {
      throw new Error('No graph, or invalid object, specified when creating edge')
    }

    let _isValidId = isValidId(nodeData.id)
    if (!_isValidId) {
      console.warn('No valid id passed with node creation. A random one will be generated.')
    }

    Object.assign(this, nodeData)
    this._graph = graph
    this._id = _isValidId ? nodeData.id : randomId()
  }
  get graph () { return this._graph }
  set graph (o) { return this.graph }
  get id () { return this._id }
  set id (o) { return this.id }
  get edges () { return this.graph.getEdges(this) }
  set edges (o) { return this.edges }
}
class HyperGraph {
  constructor (label = `HyperGraph:${randomId()}`) {
    this._label = label
    this._nodes = new Map() // Node:id => Node
    this._edges = new Map() // Edge:id => Edge
    this._edgeToNodes = new Map() // Edge:id => [Node:id]
    this._nodeToEdges = new Map() // Node:id => [Edge:id]
  }
  // Nodes
  createNode (nodeData) {
    let node = new Node(this, nodeData)
    if (!validateNewNode(node)) {
      console.warn('Node could not be created')
      return false
    }
    this._nodes.set(node.id, node)
    this._nodeToEdges.set(node.id, [])
    return node
  }
  removeNode (node) {
    let nodeId = id(node)
    let outgoingEdges = this.getEdges(nodeId)
    if (outgoingEdges.length === 0) { // To remove a node: Has to not be in any edges
      this._nodeToEdges.delete(nodeId)
      this._nodes.delete(nodeId)
      return true
    }
    console.warn('Node could not be removed')
    return false
  }
  // Edges
  createEdge (edgeData) {
    let [nodes, restOfEdgeData] = [_.pick(edgeData, 'nodes'), _.omit(edgeData, 'nodes')]
    let edge = new Edge(this, restOfEdgeData)
    if (!validateNewEdge(edge, edgeData.nodes)) {
      console.warn('Edge could not be created')
      return false
    }
    let nodeIds = nodes.map(id)
    this._edges.set(edge.id, edge)
    this._edgeToNodes.set(edge.id, nodeIds)
    nodeIds.forEach((nodeId) => this._nodeToEdges.get(nodeId).push(edge.id)) // validateNewEdge ensures this does not fail
    return edge
  }
  removeEdge (edge) {
    let edgeId = id(edge)
    let nodesInEdge = this.getNodes(edgeId)
    nodesInEdge.forEach((node) => { // Remove from all nodeToEdges map
      let nodeToEdgesArr = this._nodeToEdges.get(node) // Ugly mutating of array, switch to map here too
      let edgeIndex = nodeToEdgesArr.indexOf(edgeId)
      nodeToEdgesArr.splice(edgeIndex, 1)
    })
    this._edges.delete(edgeId)
    this._edgeToNodes.delete(edgeId)
  }
  getNodes (edge) { return this._edgeToNodes.get(id(edge)).map(this._nodes.get) }
  getEdges (node) { return this._nodeToEdges.get(id(node)).map(this._edges.get) }
  hasEdge (edge) { return this._edges.has(id(edge)) }
  hasNode (node) { return this._nodes.has(id(node)) }
  get nodes () { return Array.from(this._nodes.values()) }
  get edges () { return Array.from(this._nodes.values()) }
  get label () { return this._label }
}

function testHg () {
  let hg = new HyperGraph()
  console.log('NODE TESTS')
  console.log('noId:', hg.createNode({}))
  console.log('---')
  console.log('validIdString:', hg.createNode({ id: 'hej' }))
  console.log('---')
  console.log('validIdInt:', hg.createNode({ id: 55 }))
  console.log('---')
  console.log('validIdIntZero:', hg.createNode({ id: 0 }))
  console.log('---')
  console.log('invalidIdFunc:', hg.createNode({ id: function () {} }))
  console.log('---')
  console.log('invalidIdProxy:', hg.createNode({ id: new Proxy({}, {}) }))
  console.log('---')
  console.log('extraDataSome:', hg.createNode({ some: 'data' }))
  console.log('---')
  console.log('extraDataOverwrite', hg.createNode({ someOther: 'data', _id: {}, _graph: 'sasuga', _edges: 123, nodes: 123 }))
  console.log('---')
  console.log('EDGE TESTS')
}
