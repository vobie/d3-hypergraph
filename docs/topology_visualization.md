# Overview
Thought dump regarding topology. Not everything will be implemented here.

## Visualizing connectedness/nearness easily
* Hovering a node/edge gives them full opacity. They then "leak" opacity to edges which contain the same nodes. Similar to sorting by edge similarity to one/more edges.
* Time domain can be used. Hovering a node spawns "walkers" visualized zipping around the edges (extra opacity where walker is). Similar to above but using time to show number of hops needed.

## Time domain
Consider three groups all of which pairwise share two nodes. How does one differentiate them all sharing the same two nodes and pairwise disjoint overlaps?

Leak: Amplify when more than two share the same nodes.

Time domain: Will be obvious by seeing how many groups of walkers can be seen moving at the same time, if walkers are sent with small time delay between nodes they use to jump over.

Objective:
Differentiate h1=((1,2,3,4),(1,2,5,6), (1,2,7,8)) and h2=((1,2,3,4),(3,4,5,6),(5,6,1,2)) visually. Walker/leak should both be able to but walker likely better.

Walker will show h2 as a cycle/circular resonance (if disallowing using the same node to jump back/forth) going opposite ways and h1 as a "resonance" like a drumskin wher 1,2 is the center

Conclusion: Really investigate this, could potentially show structure very well. Difference from regular graph is that edge connects many nodes, so focus here.

## Walker rules
Could have different probabilities/leaks depending on where it came from.

* Disallowing "going back" using same node/to same edge differentiates 3-cycles from 1-cycles, for example.
* Not distinguishing which node was used to jump but increasing probability of jump if more nodes shared

# Vis methods for this
* Opacity
* Time variance
* Color mixing (jump 1 = red, jump 2 = blue etc) - mixing shows patterns
* Movement across/between edges/nodes
* Coloured walkers leaving traces that fade (=all three methods)
* Frequency - Setting different nodes/edges to "pulse" (light up) its edges/nodes/neighbors with different frequencies is similar to color mixing, will create pattens that can be seen
* Sound - "listen where you hover" (see frequency idea)
* Have cycles -> frequencies
  * 3/2 = fifth -> one 3-cycle and one 2-cycle. Can add overtones 
  * farther away? -> moves up an octave somehow
  * "A three cycle and a two cycle one step away is a 3/2 fairly loudly" - possibly structures will make interesting and highly distinguishable sounds
  * Echoes.. same as light pulse idea
  * Cycle distinguished from distance. Make as nonlinear as possible so that structures make distinct sounds
  * Slight frequency/time shifts is an avenue to investigate ("thick/thin", "dirty/clean" sounds)
    * if slight delay each jump - different frequencies will cancel on different number of jumps
    * Same with freq shift, but will sound more off the more shifted/blurred/spread a signal comes back - can depend on #jumps, #jumps combined with "jump streght (#shared nodes between edges)", certain nodes shifting a certain amount
  * Additive/subtractive/multiplicative/exponential depending on what one is looking for
  * Nodes can make freqs, or edge
  * Nodes can make combo sounds too. Many are distinguishable when heard together such as 3/2. Pitch shift on move.. etc

The above ideas can probably be utilized to do analysis without listening. 
