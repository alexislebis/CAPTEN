/**
 * Property represents a property linking two elements between them. For example: Student _making_ MCQ
 * The name gave describe the prop.
 *
 * The additionalConstraint parameter allows to express more complex logic in future realese, such as, Student _commingFrom_ MOOC iff max 1 MOOC.
 */
function Property(uri, label, From, to, additionalConstraints){
    this.id = Property.id++;

    this.iName = "Property";//Memorize the root level for inheritance

    if(label == null)
      this.label = this.iName;
    else
      this.label = label;

    this.uri = uri;

    this.from = From;

    this.to = to;

    this.constraints = additionalConstraints;

    this.description = null;

    this.inheritanceArray = [];


  //   this.subClasses = [
  //             {subClasses:{}, uri: 'NAU', name: 'hasPreviousStep'},
  //             {subClasses:{}, uri: 'NAU', name: 'hasPreviousVersion'},
  //             {subClasses:{}, uri: 'NAU', name: 'require'},
  //             {subClasses:{}, uri: 'NAU', name: 'useCase'},
  //             {subClasses:{}, uri: 'NAU', name: 'hasScientificHaeccity'},
  //             {subClasses:{}, uri: 'NAU', name: 'subpartOf'},
  //             {subClasses:{}, uri: 'NAU', name: 'hasTerminology'},
  // ];
}

Property.id = 0;

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

  copy: function()
  {
    // var cls = new Property();
    var cls = PROPERTIES_POOL.create(this.uri);
    cls.id = this.id;

    cls.iName = this.iName;
    cls.label = this.label;
    cls.uri = this.uri;

    cls.from = this.from;

    cls.to = this.to;

    cls.constraints = this.constraints;

    cls.description = this.description;

    cls.description = this.inheritanceArray;

    return cls;
  },

  includedIn: function(arrayProp)
  {

      if(arrayProp == null)
        return -1;

      var nbIte = 0;

      for (var i in arrayProp)
      {
          nbIte++;
          if (this.equals(arrayProp[i]))
              return i;
      }

      if (nbIte === 0) //If the array is not a map, thus it has to be iterated in a normal way
      {
          for (var i = 0; i < arrayProp.length; i++)
          {
              if (this.equals(arrayProp[i]))
                  return i;
          }
      }

      return -1;
  },

  equals: function(prop)
  {
    if (prop instanceof Property)
    {
        if (this.uri === prop.uri)
            return true;
    }

    return false;
  },

  serializeToJSON: function()
  {
    var ser = {}

    for(var i in this)
    {
      if(i !== 'from' && i !== 'to' && i !== 'constraints' && i !== 'inheritanceArray')
        ser[i] = this[i];
    }

    ser['from'] = {};
    ser['to'] = {};


    //TODO faire le reste des tableaux
    if(this.from.constructor === Array) //If it's an array, then elements are CaptenClass
    {
      for(var i in this.from)
      {
        ser['from'][i] = {};
        ser['from'][i].id = this.from[i].id;
        ser['from'][i].uri = this.from[i].uri;
      }
    }
    else { //else it's just a simple number
      ser['from'] = this.from;
    }

    if(this.to.constructor === Array)
    {
      for(var i in this.to)
      {
        ser['to'][i] = {};
        ser['to'][i].id = this.to[i].id;
        ser['to'][i].uri = this.to[i].uri;
      }
    }
    else { //else it's just a simple number
      ser['to'] = this.to;
    }

    return ser;
  },

  addFromTo: function(fromCL, toCL)
  {
    if(fromCL == null || toCL == null)
      return;

    if(this.from == null)
      this.from = [];
    if(this.to == null)
      this.to = [];

    this.from.push(fromCL);
    this.to.push(toCL);

    if(fromCL.properties == null)
      fromCL.properties = [];
    if(toCL.properties == null)
      toCL.properties = [];

    fromCL.properties.push(this);
    toCL.properties.push(this);
  },

  // === PARSING
  parseJSONObject: function(json)
  {
    if(json == null)
      return;

    for(var i in json)
      this[i] = json[i];
  },
  // ===

  // === OVERRIDED METHODS
    retrieveUniqueIdentifier: function()
    {
      return this.id;
    },
  // ===

};
