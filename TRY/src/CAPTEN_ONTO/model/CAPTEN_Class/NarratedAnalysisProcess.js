function NarratedAnalysisProcess() {

  NarratedOperator.call(this);

  this.uri = ANALYSIS_URI;

  this.expectedConcepts = null;

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

  return sSteps;
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
