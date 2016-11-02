
/**
 * RGTE class is the representation of data concept bound together with relations.
 * Network is the graph, currently a vis.js network.
 */

function RGTE(){


  this.nodes = [];
  this.edges = [];
  this.edgesCardinality = []; //Array of edge (currently based on vis edge).

  this.context = null;
}

RGTE.nodeID = 0;
RGTE.edgeID = 0;
RGTE.cardiID = 0;

RGTE.prototype = {

  addVisNode: function(nodeLabel){
    this.nodes.push({"id": RGTE.nodeID++, "label": nodeLabel, "shape": "dot", "size":30});
  },

  addVisProperty: function(fromID, toID, edgeLabel)
  {
    this.edges.push({"id": RGTE.edgeID++, "from":fromID, "to":toID, "label":edgeLabel, "arrows": "to"});
  },

  addEdgesCardinality: function(eid, fromCardinality, toCardinality)
  {
    this.edgesCardinality.push({"id": RGTE.cardiID++, "edgeId": eid, "fromCardinality":fromCardinality, "toCardinality": toCardinality});
  },

  /**
   * For extension and more complex perspective, return an array. However, in the current version (2/Nov/2016)
   * cardinality is always related to only one edge
   */
  findCardinalityForEdge: function(eid)
  {
    var arrayEdges = [];

    for(var i = 0; i < this.edgesCardinality.length; i++)
    {
      if(this.edgesCardinality[i].edgeId === eid)
      {
        arrayEdges.push(this.edgesCardinality[i]);
      }
    }

    return arrayEdges;
  },

  createVisProperty: function(fromID, toID, edgeLabel)
  {
    var fromOK = false;
    var toOK = false;

    for(var i = 0; (i < this.nodes.length && (!fromOK || !toOK)); i++)
    {
      if(this.nodes[i].id === fromID)
        fromOK = true;

      if(this.nodes[i].id === toID)
        toOK = true;
    }

    if(fromOK && toOK)
      return {"from":fromID, "to":toID, "label":edgeLabel, "arrows": "to"};

    return null;
  },

  updateEdgeCardinality: function(id, fromC, toC)
  {
    var index = this.edgeCardinalityExists(id)
    if(index != -1)
    {
      this.edgesCardinality[index].from = fromC;
      this.edgesCardinality[index].to = toC;
    }
  },

// === EXISTENCE METHODS ===

edgesCardinalityExists: function(id){
  for(var i = 0; i < this.edgesCardinality.length; i++)
  {
    if(this.edgesCardinality[i].id === id)
      return i;
  }

  return -1;
},

// === PRIVATE METHODS ===

  _calculatingCardinalitiesAvailable: function() {

      var cardinalitiesAvailable = [];

      this.edgesCardinality.forEach(function(e) {
          console.log(e);
          if (!cardinalitiesAvailable.includes(e.from)) {
              cardinalitiesAvailable.push(e.fromCardinality);
          }
          if (!cardinalitiesAvailable.includes(e.to)) {
              cardinalitiesAvailable.push(e.toCardinality);
          }
      }.bind(this));

      return cardinalitiesAvailable;
  },

// === GETTERS ===
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
  },

  getNodeById: function(id)
  {
    for(var i = 0; i < this.nodes.length; i++)
    {
      if(id === this.nodes[i].id)
        return this.nodes[i];
    }

    return null;
  },

  getEdgeById: function(id)
  {
    for(var i = 0; i < this.edges.length; i++)
    {
      if(id === this.edges[i].id)
        return this.edges[i];
    }

    return null;
  },

  getCardinalityById: function(id)
  {
    for(var i = 0; i < this.edgesCardinality.length; i++)
    {
      if(id === this.edgesCardinality[i].id)
        return this.edgesCardinality[i];
    }

    return null;
  },

  /**
   * Retrieve all the symbols used as cardinality for reuse. Avoid redundencies, ie not recreate another
   * "d" cardinality value with another meaning for the system.
   */
  getUsedCardinality: function()
  {
    return this._calculatingCardinalitiesAvailable();
  },

};