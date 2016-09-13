class IndependentOperator extends CAPTENClass{
  constructor(name){
    this.name = name;
    this.annotation = null;//Annotation regarding the IndpOp
    this.inputPatterns = null;//Inputs RGTE pattern needed
    this.outputPatterns = null;//Output pattern. FIXME: can be infered by behaviors(inputPatterns)
    this.specificSettings = null;//Specific settings needed to this Indp. Op. such as _node1_ > 5
    this.behaviors = null;//The behaviors of a specific IndependentOperator. It is tightly bound with patterns
    this.implementedByOperation = null; //For each tool : [T1:[OperatorList], T2:[OperatorList], ...]

    this.creationDate = null;
    this.author = null;
  }

  /**
   * All IndependentOperator must be able to resolve the RGTEs ( [] ) giving in parameters if they match
   * its expected patterns ( [] ).
   */
  resolve(inputs){}

}
