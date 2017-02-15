//TODO: Implement StrongStatement of the ontology

function ScientificStatement()
  {
    Statement.call(this);

    this.name = "ScientificStatement";
    this.content = null;//NOTE: Equivalent to description in CAPTEN-ONTO-After_REU_29/08/16
    this.researchObjects = null;

    this.subClasses = [
      {subClasses:{}, name: "Hypothesis", uri: "NAU"},
      {subClasses:{}, name: "Proposition", uri: "NAU"},
      {subClasses:{}, name: "Theory", uri: "NAU"},
      {subClasses:{}, name: "Defintion", uri: "NAU"},
      {subClasses:{}, name: "Axiom", uri: "NAU"},
      {subClasses:{}, name: "Conjecture", uri: "NAU"},
    ];
}

ScientificStatement.prototype = new Statement();//Object.create(CAPTENClass.prototype);
ScientificStatement.prototype.constructor = ScientificStatement;




// ==============
function Hypothesis()
{
  ScientificStatement.call(this);
  this.uri = "NAU";
  this.iName = "Hypothesis";
  this.label = this.iName;
  this.name = "Hypothesis";
  this.htmlify = "a hypothesis"; //use for html display
}

Hypothesis.prototype = new ScientificStatement();
Hypothesis.prototype.constructor = Hypothesis;
// === POLYMER ELEMENT
  // === NAMER ELEMENT
  Hypothesis.namerElement = Polymer(
    {
      is : 'hypothesis-namer-element',

      properties:
      {
        entity:
        {
          type: Object,
          notify: true,
        }
      },

      factoryImpl: function(item)
      {
        this.entity = item;
      },
    });
    // === END NAMER ELEMENT

    // === CONFIGURER ELEMENT
    Hypothesis.configurerElement = Polymer({
      is : "hypothesis-configurer-element",

      properties:
      {
        entity:
        {
          type: Object,
          notify: true,
        }
      },

      factoryImpl: function(item)
      {
        this.entity = item;
      },
    });
    // === END CONFIGURER ELEMENT
