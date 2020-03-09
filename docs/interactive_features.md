# Operations
Possible operations to add as interactive features.

## Edges
### Angular drag (single+group)
Dragging an edge angularly (sideways) drags all nodes it's connected to.

Usefulness: In combination with "contract edge" and other node sorting schemes, can use it to move edge to Tau/2 to have other edges partition on two sides

### Radial drag (single+group)
Manual edge resort.

### Contract (single+group)
Forces the nodes of an edge together or apart.

Usefulness: Topology exploration from a single edge (easy to "jump"/branch to other edges)

### Sort by similarity (single+group)
For an edge, puts it innermost and sorts other edges by similarity. Alt: putting in center, gives ability to sort on both ends giving a better similarity measue (projection to 1 dimension (distance) with both positive and negative. Means those on the inner side are dissimilar from those on the outer side even if same distance)

Usefulness: Topology investigation

### Label/add to subset (single+group)
Putting edges in subsets/partitions.

Usefulness: Color/sort/set opertations.

## Nodes
### Contract
Select node set and force together

### Angular drag
Re-sort. When all selected, rotate.

### Label/add to subset (single+group)
Putting edges in subsets/partitions.

Usefulness: Color/sort/set opertations.

# Modes
Being able to select what click, hover does would be beneficial.

# Styling
## Style others by selection
When user does a selection or hover, other edges/nodes can be colored/styled by some sorting.

Example: Hover node, sets opacity of other nodes by how many edges they share. Or, even, how many of their edges share other nodes, etc... see topology document.

## Style by sort/measure
One sort can be used to actually sort, another can be used to style. Allow some properties for nodes and arcs.

Examples:
* Opacity
* Color (categorical or continous)
* Line thickness
* Lane thickness
* Line dot density

## Subsets
### Sort
Sorting a subset by some rule, and then showing multiple subsets in one plot sorted by subset is highly useful for doing "tree" sorts. One subset sorted one way, another sorted another way.

# "Selections"
* Hover
* Selected
* Coloured
* Colour on hover by association (see the "leak")