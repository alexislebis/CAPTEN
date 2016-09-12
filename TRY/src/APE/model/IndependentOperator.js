class IndependentOperator{
  constructor(name){
    this.name = name;
    this.annotation = null;//Annotation regarding the IndpOp
    this.patterns = null;//Inputs RGTE pattern needed
    this.specificSettings = null;//Specific settings needed to this Indp. Op. such as _node1_ > 5
  }

  /**
   * All IndependentOperator must be able to resolve the RGTEs ( [] ) giving in parameters if they match
   * its expected patterns ( [] ).
   */
  resolve(inputs){}

}
