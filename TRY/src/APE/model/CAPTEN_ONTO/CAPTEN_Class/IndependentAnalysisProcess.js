function IndependentAnalysisProcess() {

  IndependentOperator.call(this);

  this.operators = []; //Associative array : [RelationOrder]:[ListOfOperations]
  this.exploitableOutput = null;

}

IndependentAnalysisProcess.prototype = Object.create(IndependentOperator.prototype);
