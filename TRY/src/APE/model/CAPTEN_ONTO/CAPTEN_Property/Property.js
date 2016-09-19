/**
 * Property represents a property linking two elements between them. For example: Student _making_ MCQ
 * The name gave describe the prop.
 *
 * The additionalConstraint parameter allows to express more complex logic in future realese, such as, Student _commingFrom_ MOOC iff max 1 MOOC.
 */
function Property(uri, From, to, additionalConstraints){

    this.iName = "Property";//Memorize the root level for inheritance
    this.name = this.iName;
    this.uri = uri;

    this.from = From;
    this.to = to;
    this.constraints = additionalConstraints;

    this.inheritanceArray = [];

    this.subClasses = [
              {subClasses:{}, uri: 'NAU', name: 'hasPreviousStep'},
              {subClasses:{}, uri: 'NAU', name: 'hasPreviousVersion'},
              {subClasses:{}, uri: 'NAU', name: 'require'},
              {subClasses:{}, uri: 'NAU', name: 'useCase'},
              {subClasses:{}, uri: 'NAU', name: 'hasScientificHaeccity'},
              {subClasses:{}, uri: 'NAU', name: 'subpartOf'},
              {subClasses:{}, uri: 'NAU', name: 'hasTerminology'},
  ];
}

Property.prototype = {

  /** The is function give the possibility to this (ScientificHaecceity) to evolve according to the need of the user.
   * Thus, by choosing a specific subclass, the object will evolve. Note the nested evolving possibility with the subClasses value.
   * if newName does not belong to the subClass possibilities of this (ScientificHaecceity), then is throw an exception.
   * Moreover, specialization cannot be redone a second time, otherwise an exception is throw.
   **/
  is: function(newName){
    var find = false;
    var that = this;

    if(Object.keys(this.subClasses).length === 0 && this.subClasses.constructor === Object)
      throw new NotSubClassException(newName, this);

    //Verification if the property is already specialized. If yes, then throw an exception. The user has to create a new prop.
    this.subClasses.forEach(function(p){
      if(that.name === p.name)
        throw new ClassAlreadySpecializedException(newName, that);
    });

    this.subClasses.forEach(function(e){
      if(e.name === newName)
      {
        console.log(e.subClasses);
        that.inheritanceArray.push(that.name);//memorizing the previous super class;
        that.name = e.name;
        that.subClasses = e.subClasses;
        that.uri = e.uri;
        find = true;
      }
    });

    if(!find)
      throw new NotSubClassException(newName, this);

    return;
  },

};
