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

    json = this.rebuildIntoHOGNVPStructure(json);

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

  rebuildIntoHOGNVPStructure: function(json)//Old structure Header, NOP, NAP, Graphs, Vocab, Narratives, Properties
  {
    var tStart = (new Date()).getTime();

    var narratives = [];
    var graphs = [];
    var vocab = [];
      vocab.vocabClasses = [];
      vocab.vocabProps = [];
    var composites = [];
    var properties = [];
    var extStrings = [];
    var captenClasses = [];
    var unrecognized = [];

    console.log("Storing elements and mapping...");
    for(var i in json)
    {
      if(this._isNarrativeBlock(json[i]))
        narratives[json[i].narr.id] = json[i].narr;
      else if(this._isCompositeBlock(json[i]))
        composites[json[i].composite.id] = json[i].composite;
      else if(this._isExtString(json[i]))
        extStrings[json[i].extString.id] = json[i].extString;
      else if(this._isGraph(json[i]))
        graphs[this._retrieveGraphID(json[i])] = this._retrieveGraph(json[i]);
      else if(this._isVocabularyClass(json[i]))
        vocab.vocabClasses[json[i].vcls.id] = json[i].vcls;
      else if(this._isVocabularyProperty(json[i]))
        vocab.vocabProps[json[i].vprp.id] = json[i].vprp;
      else if(this._isCAPTENClass(json[i]))
        captenClasses[json[i].cpt.id] = json[i].cpt;
      else if(this._isProperty(json[i]))
        properties[json[i].prop.id] = json[i].prop;
      else
        unrecognized.push(json[i]);
    }
    console.log("Done.");

    // var cG = 0; var cn = 0; var cc = 0; var ce = 0; var cvc = 0; var cvp = 0; var ccpt = 0; var cgrp = 0; var cpr = 0; var cu = 0;
    // for(var i in json)
    //   cG++;
    // for(var i in narratives)
    //   cn++;
    // for(var i in composites)
    //   cc++;
    // for(var i in extStrings)
    //   ce++;
    // for(var i in graphs)
    //   cgrp++;
    // for(var i in vocab.vocabClasses)
    //   cvc++;
    // for(var i in vocab.vocabProps)
    //   cvp++;
    // for(var i in captenClasses)
    //   ccpt++;
    // for(var i in properties)
    //   cpr++;
    // for(var i in unrecognized)
    //   cu++;
    //
    // console.log("Total: "+cG);
    // console.log("Narratives: "+cn);
    // console.log("Composites: "+cc);
    // console.log("Strings: "+ce);
    // console.log("Graphs: "+cgrp);
    // console.log("VCls: "+cvc);
    // console.log("VPrps:"+cvp);
    // console.log("CAPTEN: "+ccpt);
    // console.log("Props: "+cpr);
    // console.log("Unrecognized: "+cu);
    // console.log("SUM: "+(cn+cc+ce+cgrp+cvc+ccpt+cpr+cu));

    console.log("Rebuilding elements");
    this._rebuild([narratives, graphs, vocab.vocabClasses, vocab.vocabProps, composites, properties, extStrings, captenClasses], [narratives, graphs, vocab.vocabClasses, vocab.vocabProps, composites, properties, extStrings, captenClasses]);

    console.log("Transforming narrative block references into pointers");//Because old loader requires plannar references
    this._plannarReferenceNBlock([narratives, graphs, vocab.vocabClasses, vocab.vocabProps, composites, properties, extStrings, captenClasses],[]);

    console.log("Transforming properties references into pointers");
    this._plannarReferenceProperties(properties);

    var tStop = (new Date()).getTime();
    console.log("Done in "+(tStop - tStart)+" ms");

    return {narratives: narratives, graphs: graphs, operations: this._retrieveOperations(captenClasses), vocab: vocab, properties: properties};
  },

    _rebuild: function(origin, rebuild)
    {
      for(var i in rebuild)
      {
        if(rebuild[i] instanceof Array || rebuild[i] === Object(rebuild[i]) )
          this._rebuild(origin, rebuild[i]);
        else if( i != "id" && (
                                (rebuild[i] instanceof String && rebuild[i].indexOf(/\d+/)) || (!isNaN(parseFloat(rebuild[i])) && isFinite(rebuild[i]))
                              ))
        {
          var mapped = this._retrieveConcernedObj(origin, rebuild[i]);
          if(mapped)
            rebuild[i] = mapped;
        }
      }
    },

    _retrieveConcernedObj: function(origin, index)
    {
      for(var i in origin)
      {
        if(origin[i][index])
          return origin[i][index];
      }
    },

  // === NARRATIVE BLOCK
    _isNarrativeBlock: function(o)
    {
      if(o && o.narr)
        return true;
    },
      _plannarReferenceNBlock: function(array, visitedID)
      {
        for(var i in array)
        {
          if(array[i] instanceof Array)
            this._plannarReferenceNBlock(array[i], visitedID)
          else if(array[i] === Object(array[i]) && array[i].id && !IF_MAP_CONTAINS(visitedID, array[i].id))
          {
            visitedID[array[i].id] = array[i].id;
            if(array[i].narrativeBlock)
              array[i].narrativeBlock = array[i].narrativeBlock.id;

            this._plannarReferenceNBlock(array[i], visitedID);
          }
        }
      },

  // === COMPOSITE BLOCK
    _isCompositeBlock: function(o)
    {
      if(o && o.composite)
        return true;
    },

  // === EXT STRING
    _isExtString: function(o)
    {
      if(o && o.extString)
        return true;
    },

  // === PROPERTIES
    _isProperty: function(o)
    {
      if(o && o.prop)
        return true;
    },
      _plannarReferenceProperties: function(prop)
      {
        for(var i in prop)
        {
          if(prop[i].from)
            prop[i].from = prop[i].from.id;
          if(prop[i].to)
            prop[i].to = prop[i].to.id;
        }
      },

  // === GRAPHS
    _isGraph: function(o)
    {
      if(o && (o.rgte || o.srgte))
        return true;
    },
      _retrieveGraphID: function(o)
      {
        if(o && o.rgte)
          return o.rgte.id;
        else if(o && o.srgte)
          return o.srgte.id;
      },
      _retrieveGraph: function(o)
      {
        if(o && o.rgte)
          return o.rgte;
        else if(o && o.srgte)
          return o.srgte;
      },

  // === CAPTEN CLASSES
    _isCAPTENClass: function(o)
    {
      if(o && o.cpt)
        return true;
    },
      // === OPERATIONS
      _retrieveOperations: function(classes)
      {
        var res = {};
        res.analyses = [];
        res.operators = [];

        for(var i in classes)
        {
          if(classes[i].uri == OPERATOR_URI)
            res.operators.push(classes[i]);
          else if(classes[i].uri == ANALYSIS_URI)
            res.analyses.push(classes[i]);
        }

        return res;
      },
  // === VOCABULARY
    // === CLASSES
      _isVocabularyClass: function(o)
      {
        if(o && o.vcls)
          return true;
      },
    // === PROPERTIES
      _isVocabularyProperty: function(o)
      {
          if(o && o.vprp)
            return true;
      },

  _continueImport: function(json, vocab, customcls, customprops)
  {
    this._deserializeProperties(json);
    this._deserializeGraphs(json);
    this._deserializeNarrativeOperations(json);
    this._deserializeNarrativeBlocks(json); // MUST BE IN LAST POSITION

    this._solve();

    return {vocab: vocab, customcls: customcls, customprops: customprops};
  },

  _solve: function()
  {
    console.error("WARNING. TODO PROP ASYNC HAVE TO BE SAVED TOO. + HANDLE _GENERATE on SEVERAL ITEM SUCH AS NAP TO ENSURE REBUILD OF THE BEHAVIORAL PATTERNS");
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

    for(var i in RGTE_POOL.pool)
    {
      if(RGTE_POOL.pool[i] instanceof SuperRGTE)
        RGTE_POOL.pool[i]._regenerate();
    }

    // for(var i in NARRATED_ANALYSIS_POOL.pool)
    // {
    //   NARRATED_ANALYSIS_POOL.pool[i]._updateBehavioralPatterns();
    // }

    console.log("UNRESOLVED ALIGNEMENTS");
    console.log(unresolved);
    console.log("======================");

    console.log("CLEANING ALIGNEMENTS...");
    this.alignements = [];
    console.log("DONE");
    this.recallFunction.func.call(this.recallFunction.src);
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

    for(var i in analysisjson.behaviors.parameters)
    {
      var p = new ParameterPattern();
      p = this._captenClassBuider(p, analysisjson.behaviors.parameters[i]);

      p.selfBuildingWithJson(analysisjson.behaviors.parameters[i], this.alignements);

      this._addNewAlignmentRow(analysisjson.behaviors.parameters[i].id, null, {obj: a.behaviors.parameters, attr: i});//the creation of the param pattern is delegated to the narrative block section
    }

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

    console.log("param currently ignored for analysis");

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

    for(var i in stepjson.parameters)
    {
      var p = new ParameterConfiguration();
      p = this._captenClassBuider(p, stepjson.parameters[i]);

      p.selfBuildingWithJson(stepjson.parameters[i], this.alignements);
      this._addNewAlignmentRow(stepjson.parameters[i].id, null, {obj: s.parameters, attr:i});
      this._addNewAlignmentRow(stepjson.parameters[i].pattern.id, null, {obj: p, attr: 'pattern'});
    }
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
    if(this.alignements[nbjson.id] == null)
    {
      this._addNewAlignmentRow(nbjson.id);
    }

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
      if(json.uri == SuperRGTE_URI)
      {
        var sg = new SuperRGTE();

        this._addNewAlignmentRow(json.id, sg, null);

        for(var i in json.sources)
        {
          this._addNewAlignmentRow(json.sources[i].id, null, {obj: sg.sources, attr: i});
        }

        return sg;
      }

      //ELSE
      var g = new RGTE();

      NARRATIVE_BLOCK_POOL.unregister(g.narrativeBlock);

      this._addNewAlignmentRow(json.id, g, null);

      // g.narrativeBlock = json.narrativeBlock;//WARNING: It is just an id. Need to be dereferenced with the new value
      g.type = json.type;


      this._addNewAlignmentRow(json.narrativeBlock, null, {obj: g, attr: "narrativeBlock"})

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
        this._addNewAlignmentRow(json.knowledges[i].id, null, {obj: g.knowledges, attr: i});
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
    p.htmlify = propJson.htmlify;

    if(propJson.name)
      p.name = propJson.name;

    return p;
  },
  _OLDcaptenPropertyBuilder: function(p, propJson)
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
    p.htmlify = propJson.htmlify;

    if(propJson.name)
      p.name = propJson.name;

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
