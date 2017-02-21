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

    this.name = null; //The name of the step //WARNING potential conflict

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

    this.htmlify = "a step";
}

Step.prototype = new CAPTENClass();
Step.prototype.constructor = Step;



  // === OBSERVATION
    Step.prototype.resetAllObservers = function()
    {
      this.observers = [];
      this.observersUnc = [];
    }
    // === COMPUTATION
    Step.prototype.registerObserverCallbackOnOutputsComputation = function(objCallback, callback)
    {
      this.observers.push([objCallback,callback]);
    }

      // === NOTIFICATION
      Step.prototype.notifyOutputsComputation = function()
      {
        this.observers.forEach(function(e)
        {
          console.log(e);
            if (typeof e[1] === "function") {
              e[1].call(e[0]);//e[0] define the `this` context for e[1]
            }
        });
      }

      // === UNCOMPLETION
      Step.prototype.registerObserverCallbackOnUncompletion = function(objCallback, callback)
      {
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
    // ===

  // === CALLBACK BEHAVIORS FROM PROPASYNC
  Step.prototype._callbackUsedConceptsInputComplete = function()
  {
    this._computeOutput();
  }

  Step.prototype._computeOutput = function()
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
  }

  Step.prototype._callbackUCIUncompletion = function()
  {
    this.notifyUncompletion();
  }
  // ===

  // === PUBLIC
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
  }

  Step.prototype.changeRGTE = function(rgte)
  {
      if (rgte == null)
          return;

      this.inputs = rgte;

      this.propAsyncBuild.setFirstObject(this.inputs);

      this.displayRGTE = true;
  }

  Step.prototype.bindRGTENOP = function(params)
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
  }

  Step.prototype.bindRGTEParams = function(params) {

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
        if(steps[i].outputs.id == this.inputs.id)
          { prop = new Property(FOLLOWED_BY_URI, "followed by", steps[i].id, this.id);
            prop.arrows = arrows;
            props.push(prop);
          }
    }

    return props;
  }

  Step.prototype.setName = function(name)
  {
    if(name == null)
      return;

    if(name.id == null)
    {
      console.error('content must have an id');
      return null;
    }

    if(!(name instanceof EntityName))
    {
      console.error('content must be an EntityName');
      return null;
    }

    var narrativeblock = null;
    if(this.name)//If a name already exist, it must be replaced
    {
      narrativeblock = NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);

      if(narrativeblock == null)
      {
        console.log('A narrative block should be present. Aborting...');
        return;
      }

      narrativeblock.removeElement(this.name);
    }

    narrativeblock = NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);
    if(narrativeblock == null)
    {
      console.log('Their is no narrative block registered for the element#'+this.id+' inside the narrative block pool. Registering...');
      narrativeblock = NARRATIVE_BLOCK_POOL.createFromElement(this);
      console.log('done. Registered in block#'+narrativeblock.id);
    }

    var props = PROPERTIES_POOL.getPropertiesByExtremities(this.id, name.id);
    var prop = null;

    if(props.length <= 0)
    {
      console.log('the relation between the step and the name is not referenced in the pool. Referencing...');
      prop = PROPERTIES_POOL.create(HAS_NAME_URI, URI_TO_LABEL(HAS_NAME_URI) ,this.id, name.id);
      console.log('done.');
    }
    else
      prop = props[0];

    console.log(narrativeblock);
    narrativeblock.addElement(name, prop);//Adding the new addendum inside the corresponding narrative block

    this.name = name;
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

    if(objective.id == null)
    {
      console.error('objective must have an id');
      return null;
    }

    if(!(objective instanceof Objective))
    {
      console.error('objective must be an Objective');
      return null;
    }

    var narrativeblock = null;
    if(this.objective)//If an author already exist, it must be replaced
    {
      narrativeblock = NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);

      if(narrativeblock == null)
      {
        console.log('A narrative block should be present. Aborting...');
        return;
      }

      narrativeblock.removeElement(this.objective);
    }

    narrativeblock = NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);
    if(narrativeblock == null)
    {
      console.log('Their is no narrative block registered for the element#'+this.id+' inside the narrative block pool. Registering...');
      narrativeblock = NARRATIVE_BLOCK_POOL.createFromElement(this);
      console.log('done. Registered in block#'+narrativeblock.id);
    }

    var props = PROPERTIES_POOL.getPropertiesByExtremities(this.id, objective.id);
    var prop = null;

    if(props.length <= 0)
    {
      console.log('the relation between the step and the author is not referenced in the pool. Referencing...');
      prop = PROPERTIES_POOL.create(HAS_OBJECTIVE_URI, URI_TO_LABEL(HAS_OBJECTIVE_URI),this.id, objective.id);
      console.log('done.');
    }
    else
      prop = props[0];

    console.log(narrativeblock);
    narrativeblock.addElement(objective, prop);//Adding the new addendum inside the corresponding narrative block

    this.objective = objective;
    //ADD IN NARRATIVE BLOCK AND PROPERTY POOL HAS_OBJECTIVE
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
            }
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
