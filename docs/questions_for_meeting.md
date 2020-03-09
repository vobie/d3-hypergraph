* Why have a zero-angle?
  * There is no inherent node ordering "start" and "end"
  * Not doing this would allow less arc angle overlap - an extra degree of freedom
  * However, guarantees two similar edges will overlap even in the empty space.
* How to compare hypergraphs? Needs vertex mapping. Combinatorial explosion. What are the important metrics. Graph features? Groups of edges?
  * Is there a benefit to some kind of very "deterministic" sorting, to see patterns?
* Why radial at all? Especially if zero-angle exists, since the main benefit is that edges can loop around one or the other way to minimize length.
  * Is it because a circle is smaller at the center?
* Packing multiple disjoint edges in one lane? Pros/cons?
* Force-directed algorithms can probably integrate rules to sort "optimally". Thoughts?
  * Almost any rule can be converted easily into a force-function - very flexible
  * Lots of work on Hypergraph partitioning
    * Can it be utilized?
    * Does the radial layout introduce issues, specific constraints, that make standard partitioning algos unsuitable?
* Node/edge inversion might be beneficial. Nodes are arranged circularly, edges have a single dimension to be "near" in (assuming zero-angle)
  * When arranging by similarity to an edge, it is beneficial to have that edge in the middle, this can preserve distances better (two sides where sides can be dissimilar but still similar to original edge)
  * Same goes for nodes if using zero-angle. placing node in the middle gives two directions to work with
* Edge standard/subset standard/bipartite
  * All cluttery quickly - not much inspiration here
* Topology
  * What kinds of features are we interested visually identifying? Nodes sharing edges, edges sharing nodes, ...
* For categorical data: Node blob color for category "variable" - cuts down node count immensely.
* There seems to be a connection to building/furniture etc - What can I look for here?
* Partition nodes, show multiple views, highlight in both?
  * A single node can represent "has nodes in the other graph"
* Keywords for further reference searching. "Often described in the terms of set theory" -> how to phrase that as a search? Other tips?
* Cognitive load. Node sort for arcs. Edge sorts to avoid "lanes"
* Edge labels in last "slice?"