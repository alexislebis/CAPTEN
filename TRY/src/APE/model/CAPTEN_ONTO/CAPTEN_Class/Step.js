function Step() {
    CAPTENClass.call(this);
    //this.previousStep = null;//FIXME PreviousStep est pointée par la propriété hasPrevious. Si elle existe

    //this.annotation = null;//FIXME needed ?
    this.objective = null;
    this.settings = null; //At the difference to Indp.Op.specificSettings, it concerns all the settings needed for the step. not for the IndOp running.
    //The union of Indep.Op.specificSettings with this.settings constitute the whole --isConfiguredBy-->Setting of the ontology
    this.operator = null;
    this.inputs = null; //[RGTE]. It is actually see as a Union of the different inputs
    this.outputs = null;
    this.relationOrder = null; //Integer. Representing the place of this in the IAP.

    this.context = null; //TODO define CONTEXT notion
    this.treatmentType = null;

    this.creationDate = null;
    this.author = null; //using FOAF agent
}

Step.prototype = Object.create(CAPTENClass.prototype);
