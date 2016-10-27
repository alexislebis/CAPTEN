
/**
 * RGTE class is the representation of data concept bound together with relations.
 * Network is the graph, currently a vis.js network.
 */

function RGTE(){


  this.nodes = null;
  this.edges = null;
  this.edgesCardinality = null; //Array of edge (currently based on vis edge).

  this.context = null;
}

RGTE.prototype = {

  addVisNode: function(nodeID, nodeLabel){
    this.nodes.push({"id": nodeID, "label": nodeLabel, "shape": "dot", "size":"30"});
  },

  addVisProperty: function(fromID, toID, edgeLabel)
  {
    this.edges.push({"from":fromID, "to":toID, "label":edgeLabel, "arrows": "to"});
  },

  addEdgesCardinality: function(index, fromCardinality, toCardinality)
  {
    this.edgesCardinality.push({"index":index, "fromCardinality":fromCardinality, "toCardinality": toCardinality});
  },

  getNodes: function()
  {
    return this.nodes;
  },

  getEdges: function()
  {
    return this.edges;
  },

  getEdgesCardinality: function()
  {
    return this.edgesCardinality;
  }

};
