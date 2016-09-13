class IndependentAnalysisProcess extends IndependentOperator {
  constructor()
  {
    this.operators = []; //Associative array : [RelationOrder]:[ListOfOperations]
    this.uriConceptConvoyed = null; //Allow to have a dictionary of the different concept of operation

  }
}
