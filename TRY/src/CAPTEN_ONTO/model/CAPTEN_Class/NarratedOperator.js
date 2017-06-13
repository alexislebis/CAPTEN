function NarratedOperator(usualName)
{

    CAPTENClass.call(this);

    this.usualName = usualName;
    this.uriConceptConvoyed = null; //Allow to have a dictionary of the different concept of operation. Comme *Find* et *Correlation*

    //UPDATE from 22/09/216 : operators[] remove from IAP & become a part of an IOP
    this.steps = []; //NOT Used : Associative array : [RelationOrder]:[ListOfSteps]

    this.annotation = null; //Annotation regarding the IndpOp


    this.objective = null;

    //Behavoural Patterns
    // this.inputPatterns = null; //Inputs RGTE pattern needed
    // this.outputPatterns = null; //Output pattern. : can be infered by behaviors(inputPatterns)
    // this.specificSettings = null; //Specific settings needed to this Indp. Op. such as _node1_ > 5
    this.behaviors = []; //BehavioralPattern. The behaviors of a specific NarratedOperator.
      this.behaviors['output'] = new RGTE();//this RGTE is not register in the RGTE POOL
      this.behaviors['input'] = new RGTE;//this RGTE is not register in the RGTE POOL

    //Analysis tools links
    this.implementedByOperation = null; //For each tool : [T1:[OperatorList], T2:[OperatorList], ...]

    this.creationDate = null;
    this.author = null;

    // this.notation = null; //NOTE notation of the operation. Don't forget for future version

    // === OBSERVATION
      this.observers = [];
}

/**
 * All NarratedOperator must be able to resolve the RGTEs ( [] ) giving in parameters if they match
 * its expected patterns ( [] ).
 */
NarratedOperator.prototype = Object.create(CAPTENClass.prototype);

NarratedOperator.prototype = {

    // === OBSERVATION
      resetAllObservers: function()
      {
        this.observers = [];
      },

      registerObserverCallbackOnChange: function(objCallback, callback)
      {
        if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.observers))
          this.observers.push([objCallback,callback]);
      },

      notifyChange: function()
      {
        this.observers.forEach(function(e){
          if(typeof e[1] === "function")
          {
            e[1].call(e[0], this);
          }
        }.bind(this));
      },

    solve: function(inputs)
    {
        console.log("solving");
    },

    /**
     * Test if a NOP is equal to an another NOP. The equality should be mostly defined by the patterns
     */
    isEqual: function(nop)
    {

    },

    addStep: function(step)
    {
      if(!(step instanceof Step))
        return;

      if(!this.alreadyExists(step))
      {
        this.steps.push(step);

        this.notifyChange();
        
        return this.steps[this.steps.length-1];
      }
    },

    alreadyExists: function(step)
    {
      for(var i in this.steps)
        if(this.steps[i].id == step.id)
          return true;
      return false;
    },
};
