// class ScientificHaecceity extends Property

function ScientificHaecceity(){

  Property.call(this);

  this.iName = "hasScientificHaeccity";
  this.name = this.iName;

  this.inheritanceArray.push('Property');

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

ScientificHaecceity.prototype = Object.create(Property.prototype);

// ScientificHaecceity.prototype = {
//
//   /** The is function give the possibility to this (ScientificHaecceity) to evolve according to the need of the user.
//    * Thus, by choosing a specific subclass, the object will evolve. Note the nested evolving possibility with the subClasses value.
//    * if newName does not belong to the subClass possibilities of this (ScientificHaecceity), then is throw an exception
//    **/
//   is: function(newName){
//     var find = false;
//
//     this.subClasses.forEach(function(e){
//       if(e.name === newName)
//       {
//         this.name = e.name;
//         this.subClasses = e.subClasses;
//         this.uri = e.uri;
//         find = true;
//       }
//     })
//
//     if(!find)
//       throw new NotSubClassException(newName, this);
//
//     return;
//   },
//
// };
