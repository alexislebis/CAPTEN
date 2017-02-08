
function Statement()
  {
    CAPTENClass.call(this);

    this.inheritanceArray.push("CAPTENClass");

    this.name = "Statement";
    this.content = null;//NOTE: Equivalent to description in CAPTEN-ONTO-After_REU_29/08/16
    this.researchObjects = null;

    this.addendum = null;

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

  var prop = PROPERTIES_POOL.getPropertiesByExtremities(this.id, content.id);

  if(prop == null)
  {
    console.log('the relation between the statement and the addendum is not referenced in the pool. Referencing...');
    PROPERTIES_POOL.create('NAU','describedBy',this.id, content.id);
    console.log('done.');
  }

  this.content = content;
},

Statement.prototype.constructor = Statement;
Statement.namerElement = Polymer(
  {
    is : 'statement-namer-element',

    properties:
    {
      statement:
      {
        type: Object,
        value: function(){return new Statement();},
        notify: true,
      }
    },

    factoryImpl: function(item)
    {
      this.statement = item;
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
