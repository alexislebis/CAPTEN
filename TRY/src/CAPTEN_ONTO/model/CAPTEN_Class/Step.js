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

    //State of the Step (ouput generation) + notification
    this.observers = [];
    this.observersUnc = []; //Uncomp observer
    this.isStateComputed = false; //If the output has been computed. MUST BE @ true when all the node expected are aligned with the input node
    this.usedComputationInput = []; //State of the computation. Associative array. All the op.beh.inpu node must be aligned with one this.input.node
    this.propAsyncBuild = new PropertyAsyncrhonousBuilder();
      this.propAsyncBuild.registerObserverCallbackOnCompletion(this, this._callbackUsedConceptsInputComplete);
      this.propAsyncBuild.registerObserverCallbackOnUncompletion(this, this._callbackUCIUncompletion);
}

Step.prototype = Object.create(CAPTENClass.prototype);

Step.prototype = {

  // === OBSERVATION
    resetAllObservers: function()
    {
      this.observers = [];
      this.observersUnc = [];
    },
    // === COMPUTATION
    registerObserverCallbackOnOutputsComputation: function(objCallback, callback)
    {
      this.observers.push([objCallback,callback]);
    },

      // === NOTIFICATION
      notifyOutputsComputation: function()
      {
        this.observers.forEach(function(e)
        {
          console.log(e);
            if (typeof e[1] === "function") {
              e[1].call(e[0]);//e[0] define the `this` context for e[1]
            }
        });
      },

      // === UNCOMPLETION
      registerObserverCallbackOnUncompletion: function(objCallback, callback)
      {
        this.observersUnc.push([objCallback,callback]);
      },

        // === NOTIFICATION
        notifyUncompletion: function()
        {
          this.observersUnc.forEach(function(e)
          {
            console.log(e);
              if (typeof e[1] === "function") {
                e[1].call(e[0]);//e[0] define the `this` context for e[1]
              }
          });
        },
    // ===

  // === CALLBACK BEHAVIORS FROM PROPASYNC
  _callbackUsedConceptsInputComplete: function()
  {
    this._computeOutput();
  },

  _computeOutput: function()
  {
      // console.log("COMPLETE");
      var outObs = null;
      if(this.outputs)
        outObs = this.outputs.observers; //tmp

      //TODO locate correct pattern regarding context of step
      console.log("MATCH REGARDING CONTEXT");


      this.outputs = this.inputs.merge(this.operator.behaviors.output);
      this.outputs.resetObservers();

      for(var i in this.propAsyncBuild.arrayToFill)
      {
        var fromID = this.outputs._getIdEquivalenceById("OLD_ID", this.propAsyncBuild.arrayToFill[i].from.id)[1];

        for(var j in this.operator.behaviors.output.nodes)
        {
          var toID = this.outputs._getIdEquivalenceById("OLD_ID",this.operator.behaviors.output.nodes[j].id)[1];
          this.outputs.addVisProperty(new Property(GENERATES_URI, 'generates', fromID, toID), 'to');
        }
      }

      this.isStateComputed = true;
      this.notifyOutputsComputation();
  },

  _callbackUCIUncompletion: function()
  {
    this.notifyUncompletion();
  },
  // ===

  // === PUBLIC
  changeOperator: function(op)
  {
      if (op == null)
          return;

      this.operator = op;

      if (this.operator.behaviors != null)
      {
          this.propAsyncBuild.setSecondObject(this.operator.behaviors['input']);
          this._updateUsedConcepts();
      }

      this.displayOperatorInputs = true;
  },

  changeRGTE: function(rgte)
  {
      if (rgte == null)
          return;

      this.inputs = rgte;

      this.propAsyncBuild.setFirstObject(this.inputs);

      this.displayRGTE = true;
  },

  bindRGTENOP: function(params)
  {
      if (this.isStateComputed)
      {
          console.log("===WARNING===");
          console.log("The step is currently flag as computed, meaning that its outputs has been produced. Currently, recomputing is not allowed. Thus, you could not change any bound between concepts once the configuration is over. Create a new step instead.");
          console.log("=============");
          return;
      }

      var obj = this.inputs.getNodeById(params.id);
      if (obj == null)
          obj = this.operator.behaviors['input'].getNodeById(params.id);

      this.propAsyncBuild.bind(obj, USED_AS, 'usedAs');

      return;
  },

  bindRGTEParams: function(params) {

  },

  findDependencies: function(steps, arrows)
  {
    if(this.inputs == null)
      return null;

      var props = [];
      var prop = null;

    for(var i in steps)
    {
      if(steps[i].outputs)
        if(steps[i].outputs.id == this.inputs.id)
          { prop = new Property(FOLLOWED_BY_URI, "followed by", steps[i].id, this.id);
            prop.arrows = arrows;
            props.push(prop);
          }
    }

    return props;
  },

  /* _updateUsedConcepts reset the usedComputationInput and usedConceptsParams
      arrays with the number of excepted concept
      (number of rgte classes) of the operator input and parameters*/
  _updateUsedConcepts: function()
  {
      if (this.operator == null || this.operator.behaviors == null)
          return;

      if (this.operator.behaviors['input'] != null)
      {
          this._updateUsedConceptsKeyed('input');
          console.log(this.operator.behaviors['input'].getNodes().length);
          this.propAsyncBuild.setArray(this.operator.behaviors['input'].getNodes().length);
      }

      if (this.operator.behaviors['params'] != null)
      {
          this._updateUsedConceptsKeyed('params');
          console.log("TODO propAsyncBuild!!!!");
      }

      // this.propAsyncBuild.setArray(this.usedComputationInput);
  },
  _updateUsedConceptsKeyed: function(key)
  {
      var array = [];
      var nodes = this.operator.behaviors[key].getNodes();

      for (var i in nodes)
      {
          if (nodes[i].uri != null) //If uri exist, we use it. Otherwise, we use the value of node directly
              array[nodes[i].id] = null;
          else
              array[nodes[i]] = null;
      }

      this.usedComputationInput = [];
      this.usedComputationInput = array;
  },

  isArrayFullyCompleted: function(array) //Check only the 1st level
      {
          if (array == null)
              return false;

          for (var i in array)
          {
              if (array[i] == null)
                  return false;
          }

          return true;
      },

};