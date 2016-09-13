class IndependentAnalysisProcess extends IndependentOperator {
  constructor()
  {
    this.operators = []; //Associative array : [RelationOrder]:[ListOfOperations]

    this.exploitableOutput = null;

  }
}
