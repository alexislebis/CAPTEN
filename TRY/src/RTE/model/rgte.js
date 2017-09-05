
/**
 * RGTE class is the representation of data concept bound together with relations.
 * Network is the graph, currently a vis.js network.
 */

function RGTE(){

  this.id = CAPTEN.ID++; // DO NOT DELETE. IT IS NOT A CAPTEN CLASS CURRENTLY

  this.uri = RGTE_URI;

  // === PREDEFINED NARRATIVE ELEMENT
    // === NAME
      var elmt = new EntityName();
      var prop = new Property(HAS_NAME_URI, URI_TO_LABEL(HAS_NAME_URI) ,this.id, elmt.id);
      var res = NARRATIVE_BLOCK_POOL.addElementFor(this, elmt, prop);
      this.narrativeBlock = res.block;
      this.name = elmt; //The name of the step //WARNING potential conflict


  this.observers = [];

    // === Specialized observers
      this.innerBindingObservers = [];//For the linking inside a graph
      this.removedElmtObservers= []; //for listening elm removed (ie node or edge)
      this.addedElmtObservers= [];
      this.updatedElmtObservers= [];
      this.thisDeletedObservers = [];
      this.KidentifiedObservers = []; //When a K is identified
      this.KdeidentifiedObservers = [];

  this.nodes = [];//Need to be CAPTENCLass
  this.edges = [];
  this.edgesCardinality = []; //Array of edge (currently based on vis edge).

  this.knowledges = []; //the this.nodes identified as Knowledge. Reference is maintened via derivedFrom

  this.context = null;

  this.versions = null; //Array of different version with {Author, date, etc}

  // Keep a link with the instance of the same class which was used to produce this
  // copy function MUST DEFINE this.derivedFrom attribute.
  this.derivedFrom = null;

  // === BINDING BEHAVIORS
  this.propAsyncBuild = new PropertyAsyncrhonousBuilder(this, this);
    this.propAsyncBuild.setValidationFunction(this._propertyAsyncValidationFunction);
    this.propAsyncBuild.registerObserverCallbackOnCompletion(this, this._callbackInnerBindingComplete);
    this.propAsyncBuild.registerObserverCallbackOnUncompletion(this, this._callbackInnerBindingUncomplete);

    // ROLLBACK ATTRIBUTES
    this.lastAction = null;
    this.prevAlteredElement = null;//The element altered. In an add, nothing, in an update the initial, like in deletion
    this.prevSubstituteElement = null; //In add, the new, in update, the replacent, in remove nothing.
    this.previousKnowledge = null; //The last added K
}

RGTE.nodeID = 0;
RGTE.edgeID = 0;
RGTE.cardiID = 0;
RGTE.rgteID = 0;

RGTE.ACTIONS = [];
  RGTE.ACTIONS.ADD    = "ADD";
  RGTE.ACTIONS.UPDATE = "UPDATE";
  RGTE.ACTIONS.REMOVE = "REMOVE";
  RGTE.ACTIONS.K_ADD = "K_ADD";//Added a new Knowledge
  RGTE.ACTIONS.K_DEL = "K_DEL";//Deleted a new Knowledge

RGTE.NODES = "nodes";
RGTE.EDGES = "edges";
RGTE.CARDI = "edgesCardinality";
RGTE.KNOWLEDGES = "knowledges";

RGTE.delete = function(object, rgteRef)
{
  if(object == null || rgteRef == null || object[rgteRef] == null)
    return;

  object[rgteRef]._delete();
  delete object[rgteRef];
  object[rgteRef] = null;
}

RGTE.prototype = {

// === ADDING METHODS ===
  addVisNode: function(nodeLabel, label)
  {
    var cls = this._addVisNode(nodeLabel, label);
    //this.notifyChange();

    this.lastAction = RGTE.ACTIONS.ADD;
    this.prevAlteredElement = null;
    this.prevSubstituteElement = cls;


    this.notifyAdd(cls);

    return cls.id
  },

  _addVisNode: function(nodeLabel, label){ //Silence version, return a CAPTENClass
    // var cls = new CAPTENClass(nodeLabel);
    // cls.id = RGTE.nodeID++;

    var cls = nodeLabel.copy();

    cls.idVoc = nodeLabel;
    cls.id = CAPTEN.ID++;

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

    return cls;
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
    var prop = this._addVisProperty(proper, arrows);

    //this.notifyChange();

    this.lastAction = RGTE.ACTIONS.ADD;
    this.prevAlteredElement = null;
    this.prevSubstituteElement = prop;

    this.notifyAdd(prop);

    return prop.id;
  },
  _addVisProperty: function(proper, arrows)//Silence version. Return a Property
  {
    var prop = proper.copy();
    // prop.id = RGTE.edgeID++;
    prop.idVoc = proper.id;
    prop.id = CAPTEN.ID++;
    console.log(prop);
    prop.arrows = arrows;
    // prop.arrows = arrows;
    // prop.label = edgeLabel;
    // this.edges.push({"id": RGTE.edgeID++, "from":fromID, "to":toID, "label":edgeLabel, "arrows": "to"});
    this.edges.push(prop);

    return prop;
  },

  addEdgesCardinality: function(eid, fromCardinality, toCardinality)
  {
    this.edgesCardinality.push({"id": CAPTEN.ID++, "edgeId": eid, "fromCardinality":fromCardinality, "toCardinality": toCardinality});
    this.notifyChange();
  },
// ===

  /**
   * Copy return this copied, with ancestor updated and a new attribute idEquivalence storing the oldId ref of any element of this to the newID of any alement of the new rgte
   */
  copy: function()
  {
    var newRGTE = new RGTE();
    // var tmpCls;
    // var classID = [];

    if(newRGTE.ancestor == null)
      newRGTE.ancestor = [];
    newRGTE.ancestor.push(this);

    newRGTE.idEquivalence = [];// key:[oldID;newID]

    newRGTE.observers = this.observers;

    console.log(this.nodes);
    for(var i in this.nodes)
    {
      var tmpCls = this.nodes[i].copy();
      var classID = [];

      classID.push(this.nodes[i].id);
      classID.push(tmpCls.id);

      newRGTE.idEquivalence.push(classID);

      newRGTE.nodes.push(tmpCls);
    }

    for(var i in this.edges)
    {
      var tmpProp = this.edges[i].copy();
      var propID = [];

      propID.push(this.edges[i].id),
      propID.push(tmpProp.id);

      newRGTE.idEquivalence.push(propID);

      tmpProp.from = newRGTE._getIdEquivalenceById("OLD_ID", this.edges[i].from)[1];
      tmpProp.to = newRGTE._getIdEquivalenceById("OLD_ID", this.edges[i].to)[1];

      if(this.edges[i].arrows != null)
        tmpProp.arrows = this.edges[i].arrows;

      newRGTE.edges.push(tmpProp);
    }

    for(var i in this.edgesCardinality)
      newRGTE.addEdgesCardinality(this.edgesCardinality[i].id, newRGTE._getIdEquivalenceById("OLD_ID", this.edgesCardinality[i].fromCardinality)[1], newRGTE._getIdEquivalenceById("OLD_ID", this.edgesCardinality[i].toCardinality)[1]);

    newRGTE.derivedFrom = this;

    return newRGTE;
  },

  merge: function(rgte)
  {
    if( rgte == null)
      return null;

    var nr1 = this.copy();
    var nr2 = rgte.copy();

    console.log(nr1);
    console.log(nr2);

    for(var i in nr2.nodes)
    {
      console.log(nr2.nodes[i]);
      nr1.nodes.push(nr2.nodes[i]);
      console.log(nr1.nodes)
    }

    for(var i in nr2.edges)
      nr1.edges.push(nr2.edges[i]);

    for(var i in nr2.edgesCardinality)
      nr1.edgesCardinality.push(nr2.edgesCardinality[i]);

    for(var i in nr2.idEquivalence)
      nr1.idEquivalence.push(nr2.idEquivalence[i]);

    return nr1;
  },

  /**
   * Compute the dispersion of the RGTE regarding the vocabulary.
   * Dispersion = RGTE \ VOCAB.
   * @return 2D array with classes and properties keys, containing all the non matched elements of this (RGTE) in the vocabulary vocab
   */
  vocabularyDispersion: function(vocab)
  {
    var dispArray = [];
    dispArray['classes'] = [];
    dispArray['properties'] = [];

    for(var i  in this.nodes)
      if(this.nodes[i].includedIn(vocab.getClasses()) == -1)
        dispArray['classes'].push(this.nodes[i]);

    for(var i in this.edges)
      if(this.edges[i].includedIn(vocab.getProperties()) == -1)
        dispArray['properties'].push(this.edges[i]);

      return dispArray;
  },

// === SERIALIZATION
  serializeToJSON: function()
  {
    var seri = {};

    seri['id'] = this.id;
    seri['type'] = 'RGTE';
    seri['uri'] = RGTE_URI;

    seri[RGTE.NODES] = {};
    seri[RGTE.EDGES] = {};
    seri[RGTE.CARDI] = {};
    seri[RGTE.KNOWLEDGES] = {};

    for(var i in this.nodes)
    {
      seri[RGTE.NODES][i] = {};
      seri[RGTE.NODES][i] = this.nodes[i].serializeToJSON();
    }

    for(var i in this.edges)
    {
      seri[RGTE.EDGES][i] = {};
      seri[RGTE.EDGES][i] = this.edges[i].serializeToJSON();
    }

    for(var i in this.edgesCardinality)
    {
      seri[RGTE.CARDI][i] = {};
      seri[RGTE.CARDI][i] = this.edgesCardinality[i];
    }

    seri['narrativeBlock'] = this.narrativeBlock.id;

    for(var i in this.knowledges)
    {
      seri[RGTE.KNOWLEDGES][i] = {};
      seri[RGTE.KNOWLEDGES][i] = this.knowledges[i].serializeToJSON();
    }

    // console.log(seri);
    return seri;
  },

  serializeToJSONv2: function()
  {
    var seri = {};

    seri['id'] = this.id;
    seri['type'] = 'RGTE';
    seri['uri'] = RGTE_URI;

    seri[RGTE.NODES] = {};
    seri[RGTE.EDGES] = {};
    seri[RGTE.CARDI] = {};
    seri[RGTE.KNOWLEDGES] = {};

    for(var i in this.nodes)
    {
      seri[RGTE.NODES][i] = {};
      seri[RGTE.NODES][i] = this.nodes[i].id;
    }

    for(var i in this.edges)
    {
      seri[RGTE.EDGES][i] = {};
      seri[RGTE.EDGES][i] = this.edges[i].id;
    }

    for(var i in this.edgesCardinality)
    {
      seri[RGTE.CARDI][i] = {};
      seri[RGTE.CARDI][i] = this.edgesCardinality[i];
    }

    seri['narrativeBlock'] = this.narrativeBlock.id;

    for(var i in this.knowledges)
    {
      seri[RGTE.KNOWLEDGES][i] = {};
      seri[RGTE.KNOWLEDGES][i] = this.knowledges[i].id;
    }

    // console.log(seri);
    return {rgte: seri};
  },


  //TODO update versions of this.vocab with usernames & others
  serializeAndIntegrateVocabulary: function(vocab, usernames, prefixes)
  {
    var voc = vocab.clone();

    console.log(voc.getClasses());

    for(var i in this.nodes)
      voc.addClass(this.nodes[i]);

    for(var i in this.edges)
      voc.addProperty(this._convertEdge(this.edges[i]));

    return voc.serializeToN3();
  },
// ===

// === OBSERVATION
  registerObserverCallbackOnChange: function(objCallback, callback)
  {
    if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.observers))
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

    // === SPECIALIZED OBSERVATIONS
      // === REGISTER
        registerObserverCallbackInnerBinding: function(objCallback, callback)
        {
          if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.innerBindingObservers))
            this.innerBindingObservers.push([objCallback, callback]);
        },
        registerObserverCallbackElementRemoved: function(objCallback, callback)
        {
          if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.removedElmtObservers))
            this.removedElmtObservers.push([objCallback,callback]);
        },

        registerObserverCallbackElementAdded: function(objCallback, callback)
        {
          if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.addedElmtObservers))
            this.addedElmtObservers.push([objCallback,callback]);
        },

        registerObserverCallbackElementUpdated: function(objCallback, callback)
        {
          if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.updatedElmtObservers))
            this.updatedElmtObservers.push([objCallback,callback]);
        },
        registerObserverCallbackGraphDeleted: function(objCallback, callback)
        {
          if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.thisDeletedObservers))
            this.thisDeletedObservers.push([objCallback,callback]);
        },
        registerObserverCallbackOnKnowledgeIdentified: function(objCallback, callback)
        {
          if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.KidentifiedObservers))
            this.KidentifiedObservers.push([objCallback,callback]);
        },
        registerObserverCallbackOnKnowledgeDeidentified: function(objCallback, callback)
        {
          if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.KdeidentifiedObservers))
            this.KdeidentifiedObservers.push([objCallback,callback]);
        },
      // === NOTIFIER
        notifyInnerBinding: function()
        {
          this.innerBindingObservers.forEach(function(e){
            if(typeof e[1] === "function")
            {
              e[1].call(e[0], this);
            }
          }.bind(this));
        },
        notifyRemove: function(elmtRemoved)
        {
          this.removedElmtObservers.forEach(function(e)
          {
            console.log(e);
              if (typeof e[1] === "function") {
                e[1].call(e[0], this, elmtRemoved);//e[0] define the `this` context for e[1]
              }
          }.bind(this));
          this.notifyChange();
        },
        notifyAdd: function(elmtAdded)
        {
          this.addedElmtObservers.forEach(function(e)
          {
            console.log(e);
              if (typeof e[1] === "function") {
                e[1].call(e[0], this, elmtAdded);//e[0] define the `this` context for e[1]
              }
          }.bind(this));
          this.notifyChange();
        },
        notifyUpdate: function(elmtUpdated)
        {
          this.updatedElmtObservers.forEach(function(e)
          {
            console.log(e);
              if (typeof e[1] === "function") {
                e[1].call(e[0], this, elmtUpdated);//e[0] define the `this` context for e[1]
              }
          }.bind(this));
          this.notifyChange();
        },
        notifyDelete: function()
        {
          this.thisDeletedObservers.forEach(function(e)
          {
            console.log(e);
              if (typeof e[1] === "function") {
                e[1].call(e[0], this.id);//e[0] define the `this` context for e[1]
              }
          }.bind(this));
          this.notifyChange();
        },
        notifyKIdentification: function()
        {
          this.KidentifiedObservers.forEach(function(e)
          {
            console.log(e);
              if (typeof e[1] === "function") {
                e[1].call(e[0], this.id);//e[0] define the `this` context for e[1]
              }
          }.bind(this));
          this.notifyChange();
        },
        notifyKDeidentification: function()
        {
          this.KdeidentifiedObservers.forEach(function(e)
          {
            console.log(e);
              if (typeof e[1] === "function") {
                e[1].call(e[0], this.id);//e[0] define the `this` context for e[1]
              }
          }.bind(this));
          this.notifyChange();
        },
    // === END SPECIALIZED OBSERVATION

  resetObservers: function()
  {
    this.observers = [];
  },

// ===

// === PARSING
  parseJSON: function(json, vocab)
  {
    // throw new Error("Identification to the rdf voc is not correctly done. Must use the structure of the json and match uri")
    // console.log(json.nodes[0].subClassOf[0].uri);
    // console.log(json['nodes'][0]['subClassOf'][0].uri);

    if(json['type'] == null || json['type'] != 'RGTE')
      return; //not a rgte json

      if(vocab == null)
        vocab = new CONTROLLED_VOCABULARY(); //The vocab cannot be null since uri depends of it, even custom one


    this[RGTE.NODES] = [];
    this[RGTE.EDGES] = [];
    this[RGTE.CARDI] = [];

    // === NODES
    for(var i in json[RGTE.NODES])
    {
      var node = new CAPTENClass();

      node.parseJSONObject(json[RGTE.NODES][i], vocab);
      this._updateNodeVoc(node, vocab);
      // vocab.addClass(node);

      this[RGTE.NODES].push(node);
    }
    for(var i in this.nodes) //while all nodes are loaded and the vocab was update, inheritence needs to be recmputed correctly (currently only id & uri are stored)
      this.nodes[i].updateInheritences(vocab);


    console.log(this);
    // === EDGES
    for(var i in json[RGTE.EDGES])
    {
      var edge = PROPERTIES_POOL.create();
      edge.parseJSONObject(json[RGTE.EDGES][i]);

      // vocab.addProperty(edge);
      this[RGTE.EDGES].push(edge);
    }

    // === EDGES CARDINALITIES
    for(var i in json[RGTE.CARDI])
    {
      this.edgesCardinality.push({"id": json[RGTE.CARDI][i].id, "edgeId": json[RGTE.CARDI][i].edgeId, "fromCardinality":json[RGTE.CARDI][i].fromCardinality, "toCardinality": json[RGTE.CARDI][i].toCardinality});
    }
      // var clsTEST = new CAPTENClass();
      // var jsonO = JSON.parse('{"id":0,"uri":"aze","isBlank":false,"iName":"Class","label":"aze","inheritanceArray":[],"idVoc":15,"shape":"dot","size":30,"subClassOf":{},"subClasses":{},"properties":{}}');

      this.notifyChange();
      vocab.notifyChange();

      console.log(this.vocabularyDispersion(vocab));
      console.log(vocab);
      console.log(this);
      // clsTEST.parseJSONObject(jsonO);
  },

  _updateNodeVoc: function(captenClass, vocab)
  {
    if(captenClass.idVoc.uri == null)
      return;

    var voc = vocab.getClassFromURI(captenClass.idVoc.uri);

    if(voc == null)
    {
      var newCaptenCls = new CAPTENClass(captenClass.idVoc.uri);
      vocab.addClass(newCaptenCls);

      voc = newCaptenCls;
    }

    captenClass.idVoc = voc;
  },
// ===


  setColorNode: function(nodeID, color)
  {
    if(nodeID == null)
      return;

    this.getNodeById(nodeID).color = color;

    this.notifyChange();
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

_getIdEquivalenceById: function(location, ID)
{
  if(this.idEquivalence == null)
    return;

  var index = 1;

  if(location = "OLD_ID");
    index = 0;

  for(var i in this.idEquivalence)
    if(this.idEquivalence[i][index] == ID)
      return this.idEquivalence[i];

  return null;
},
_isIdEquivalenceExists: function(location,ID)
{
  if(this._getIdEquivalenceById(location, ID) == null)
    return false;

  return true;

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

// === ROLLBACK
rollback: function()
{
  switch (this.lastAction) {
    case RGTE.ACTIONS.ADD:
      this._rollbackAdd();
      break;
    case RGTE.ACTIONS.UPDATE:
      this._rollbackUpdate();
      break;
    case RGTE.ACTIONS.REMOVE:
      this._rollbackRemove();
      break;
    case RGTE.ACTIONS.K_ADD:
      this._rollbackKnowledgeAdd();
      break;
    case RGTE.ACTIONS.K_DEL:
      this._rollbackKnowledgeDelete();
      break;
    default:
  }

  this.lastAction = null;
  this.prevAlteredElement = null;
  this.prevSubstituteElement = null;

  this.notifyChange();
},

_rollbackAdd: function()
{
  if(this.prevSubstituteElement == null)
    return;

  if(this.prevSubstituteElement instanceof CAPTENClass)
    this.removeNode(this.prevSubstituteElement.id);
  else if(this.prevSubstituteElement instanceof Property)
    this.removeEdge(this.prevSubstituteElement.id);
},

_rollbackUpdate: function()
{
  if(this.prevAlteredElement == null || this.prevSubstituteElement == null)
    return;

  if(this.prevAlteredElement instanceof CAPTENClass)
  {
    this.updateNode(this.prevSubstituteElement.id, this.prevAlteredElement);
  }
  else if(this.prevAlteredElement instanceof Property)
  {
    this.updateEdge(this.prevSubstituteElement.id, this.prevAlteredElement);
  }
},

_rollbackRemove: function()
{
  if(this.prevAlteredElement == null)
       return;

     if(this.prevAlteredElement instanceof CAPTENClass)
     {
       if(this.prevSubstituteElement ==null)
         return;

       var tmpDerived = this.prevAlteredElement.derivedFrom;
       var tmpSubstituates = this.prevSubstituteElement;
       var tmpAltered = this.prevAlteredElement;

       var newNode = this._addVisNode(this.prevAlteredElement, this.prevAlteredElement.label);
       newNode.derivedFrom = tmpDerived;

       for(var i in tmpSubstituates)//All prop altered previously by the deletion
       {
         var tmpEdge = PROPERTIES_POOL.getByID(tmpSubstituates[i].id);

         tmpDerived = tmpEdge.derivedFrom;

         var eID = this.addVisProperty(tmpEdge, tmpEdge.arrows);
         var newEdge = this.getEdgeById(eID);

         newEdge.derivedFrom = tmpDerived;

         if(newEdge.from == tmpAltered.id)
         {
           this.updateEdgeFromTo(eID, newNode.id, newEdge.to);
         }
         else if(newEdge.to == tmpAltered.id)
         {
           this.updateEdgeFromTo(eID, newEdge.from, newNode.id);
         }
       }
     }



    // for(var i in PROPERTIES_POOL.pool)
      // {
      //   if(PROPERTIES_POOL.pool[i].id == newEdge.derivedFrom.id)
      //   {
      //     if(PROPERTIES_POOL.pool[i].from == tmpAltered.id)
      //     {
      //        PROPERTIES_POOL.pool[i].updateFromTo(id, PROPERTIES_POOL.pool[i].to);
      //     }
      //     else if(PROPERTIES_POOL.pool[i].to == tmpAltered.id)
      //     {
      //       PROPERTIES_POOL.pool[i].updateFromTo(PROPERTIES_POOL.pool[i].from, id);
      //     }
      //   }
      // }
  else if(this.prevAlteredElement instanceof Property)
  {
    var tmpAltered = this.prevAlteredElement;

    var id = this.addVisProperty(this.prevAlteredElement, this.prevAlteredElement.arrows);
    this.getEdgeById(id).derivedFrom = tmpAltered.derivedFrom;
  }

},

  _rollbackKnowledgeAdd: function()
  {
    if(this.previousKnowledge == null)
      return;

    this.removeKnowledgeFromSource(this.previousKnowledge.derivedFrom.id);
  },

  _rollbackKnowledgeDelete: function()
  {
    if(this.previousKnowledge == null)
      return;

    this.addKnowledgeFromSource(this.previousKnowledge.derivedFrom.id);
  },
// ===

// === GETTERS ===
  getNodes: function()
  {
    return this.nodes;
  },

  getNodesSerializedJSON: function()
  {
    var array = [];
    //
    // this.nodes.forEach(function(e){
    //   console.log(e);
    //   array.push(e);//JSON.stringify(e))
    // }.bind(this));

    for(var i in this.nodes)
    {
      array.push(this.nodes[i]);
    }

    console.log(array);

    return array;
  },

  getEdges: function()
  {
    var array = [];
    for(var i in this.edges){ //@WARNING OPTI
      array.push(this.edges[i]);
    }
    return array;
  },

  getEdgesCardinality: function()
  {
    return this.edgesCardinality;
  },

  getNodeById: function(id)
  {
    for(var i in this.nodes)
    {
      if(id === this.nodes[i].id)
        return this.nodes[i];
    }

    return null;
  },

  getEdgeById: function(id)
  {
    for(var i in this.edges)
    {
      if(id === this.edges[i].id)
        return this.edges[i];
    }

    return null;
  },

  getCardinalityById: function(id)
  {
    for(var i in this.edgesCardinality)
    {
      if(id === this.edgesCardinality[i].id)
        return this.edgesCardinality[i];
    }

    return null;
  },

  updateNode: function(nodeToUpdateID, newNode)
  {
    var result = this._updateNode(nodeToUpdateID, newNode);

    if(result)
      this.notifyUpdate(result);

    return result;
  },
  _updateNode: function(nodeToUpdateID, newNode)
  {
    if(nodeToUpdateID == null || typeof nodeToUpdateID != 'number')
      return null;

    if(newNode == null)
      return;

    var initialNode = this.getNodeById(nodeToUpdateID);
    var res = this._removeNode(nodeToUpdateID, true);

    var cls = this._addVisNode(newNode, newNode.label);

    //Trick for update. Since newNode is anonymous and unuseful for trackback,
    //we set derivedFrom on the nodeToUpdateID, saying that cls come from the updatedNode
    //Usefull for function such as _findDerivationCorrespondance@Step.js
      cls.derivedFrom = initialNode;

    res = this._cleanUnrelevantProperties(res);

    for(var i in res)
    {
      if(res[i].from === nodeToUpdateID)
      {
        // this.rgte.updateEdgeFromTo(res[i], addClass(this.nodeIDSelected), res[i].to);
        this.updateEdgeFromTo(this._addVisProperty(res[i], 'to').id, cls.id, res[i].to);
      }
      else if(res[i].to === nodeToUpdateID)
      {
        this.updateEdgeFromTo(this._addVisProperty(res[i], 'to').id, res[i].from, cls.id);
      }
      else {
        throw new Error("Unexpected property to update");
      }

      this._removeEdge(res[i].id, true);
    }

    this.lastAction = RGTE.ACTIONS.UPDATE;
    this.prevAlteredElement = initialNode;
    this.prevSubstituteElement = cls;

    return cls;
  },

  _cleanUnrelevantProperties: function(res)
  {
    var indexes = [];
    for(var i in res)
    {
      if(res[i].uri == "http://www.CAPTEN.org/SEED/ontologies/hasNarrativeBlock")
      {
        indexes.push(res[i]);
      }
    }

    var offset = 0;

    for(var i in indexes)
    {
      res.splice(i-offset, 1);
    }

    return res;
  },

  _delete: function()
  {
    this.notifyDelete();
  },

  updateEdge: function(edgeToUpdateID, newEdge)
  {
    var result = this._updateEdge(edgeToUpdateID, newEdge);

    if(result)
      this.notifyUpdate(result);

    return result;
  },

  _updateEdge: function(edgeToUpdateID, newEdge)
  {
    if(edgeToUpdateID == null || typeof edgeToUpdateID != 'number')
      return null;

    if(newEdge == null)
      return;

    var initialEdge = PROPERTIES_POOL.getByID(edgeToUpdateID);
    var res = this._removeEdge(edgeToUpdateID, true);

    if(res == null || res.length < 2)
    {
      throw new Error("Unexpected nodes for redraw property");
      return;
    }

    var edge = this._addVisProperty(newEdge, 'to');

      edge.derivedFrom = initialEdge;

    this.updateEdgeFromTo(edge.id, res[0], res[1]);

    this.lastAction = RGTE.ACTIONS.UPDATE;
    this.prevAlteredElement = initialEdge;
    this.prevSubstituteElement = edge;

    return edge;
  },

  removeNode: function(nodeID)
  {
    var delNode = this.getNodeById(nodeID);

    var affectedProps = this._removeNode(nodeID);

    this.lastAction = RGTE.ACTIONS.REMOVE;
    this.prevAlteredElement = delNode;
    this.prevSubstituteElement = affectedProps;

    this.notifyRemove(delNode);

    return affectedProps;
  },
  _removeNode: function(nodeID)//Silence remove
  {
    var affectedProps = [];

    for(var i in this.nodes)
    {
      if(this.nodes[i].id === nodeID)
      {
        affectedProps = PROPERTIES_POOL.relatedProperties(nodeID);

        for(var j in affectedProps)
          this._removeEdge(affectedProps[j].id);

        var notif = this.nodes.splice(i,1)[0];
        // if(!isSilent || isSilent == null)
        //   this.notifyRemove(notif);//Remove the ieme elmt of this.nodes and notify the remove by taking the 1st elmt returned (and the only one)

        return affectedProps;
      }
    }
  },

  removeEdge: function(propertyID)//With notification of change
  {
    var delEdge = PROPERTIES_POOL.getByID(propertyID);

    var affectedNodes = this._removeEdge(propertyID);

    this.lastAction = RGTE.ACTIONS.REMOVE;
    this.prevAlteredElement = delEdge;
    this.prevSubstituteElement = null;

    this.notifyRemove(delEdge);

    return affectedNodes;
  },
  _removeEdge: function(propertyID)//Without notification of change
  {
    var affectedNodes = [];

    for(var i in this.edges)
    {
      if(this.edges[i].id === propertyID)
      {
        affectedNodes.push(this.edges[i].from);
        affectedNodes.push(this.edges[i].to);

        //this.edges.splice(i,1);

        var notif = this.edges.splice(i,1)[0];
        // if(!isSilent || isSilent == null)
        //   this.notifyRemove(notif);//Remove the ieme elmt of this.edges and notify the remove by taking the 1st elmt returned (and the only one)

        return affectedNodes;
      }
    }
  },

  updateEdgeFromTo: function(id, from, to)
  {
    for(var i in this.edges)
    {
      if(this.edges[i].id === id)
      {
        this.edges[i].from = from;
        this.edges[i].to = to;

        //console.log(PROPERTIES_POOL.getByID(id));

        this.notifyChange();
        //this.notifyUpdate(this.edges[i]);

        return id;
      }
    }
  },

  // === KNOWLEDGE MANAGEMENT FUNCTION

    KnowledgeExistsFromSource: function(idOfSource)//Try to find the source in derived from for K regarding the given id
    {
      if(this.getNodeById(idOfSource) == null)
        return null;

      return this._lazyKnowledgeExistsFromSource(idOfSource);
    },

    _lazyKnowledgeExistsFromSource: function(idOfSource)
    {
      for(var i = 0; i < this.knowledges.length; i++)
      {
        if(this.knowledges[i].derivedFrom != null && this.knowledges[i].derivedFrom.id == idOfSource)
          return this.knowledges[i];
      }
      return null;
    },

    addKnowledgeFromSource: function(idOfSource)
    {
      var node = this.getNodeById(idOfSource);
      if(node == null)
        return null;

      var isExisting = this._lazyKnowledgeExistsFromSource(idOfSource);
      if(isExisting != null)
        return isExisting;

      var newK = new ExploitableOutput(node);

      this.knowledges.push(newK);

      this.lastAction = RGTE.ACTIONS.K_ADD;
      this.previousKnowledge = newK;
      this.notifyKIdentification();

      return newK;
    },

    removeKnowledgeFromSource: function(idOfSource)
    {
      var indexToSplice = -1;
      for(var i = 0; i < this.knowledges.length; i++)
      {
        if(this.knowledges[i].derivedFrom != null && this.knowledges[i].derivedFrom.id == idOfSource)
        {
          indexToSplice = i;
          break;
        }
      }

      if(indexToSplice == -1)
        return;

      var elmSliced = this.knowledges[indexToSplice];
      elmSliced.derivedFrom.color = null;

      this.knowledges.splice(indexToSplice,1);

      this.lastAction = RGTE.ACTIONS.K_DEL;
      this.previousKnowledge = elmSliced;
      this.notifyKDeidentification();

      return elmSliced;

    },

    getKnowledgeById: function(id)
    {
      for(var i = 0; i < this.knowledges.length; i++)
        if(this.knowledges[i].id == id)
          return this.knowledges[i];
      return null;
    },

    getKnowledges: function()
    {
      return this.knowledges;
    },
  // === END OF K MANAGEMENT

  isEmpty: function()
  {
    var counter = 0;

    for(var i in this.nodes)
    {
      if(counter > 0)
        return false;

      counter++;
    }

    return counter > 0 ? false : true;
  },


  // === PROPERTY ASYNC BUILDER
  resetBinding: function()
  {
    this.propAsyncBuild.reset();
  },

  bind: function(a, prop, b)
  {
    if(a == null) //b can be null, but not a
      return;


    var id = null;

    if(a.id)
      id = a.id;
    else if(!isNaN(a))
      id = a;

    if(id == null)
      return null;

    this.propAsyncBuild.bind(this.getNodeById(id), prop.uri, prop.label);

    if(b != null)
      this.propAsyncBuild(this.getNodeById(id), prop.uri, prop.label);
  },

  _propertyAsyncValidationFunction: function(A, B, arrayToFill)
  {
    var isFromOk = false; var isToOk = false;

    for(var i in arrayToFill)
    {
      for(var j in A.getNodes())
      {
        if(arrayToFill[i].from == A.getNodes()[j].id)
        {
          isFromOk = true;
        }
        if(arrayToFill[i].to == A.getNodes()[j].id)
        {
          isToOk = true;
        }

        if(isFromOk && isToOk)
          return true;
      }
    }

    return false;
  },

  _callbackInnerBindingComplete: function()
  {
    var prop;
    var arr = this.propAsyncBuild.getArrayFilled();

    for(var i in arr)
      prop = arr[i];

    prop.from = prop.from;
    prop.to = prop.to;
    this.addVisProperty(prop, "to");

    this.propAsyncBuild.reset();

    this.notifyInnerBinding();
  },

  _callbackInnerBindingUncomplete: function()
  {

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

  // === OVERRIDED METHODS
    contains: function(obj)
    {
      //CHECK if obj is a NODE or a prop or this
      if(obj instanceof RGTE)
      {
        throw new Error('Unimplemented function');
        return;
      }

      if(obj instanceof CAPTENClass)
      {
        var idPath = '';

        if(obj.idVoc == null)//Verifying if the obj is just a vocabulary OR used inside another RGTE
        {
          for(var i in this.nodes)
          {
              if(this.nodes[i].idVoc.retrieveUniqueIdentifier() == obj.id)
                return this.nodes[i];
          }
        }
        else
        {
          for(var i in this.nodes)
          {
              if(this.nodes[i].retrieveUniqueIdentifier() == obj.id)
                return this.nodes[i];
          }
        }

        return;
      }

      if(obj instanceof Property)
      {
        throw new Error('Unimplemented function');
        return;
      }

      return;
    },

    retrieveUniqueIdentifier: function()
    {
      return this.id;
    },

    getName: function()
    {
      var name = this.name.getName();
      if(name == null || name == "")
      {
        var tabs = this.narrativeBlock.getElementsFromURIProperty(HAS_NAME_URI);
        if(tabs.length > 0)
        {
          name = tabs[0].getName();
          this.name = tabs[0];
        }
      }

      return name;
    },

    setName: function(exString)
    {
      if(exString == null || this.name == null)
        return;

      if(!exString instanceof ExtendedString)
      {
        var e = new ExtendedString();
        e.update(exString);
        exString = e;
      }

      this.name.updateElement(exString);
    },

    // Retrieve all narrative blocks concerning all the elements of the graphs (nodes & props & others)
    // map: The map to enrich
    mapNarrativeBlock: function(map)
    {
      this.narrativeBlock.mapNarrativeBlock(map);

      for(var i in this.nodes)
        if(this.nodes[i] != null)
          this.nodes[i].mapNarrativeBlock(map);
      for(var i in this.edges)
        if(this.edges[i] != null)
          this.edges[i].mapNarrativeBlock(map);
      for(var i in this.knowledges)
        if(this.knowledges[i] != null)
          this.knowledges[i].mapNarrativeBlock(map);

      if(this.derivedFrom != null)
        this.derivedFrom.mapNarrativeBlock(map);
    },

    mapIdElementsUsed: function(map)
    {
      if(this.x) //x reprensent the state of the function. If True, somehow the propagation is cyclic and thus it is stopped
        return;
      this.x = true;

      map[this.id] = this.id;

      for(var i in this.nodes)
        if(this.nodes[i] && this.nodes[i].mapIdElementsUsed && !IF_MAP_CONTAINS(map, this.nodes[i].id))
          this.nodes[i].mapIdElementsUsed(map);
      // for(var i in this.edges)
      //   if(this.edges[i] && this.edges[i].mapIdElementsUsed)
      //     this.edges[i].mapIdElementsUsed(map);
      for(var i in this.knowledges)
        if(this.knowledges[i] && !IF_MAP_CONTAINS(map, this.knowledges[i].id))
          this.knowledges[i].mapIdElementsUsed(map);

      if(this.derivedFrom && !IF_MAP_CONTAINS(map, this.derivedFrom.id))
        this.derivedFrom.mapIdElementsUsed(map);

      this.x = false;
    },

    mapElementsUsed: function(map)
    {
      if(this.x) //x reprensent the state of the function. If True, somehow the propagation is cyclic and thus it is stopped
        return;
      this.x = true;

      map[this.id] = this;

      for(var i in this.nodes)
        if(this.nodes[i] && this.nodes[i].mapElementsUsed && !IF_MAP_CONTAINS(map, this.nodes[i].id))
          this.nodes[i].mapElementsUsed(map);
      for(var i in this.edges)
        if(this.edges[i] && this.edges[i].mapIdElementsUsed)
          this.edges[i].mapElementsUsed(map);
      for(var i in this.knowledges)
        if(this.knowledges[i] && !IF_MAP_CONTAINS(map, this.knowledges[i].id))
          this.knowledges[i].mapElementsUsed(map);

      if(this.derivedFrom && !IF_MAP_CONTAINS(map, this.derivedFrom.id))
        this.derivedFrom.mapElementsUsed(map);

      this.x = false;
    },
};
