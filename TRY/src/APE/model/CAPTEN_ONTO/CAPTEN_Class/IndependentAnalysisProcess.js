function IndependentAnalysisProcess() {

  IndependentOperator.call(this);

  //UPDATE 22/09/2016
  //this.operators = []; //Associative array : [RelationOrder]:[ListOfOperations]
  this.exploitableOutput = null;

  //TODO Add specific element such as context application & description, etc..

}

IndependentAnalysisProcess.prototype = Object.create(IndependentOperator.prototype);
