/**
 * Property represents a property linking two elements between them. For example: Student _making_ MCQ
 * The name gave describe the prop.
 *
 * The additionalConstraint parameter allows to express more complex logic in future realese, such as, Student _commingFrom_ MOOC iff max 1 MOOC.
 */
function Property(uri, label, From, to, additionalConstraints){
    this.id = CAPTEN.ID++;

    this.iName = "Property";//Memorize the root level for inheritance
    this.name = this.iName;

    this.arrows = "to";

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

    this.htmlify = this._configureHTMLIFY(); //use for html display

    this.subClasses = []; //Here are the classes which inherit this
    this.subClassOf = []; //Here, the classes inherited from this

    // Keep a link with the instance of the same class which was used to produce this
    // copy function MUST DEFINE this.derivedFrom attribute.
      this.derivedFrom = null;

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

  //Since a property does not have a special behavior when it is specialized, the html must be changed according to the type of the element
  _configureHTMLIFY: function()
  {
    return this.label;
    // switch (this.label) {
    //   case 'Property':
    //     return "is linked by a property with";
    //   case 'ScientificHaecceity':
    //     return 'has a scientific property with';
    //   case 'isJustifiedBy':
    //     return 'is justified by';
    //   case 'describedBy':
    //     return 'is described by';
    //   default:
    //     return "is linked by a "+this.name+" property with";
    // }
  },

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
    // cls.id = this.id;

    cls.iName = this.iName;
    cls.label = this.label;
    cls.uri = this.uri;

    cls.from = this.from;

    cls.to = this.to;

    cls.arrows = this.arrows;

    cls.constraints = this.constraints;

    cls.description = this.description;

    cls.description = this.inheritanceArray;

    cls.derivedFrom = this;

    return cls;
  },

  /**
   * Inverse the property from and to. The targeted object becomes the root.
   */
  inverse: function()
  {
    var tmp = this.from;
    this.from = this.to;
    this.to = tmp;
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

  // serializeToJSON: function()
  // {
  //   var ser = {}
  //
  //   for(var i in this)
  //   {
  //     if(i !== 'from' && i !== 'to' && i !== 'constraints' && i !== 'inheritanceArray')
  //       ser[i] = this[i];
  //   }
  //
  //   ser['from'] = {};
  //   ser['to'] = {};
  //
  //
  //   //TODO faire le reste des tableaux
  //   if(this.from.constructor === Array) //If it's an array, then elements are CaptenClass
  //   {
  //     for(var i in this.from)
  //     {
  //       ser['from'][i] = {};
  //       ser['from'][i].id = this.from[i].id;
  //       ser['from'][i].uri = this.from[i].uri;
  //     }
  //   }
  //   else { //else it's just a simple number
  //     ser['from'] = this.from;
  //   }
  //
  //   if(this.to.constructor === Array)
  //   {
  //     for(var i in this.to)
  //     {
  //       ser['to'][i] = {};
  //       ser['to'][i].id = this.to[i].id;
  //       ser['to'][i].uri = this.to[i].uri;
  //     }
  //   }
  //   else { //else it's just a simple number
  //     ser['to'] = this.to;
  //   }
  //
  //   return ser;
  // },
  serializeToJSON: function()
  {
      var ser = {}

      for (var i in this)
      {
        if(i !== "subClassOf" && i !== "subClasses" && i != "properties" && (typeof this[i] !== 'function') && this._isNotObserver(i))
        {
          ser[i] = this._serializationHandlingArray(i, this[i])[i];
        }
        // if(typeof this[i] !== 'function')
        // {
        //     if(this[i] && this[i].serializeToJSON)
        //       ser[i] = this[i].serializeToJSON();
        //     else if (i !== "subClassOf" && i != "subClasses" && i != "properties")
        //       ser[i] = this[i];
        // }
      }

      // console.log(this);

      ser['subClassOf'] = {};
      ser['subClasses'] = {};
      ser['properties'] = {};

      for (var i in this.subClassOf)
      {
        if(this.subClassOf[i])
        {
          ser['subClassOf'][i] = {};
          ser['subClassOf'][i].id = this.subClassOf[i].id;
          ser['subClassOf'][i].uri = this.subClassOf[i].uri;
        }
      }

      for (var i in this.subClasses)
      {
        if(this.subClasses[i])
        {
          ser['subClasses'][i] = {};
          ser['subClasses'][i].id = this.subClasses[i].id;
          ser['subClasses'][i].uri = this.subClasses[i].uri;
        }
      }

      for (var i in this.properties)
      {
        if(this.properties[i])
        {
          ser['properties'][i] = {};
          set['properties'][i].id = this.properties[i].id;
          set['properties'][i].uri = this.properties[i].uri;
        }
      }

      return ser;
  },
  _serializationHandlingArray: function(index, item)
  {
    var ser = {};

    if(item == null)
      return ser[index] = {index: null};

    if(typeof item === "function")
    {
      //NTD
    }
    else if(Array.isArray(item))
    {
      var tmp = {};
      for(var i in item)
      {
        tmp[i] = this._serializationHandlingArray(i, item[i])[i];
      }
      ser[index] = tmp;
    }
    else {
      if(index == "narrativeBlock") //cuting the narrative block here
        ser[index] = item.id;
      else if(item.serializeToJSON)
        ser[index] = item.serializeToJSON();
      else
        ser[index] = item;
    }

    return ser;
  },

  serializeToJSONv2: function()
  {
      var ser = {}

      for (var i in this)
      {
        if(i !== "subClassOf" && i !== "subClasses" && i != "properties" && (typeof this[i] !== 'function') && this._isNotObserver(i))
        {
          ser[i] = this._serializationHandlingArrayv2(i, this[i])[i];
        }
      }

      // console.log(this);

      ser['subClassOf'] = {};
      ser['subClasses'] = {};
      ser['properties'] = {};

      for (var i in this.subClassOf)
      {
        if(this.subClassOf[i])
        {
          ser['subClassOf'][i] = {};
          ser['subClassOf'][i].id = this.subClassOf[i].id;
          ser['subClassOf'][i].uri = this.subClassOf[i].uri;
        }
      }

      for (var i in this.subClasses)
      {
        if(this.subClasses[i])
        {
          ser['subClasses'][i] = {};
          ser['subClasses'][i].id = this.subClasses[i].id;
          ser['subClasses'][i].uri = this.subClasses[i].uri;
        }
      }

      for (var i in this.properties)
      {
        if(this.properties[i])
        {
          ser['properties'][i] = {};
          set['properties'][i].id = this.properties[i].id;
          set['properties'][i].uri = this.properties[i].uri;
        }
      }

      return {prop: ser};
  },
  _serializationHandlingArrayv2: function(index, item)
  {
    var ser = {};

    if(item == null)
      return ser[index] = {index: null};

    if(typeof item === "function")
    {
      //NTD
    }
    else if(Array.isArray(item))
    {
      var tmp = {};
      for(var i in item)
      {
        tmp[i] = this._serializationHandlingArrayv2(i, item[i])[i];
      }
      ser[index] = tmp;
    }
    else {
      if(index == "narrativeBlock") //cuting the narrative block here
        ser[index] = item.id;
      else if(item.id)
        ser[index] = item.id;
      else
        ser[index] = item;
    }

    return ser;
  },

  _isNotObserver: function(i)
  {
    if(i &&
       (i.includes('observers') ||
        i.includes('observersComputed') ||
        i.includes('observersUnc') ||
        i.includes('observersReset') ||
        i.includes('observersInputs') ||
        i.includes('observersIOPCompositeRelations') ||
        i.includes('observersIOPCompositeOptions')) ||
        i.includes('innerBindingObservers') ||
        i.includes('removedElmtObservers') ||
        i.includes('addedElmtObservers') ||
        i.includes('updatedElmtObservers') ||
        i.includes('thisDeletedObservers') ||
        i.includes('KidentifiedObservers') ||
        i.includes('KdeidentifiedObservers')
      )
      return false;

    return true;
  },

  updateFromTo: function(from, to)
  {
    if(from == null || to == null)
      return;

    this.from = from;
    this.to = to;
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

  // Retrieve all narrative blocks concerning all the elements of the property
  // map: The map to enrich
  mapNarrativeBlock: function(map)
  {
    if(this.NarrativeBlock != null)
      this.NarrativeBlock.mapNarrativeBlock(map);

    if(this.derivedFrom != null)
      this.derivedFrom.mapNarrativeBlock(map);
  },

  mapIdElementsUsed: function(map)
  {
    map[this.id] = this.id;
  },


  mapElementsUsed: function(map)
  {
    if(this.x) //x reprensent the state of the function. If True, somehow the propagation is cyclic and thus it is stopped
      return;
    this.x = true;

    map[this.id] = this;

    for(var i in this)
      this._browseThisForMapObj(this[i], map);

    this.x = false;
  },

  _browseThisForMapObj: function(obj, map)
  {
    if(obj == null)
      return;
    if(obj instanceof Array)
      for(var i in obj)
        this._browseThisForMapObj(obj[i], map);
    else if(obj.mapElementsUsed && !IF_MAP_CONTAINS(map, obj.id))
      obj.mapElementsUsed(map);
  },

};

Property.prototype.constructor = Property;
Property.namerElement = Polymer(
  {
    is : 'property-namer-element',

    properties:
    {
      property:
      {
         type: Object,
         value: null,
         notify: true,
      },
    },

    factoryImpl: function(prop)
    {
      this.property = prop;
    },
  });
