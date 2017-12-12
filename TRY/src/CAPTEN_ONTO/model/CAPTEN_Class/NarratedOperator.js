function NarratedOperator(usualName)
{

    CAPTENClass.call(this);

    this.uri = OPERATOR_URI;

    // === PREDEFINED NARRATIVE ELEMENTS
      // === NAME
        var elmt = new EntityName(usualName);
        var prop = new Property(HAS_NAME_URI, URI_TO_LABEL(HAS_NAME_URI) ,this.id, elmt.id);
        var res = NARRATIVE_BLOCK_POOL.addElementFor(this, elmt, prop);
        this.usualName = elmt;

      // === OBJECTIVE
        // objective is not stored directly within the nop/nap, instead, the nblck for the nop/nap stores this info
        elmt = new Objective();
        prop = new Property(HAS_OBJECTIVE_URI, URI_TO_LABEL(HAS_OBJECTIVE_URI), this.id, elmt.id);
        res = NARRATIVE_BLOCK_POOL.addElementFor(this, elmt, prop);
        // this.objective = elmt;

    this.uriConceptConvoyed = null; //Allow to have a dictionary of the different concept of operation. Comme *Find* et *Correlation*

    //UPDATE from 22/09/216 : operators[] remove from IAP & become a part of an IOP
    this.steps = []; //NOT Used : Associative array : [RelationOrder]:[ListOfSteps]
      this._lastUpdatedStep = null; //Record the last step computed

    this.annotation = null; //Annotation regarding the IndpOp


    //Behavoural Patterns
    // this.inputPatterns = null; //Inputs RGTE pattern needed
    // this.outputPatterns = null; //Output pattern. : can be infered by behaviors(inputPatterns)
    // this.specificSettings = null; //Specific settings needed to this Indp. Op. such as _node1_ > 5
    this.behaviors = []; //BehavioralPattern. The behaviors of a specific NarratedOperator.
      this.behaviors['output'] = new RGTE();//this RGTE is not register in the RGTE POOL
      this.behaviors['input'] = new RGTE;//this RGTE is not register in the RGTE POOL
      this.behaviors['parameters'] = [];

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
NarratedOperator.prototype = new CAPTENClass();
NarratedOperator.prototype.constructor = NarratedOperator;



    // === OBSERVATION
      NarratedOperator.prototype.resetAllObservers = function()
      {
        this.observers = [];
      }

      NarratedOperator.prototype.removeMeFromObservation = function(obj)
      {
        if(obj == null)
          return null;

        var indexToSplice = [];
        for(var i in this.observers)
          if(this.observers[i].id && this.observers[i].id == obj.id)
            indexToSplice.push(i);

        var offset = 0;
        for(var i in indexToSplice)
        {
          this.observers.splice(i-offset, 1);
          offset++;
        }
      }

      NarratedOperator.prototype.registerObserverCallbackOnChange = function(objCallback, callback)
      {
        if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.observers))
          this.observers.push([objCallback,callback]);
      }

      NarratedOperator.prototype.notifyChange = function()
      {
        this.observers.forEach(function(e){
          if(typeof e[1] === "function")
          {
            e[1].call(e[0], this);
          }
        }.bind(this));
      }

    NarratedOperator.prototype.solve = function(inputs)
    {
        console.log("solving");
    }

    /**
     * Test if a NOP is equal to an another NOP. The equality should be mostly defined by the patterns
     */
    NarratedOperator.prototype.isEqual = function(nop)
    {

    }

    NarratedOperator.prototype.addParameterPattern = function(param)
    {
      if(param == null || !(param instanceof ParameterPattern) )
        return;

      for(var i = 0; i < this.behaviors['parameters'].length; i++)
        if(this.behaviors['parameters'][i].id == param.id)
          return;

      this.behaviors['parameters'].push(param);

      this.notifyChange();
    }

    NarratedOperator.prototype.removeParameterPattern = function(param)
    {
      var index;

      for(var i in this.behaviors['parameters'])
      {
          if(param.id == this.behaviors['parameters'].id)
        {
          index = i;
          break;
        }
      }

      if(index)
        this.behaviors.splice(i, 1);
    }

    NarratedOperator.prototype.addStep= function(step)
    {
      if(!(step instanceof Step))
        return;

      if(!this.alreadyExists(step))
      {
        step.isRegistered = true;
        step.registerObserverCallbackOnOutputsComputation(this, this.notifyChange);
        step.registerObserverCallbackOnUncompletion(this, this.notifyChange);
        step.registerObserverCallbackOnKChange(this, this._callbackKChange);
        this.steps.push(step);

        this.notifyChange();

        return this.steps[this.steps.length-1];
      }
    }

    NarratedOperator.prototype._callbackKChange = function()
    {
      // N T D because it's a NOP, therefore its input & output pattern are already defined
      // It's the NAP which will overwrite this func.
    }

    NarratedOperator.prototype._stepComputed= function(step)
    {
      this._lastUpdatedStep = step;
      this.notifyChange(step);
    }

    NarratedOperator.prototype.alreadyExists= function(step)
    {
      for(var i in this.steps)
        if(this.steps[i].id == step.id)
          return true;
      return false;
    }

    NarratedOperator.prototype.getStepByID= function(id)
    {
      if(id instanceof Step)
        id = id.id;

      for(var i in this.steps)
        if(this.steps[i].id == id)
          return this.steps[i];
    }

    NarratedOperator.prototype.getNexts = function(step)
    {
      if(step == null)
        return null;
      var res = [];
      for(var i in this.steps)
      {
        if(step.getOutputs() && this.steps[i].getInputs() && step.getOutputs().id == this.steps[i].getInputs().id)
          res.push(this.steps[i]);
      }
      return res;
    }

    NarratedOperator.prototype.getSteps= function()
    {
      return this.steps;
    }

    NarratedOperator.prototype.getLastComputedStep = function()
    {
      return this._lastUpdatedStep;
    }

    NarratedOperator.prototype.getPositionOfStep = function(step)
    {
      if(step == null)
        return;

      for(var i in this.steps)
        if(this.steps[i].id == step.id)
          return i;

      return null;
    }

    NarratedOperator.prototype.getPreviousStepsTo = function(step)
    {
      if(step == null || step.getInputs() == null || step.getOutputs() == null)
        return null;

      var res = [];

      for(var i in this.steps)
      {
        if(this.steps[i].getOutputs() && this.steps[i].getOutputs().id == step.getInputs().id)
        {
          var tmp = this.getPreviousStepsTo(this.steps[i]);

          if(tmp)
            for(var j in tmp)
              res.push(tmp[j]);

          res.push(this.steps[i]);
        }
      }

      return res;
    }

    NarratedOperator.prototype.setName = function(name)
    {
      if(name == null)
        return;

      if(this.narrativeBlock == null)
        this.narrativeBlock = NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);

      if(this.usualName == null)
        this.usualName = this.narrativeBlock.getElementsFromURIProperty(HAS_NAME_URI);

      if(this.usualName == null) //after the second if still null abort, some issue
        return;

      this.usualName.updateAttribute('name', name);

      NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);
    }

    NarratedOperator.prototype.getName = function()
    {
      if(this.usualName == null || !(this.usualName instanceof EntityName) )
        return;
      return this.usualName.getName();
    }

    NarratedOperator.prototype.getNameObject = function()
    {
      if(this.usualName == null || !(this.usualName instanceof EntityName) )
        return;
      return this.usualName.getNameObject();
    },

    NarratedOperator.prototype.toString= function()
    {
      return this.getName();
    }

    NarratedOperator.prototype.mapNarrativeBlock= function(map)
    {
      if(this.narrativeBlock != null)
        this.narrativeBlock.mapNarrativeBlock(map);

      for(var i in this.steps)
        this.steps[i].mapNarrativeBlock(map);

      if(this.behaviors)
      {
        if(this.behaviors['input'])
          this.behaviors['input'].mapNarrativeBlock(map);
        if(this.behaviors['output'])
          this.behaviors['output'].mapNarrativeBlock(map);
        for(var i in this.behaviors['parameters'])
          this.behaviors['parameters'][i].mapNarrativeBlock(map);
      }
    }

  // === ONTOLOGY EXPORT
    NarratedOperator.prototype.getN3Ready = function()
    {
      var map = {};
      map[this.getN3ID()] = [];

      // = TYPE DEF
      map[this.getN3ID()].push([TYPE_URI, OPERATOR_URI]);
      // =

      // = NAME
      map[this.getN3ID()].push([HAS_NAME_URI, this.getNameObject()]);
      // =

      // = BEHAVIOURS
      if(this.behaviors)
      {
        //If behaviors exist & exist in the pool, mean that it is not a default rgte
        // which is useless. An opti can be to remove the check of each pool
        if(this.behaviors['input'] && RGTE_POOL.getByID(this.behaviors['input']))
          map[this.getN3ID()].push([HAS_INPUT_BEHAVIOUR_URI, this.behaviors['input']]);
        if(this.behaviors['output'] && RGTE_POOL.getByID(this.behaviors['output']))
          map[this.getN3ID()].push([HAS_OUTPUT_BEHAVIOUR_URI, this.behaviors['output']]);

        for(var i in this.behaviors['parameters'])
          map[this.getN3ID()].push([HAS_PARAMETER_BEHAVIOUR_URI, this.behaviors['parameters'][i]]);
      }
      // =

      // = IMPLEMENTATION OF THE OPERATOR
        if(this.implementedByOperation)
          for(var i in this.implementedByOperation)
            map[this.getN3ID()].push([IMPLEMENTED_OPERATOR_URI, this.implementedByOperation[i]]);
      // =

      // = NARRATIVE BLOCK
      if(this.narrativeBlock)
        N3_EXPORTER.n3MapsMerger(map, this.narrativeBlock.getN3Ready());
      // =

      // = CREATION DATE
      if(this.creationDate)
        map[this.getN3ID()].push([DATE_TIME_URI, this.creationDate]);
      // =

      // = STEP
      if(this.steps.length > 0)
      {
        map[this.getN3ID()].push([HAS_STEPS_URI, SEQUENCE_URI]);
        for(var i in this.steps)
        {
          map[this.getN3ID()].push([ORDERED_LIST_URI, this.steps[i]]);
        }
      }
      // =

      return map;
    }
