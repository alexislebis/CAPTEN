function NarratedAnalysisProcess() {

  NarratedOperator.call(this);

  this.uri = ANALYSIS_URI;

  this.expectedConcepts = null; //A-BOX : this.expectedConcepts TYPE_URI INITIAL_RGTE_URI
                                //A-BOX : this prop.requires this.expectedConcepts;
  //UPDATE 22/09/2016
  //this.operators = []; //Associative array : [RelationOrder]:[ListOfOperations]
  this.exploitableOutput = null;

  //TODO Add specific element such as context application & description, etc..
  this.utilisabilityContext = null;

  // === Integration state of new component
  this.integrationState = false; //If on, then represent the fact that the analysis w8 a new step

}

NarratedAnalysisProcess.prototype = new NarratedOperator();
NarratedAnalysisProcess.prototype.constructor = NarratedAnalysisProcess;

NarratedAnalysisProcess.prototype.getStartingSteps = function()
{
  if(this.expectedConcepts == null)
    return;

  var sSteps = [];

  for(var i in this.steps)
  {
    if(this.steps[i].inputs && this.steps[i].inputs.id == this.expectedConcepts.id)
      sSteps.push(this.steps[i]);
  }

  if(sSteps.length == 0)
    sSteps = this._fallbackStartingStepIdentification();

  if(sSteps.length == 0)
    sSteps = this._lastFallbackStartingStepIdentification();

  return sSteps;
}

NarratedAnalysisProcess.prototype._fallbackStartingStepIdentification = function()
{
  var startingSteps = [];
  var tmp = [];

  var result = [];
  var cleanedResult = [];

  for(var i in this.steps)
  {
    if(this.steps[i].getOutputs())
    {
      tmp = this.steps[i].getOutputs().getKnowledges();
      if(tmp != null && tmp.length > 0)
        startingSteps.push(this.steps[i]);
    }
  }

  for(var i in startingSteps)
  {
    tmp = this._backtrackFallBack(startingSteps[i]);
    for(var j in tmp)
      result.push(tmp[j]);
  }

  //Cleaning duplicata
  var alreadyExists = false;
  for(var i in result)
  {
    for(var j in cleanedResult)
    {
      if(cleanedResult[j].id == result[i].id)
      {
        alreadyExists = true;
      }
    }
    if(alreadyExists == false)
      cleanedResult.push(result[i]);
    alreadyExists = false;
  }

  return cleanedResult;
}

NarratedAnalysisProcess.prototype._backtrackFallBack = function(stepToBacktrack)
{
  var rel = stepToBacktrack.getRelations();
  var res = [];
  var tmp = [];
  var initSteps = [];
  var oneFound = false;

  for(var j in rel)
  {
    if(rel[j].from)
      res.push(rel[j].from);
  }

  for(var i in res)
  {
    for(var j in this.steps)
    {
      node = this.steps[i].outputs.getNodeById(res[i].id);
      if(node != null)
      {
        oneFound = true;
        tmp = this._backtrackFallBack(this.steps[i]);
        for(var k in tmp)
        {
          initSteps.push(tmp[k]);
        }
      }
    }
    if(!oneFound)
    {
      initSteps.push(stepToBacktrack);
    }
    oneFound = false;
  }

  return initSteps;
}

NarratedAnalysisProcess.prototype._lastFallbackStartingStepIdentification = function()//A function which reparse the entire steps chain to find which node are to be used
{
  var startingNodes = [];
  var tmp; var resNodes = []; var stepsResult = [];

  for(var i in this.steps)
  {
    if(this.steps[i].getOutputs())
    {
      tmp = this.steps[i].getOutputs().getKnowledges();
      for(var j in tmp)
        startingNodes.push(tmp[j]);
    }
  }

  tmp = null;

  for(var i in startingNodes)
  {
    tmp = this._backtrackOriginFor(startingNodes[i].derivedFrom);
    for(var j in tmp)
    {
      resNodes.push(tmp[j]);
    }
  }

  for(var i in resNodes)
  {
    for(var j in this.steps)
    {
      if(this.steps[j].inputs.getNodeById(resNodes[i].id) != null)
      {
        stepsResult.push(this.steps[j]);
      }
    }

  }
  // PURGE NEEDED

  return stepsResult;

}

NarratedAnalysisProcess.prototype._backtrackOriginFor = function(nodeToBacktrack)
{
  var res = [];

  if(nodeToBacktrack.derivedFrom == null)
  {
    res.push(nodeToBacktrack);
    return res;
  }

  var nodes;
  var tmp = [];
  var tmpres = [];


  for(var i in this.steps)
  {
    nodes = this.steps[i].inputs.getNodes();
    for(var j in nodes)
    {
      if(nodes[j].id == nodeToBacktrack.derivedFrom.id)
        tmp.push(nodes[j]);
    }
  }

  for(var i in tmp)
  {
    tmpres = this._backtrackOriginFor(tmp[i]);

    for(var j in tmpres)
      res.push(tmpres[j]);
  }

  return res;
}

NarratedAnalysisProcess.prototype.getExpectedConcepts = function()
{
  return this.expectedConcepts;
}

NarratedAnalysisProcess.prototype.setExpectedConcept = function(rgte)
{
  if(rgte == null)
    return;

  if(this.expectedConcepts && this.expectedConcepts.id == rgte.id)
    return;

  if(this.expectedConcepts && this.expectedConcepts.isEmpty())
    RGTE_POOL.delete(this.expectedConcepts);

  this.expectedConcepts = rgte;

  this.notifyChange();
}

NarratedAnalysisProcess.prototype.willBeReplaced = function()
{
  if(this.expectedConcepts && this.expectedConcepts.isEmpty())
    RGTE_POOL.delete(this.expectedConcepts);
}

NarratedAnalysisProcess.prototype.hasAtLeastOneStep = function()
{
  return this.steps.length > 0 ? true : false;
}

NarratedAnalysisProcess.prototype._callbackKChange= function()
{
  this._updateBehavioralPatterns();
}

NarratedAnalysisProcess.prototype._updateBehavioralPatterns= function()
{
  var kNodes = [];
  var tmp = [];

  for(var i in this.steps)
  {
    if(this.steps[i].getOutputs())
    {
      tmp = this.steps[i].getOutputs().getKnowledges();
      for(var j in tmp)
        kNodes.push(tmp[j]);
    }
  }

  if(kNodes.length == 0)
  {
    this.behaviors['input']= new RGTE();//Reseting
    this.behaviors['output']= new RGTE(); //Reseting
    return;
  }

  var iNodes = this._findRequiredConceptsToRun();
  var iEdges = this._findProperties(iNodes);

  if(this.behaviors['input'])
    RGTE_POOL.delete(this.behaviors['input']);
  if(this.behaviors['output'])
    RGTE_POOL.delete(this.behaviors['output']);

  var inp = new RGTE(); var oldNew = [];
  var out = new RGTE();

  for(var i in iNodes)
  {
    oldNew[iNodes[i].id] = inp.addVisNode(iNodes[i]);
  }

  for(var i in iEdges)
  {
    inp.addVisProperty(new Property(iEdges[i].uri, iEdges[i].label, oldNew[iEdges[i].from], oldNew[iEdges[i].to]));
  }

  for(var i in kNodes)
  {
    out.addVisNode(kNodes[i]);
  }

  RGTE_POOL.register(inp);
  RGTE_POOL.register(out);

  this.behaviors['input'] = inp;
  this.behaviors['output'] = out;
}

NarratedAnalysisProcess.prototype._findRequiredConceptsToRun = function()//Parse the steps and check which nodes are used the first time which constitute the input pattern
{
    var ss = this.getStartingSteps();
    var rel;
    var res = [];

    for(var i in ss)
    {
      rel = ss[i].getRelations();
      for(var j in rel)
      {
        if(rel[j].from)
          res.push(rel[j].from);
      }
    }

    return res;
}

NarratedAnalysisProcess.prototype._findProperties= function(nodes)
{
  var ss = this.getStartingSteps();
  var edgesOfCurrentGraph;
  var res = [];

  for(var i in ss)
  {
    if(ss[i].inputs)
    {
      edgesOfCurrentGraph = ss[i].inputs.edges;

      for(var j in edgesOfCurrentGraph)
      {
        for(var k in nodes)
        {
          for(var l in nodes)
          {
            if(edgesOfCurrentGraph[i].from == nodes[k].id && edgesOfCurrentGraph[i].to == nodes[l].id)
            {
              res.push(edgesOfCurrentGraph[i]);
            }
          }
        }
      }
    }
  }

  return res;
}

NarratedAnalysisProcess.prototype.mapNarrativeBlock= function(map)
{
  if(this.narrativeBlock != null)
    this.narrativeBlock.mapNarrativeBlock(map);

  for(var i in this.steps)
    this.steps[i].mapNarrativeBlock(map);

  if(this.behaviors)
  {
    if(this.behaviors['input'])
      this.behaviors['input'].mapNarrativeBlock(map);
    if(this.behaviors['output'])
      this.behaviors['output'].mapNarrativeBlock(map);
    for(var i in this.behaviors['parameters'])
      this.behaviors['parameters'].mapNarrativeBlock(map);
  }

  if(this.expectedConcepts)
    this.expectedConcepts.mapNarrativeBlock(map);
}

// === ONTOLOGY EXPORT
// return <propertyX> rangeX
NarratedAnalysisProcess.prototype.getPropertiesRelations = function()
{
  var PR = [];

  PR.push([HAS_NAME_URI, this.getNameObject()]);

  return PR;
}
