# Vague sketches and ideas
* Placing the hypergraph vertices as columns/rows in a matrix. The value at (i,j) is the amount of shared edges between (v_i,v_j).
* Placing the hypergraph edges as columns/rows in a matrix. The value at (i,j) is the amount of shared vertices between (e_i,e_j).

# Projections
* Nodes can be seen as binary vectors v = (inE1, inE2, inE3, ...)
* This can be projected to one dimension in multiple ways
* (Correspondence analysis)[https://www.displayr.com/interpret-correspondence-analysis-plots-probably-isnt-way-think/] is one.
* Goal: Preserve the distances as much as possible
* Machine learning does this
* Vector can be extended to v = (inE1, ..., inE1E2, inE1E3, ..., inE1E2E3, ....) etc adn weight that differently etc
  * Possible to set a limit on vector length.
  * Vector lengths become N, N+N^2, N+N^2+N^3 etc.
  * Possible to pick subset of what to include in vector
* Edges can be done the same way
* Circularity of node placement complicates the idea somewhat

# Measures
* Many measures can be calculated on nodes and edges
* Cardinality, degree obvious
* Multiple "nearness measures"
* Example for nodes:
  * Take all edges belonging to a node (score 1)
  * Take all edges sharing nodes with those edges and score by how many they share (score 2)
  * etc ...
* Centrality measures
* Flipping nodes/edges can give the same centrality measures for them
* ***See doc on topology***