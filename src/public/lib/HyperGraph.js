import { assertTrue } from './SimpleAssert.js'
import { extendImmutable } from './ExtendImmutable.js'
function randomId () { return Math.random().toString(36).substr(2) }

class HyperGraph {
  constructor (id = `hypergraph:${randomId()}`, props) {
    this._id = id
    this._props = { ...props }
    this._nodes = new Map() // PKMap or Map
    this._edges = new Map()
  }
  createNode ({ id, props }) {
    const node = new Node({ graph: this, props, id })
    this._nodes.set(node.id, node)

    return node
  }
  createEdge ({ id, props, nodes = [] }) { // Note: Expects nodes to be nodes in
    assertTrue(
      nodes.every(node => this._nodes.get(node.id) === node)
    ).elseThrow('Cannot add edge with nodes not in graph')
    assertTrue(
      nodes.length > 0
    ).elseThrow('Edges have to have at least one node')

    const edge = new Edge({ graph: this, props, id })
    this._edges.set(edge.id, edge)
    edge.include(...nodes) // warn somewhere if we're subbing our own node for the one intended

    return edge
  }
  removeNode (node) {
    node.edges.forEach((edge) => edge.excludeNode(node))
    this._nodes.delete(node)
  }
  removeEdge (edge) {
    edge.nodes.forEach((node) => edge.excludeNode(node))
    this._edges.delete(edge)
  }
  get nodes () { return [...this._nodes.values()] }
  get edges () { return [...this._edges.values()] }
  get incidences () {
    return this.edges.flatMap(
      (graphEdge) => graphEdge.nodes.map(
        graphNode => ({ graphEdge, graphNode })
      )
    )
  }
  get order () { return this._nodes.size }
  get size () { return this._edges.size }
  toObject () {
    return {
      id: this._id,
      nodes: [...this._nodes.values()].map(node => node.toObject()),
      edges: [...this._edges.values()].map(edge => edge.toObject())
    }
  }
}

class Node {
  constructor ({ graph, props, id = `node:${randomId()}` }) {
    extendImmutable(this, {
      _id: id,
      _graph: graph,
      _props: { ...props },
      _edgeSet: new Set()
    })
  }
  get edges () { return [...this._edgeSet] }
  get degree () { return this._edgeSet.size }
  get props () { return this._props }
  get id () { return this._id }

  toObject () {
    return { id: this._id, props: { ...this._props } }
  }
}
class Edge {
  constructor ({ graph, props, id = `edge:${randomId()}` }) {
    extendImmutable(this, {
      _id: id,
      _graph: graph,
      _props: { ...props },
      _nodeSet: new Set()
    })
  }
  get nodes () { return [...this._nodeSet] }
  get cardinality () { return this._nodeSet.size }

  get props () { return this._props }
  get id () { return this._id }
  include (...nodes) {
    nodes.forEach(node => {
      this._nodeSet.add(node)
      node._edgeSet.add(this)
    })
  }
  exclude (...nodes) {
    nodes.forEach(node => {
      this._nodeSet.delete(node)
      node._edgeSet.delete(this)
    })
  }
  toObject () {
    return {
      id: this._id,
      props: { ...this._props },
      nodes: [...this.nodes].map(node => node.id)
    }
  }
}

HyperGraph.testGraph = function (nNodes = 15, nEdges = 50, probabilityNodeInEdge = 0.2) {
  assertTrue(probabilityNodeInEdge > 0).elseThrow('Proability too low')
  const hg = new HyperGraph()

  ;[...Array(nNodes)].forEach((nil, index) => {
    hg.createNode({ id: index, props: { testNodeProp: Math.random() } })
  })

  ;[...Array(nEdges)].forEach((nil, index) => {
    // At least one node
    let nodes = []
    while (nodes.length === 0) {
      nodes = hg.nodes.filter(() => Math.random() < probabilityNodeInEdge)
    }

    hg.createEdge({
      id: index,
      props: { testEdgeProp: Math.random() },
      nodes: nodes
    })
  })

  return hg
}

export { HyperGraph }
