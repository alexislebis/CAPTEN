function NarratedAnalysisProcess() {

  NarratedOperator.call(this);

  //UPDATE 22/09/2016
  //this.operators = []; //Associative array : [RelationOrder]:[ListOfOperations]
  this.exploitableOutput = null;

  //TODO Add specific element such as context application & description, etc..
  this.utilisabilityContext = null;

  // === Integration state of new component
  this.integrationState = false; //If on, then represent the fact that the analysis w8 a new step

}

NarratedAnalysisProcess.prototype = Object.create(NarratedOperator.prototype);
