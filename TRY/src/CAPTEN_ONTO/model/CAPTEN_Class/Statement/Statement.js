
function Statement()
  {
    CAPTENClass.call(this);

    this.inheritanceArray.push("CAPTENClass");

    this.name = "Statement";
    this.content = null;//NOTE: Equivalent to description in CAPTEN-ONTO-After_REU_29/08/16
    this.researchObjects = null;

    this.addendum = [];

    // var inheritanceSCTFSTMT = [ {subClasses:{}, name: "Hypothesis", uri: "NAU"},
    //                             {subClasses:{}, name: "Proposition", uri: "NAU"},
    //                             {subClasses:{}, name: "Theory", uri: "NAU"},
    //                             {subClasses:{}, name: "Defintion", uri: "NAU"},
    //                             {subClasses:{}, name: "Axiom", uri: "NAU"},
    //                             {subClasses:{}, name: "Conjecture", uri: "NAU"}, ];
    //
    // this.subClasses = [
    //   {subClasses:inheritanceSCTFSTMT, name: "ScientificStatement", uri: "NAU"},
    //
    // ];
}

Statement.prototype = new CAPTENClass();//Object.create(CAPTENClass.prototype);

Statement.prototype.addAddendum = function(content)
{
  console.log(content);

  if(content.id == null)
  {
    console.error('content must have an id');
    return null;
  }

  if(!(content instanceof Addendum))
  {
    console.error('content must be an Addendum');
    return null;
  }

  var props = PROPERTIES_POOL.getPropertiesByExtremities(this.id, content.id);
  var prop = null;

  if(props.length <= 0)
  {
    console.log('the relation between the statement and the addendum is not referenced in the pool. Referencing...');
    prop = PROPERTIES_POOL.create('NAU','describedBy',this.id, content.id);
    console.log('done.');
  }
  else
    prop = props[0];

  var narrativeblock = NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);
  if(narrativeblock == null)
  {
    console.log('Their is no narrative block registered for the element#'+this.id+' inside the narrative block pool. Registering...');
    narrativeblock = NARRATIVE_BLOCK_POOL.createFromElement(this);
    console.log('done. Registered in block#'+narrativeblock.id);
  }

  console.log(narrativeblock);
  narrativeblock.addElement(content, prop);//Adding the new addendum inside the corresponding narrative block

  this.addendum.push(content); //update addendum array
},

// Statement.prototype.hasNarrativeBlock = function()
// {
//   return NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id) == null ? false : true;
// },

Statement.prototype.constructor = Statement;

// === POLYMER ELEMENT
  // === NAMER ELEMENT
    Statement.namerElement = Polymer(
      {
        is : 'statement-namer-element',

        properties:
        {
          entity:
          {
            type: Object,
            value: function(){return new Statement();},
            notify: true,
          }
        },

        factoryImpl: function(item)
        {
          this.entity = item;
        },

        attached: function()
        {
          console.log("Attached");
        },

      // === TEMPLATE BEHAVIOR
        _isHypothesis: function(statement)
        {
          if(statement == null || statement.name != "Hypothesis")
            return false;
          return true;
        },
        _isProposition: function(statement)
        {
          if(statement == null || statement.name != "Proposition")
            return false;
          return true;
        },
        _isTheory: function(statement)
        {
          if(statement == null || statement.name != "Theory")
            return false;
          return true;
        },
        _isDefinition: function(statement)
        {
          if(statement == null || statement.name != "Definition")
            return false;
          return true;
        },
        _isAxiom: function(statement)
        {
          if(statement == null || statement.name != "Axiom")
            return false;
          return true;
        },
        _isConjecture: function(statement)
        {
          if(statement == null || statement.name != "Conjecture")
            return false;
          return true;
        },
      });
    // === END NAMER ELEMENT

    // === CONFIGURER ELEMENT
      Polymer({
        is : "statement-configurer-element",

        properties:
        {
          entity:
          {
            type: Object,
            notify: true,
          },

          addendum: //Its an array !
          {
            type: Object,
            notify: true,
          },

          newAddendum:
          {
            type: Object,
            notify: true,
            value: null,
            observer: "_onNewAddendum",
          },

          isCreationActive:
          {
            type: Boolean,
            notify: true,
            value: false,
          },

        },

        factoryImpl: function(item)
        {
          this.entity = item;
        },

        _isEntityAStatement: function(entity)
        {
          console.log(entity);
          if(this.entity instanceof Statement)
            return true;

          return false;
        },

        _loadAppropriateAddendum: function()
        {
          if(this.entity == null)
            return null;

          console.log(this.entity);
          for(var i in this.entity.addendum)
          {
            if( (this.entity.addendum[i].constructor).configurerElement == null ) //There is no configurer element, thus aborting
              return null;

            var div = document.createElement('div');
            var createdElmt = new (this.entity.addendum[i].constructor).configurerElement(this.entity.addendum[i]);

            div.appendChild(createdElmt);

            if(Polymer.dom(this.root).querySelector('#addendumConfig') == null)
              return;

            Polymer.dom(this.root).querySelector('#addendumConfig').appendChild(div);
          }
        },

        _toggleCreation: function()
        {
          console.log(this.isCreationActive);
          this.isCreationActive = !this.isCreationActive;
          console.log(this.isCreationActive);
        },

        _onNewAddendum: function(e)
        {
          if(this.newAddendum == null)
            return;

            console.log('onChange Addendum !');
          this.entity.addAddendum(this.newAddendum);
        },
      });
    // === END CONFIGURER ELEMENT
