function Step() {
    CAPTENClass.call(this);
    //this.previousStep = null;//FIXME PreviousStep est pointée par la propriété hasPrevious. Si elle existe

    // === PREDEFINED NARRATIVE ELEMENT
      // === NAME
        var elmt = new EntityName();
        var prop = new Property(HAS_NAME_URI, URI_TO_LABEL(HAS_NAME_URI) ,this.id, elmt.id);
        var res = NARRATIVE_BLOCK_POOL.addElementFor(this, elmt, prop);
        this.name = elmt; //The name of the step //WARNING potential conflict

      // === OBJECTIVE
        // objective is not stored directly within the step, instead, the nblck for the step stores this info
        elmt = new Objective();
        prop = new Property(HAS_OBJECTIVE_URI, URI_TO_LABEL(HAS_OBJECTIVE_URI), this.id, elmt.id);
        res = NARRATIVE_BLOCK_POOL.addElementFor(this, elmt, prop);

      // === CONTEXT
        elmt = new Context();
        prop = new Property(HAS_CONTEXT_URI, URI_TO_LABEL(HAS_CONTEXT_URI), this.id, elmt.id);
        res = NARRATIVE_BLOCK_POOL.addElementFor(this, elmt, prop);

    this.uri = STEP_URI;

    //this.annotation = null;//FIXME needed ?
    this.objective = null;
    this.settings = null; //At the difference to Indp.Op.specificSettings, it concerns all the settings needed for the step. not for the IndOp running.


    //The union of Indep.Op.specificSettings with this.settings constitute the whole --isConfiguredBy-->Setting of the ontology
    this.operator = null;
    this.inputs = null; //[RGTE]. It is actually see as a Union of the different inputs
    this.outputs = null;
    this.relationOrder = null; //Integer. Representing the place of this in the IAP.
    this.parameters = [];

    this.context = null; //TODO define CONTEXT notion
    this.treatmentType = null;

    this.creationDate = null;
    this.author = null; //using FOAF agent

    //State of the Step (ouput generation) + notification
    this.observersComputed = [];
    this.observersUnc = []; //Uncomp observer
    this.observersReset = []; //When compute output is reseted
    this.observersInputs = []; //Any modification on inputs are notified
    this.observersIOPCompositeRelations = []; //Any modification of the relations between A -> B from Input and NOP
    this.observersIOPCompositeOptions = []; //Any modif in the composite elements' option will be forwarded by the step
    this.observersKChange = []; //Any modification when embedded K is changed (i.e. from inputs or outputs);

    this.isStateComputed = false; //If the output has been computed. MUST BE @ true when all the node expected are aligned with the input node
    this.usedComputationInput = []; //State of the computation. Associative array. All the op.beh.inpu node must be aligned with one this.input.node
    this.propAsyncBuild = new PropertyAsyncrhonousBuilder();
      this.propAsyncBuild.setValidationFunction(this._propertyAsyncValidationFunction);
      this.propAsyncBuild.registerObserverCallbackOnCompletion(this, this._callbackUsedConceptsInputComplete);
      this.propAsyncBuild.registerObserverCallbackOnUncompletion(this, this._callbackUCIUncompletion);
      this.propAsyncBuild.registerObserverCallbackOnUpdate(this, this._callbackPropertyAsyncUpdate);

    this.htmlify = "a step";


    this._compositeRelations = []; //An array of compositeelement. Each are a 4-tuples : one node input, one node ope.behaviors.inputs, one prop linking them and one options.color
}

Step.prototype = new CAPTENClass();
Step.prototype.constructor = Step;



  // === OBSERVATION
    Step.prototype.resetAllObservers = function()
    {
      this.observersComputed = [];
      this.observersUnc = [];
    }
    // === COMPUTATION
    Step.prototype.registerObserverCallbackOnOutputsComputation = function(objCallback, callback)
    {
      if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.observersComputed))
        this.observersComputed.push([objCallback,callback]);
    }

      // === NOTIFICATION
      Step.prototype.notifyOutputsComputation = function()
      {
        this.observersComputed.forEach(function(e)
        {
          console.log(e);
            if (typeof e[1] === "function") {
              e[1].call(e[0], this);//e[0] define the `this` context for e[1]
            }
        }.bind(this));
      }

      // === UNCOMPLETION
      Step.prototype.registerObserverCallbackOnUncompletion = function(objCallback, callback)
      {
        if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.observersUnc))
          this.observersUnc.push([objCallback,callback]);
      }

        // === NOTIFICATION
        Step.prototype.notifyUncompletion = function()
        {
          this.observersUnc.forEach(function(e)
          {
            console.log(e);
              if (typeof e[1] === "function") {
                e[1].call(e[0]);//e[0] define the `this` context for e[1]
              }
          });
        }

        // === RESETING OUTPUTS
        Step.prototype.registerObserverCallbackOnOutputsReset = function(objCallback, callback)
        {
          if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.observersReset))
            this.observersReset.push([objCallback,callback]);
        }

          // === NOTIFICATION
          Step.prototype.notifyOutputReset = function(resetedOutput)
          {
            this.observersReset.forEach(function(e)
            {
              console.log(e);
                if (typeof e[1] === "function") {
                  e[1].call(e[0], resetedOutput);//e[0] define the `this` context for e[1]
                }
            });
          }

        // === CHANGE INPUTS
          Step.prototype.registerObserverCallbackOnInputsChange = function(objCallback, callback)
          {
            if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.observersInputs))
              this.observersInputs.push([objCallback, callback]);
          }

          // === NOTIFICATION
          Step.prototype.notifyInputsChange = function()
          {
            this.observersInputs.forEach(function(e)
            {
              console.log(e);
                if (typeof e[1] === "function") {
                  e[1].call(e[0]);//e[0] define the `this` context for e[1]
                }
            });
          }
          // === COMPOSITE RELATIONS I NOP CHANGE
          Step.prototype.registerObserverCallbackOnIOPCompositeRelationChange = function(objCallback, callback)
          {
            if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.observersIOPCompositeRelations))
              this.observersIOPCompositeRelations.push([objCallback,callback]);
          }

            // === NOTIFICATION
            Step.prototype.notifyIOPCompositeRelationChange = function()
            {
              this.observersIOPCompositeRelations.forEach(function(e)
              {
                console.log(e);
                  if (typeof e[1] === "function") {
                    e[1].call(e[0], this);//e[0] define the `this` context for e[1]
                  }
              }.bind(this));
            }

          // === COMPOSITE ELEMENTS I NOP OPTION CHANGE
          Step.prototype.registerObserverCallbackOnIOPCompositeOptionsChange = function(objCallback, callback)
          {
            if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.observersIOPCompositeOptions))
              this.observersIOPCompositeOptions.push([objCallback,callback]);
          }

            // === NOTIFICATION
            Step.prototype.notifyIOPCompositeOptionsChange = function(concernedCompositeElement)//elmt is the CompositeElement concerned
            {
              this.observersIOPCompositeOptions.forEach(function(e)
              {
                console.log(e);
                  if (typeof e[1] === "function") {
                    e[1].call(e[0], concernedCompositeElement);//e[0] define the `this` context for e[1]
                  }
              }.bind(this));
            }

          // === CHANGEMENT OF A KNOWLEDGE / EXPLOITABLE OUTPUT EMBEDDED IN THIS
          Step.prototype.registerObserverCallbackOnKChange = function(objCallback, callback)
          {
            if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.observersKChange))
              this.observersKChange.push([objCallback, callback]);
          }

            // === NOTIFICATION
            Step.prototype.notifyKEmbeddedChange = function()
            {
                this.observersKChange.forEach(function(e){
                  if(typeof e[1] === "function")
                  {
                    e[1].call(e[0], this);
                  }
                }.bind(this));
            }
    // ===

  // === CALLBACK BEHAVIORS FROM PROPASYNC
  Step.prototype._callbackUsedConceptsInputComplete = function()
  {
    this._computeOutput();
  }

  Step.prototype._computeOutput = function()
  {
      // console.log("COMPLETE");
      // var outObs = null;
      // if(this.outputs)
      //   outObs = this.outputs.observers; //tmp
      //
      // //TODO locate correct pattern regarding context of step
      // console.log("MATCH REGARDING CONTEXT");
      //
      //
      // this.outputs = this.inputs.merge(this.operator.behaviors.output);
      // this.outputs.resetObservers();
      //
      // for(var i in this.propAsyncBuild.arrayToFill)
      // {
      //   var fromID = this.outputs._getIdEquivalenceById("OLD_ID", this.propAsyncBuild.arrayToFill[i].from.id)[1];
      //
      //   for(var j in this.operator.behaviors.output.nodes)
      //   {
      //     var toID = this.outputs._getIdEquivalenceById("OLD_ID",this.operator.behaviors.output.nodes[j].id)[1];
      //     this.outputs.addVisProperty(new Property(GENERATES_URI, 'generates', fromID, toID), 'to');
      //   }
      // }

      var outputs = this._generateOutput();
      this._updateOutputStatus(outputs);
  }

  Step.prototype._generateOutput = function()
  {
    var outputs = this.inputs.merge(this.operator.behaviors.output);
    outputs.resetObservers();

    for(var i in this.propAsyncBuild.arrayToFill)
    {
      var fromID = outputs._getIdEquivalenceById("OLD_ID", this.propAsyncBuild.arrayToFill[i].from)[1];

      for(var j in this.operator.behaviors.output.nodes)
      {
        var toID = outputs._getIdEquivalenceById("OLD_ID",this.operator.behaviors.output.nodes[j].id)[1];
        outputs.addVisProperty(new Property(GENERATES_URI, 'generates', fromID, toID), 'to');
      }
    }

    var exString = new ExtendedString();
    exString.update("Graph computed during the step ");
    exString.add(this);
    exString.add('.');

    outputs.setName(exString);
    RGTE_POOL.register(outputs);

    return outputs;
  }

  Step.prototype._updateOutputStatus= function(outputs) //Update the status for a given outputs. Mostly used after this._generateOutput();
  {
    if(this.outputs == null)
    {
      this.isStateComputed = false;
    }

    if(outputs != null && (this.outputs == null || this.outputs.id != outputs.id) )
    {
      this.outputs = outputs;

      this.isStateComputed = true;

      // Attaching observation on the new output
      this.outputs.registerObserverCallbackElementAdded(this, this._callbackRGTEReceiveAdd);
      this.outputs.registerObserverCallbackElementRemoved(this, this._callbackRGTEReceiveRemove);
      this.outputs.registerObserverCallbackElementUpdated(this, this._callbackRGTEReceiveUpdate);
      this.outputs.registerObserverCallbackGraphDeleted(this, this._callbackRGTEDeleted);

      this.outputs.registerObserverCallbackOnKnowledgeIdentified(this, this._callbackAddedK);
      this.outputs.registerObserverCallbackOnKnowledgeDeidentified(this, this._callbackRemovedK);
    }
    this.notifyOutputsComputation();
  }

  Step.prototype.addParameter = function(param)
  {
    if(param == null)
      return;

    this.parameters.push(param);
  }

  Step.prototype.toString= function()
  {
    var res = this.name.getName();

    if(res == null)
      res = this.label;

    if(res == null)
      res = this.uri;

    if(res == null)
      res = this.id;

    return res;
  },

  Step.prototype._callbackUCIUncompletion = function()
  {
    this.notifyUncompletion();
  }
  // ===

  // === CALLBACK BEHAVIORS FROM INPUTS & OUTPUTS
    Step.prototype._callbackRGTEReceiveAdd = function(from, elmt)
    {
      if(elmt == null)
        return;

      if(!this.isStateComputed) // Nothing to do
        return;

      if(from.id == this.inputs.id)//Inputs has changed, thus recompute must be done !
      {
        console.log("building new output");
        // var newOutput = this.outputs.copy();

        if(elmt instanceof CAPTENClass)
          this.outputs.addVisNode(elmt, elmt.label);
        else if(elmt instanceof Property)
        {
          var nodeFrom = this._findDerivationCorrespondance(elmt.from, this.outputs);
          var nodeTo = this._findDerivationCorrespondance(elmt.to, this.outputs);

          if( !nodeFrom instanceof CAPTENClass || !nodeTo instanceof CAPTENClass)
            return;

          // var outputEdge = elmt.copy();
          // outputEdge.from = nodeFrom.id;
          // outputEdge.to = nodeTo.id;

          this.outputs.updateEdgeFromTo(this.outputs.addVisProperty(elmt, elmt.arrows), nodeFrom.id, nodeTo.id);
        }
        this.notifyInputsChange();
        this._updateOutputStatus(this.outputs);
      }
      else if(from.id == this.outputs.id)//otherwise, outputs has changed, nothing has to be done for this step
      {
        /*If the RGTE is produced by this, then modifying it does not influence this. If it is used in other step, then the _callbackRGTEReceiveAdd will
         * be called and proc into from.id == this.input.id, for recompute
        */
      }
    }

    Step.prototype._callbackRGTEReceiveRemove = function(from, elmt)
    {
      if(elmt == null)
        return;

      if(!this.isStateComputed)
        return;

      if(from.id == this.inputs.id)
      {
        if(elmt instanceof CAPTENClass)
        {
          var relatedNOPProps = this._findNOPNodesDependenciesWith(elmt);
          var nodeRemoved = this._findDerivationCorrespondance(elmt, this.outputs);

          if(relatedNOPProps == 0)//If the deleted node is not used for compute the output
          {
            this.outputs.removeNode(nodeRemoved.id);
          }
          else {
            this.propAsyncBuild.cleanArrayOf(nodeRemoved.id);
            this.verifyOutputsEligibility();
          }
        }
        else if(elmt instanceof Property)
        {
          var edgeRemoved = this._findDerivationCorrespondance(elmt, this.outputs);
          this.outputs.removeEdge(edgeRemoved.id);
        }
      }
    }

    Step.prototype._callbackRGTEDeleted = function(graphID)//Handled in the super structure (here NAP). It could be manged by a notification system between rgte & step, but a counter is more hard to maintain
    {
      if(this.inputs == null)
        return;

      if(graphID == this.inputs.id)
        this.removeInputs();

        //NTD if output, already handled from verifyOutputsEligibility
    }

    Step.prototype._callbackRGTEReceiveUpdate = function(from, elmt)
    {
      if(elmt == null)
        return;

      if(!this.isStateComputed)
        return;

        if(from.id == this.inputs.id)//Inputs has changed, thus recompute must be done !
        {
          if(elmt instanceof CAPTENClass)
          {
            //CHECK DESYNCHRO WITH OPERATOR

            var nodeUpdated = this._findDerivationCorrespondance(elmt.derivedFrom, this.outputs);
            var relatedNOPProps = this._findNOPNodesDependenciesWith(elmt.derivedFrom); //If NOP use the updated node,

            for(var i in relatedNOPProps)
              relatedNOPProps[i].updateFromTo(elmt.id, relatedNOPProps[i].to);

            var n = this.outputs.updateNode(nodeUpdated.id,elmt);
            n.derivedFrom = elmt;//Allow to update for the next and avoid id desynchro
          }
          else if(elmt instanceof Property)
          {
            var propUpdated = this._findDerivationCorrespondance(elmt.derivedFrom, this.outputs);

            var e = this.outputs.updateEdge(propUpdated.id, elmt);
            e.derivedFrom = elmt;
          }

          this.notifyInputsChange();
          this._updateOutputStatus(this.outputs);
        }
        else if(from.id == this.outputs.id)//otherwise, outputs has changed, nothing has to be done for this step
        {
          /*If the RGTE is produced by this, then modifying it does not influence this. If it is used in other step, then the _callbackRGTEReceiveAdd will
           * be called and proc into from.id == this.input.id, for recompute
          */
        }
    }

    Step.prototype._callbackAddedK= function(graphID)
    {
      this.notifyKEmbeddedChange();
    }

    Step.prototype._callbackRemovedK= function(graphID)
    {
      this.notifyKEmbeddedChange();
    }
  // === END CALLBACK BEHAVIORS FROM INPUTS & OUTPUTS

  // === PROPASYNC VALIDATION FUNCTION
  Step.prototype._propertyAsyncValidationFunction= function(A, B, arrayToFill)
  {
    if( !(B instanceof RGTE) )
    {
      console.error("VALIDATION FUNCTION FROM STEP: B IS NOT A GRAPH");
      return;
    }

    var max = 0; var counted = 0;
    for(var i in this.B.getNodes()) // each node have to be linked with other item once
    {
      for(var j in this.arrayToFill)
      {
        if(this.B.nodes[i].id == this.arrayToFill[j].to)//We have on property goind toward this.B.nodes[i].id.
          counted++;
      }
      max++;
    }

    if(max == counted)
      return true;
    return false;
  },
  // === END PROPASYNC

  // === PUBLIC
  Step.prototype.isComplete = function()
  {
    return this.isStateComputed;
  }

  Step.prototype.getRelations= function()
  {
    var from; var opNode;
    var res = [];

    for(var i in this.propAsyncBuild.arrayToFill)
    {
      if(this.inputs)
        from = this.inputs.getNodeById(this.propAsyncBuild.arrayToFill[i].from);
      if(this.operator && this.operator.input)
        opNode = this.operator.input.getNodeById(this.propAsyncBuild.arrayToFill[i].to);

      res.push({from: from, to: opNode });
    }

    return res;
  }

  Step.prototype.removeInputs = function()
  {
    this.inputs = null;

    this.propAsyncBuild.setFirstObject(null);

    this.displayRGTE = false;

    this.notifyInputsChange();
    this.verifyOutputsEligibility();
  }

  Step.prototype.changeOperator = function(op)
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

      this._flushCompositeRelations();

      this.verifyOutputsEligibility();
  }

  Step.prototype.changeRGTE = function(rgte) // Input is considered as always in the pool
  {
      if (rgte == null)
          return;

      this.inputs = rgte;

      this.inputs.registerObserverCallbackElementAdded(this, this._callbackRGTEReceiveAdd);
      this.inputs.registerObserverCallbackElementRemoved(this, this._callbackRGTEReceiveRemove);
      this.inputs.registerObserverCallbackElementUpdated(this, this._callbackRGTEReceiveUpdate);
      this.inputs.registerObserverCallbackGraphDeleted(this, this._callbackRGTEDeleted);

      this.inputs.registerObserverCallbackOnKnowledgeIdentified(this, this._callbackAddedK);
      this.inputs.registerObserverCallbackOnKnowledgeDeidentified(this, this._callbackRemovedK);

      this.propAsyncBuild.setFirstObject(this.inputs);
      this._updateUsedConcepts();

      this.displayRGTE = true;

      this._flushCompositeRelations();

      this.notifyInputsChange();

      this.verifyOutputsEligibility();
  }

  //A notifyUncompletion is ALWAYS fired! Because its from this func
  // !!!!!!!!!! THIS FUNCTION HAS TO BE CALLED ONLY AFTER AN ALTERATION OF INPUTS or OPERATOR of THIS !!!!!!!!
  Step.prototype.verifyOutputsEligibility = function()
  {
    if(this.isStateComputed)
    {
      var oldOutputs = this.outputs;
      RGTE_POOL.delete(this.outputs);
      this.outputs = null;

      this.isStateComputed = false; //Reset state of computation;

      this.notifyOutputReset(oldOutputs);
    }
    this.notifyUncompletion();
  }

  Step.prototype.bindRGTENOP = function(params)
  {
      if(this.inputs == null || this.operator == null)
      {
        console.log("Binding is impossible, one of the two elements is null. Aborting...");
        return;
      }
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

      this._updateCompositeRelations();

      return;
  }

  Step.prototype.bindRGTEParams = function(params) {

  }

  Step.prototype._flushCompositeRelations = function() //reset the array by calling delete
  {
    for(var i in this._compositeRelations)
      this._compositeRelations[i].delete();

    this._compositeRelations = [];

    this.notifyIOPCompositeRelationChange();
  }

  Step.prototype.getCompositeRelations= function()
  {
    return this._compositeRelations;
  }

  Step.prototype.findDependencies = function(steps, arrows)
  {
    if(this.inputs == null)
      return null;

      var props = [];
      var prop = null;

    for(var i in steps)
    {
      if(steps[i].outputs)
      {
        if(this.inputs instanceof SuperRGTE)
        {
          for(var j in this.inputs.sources)
          {
            if(this.inputs.sources[j].id == steps[i].outputs.id)
            {
              prop = new Property(FOLLOWED_BY_URI, "followed by", steps[i].id, this.id);
              prop.arrows = arrows;
              props.push(prop);
            }
          }
        }
        else
        {
          if(steps[i].outputs.id == this.inputs.id)
          { prop = new Property(FOLLOWED_BY_URI, "followed by", steps[i].id, this.id);
            prop.arrows = arrows;
            props.push(prop);
          }
        }
      }
    }

    return props;
  }

  Step.prototype.setName = function(name)
  {
    if(name == null)
      return;

    if(this.narrativeBlock == null)
      this.narrativeBlock = NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);

    if(this.name == null)
      this.name = this.narrativeBlock.getElementsFromURIProperty(HAS_NAME_URI);

    if(this.name == null) //after the second if still null abort, some issue
      return;

    this.name.updateAttribute('name', name);

    NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);
    // if(name.id == null)
    // {
    //   console.error('content must have an id');
    //   return null;
    // }
    //
    // if(!(name instanceof EntityName))
    // {
    //   console.error('content must be an EntityName');
    //   return null;
    // }
    //
    // var narrativeblock = null;
    // if(this.name)//If a name already exist, it must be replaced
    // {
    //   narrativeblock = NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);
    //
    //   if(narrativeblock == null)
    //   {
    //     console.log('A narrative block should be present. Aborting...');
    //     return;
    //   }
    //
    //   narrativeblock.removeElement(this.name);
    // }
    //
    // narrativeblock = NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);
    // if(narrativeblock == null)
    // {
    //   console.log('Their is no narrative block registered for the element#'+this.id+' inside the narrative block pool. Registering...');
    //   narrativeblock = NARRATIVE_BLOCK_POOL.createFromElement(this);
    //   console.log('done. Registered in block#'+narrativeblock.id);
    // }
    //
    // var props = PROPERTIES_POOL.getPropertiesByExtremities(this.id, name.id);
    // var prop = null;
    //
    // if(props.length <= 0)
    // {
    //   console.log('the relation between the step and the name is not referenced in the pool. Referencing...');
    //   prop = PROPERTIES_POOL.create(HAS_NAME_URI, URI_TO_LABEL(HAS_NAME_URI) ,this.id, name.id);
    //   console.log('done.');
    // }
    // else
    //   prop = props[0];
    //
    // console.log(narrativeblock);
    // narrativeblock.addElement(name, prop);//Adding the new addendum inside the corresponding narrative block
    //
    // this.name = name;
    // // this.label = this.name;//By default, the label name of the step is its name
  }

  Step.prototype.getName = function()
  {
    if(this.name == null)
      return;
    return this.name.getName();
  }

  Step.prototype.getInputs = function()
  {
    return this.inputs;
  }
  Step.prototype.getOutputs = function()
  {
    return this.outputs;
  }

  Step.prototype.setAuthor = function(author)
  {
    if(author == null)
      return;

    if(author.id == null)
    {
      console.error('content must have an id');
      return null;
    }

    if(!(author instanceof Author))
    {
      console.error('content must be an Author');
      return null;
    }

    var narrativeblock = null;
    if(this.author)//If an author already exist, it must be replaced
    {
      narrativeblock = NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);

      if(narrativeblock == null)
      {
        console.log('A narrative block should be present. Aborting...');
        return;
      }

      narrativeblock.removeElement(this.author);
    }

    narrativeblock = NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);
    if(narrativeblock == null)
    {
      console.log('Their is no narrative block registered for the element#'+this.id+' inside the narrative block pool. Registering...');
      narrativeblock = NARRATIVE_BLOCK_POOL.createFromElement(this);
      console.log('done. Registered in block#'+narrativeblock.id);
    }

    var props = PROPERTIES_POOL.getPropertiesByExtremities(this.id, author.id);
    var prop = null;

    if(props.length <= 0)
    {
      console.log('the relation between the step and the author is not referenced in the pool. Referencing...');
      prop = PROPERTIES_POOL.create(HAS_AUTHOR_URI, URI_TO_LABEL(HAS_AUTHOR_URI),this.id, author.id);
      console.log('done.');
    }
    else
      prop = props[0];

    console.log(narrativeblock);
    narrativeblock.addElement(author, prop);//Adding the new addendum inside the corresponding narrative block

    this.author = author;
  }

  Step.prototype.setObjective = function(objective)
  {
    if(objective == null)
      return;

    if(this.narrativeBlock == null)
      this.narrativeBlock = NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);

    if(this.objective == null)
      this.name = this.narrativeBlock.getElementsFromURIProperty(HAS_NAME_URI);

    if(this.name == null) //after the second if still null abort, some issue
      return;

    this.name.updateAttribute('name', name);

    NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);
    // if(objective == null)
    //   return;
    //
    // if(objective.id == null)
    // {
    //   console.error('objective must have an id');
    //   return null;
    // }
    //
    // if(!(objective instanceof Objective))
    // {
    //   console.error('objective must be an Objective');
    //   return null;
    // }
    //
    // var narrativeblock = null;
    // if(this.objective)//If an author already exist, it must be replaced
    // {
    //   narrativeblock = NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);
    //
    //   if(narrativeblock == null)
    //   {
    //     console.log('A narrative block should be present. Aborting...');
    //     return;
    //   }
    //
    //   narrativeblock.removeElement(this.objective);
    // }
    //
    // narrativeblock = NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);
    // if(narrativeblock == null)
    // {
    //   console.log('Their is no narrative block registered for the element#'+this.id+' inside the narrative block pool. Registering...');
    //   narrativeblock = NARRATIVE_BLOCK_POOL.createFromElement(this);
    //   console.log('done. Registered in block#'+narrativeblock.id);
    // }
    //
    // var props = PROPERTIES_POOL.getPropertiesByExtremities(this.id, objective.id);
    // var prop = null;
    //
    // if(props.length <= 0)
    // {
    //   console.log('the relation between the step and the author is not referenced in the pool. Referencing...');
    //   prop = PROPERTIES_POOL.create(HAS_OBJECTIVE_URI, URI_TO_LABEL(HAS_OBJECTIVE_URI),this.id, objective.id);
    //   console.log('done.');
    // }
    // else
    //   prop = props[0];
    //
    // console.log(narrativeblock);
    // narrativeblock.addElement(objective, prop);//Adding the new addendum inside the corresponding narrative block
    //
    // this.objective = objective;
    // //ADD IN NARRATIVE BLOCK AND PROPERTY POOL HAS_OBJECTIVE
  }

  Step.prototype.setContext = function(context)
  {
    if(context == null)
      return;

    if(context.id == null)
    {
      console.error('context must have an id');
      return null;
    }

    if(!(context instanceof Context))
    {
      console.error('context must be an Objective');
      return null;
    }

    var narrativeblock = null;
    if(this.context)//If a context already exist, it must be replaced
    {
      narrativeblock = NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);

      if(narrativeblock == null)
      {
        console.log('A narrative block should be present. Aborting...');
        return;
      }

      narrativeblock.removeElement(this.context);
    }

    narrativeblock = NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);
    if(narrativeblock == null)
    {
      console.log('Their is no narrative block registered for the element#'+this.id+' inside the narrative block pool. Registering...');
      narrativeblock = NARRATIVE_BLOCK_POOL.createFromElement(this);
      console.log('done. Registered in block#'+narrativeblock.id);
    }

    var props = PROPERTIES_POOL.getPropertiesByExtremities(this.id, context.id);
    var prop = null;

    if(props.length <= 0)
    {
      console.log('the relation between the step and the author is not referenced in the pool. Referencing...');
      prop = PROPERTIES_POOL.create(HAS_CONTEXT_URI,URI_TO_LABEL(HAS_CONTEXT_URI),this.id, context.id);
      console.log('done.');
    }
    else
      prop = props[0];

    console.log(narrativeblock);
    narrativeblock.addElement(context, prop);//Adding the new addendum inside the corresponding narrative block
      this.context = context;
      //ADD IN NARRATIVE BLOCK AND PROPERTU POOL HAS_CONTEXT
  }

  /* _updateUsedConcepts reset the usedComputationInput and usedConceptsParams
      arrays with the number of excepted concept
      (number of rgte classes) of the operator input and parameters*/
  Step.prototype._updateUsedConcepts = function()
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
  }
  Step.prototype._updateUsedConceptsKeyed = function(key)
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
  }

  Step.prototype._findNOPNodesDependenciesWith = function(node) //test NOP if of its inputs behaviors is linked with node
  {
    if(this.operator == null || this.operator.behaviors == null || this.operator.behaviors.input == null)
      return;

    var res = [];
    var tmp = [];
    var browsedNodes = this.operator.behaviors.input.getNodes();

    for(var i in browsedNodes)
    {
      tmp = PROPERTIES_POOL.getPropertiesByExtremities(node.id, browsedNodes[i].id);

      for(var j in tmp)
        res.push(tmp[j]);
    }

    return res;
  }

  Step.prototype.isArrayFullyCompleted = function(array) //Check only the 1st level
      {
          if (array == null)
              return false;

          for (var i in array)
          {
              if (array[i] == null)
                  return false;
          }

          return true;
      }

  Step.prototype._findDerivationCorrespondance = function(elmt, rgte)//Browse all the elements of rgte and look @ rgte.elmt.derivedFrom.
  {
    var res;
    var id;
    if(elmt == null)
    {
      console.error("Element is null, could not find dependencies");
      return;
    }
    if(typeof elmt == 'number')
      id = elmt;
    else if(elmt.retrieveUniqueIdentifier != null)
      id = elmt.retrieveUniqueIdentifier();
    else
      return null;

    var nodes = rgte.getNodes();
    for(var i in nodes)
      if(nodes[i].derivedFrom && nodes[i].derivedFrom.id == id)
          return nodes[i];

    var edges = rgte.getEdges();
    for(var i in edges)
      if(edges[i].derivedFrom && edges[i].derivedFrom.id == id)
        return edges[i];

    return null;
  }

  Step.prototype._updateCompositeRelations = function()
  {
    var compositesToAdd = [];

    for(var i in this.propAsyncBuild.arrayToFill)
    {
      var ce = new CompositeElement();
      ce.addElements([this.propAsyncBuild.arrayToFill[i], this.inputs.getNodeById(this.propAsyncBuild.arrayToFill[i].from), this.operator.behaviors.input.getNodeById(this.propAsyncBuild.arrayToFill[i].to)]);
      ce.addOption({color: DEFAULT_RELATION_COLOR});
      compositesToAdd.push(ce);
    }

    var indexToSplice = [];
    for(var i in this._compositeRelations)
    {
      for(var j in compositesToAdd)
      {
        if(this._compositeRelations[i].containsAll(compositesToAdd[j].getElementsID()))
        {
          indexToSplice.push(j);
        }
      }
    }

    var offset = 0;//Used to relacibrate for splicing
    for(var i in indexToSplice)
    {
      compositesToAdd.splice(indexToSplice[i]-offset,1);
      offset++;
    }

    for(var i = 0; i < compositesToAdd.length; i++)
    {
      this._compositeRelations.push(compositesToAdd[i]);
      this._compositeRelations[this._compositeRelations.length-1].registerObserverCallbackOnChange(this, this._onCompositeElementChange);
      this._compositeRelations[this._compositeRelations.length-1].registerObserverCallbackOnOptionsChange(this, this._onCompositeElementOptionsChange);

      this.notifyIOPCompositeRelationChange();
    }
    return;

    // for(var i in this.propAsyncBuild.arrayToFill)
    // {
    //   if(this._compositeRelations.length == 0)
    //   {
    //     var ce = new CompositeElement();
    //     ce.addElements([this.propAsyncBuild.arrayToFill[i], this.inputs.getNodeById(this.propAsyncBuild.arrayToFill[i].from), this.operator.behaviors.input.getNodeById(this.propAsyncBuild.arrayToFill[i].to)]);
    //     ce.addOption({color: DEFAULT_RELATION_COLOR});
    //     compositesToAdd.push(ce);
    //     break;
    //   }
    //
    //   for(var j in this._compositeRelations)
    //   {
    //     if(!this._compositeRelations[j].containsAll([this.propAsyncBuild.arrayToFill[i].id, this.propAsyncBuild.arrayToFill[i].from, this.propAsyncBuild.arrayToFill[i].to]))
    //     {
    //       var ce = new CompositeElement();
    //       ce.addElements([this.propAsyncBuild.arrayToFill[i], this.inputs.getNodeById(this.propAsyncBuild.arrayToFill[i].from), this.operator.behaviors.input.getNodeById(this.propAsyncBuild.arrayToFill[i].to)]);
    //       ce.addOption({color: DEFAULT_RELATION_COLOR});
    //       compositesToAdd.push(ce);
    //     }
    //   }
    // }
    //
    // if(compositesToAdd.length == 0)
    //   return;
    //
    // for(var i = 0; i < compositesToAdd.length; i++)
    // {
    //   this._compositeRelations.push(compositesToAdd[i]);
    //   this._compositeRelations[this._compositeRelations.length-1].registerObserverCallbackOnChange(this, this._onCompositeElementChange);
    //
    //   this.notifyIOPCompositeRelationChange();
    // }
    // return;
  }

  Step.prototype._onCompositeElementChange = function()
  {
    this.notifyIOPCompositeRelationChange();
  },

  Step.prototype._onCompositeElementOptionsChange = function(elmt)
  {
    this.notifyIOPCompositeOptionsChange(elmt);
  },

  Step.prototype._callbackPropertyAsyncUpdate = function(oldP, newP)
  {
    var ce = new CompositeElement();
    ce.addElements([newP, this.inputs.getNodeById(newP.from), this.operator.behaviors.input.getNodeById(newP.to)]);

    for(var i in this._compositeRelations)
    {
      if(this._compositeRelations[i].containsAll([oldP.id, oldP.from, oldP.to]))
      {
        this._compositeRelations.splice(i, 1);
        break;
      }
    }

    this._compositeRelations.push(ce);

    this._compositeRelations[this._compositeRelations.length-1].registerObserverCallbackOnChange(this, this._onCompositeElementChange);
    this._compositeRelations[this._compositeRelations.length-1].registerObserverCallbackOnOptionsChange(this, this._onCompositeElementOptionsChange);

    this.notifyIOPCompositeRelationChange();
  },

// === POLYMER ELEMENTS
  // === NAMER ELEMENT
  Step.namerElement = Polymer(
  {
    is : 'step-namer-element',

    properties:
    {
      entity:
      {
        type: Object,
        notify: true,
      },
    },

    factoryImpl: function(item)
    {
      this.entity = item;
    },
  });
  // === END NAMER ELEMENT
  // === CONFIGURER ELEMENT
    Step.configurerElement =  Polymer(
    {
        is: "step-configurer-element",

        properties:
        {
            entity:
            {
                type: Object,
                notify: true,
                observer: "_updateField",
            },
            name:
            {
                type: Object,
                notify: true,
                value: function(){return new EntityName();},
            },
            objective:
            {
                type: Object,
                notify: true,
                value: function(){return new Objective();},
            },
            context:
            {
                type: Object,
                notify: true,
                value: function(){return new Context();},
            },
            author:
            {
              type: Object,
              notify: true,
              value: function(){return new Author();},
            },
            cascaded:
            {
              type: Boolean,
              notify: true,
              value: false,
            },
        },

        factoryImpl: function(item)
        {
          this.author = new Author();
          this.entity = item;
        },

        _updateStep: function(e)
        {
          if(this.entity == null)
            return;

          this.$.nameConfigurer._update();
            if( ! IS_EMPTY(this.name) )
              this.entity.setName(this.name);

          this.$.objectiveConfigurer._updateObjective();
            if( ! IS_EMPTY(this.objective) )
              this.entity.setObjective(this.objective);

          this.$.contextConfigurer._update();
            if(!IS_EMPTY(this.context))
              this.entity.setContext(this.context);

          this.$.authorConfigurer._updateAuthor();
            if( ! IS_EMPTY(this.author) )
              this.entity.setAuthor(this.author);

          if(!this.cascaded)
            CONFIGURER_NOTIFY_VALIDATION_SIGNAL_BUILDER(this, this.entity, e);
        },
        _updateField: function()
        {
          if(this.entity == null)
            return;

          if(this.entity.name)
            this.name = this.entity.name;

          if(this.entity.objective)
            this.objective = this.entity.objective;

          if(this.entity.context)
            this.context = this.entity.context;

          if(this.entity.author)
            this.author = this.entity.author;
        },
    });
  // === END CONFIGURER ELEMENT
