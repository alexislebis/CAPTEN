function isJustifiedBy(from, to,additionalConstraints){

  ScientificHaecceity.call(this);

  this.uri = "NAU";
  this.iName = "isJustifiedBy";
  this.name = this.iName;

  this.inheritanceArray.push('ScientificHaecceity');

  this.htmlify = "is justified by";

  if(from != null && from >= 0)
    this.from = from;
  if(to != null && to >= 0)
    this.to = to;
}

// ScientificHaecceity.prototype = Object.create(Property.prototype);

isJustifiedBy.prototype = new ScientificHaecceity();
isJustifiedBy.prototype.constructor = isJustifiedBy;

isJustifiedBy.namerElement = Polymer(
  {
    is : 'is-justified-by-namer-element',

    properties:
    {
      property:
      {
         type: Object,
         notify: true,
      },
    },

    factoryImpl: function(prop)
    {
      this.property = prop;
    },
});
