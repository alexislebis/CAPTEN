// class ScientificHaecceity extends Property

function ScientificHaecceity(from, to, additionalConstraints){

  Property.call(this);

  this.iName = "hasScientificHaeccity";
  this.name = this.iName;

  this.inheritanceArray.push('Property');

  if(from != null && from >= 0)
    this.from = from;
  if(to != null && to >= 0)
    this.to = to;

  this.htmlify = "is linked by a scientific property defining the nature of";

  //Property.prototype.is.call(this, 'hasScientificHaeccity');
  // constructor(){
    this.subClasses = [
              // {subClasses:[
              //   {subClasses:{}, uri: "NAU", name:"testTaMere"}
              // ], uri: 'NAU', name: 'reliesOn'},
              {subClasses:{}, uri: "NAU", name: 'reliesOn'},
              {subClasses:{}, uri: 'NAU', name: 'inconsistentWith'},
              {subClasses:{}, uri: 'NAU', name: 'respects'},
              {subClasses:{}, uri: 'NAU', name: 'completes'},
              {subClasses:{}, uri: 'NAU', name: 'implies'},
              {subClasses:{}, uri: 'NAU', name: 'alternativeTo'},
              {subClasses:{}, uri: 'NAU', name: 'isConditionedBy'},
              {subClasses:{}, uri: 'NAU', name: 'discusses'},
              {subClasses:{}, uri: 'NAU', name: 'isJustifiedBy'},
              {subClasses:{}, uri: 'NAU', name: 'consistentWith'}
  ];
// }
//   is(newName){
//     console.log("yo");
//     this.subClasses.forEach(function(e){
//       console.log(e);
//     });
//   }
}

// ScientificHaecceity.prototype = Object.create(Property.prototype);

ScientificHaecceity.prototype = new Property();
ScientificHaecceity.prototype.constructor = ScientificHaecceity;

ScientificHaecceity.namerElement = Polymer(
  {
    is : 'scientific-haeacceity-namer-element',

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
