# Overview
Collected thoughts about node and edge sorting, and how edges and nodes interact while sorting. Both for topology exposition and cognitive load.

# Sorting
## Short arcs
When arcs are long, user has to follow an arc a long way. The total arc length can be calculated but this depends on the full node ordering, combinatorial explosion here.

## Arc density
Arcs next to each other overlapping with "no blob" makes it hard to follow a specific arc. Arcs next to each other should either reach different ways where they don't overlap (left/right), overlap as little as possible, or be pushed apart one step. Mostly bad in cases of 4+ arcs forming a "lane".

```
1. Undesirable:
e1 : o--o--------o
e2 : o--o-----o

2. Better:
2.1 "Warping node to other side"
e1 : o--------o--o
e2 :          o--o-----o

2.2 Spacing out 
e1 : o--o--------o
e3 : 
e2 : o--o-----o
```

1: One can get lost between the arcs

2.1: It's hard to achieve this warping without destroying other edges' properties. Potential idea: If nodes are clustered, one could move an entire cluster for arc increased spread. If we have no "zero angle", the arc could instead wrap the other way. Introduce a "wormhole" function, that mirrors a node around a set of other nodes.

2.2: Easily achieved by small movements, force directed might work here

## Near-disjoint parts
Spreading near-disjoint subgraphs by node sort is dsirable. Much in literature for hypergraph partitioning, look here.


## Some force rules that might be useful
### Node force to minimize arc length
```
For each tick:
    Force = Map(v_n -> float) 
    For each edge:
        For nodes pairs in order v_n, v_m where n<m: //edge with v1v2v4 has pairs v1v2,v2v4
            Force(v_n) += (m - n)^2
            Force(v_m) -= (m - n)^2
        
    For each node:
        Position(v) += Floor(c*Force(v)) //max-hop 1, 2 possibly 
```

Options include:
* Progressive relaxation
* An element of brute force where several different changes to the sort are created and compated, even forward tested a bit
  * Similar to gradient descent - "Random walk descent"
    * Walk need not be entirely random but could be based on force rules
    * Taking it a step further: Force values input to ML that spits out a set of next-step candidates
    * Alternative: ML input is just the same input force algo uses (counts of good or bad relationships between edges)
* Only "arc end" nodes pull on each other
  * Or simply pull harder
  * grouping within arc less cared about
  * cannot really eject empty spaces, but
    * empty spaces should implicitly be ejected by pull
    * makes "warping" over a group more possible
    * depending on max-hop, can eject empty space less than max-hop from edge
    * depending on options below, might make two nodes just take turns being the outer one, leading to stalemate (a<>b keeps switching places)
* Only N node, top ones by force, move per iteration
* Since hopping is seqential (one at a time)
  * Hop can be calculated from current position (changed by other nodes hopping)
  * Start position when force was calculated
  * Simply round-robin all the nodes. Calc force for node, hop. Repeat.
* Edge nearness/"laning" come into play, see above.
  * Example: Force is stronger if node has crossing arcs with no blob (multiplier).
  * If edge force simulation in play at the same time: extra force when "lane crossings"

## Monte Carlo?
Is there an equivalent in the sorts?

Consider using the above force rules to calculate the `goodness` of a certain sort (minimum forces => "best" sort)
* Try a random or chosen range of start values, check which one has the best goodness score
* Use straight up, or use as seed sort for the force directed sorter

The key question is: Is the space of all sorts in this context such that we can calculate a "monte carlo set" that we know "cover" the space reasonably well. We want a set such that it will likely converge on a sort with a goodness score not much worse than the best one. The convergence and MC-set largely depends on force algorithm: Is the space it creates "stable" or will it "get stuck easily" (does it easily create lagrange points)? This can be investigated by simply running the force layout on random graphs and see how it perfoms depending on seed sort and computed (brute forced) optimal sort: Does it often a sort with similar or not much worse goodness score.

## Partitions
Hypergraph partitioning algorithms can be used as seed for force layout, or on their own to produce sorts. Several can be calculated and compared using the rules derived from the forces decribed in "Monte Carlo" section. 

Perhaps partitions can be used to some degree to calculate the monte carlo set? Do a few 2,3,...,n partitions, base monte carlo set on this rough set of start points. Final algorithm could be `graph | partitions | monteCarlo | forceDirected`

# Arc tracking
## Lanes
Tables are often styled with alternating background colors. This idea can be carried over. Even better some highlight/shadow at the lane edges, this makes one less likely to "fall off" visually. The table header can also be carried over by pytting labels at the outside of the circle. Edge label can be placed at either end of arc.
<dl>
    <img src="https://i.stack.imgur.com/G6xXh.png" width="500px">
</dl>

## Arc styling
In addition to lanes, the arc can be styled differently Thickness, dotted arc, etc.

## Arc packing
Matching edge sets to "pack" a full loop-around by best-effort. Allows more edges in graph (scales better)

# When edges > nodes
Ability to flip dimensions (arc = node).