/**
 * CAPTENLoader import a JSON object (NOT a JSON string) representing an export
 * of CAPTEN into the curret CAPTEN structure.
 * It uses of the various POOL to work.
 * Return the new current vocab, customs cls and props.
 */
function CAPTENLoader()
{
  this.recallFunction = {src: null, func: null};
  this.vocab = null;
  this.customcls = null;
  this.customprops = null;

  this.alreadyDone = false; //prevent the rdf graph to call several time the same methods

  this.alignements = []; // Array for align old id with new. Each cell is of the form : {newObject: x, subjects: [ {obj: y, attr: z }]}, keyed by oldObject.id
}

CAPTENLoader.prototype = {

  import: function(json, vocab, customcls, customprops, src, func)
  {
    if(json == null)
      return;

    if(vocab == null)
      this.vocab = new CONTROLLED_VOCABULARY();
    else
      this.vocab = vocab;

    if(customcls == null)
      this.customcls = [];
    else
      this.customcls = customcls;

    if(customprops == null)
      this.customprops = [];
    else
      this.customprops = customprops;

    this.recallFunction.src = src; this.recallFunction.func = func;

    this._deserializeVocab(json, this.vocab, this.customcls, this.customprops);
  },

  _continueImport: function(json, vocab, customcls, customprops)
  {
    this._deserializeProperties(json);
    this._deserializeGraphs(json);
    this._deserializeNarrativeOperations(json);
    this._deserializeNarrativeBlocks(json); // MUST BE IN LAST POSITION

    this._solve();
  },

  _solve: function()
  {
    var unresolved = [];

    for(var i in this.alignements)
    {
      if(this.alignements[i].newObject)
      {
        for(var j in this.alignements[i].subjects)
        {
          if(this.alignements[i].subjects[j].obj instanceof Property && ( this.alignements[i].subjects[j].attr == 'from' || this.alignements[i].subjects[j].attr == 'to') )
            this.alignements[i].subjects[j].obj[this.alignements[i].subjects[j].attr] = this.alignements[i].newObject.id;
          else
            this.alignements[i].subjects[j].obj[this.alignements[i].subjects[j].attr] = this.alignements[i].newObject;
        }
      }
      else
      {
        unresolved.push(this.alignements[i]);
      }
    }

    console.log("UNRESOLVED ALIGNEMENTS");
    console.log(unresolved);
    console.log("======================");
  },

  _deserializeProperties: function(json)
  {
    var props = json.properties;
    var p;

    for(var i in props)
    {
      p = this._createPropertyFromJSON(props[i]);
      PROPERTIES_POOL.register(p);
    }
  },

  _createPropertyFromJSON: function(propjson)
  {
    var p = new Property();

    this._captenPropertyBuilder(p, propjson);

    return p;
  },

  _deserializeNarrativeOperations: function(json)
  {
    console.log(json.operations);
    var analyses = json.operations.analyses;
    var a;

    var operators = json.operations.operators;
    var o;

    for(var i in operators)
    {
      o = this._createOperatorFromJSON(operators[i]);
      NARRATED_OPERATION_POOL.registerNOP(o);
    }

    for(var i in analyses)
    {
      a = this._createAnalysisFromJSON(analyses[i]);
      NARRATED_OPERATION_POOL.registerNAP(a);
    }

  },

  _createOperatorFromJSON: function(analysisjson)
  {
    var a = new NarratedOperator();

    // this._addNewAlignmentRow(analysisjson.id, a, null);

    a = this._captenClassBuider(a, analysisjson);

    this._addNewAlignmentRow(analysisjson.behaviors.input.id, null, {obj: a.behaviors, attr: "input" });
    this._addNewAlignmentRow(analysisjson.behaviors.output.id, null, {obj: a.behaviors, attr: "output"});

    if(analysisjson.expectedConcepts)
      this._addNewAlignmentRow(analysisjson.expectedConcepts.id, null, {obj: a, attr: "expectedConcepts"});


    console.log("inheritanceArray currently ignored");


    console.log("properties currently ignored");

    var s;
    for(var i in analysisjson.steps)
    {
      s = this._createStepFromJSON(analysisjson.steps[i]);
      a.addStep(s);
    }

    if(analysisjson.uriConceptConvoyed)
      a.uriConceptConvoyed = analysisjson.uriConceptConvoyed;

    return a;
  },

  _createAnalysisFromJSON: function(analysisjson)
  {
    var a = new NarratedAnalysisProcess();

    // this._addNewAlignmentRow(analysisjson.id, a, null);

    a = this._captenClassBuider(a, analysisjson);

    this._addNewAlignmentRow(analysisjson.behaviors.input.id, null, {obj: a.behaviors, attr: "input" });
    this._addNewAlignmentRow(analysisjson.behaviors.output.id, null, {obj: a.behaviors, attr: "output"});

    if(analysisjson.expectedConcepts)
      this._addNewAlignmentRow(analysisjson.expectedConcepts.id, null, {obj: a, attr: "expectedConcepts"});


    console.log("inheritanceArray currently ignored");


    console.log("properties currently ignored");

    var s;
    for(var i in analysisjson.steps)
    {
      s = this._createStepFromJSON(analysisjson.steps[i]);
      a.addStep(s);
    }

    if(analysisjson.uriConceptConvoyed)
      a.uriConceptConvoyed = analysisjson.uriConceptConvoyed;

    return a;
  },

  _createStepFromJSON: function(stepjson)
  {
    var s = new Step();

    s = this._captenClassBuider(s, stepjson);

    if(stepjson.displayRGTE)
      s.displayRGTE = stepjson.displayRGTE;

    if(stepjson.inputs)
      this._addNewAlignmentRow(stepjson.inputs.id, null, {obj: s, attr: "inputs"});

    if(stepjson.outputs)
      this._addNewAlignmentRow(stepjson.outputs.id, null, {obj: s, attr: "outputs"});

    if(stepjson.operator)
      this._addNewAlignmentRow(stepjson.operator.id, null, {obj: s, attr: "operator"});

    if(stepjson.isStateComputed)
      s.isStateComputed = stepjson.isStateComputed;

    if(stepjson.relationOrder)
      s.relationOrder = stepjson.relationOrder;

    console.error("TODO: Composite Relation");

    return s;
  },

  _deserializeNarrativeBlocks: function(json)
  {
    var narratives = json.narratives;
    var n;

    for(var i in narratives)
    {
      if(this.alignements[narratives[i].id] == null || this.alignements[narratives[i].id].newObject == null)
        n = this._createNarrativeBlockFromJSON(narratives[i]);
      // NARRATIVE_BLOCK_POOL.register(n);
    }

  },

  _createNarrativeBlockFromJSON: function(nbjson)
  {
    if(this.alignements[nbjson.id].newObject == null)//If the narrative block does not exist yet; i.e. not created inside a captenclass
    {
      var n = NARRATIVE_BLOCK_POOL.create();

      this._addNewAlignmentRow(nbjson.id, n, null);
    }

    if(nbjson.propertyEntity)
      this._addNewAlignmentRow(nbjson.propertyEntity.id, null, {obj: n, attr: "propertyEntity"});

    if(nbjson.entity)
    {
      this._addNewAlignmentRow(nbjson.entity.id, null, {obj: n, attr: "entity"});//entity is already an id
    }

    for(var i in nbjson.elements)
    {
      this._addNewAlignmentRow(nbjson.elements[i].id, null, {obj: n.elements, attr: i});

      var obj = this.alignements[nbjson.elements[i].id].newObject; // SHOULD NOT BE NULL. IF IT IS, item must be created

      if(obj == null)
      {
        elm = NARRATIVE_BLOCK_POOL.newInstanceDispatcher(nbjson.elements[i].uri);

        if(elm instanceof CAPTENClass)
          this._captenClassBuider(elm, nbjson.elements[i]);

        if(elm instanceof NarrativeElement)
          elm.selfBuildingWithJson(nbjson.elements[i], this.alignements);
        else if(elm instanceof CompositeElement)
          elm.selfBuildingWithJson(nbjson.elements[i], this.alignements);
        else if (elm instanceof ExtendedString)
        {
          console.error("ExtendedString");
        }
        else
        {
          console.error("Unrecognized elm");
        }

        this._addNewAlignmentRow(nbjson.elements[i].id, elm, null);
      }
    }

    return n;
  },

  _addNewAlignmentRow: function(key, newObject, subj)
  {
    if(this.alignements[key] == null)
      this.alignements[key] = {newObject: newObject, subjects: []};

    if(subj != null)
      this.alignements[key].subjects.push({obj: subj.obj, attr: subj.attr});

    if(newObject != null)
      this.alignements[key].newObject = newObject;
  },

  _deserializeGraphs: function(json)
  {
    var graphs = json.graphs;
    var g;

    for(var i in graphs)
    {
      g = this._createGraphFromJSON(graphs[i]);
      RGTE_POOL.register(g);
    }
  },

    _createGraphFromJSON: function(json)
    {
      var g = new RGTE();

      this._addNewAlignmentRow(json.id, g, null);

      // g.narrativeBlock = json.narrativeBlock;//WARNING: It is just an id. Need to be dereferenced with the new value
      g.type = json.type;


      this._addNewAlignmentRow(json.narrativeBlock, g.narrativeBlock, {obj: g, attr: "narrativeBlock"})

      console.error("UNCOMPLETE DESERIALIZATION");
      console.error("CHECK ARRAY subClassOf subClasses properties and inheritanceArray");
      var c;
      for(var i in json.nodes)
      {
        c = new CAPTENClass();
        c = this._captenClassBuider(c, json.nodes[i]);
        g.nodes.push(c);
      }

      var p;
      for(var i in json.edges)
      {
        p = new Property();

        p = this._captenPropertyBuilder(p, json.edges[i]);

        // this._addNewAlignmentRow(json.edges[i].from, null, {obj: p, attr: "from"});
        // this._addNewAlignmentRow(json.edges[i].to, null, {obj: p, attr: "to"});

        g.edges.push(p);
      }

      var k;
      for(var i in json.knowledges)
      {
        k = new ExploitableOutput();

        k = this._captenClassBuider(k, json.knowledges[i]);
      }

      console.error('TODO : Edge cardinality');

      return g;
    },

  _deserializeVocab: function(json, vocab, customcls, customprops)
  {
    var vocTMP = new CONTROLLED_VOCABULARY();

    var p;
    for(var i in json.vocab.vocabProps)
    {
      p = PROPERTIES_POOL.create();

      p = this._captenPropertyBuilder(p, json.vocab.vocabProps[i]);
      // this._addNewAlignmentRow(json.vocab.vocabProps[i].id, p, null) ;
      this.customprops.push(p);
    }

    //Alignment detection
    var c;
    for(var i in json.vocab.vocabClasses)
    {
      c = new CAPTENClass();
      c = this._captenClassBuider(c, json.vocab.vocabClasses[i]);
      this.customcls.push(c);
    }

    this._continueImport(json);

  },

  _captenClassBuider: function(c, classJson)
  {

    this._addNewAlignmentRow(classJson.id, c, null);

    NARRATIVE_BLOCK_POOL.unregister(c.narrativeBlock);

    //Planar Attributes
    if(classJson.label)
      c.label = classJson.label;
    if(classJson.uri)
      c.uri = classJson.uri;
    if(classJson.isBlank)
      c.isBlank = classJson.isBlank;
    if(classJson.isRegistered)
      c.isRegistered = classJson.isRegistered;
    if(classJson.iName)
      c.iName = classJson.iName;
    if(classJson.htmlify)
      c.htmlify = classJson.htmlify;

    //Retrieving all object dependent attributes
    if(classJson.author)
      this._addNewAlignmentRow(classJson.author.id, null, {obj: c, attr: "author"});
    if(classJson.narrativeBlock)
      this._addNewAlignmentRow(classJson.narrativeBlock, null, {obj: c, attr: "narrativeBlock"});
    if(classJson.idVoc)
      this._addNewAlignmentRow(classJson.idVoc.id, null, {obj: c, attr: "idVoc"});
    if(classJson.derivedFrom)
      this._addNewAlignmentRow(classJson.derivedFrom.id, null, {obj: c, attr: "derivedFrom"});
    if(classJson.name)
      this._addNewAlignmentRow(classJson.name.id, null, {obj:c, attr:"name"});
    if(classJson.usualName)
      this._addNewAlignmentRow(classJson.usualName.id, null, {obj:c, attr:"usualName"});

      // HERE handler sublcasses and other !!

    return c;
  },

  _captenPropertyBuilder: function(p, propJson)
  {
    this._addNewAlignmentRow(propJson.id, p, null);

    if(propJson.from)
      this._addNewAlignmentRow(propJson.from, null, {obj: p, attr: "from"});
    if(propJson.to)
      this._addNewAlignmentRow(propJson.to, null, {obj: p, attr: "to"});

    if(propJson.arrows)
      this.arrows = propJson.arrows;

    p.uri = propJson.uri;
    p.label = propJson.label;
    p.iName = propJson.iName;

    return p;
  },
};

var CAPTEN_LOADER = new CAPTENLoader();

var CAPTEN_LOADER_ALIGNMENTS_NEW_ROW = function(alignements, key, newObject, subj)
{
  if(alignements[key] == null)
    alignements[key] = {newObject: newObject, subjects: []};

  if(subj != null)
    alignements[key].subjects.push({obj: subj.obj, attr: subj.attr});

  if(newObject != null)
    alignements[key].newObject = newObject;
};
