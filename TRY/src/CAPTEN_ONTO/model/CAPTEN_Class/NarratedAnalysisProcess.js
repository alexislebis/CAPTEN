function NarratedAnalysisProcess() {

  NarratedOperator.call(this);

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
    if(this.steps[i].inputs && this.steps[i].inputs.id == expectedConcepts.id)
      sSteps.push(this.steps[i]);
  }

  return sSteps;
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
