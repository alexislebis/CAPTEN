class Step{
  constructor()
  {
    //this.annotation = null; ?
    this.objective = null;
    this.settings = null; //At the difference to Indp.Op.specificSettings, it concerns all the settings needed for the step. not for the IndOp running.
                          //The union of Indep.Op.specificSettings with this.settings constitute the whole --isConfiguredBy-->Setting of the ontology
    this.operator = null;
    this.inputs = null; //[RGTE]. It is actually see as a Union of the different inputs
    this.relationOrder = null; //Integer. Representing the place of this in the IAP.
  }
}
