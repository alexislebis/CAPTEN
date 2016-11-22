
/**
 * RGTE class is the representation of data concept bound together with relations.
 * Network is the graph, currently a vis.js network.
 */

function RGTE(){

  this.observers = [];
  this.nodes = [];//Need to be CAPTENCLass
  this.edges = [];
  this.edgesCardinality = []; //Array of edge (currently based on vis edge).

  this.context = null;
}

RGTE.nodeID = 0;
RGTE.edgeID = 0;
RGTE.cardiID = 0;

RGTE.prototype = {

// === ADDING METHODS ===
  addVisNode: function(nodeLabel, label){
    // var cls = new CAPTENClass(nodeLabel);
    // cls.id = RGTE.nodeID++;

    var cls = nodeLabel.copy();

    cls.idVoc = cls.id;
    cls.id = RGTE.nodeID++;

    for(var i in this.nodes)
      if(this.nodes[i].id === cls.id)
        throw new ClassAlreadyUsedInRGTE(cls, this);

    if(label != null)
      cls.label = label;
    else
      cls.label = nodeLabel.uri;

    cls.shape = "dot";
    cls.size = 30;
    // this.nodes.push({"id": RGTE.nodeID++, "label": nodeLabel, "shape": "dot", "size":30});
    this.nodes.push(cls);
    this.notifyChange();
  },

  // addVisProperty: function(fromID, toID, edgeLabel, arrows)
  // {
  //   var prop = new Property(edgeLabel);
  //   // prop.id = RGTE.edgeID++;
  //   prop.from = fromID.id;
  //   prop.to = toID.id;
  //   prop.arrows = arrows;
  //   prop.label = edgeLabel;
  //   // this.edges.push({"id": RGTE.edgeID++, "from":fromID, "to":toID, "label":edgeLabel, "arrows": "to"});
  //   this.edges.push(prop);
  //   this.notifyChange();
  // },

  addVisProperty: function(proper, arrows)
  {
    var prop = proper.copy();
    // prop.id = RGTE.edgeID++;
    prop.idVoc = proper.id;
    prop.id = RGTE.edgeID++;
    console.log(prop.id);
    prop.arrows = arrows;
    // prop.arrows = arrows;
    // prop.label = edgeLabel;
    // this.edges.push({"id": RGTE.edgeID++, "from":fromID, "to":toID, "label":edgeLabel, "arrows": "to"});
    this.edges.push(prop);
    this.notifyChange();
  },

  addEdgesCardinality: function(eid, fromCardinality, toCardinality)
  {
    this.edgesCardinality.push({"id": RGTE.cardiID++, "edgeId": eid, "fromCardinality":fromCardinality, "toCardinality": toCardinality});
    this.notifyChange();
  },
// ===

// === SERIALIZATION
  serializeToN3: function()
  {

  },

  serializeAndIntegrateVocabulary: function(vocab)
  {
    var voc = vocab.clone();

    console.log(voc.getClasses());

    for(var i in this.nodes)
      voc.addClass(this.nodes[i]);

    for(var i in this.edges)
      voc.addProperty(this._convertEdge(this.edges[i]));

    console.log(voc);// TODO Traduire les node id du rgte dans from et to en [] [] de prop.
    console.log(voc.serializeToN3());
  },
// ===

// === OBSERVATION
  registerObserverCallbackOnChange: function(objCallback, callback)
  {
    this.observers.push([objCallback,callback]);
  },

    // === NOTIFICATION
    notifyChange: function()
    {
      this.observers.forEach(function(e)
      {
        console.log(e);
          if (typeof e[1] === "function") {
            e[1].call(e[0]);//e[0] define the `this` context for e[1]
          }
      });
    },

// ===


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
    var fromOK = null;
    var toOK = null;

    for(var i = 0; (i < this.nodes.length && (!fromOK || !toOK)); i++)
    {
      if(this.nodes[i].id === fromID)
        fromOK = this.nodes[i];

      if(this.nodes[i].id === toID)
        toOK = this.nodes[i];
    }

    if(fromOK != null && toOK != null)
      return {"from":fromOK, "to":toOK, "label":edgeLabel, "arrows": "to"};

    return null;
  },

  updateEdgeCardinality: function(id, fromC, toC)
  {
    var index = this.edgeCardinalityExists(id)
    if(index != -1)
    {
      this.edgesCardinality[index].fromCardinality = fromC;
      this.edgesCardinality[index].toCardinality = toC;

      this.notifyChange();
    }
  },

// === EXISTENCE METHODS ===

edgeCardinalityExists: function(id){
  for(var i = 0; i < this.edgesCardinality.length; i++)
  {
    if(this.edgesCardinality[i].id === id)
      return i;
  }

  return -1;
},

// === PRIVATE METHODS ===

/**
 * Transform planar from & to edge attribute to arrayed ones for properties.
 */
 // NB : Edges used planar from & to because of multi use of the same properties
_convertEdge: function(edge)
{
  var nfrom = this.getNodeById(edge.from);

  if(nfrom == null)
    return;

  var nto = this.getNodeById(edge.to);
  if(nto == null)
    return;

  var e = edge.copy();
  e.from = [];
  e.to = [];

  e.from.push(nfrom);
  e.to.push(nto);

  return e;
},

  _calculatingCardinalitiesAvailable: function() {

      var cardinalitiesAvailable = [];

      this.edgesCardinality.forEach(function(e) {
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

  getNodesSerializedJSON: function()
  {
    var array = [];

    this.nodes.forEach(function(e){
      console.log(e);
      array.push(e);//JSON.stringify(e))
    }.bind(this));

    console.log(array);

    return array;
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

  getSortedUsedCardinality: function()
  {
    return this.getUsedCardinality().sort();
  },

};
