function NarratedAnalysisProcess() {

  NarratedOperator.call(this);

  //UPDATE 22/09/2016
  //this.operators = []; //Associative array : [RelationOrder]:[ListOfOperations]
  this.exploitableOutput = null;

  //TODO Add specific element such as context application & description, etc..
  this.utilisabilityContext = null;

}

NarratedAnalysisProcess.prototype = Object.create(NarratedOperator.prototype);
