function NarratedOperator(usualName) {

    CAPTENClass.call(this);

    this.usualName = usualName;
    this.uriConceptConvoyed = null; //Allow to have a dictionary of the different concept of operation. Comme *Find* et *Correlation*

    //UPDATE from 22/09/216 : operators[] remove from IAP & become a part of an IOP
    this.steps = null; //Associative array : [RelationOrder]:[ListOfSteps]

    this.annotation = null; //Annotation regarding the IndpOp

    //Behavoural Patterns
    // this.inputPatterns = null; //Inputs RGTE pattern needed
    // this.outputPatterns = null; //Output pattern. : can be infered by behaviors(inputPatterns)
    // this.specificSettings = null; //Specific settings needed to this Indp. Op. such as _node1_ > 5
    this.behaviors = null; //BehavioralPattern. The behaviors of a specific NarratedOperator.

    //Analysis tools links
    this.implementedByOperation = null; //For each tool : [T1:[OperatorList], T2:[OperatorList], ...]

    this.creationDate = null;
    this.author = null;

    // this.notation = null; //NOTE notation of the operation. Don't forget for future version
}

/**
 * All NarratedOperator must be able to resolve the RGTEs ( [] ) giving in parameters if they match
 * its expected patterns ( [] ).
 */
NarratedOperator.prototype = Object.create(CAPTENClass.prototype);
NarratedOperator.prototype.solve = function(inputs) {
                console.log("solving");
        };
