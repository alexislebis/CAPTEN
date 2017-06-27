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

ScientificStatement.prototype.updateElement = function(content)
{
  if(content == null)
    return;

  this.content = content;
}

ScientificStatement.prototype.getContent = function()
{
  return this.content;
}


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

      observers:
      [
        '_onEntityChanged(entity)',
        '_onContentChanged(content)',
      ],

      _onEntityChanged: function(entity)
      {
        var c = this.entity.getContent();
        if(c != null)
          this.content = c;
      },

      _onContentChanged: function(content)
      {
        if(this.entity == null)
          return;

        this.entity.updateElement(content);
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
        },

        cascaded:
        {
          type: Object,
          notify: true,
        },
      },

      factoryImpl: function(item)
      {
        this.entity = item;
      },

      _update: function()
      {
        this.$.inheritedStmt._update();

        if(!this.cascaded)
          CONFIGURER_NOTIFY_VALIDATION_SIGNAL_BUILDER(this, this.entity, null);
      },
    });
    // === END CONFIGURER ELEMENT
