/**
 * A PropertyAsyncrhonousBuilder (PAB) allow to handle the asynchronous creation of properties (array) between two OBJECT (prerequisite is that these objects must implement a contains function).
 * Use a PAB when user has to create several bind between differents objects. Note that the ID key of the array MUST BE a unique reference of the TO object in the properety relation <From-To> (likely its ID)
 */

//TODO add constraints. The array is validated iff all the contraints (i.e. all the to.uniqueIdentifier supplied) are satisfied

//@WARNING : It seems that propAsync does not handle multi link to one target *to*, since property.to is used as reference

function PropertyAsyncrhonousBuilder(A, B, length)
{
  this.id = CAPTEN.ID++;
  PropertyAsyncrhonousBuilder.id++;

  this.A = A; //The first object, mostly the FROM. Please note that if A == B, then A will also be considered as TO
  this.B = B; //The second object

  this.observers = [];
  this.observersUnc = [];
  this.observersUpdate = [];

  this.lengthArray = length;

  this.reset();

  this.fromObject = null; //relocate in FacrotyPoolProperty
  this.toObject = null; //relocate in FacrotyPoolProperty
}

PropertyAsyncrhonousBuilder.id = 0;

PropertyAsyncrhonousBuilder.prototype = {

  // === OBSERVATION
    registerObserverCallbackOnCompletion: function(objCallback, callback)
    {
      if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.observers))
        this.observers.push([objCallback,callback]);
    },

      // === NOTIFICATION
      notifyCompletion: function()
      {
        this.observers.forEach(function(e)
        {
          console.log(e);
            if (typeof e[1] === "function") {
              e[1].call(e[0]);//e[0] define the `this` context for e[1]
            }
        });
      },

      registerObserverCallbackOnUncompletion: function(objCallback, callback)
      {
        if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.observersUnc))
          this.observersUnc.push([objCallback,callback]);
      },

        // === NOTIFICATION
        notifyUncompletion: function()
        {
          this.observersUnc.forEach(function(e)
          {
            console.log(e);
              if (typeof e[1] === "function") {
                e[1].call(e[0]);//e[0] define the `this` context for e[1]
              }
          });
        },

        registerObserverCallbackOnUpdate: function(objCallback, callback)//Fired when prop is replaced
        {
          if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.observersUpdate))
            this.observersUpdate.push([objCallback,callback]);
        },

          // === NOTIFICATION
          notifyPropertyReplaced: function(oldProp, newProp)
          {
            this.observersUpdate.forEach(function(e)
            {
              console.log(e);
                if (typeof e[1] === "function") {
                  e[1].call(e[0], oldProp, newProp);//e[0] define the `this` context for e[1]
                }
            });
          },
  // ===

  verifyCompatibility: function(smth)
  {
    this.verifyContainsExistence(smth);
    this.verifyRetrieveUniqueIdentifierExistence(smth);
  },

  verifyContainsExistence: function(smth)
  {
    if(smth == null)
      throw new Error("Object is null");
    if(typeof smth.contains !== "function")
      throw new Error(smth+' does not implement: contains');
  },

  verifyRetrieveUniqueIdentifierExistence: function(smth)
  {
    if(smth == null)
      throw new Error("Object is null");
    if(typeof smth.retrieveUniqueIdentifier !== 'function')
      throw new Error(smth+' does not implement: retrieveUniqueIdentifier');
  },

  bind: function(evalObj, uriProp, labelProp)
  {
    this.verifyCompatibility(this.A);
    this.verifyCompatibility(this.B);
    this.verifyRetrieveUniqueIdentifierExistence(evalObj);

    if(this.A == this.B)
    {
      this._bindWithinA(evalObj, uriProp, labelProp);
      return;
    }
    var obj = this.A.contains(evalObj);

    console.log(evalObj);
    console.log(obj);
    if(obj != null)//The Object belongs to A
    {
      var prop = this._updateCurrentProperty(obj, null, uriProp, labelProp);

      if(prop != null)
      {
        this._addPropertyToArray(prop);
      }

      return;
    }

    console.log(this.A);
    console.log(this.B);
    obj = this.B.contains(evalObj);
    console.log(obj);
    if(obj != null)//Belongs to B
    {
      var prop = this._updateCurrentProperty(null, obj, uriProp, labelProp);

      if(prop != null)
      {
        this._addPropertyToArray(prop);
      }

      return;
    }

    throw new Error('Undefined Provenance of '+evalObj+'.');

  },

  _bindWithinA: function(evalObj, uriProp, labelProp)
  {
    var obj = this.A.contains(evalObj);
    if(obj == null)
      return;

    var prop = null;
    //Retrieve the state of the facorty
    if(this.fromObject == null)
      prop = this._updateCurrentProperty(obj, null, uriProp, labelProp);
    else if(this.toObject == null)
      prop = this._updateCurrentProperty(null, obj, uriProp, labelProp);

    if(prop != null)
      this._addPropertyToArray(prop);

  },

  setArray: function(array)
  {
    this.lengthArray = array;
    this.reset();

    this.verifyArrayFilling();
  },

  addArrayRow: function()
  {
    this.lengthArray++;
    this.verifyArrayFilling();
  },

  setFirstObject: function(A)
  {
    this._setObjects(A,null);
  },

  setSecondObject: function(B)
  {
    this._setObjects(null, B);
  },

  getArrayFilled: function()
  {
    return this.arrayToFill;
  },

  getArrayToFillCurrentLength: function()
  {
    var counter = 0;

    for(var i in this.arrayToFill)
      counter++;

    return counter;
  },

  _setObjects: function(A, B)
  {
    if(A != null)
      this.A = A;
    if(B != null)
      this.B = B;

    this.reset();//Reset of the array to fill
  },


  reset: function()
  {
    for(var i in this.arrayToFill)
    {
      if(this.arrayToFill[i] instanceof Property)
      {
        PROPERTIES_POOL.remove(this.arrayToFill[i]);
      }
    }
    this.arrayToFill = null;
    this.arrayToFill = [];
  },

  _addPropertyToArray: function(property)
  {
    console.log(property);
    // if(this.arrayToFill[property.to.retrieveUniqueIdentifier()] === undefined)
    //   throw new Error('The array of '+this+" does not include such a key "+property.to.retrieveUniqueIdentifier());

    if(this.arrayToFill[property.to] != null)
      this.notifyPropertyReplaced(this.arrayToFill[property.to], property);

    this.arrayToFill[property.to] = property;

    this.verifyArrayFilling();
  },

  cleanArrayOf: function(elmtID)
  {
    var indexes = [];
    var iterationObjective = this.arrayToFill.length;
    var it = 0;
    var isModifHappened = false;

    while(it < iterationObjective)
    {
      it++;
      for(var i in this.arrayToFill)
      {
        if(this.arrayToFill[i].from == elmtID || this.arrayToFill[i].to == elmtID)
        {
          this.arrayToFill.splice(i,1);
          it = 0;
          iterationObjective -= 1;
          isModifHappened = true;
          break;
        }
      }
    }

    if(isModifHappened)
      this.verifyArrayFilling();

  },

  verifyArrayFilling: function()
  {
    if(this.arrayToFill == null || this.arrayToFill.length == 0)
    {
      this.notifyUncompletion();
      return false;
    }

    console.log(this.A);
    console.log(this.B);

    var counter = 0;
    for(var i in this.arrayToFill)
      counter++;

    if(counter == this.lengthArray)
    {
      this.notifyCompletion();
      return true;
    }

    this.notifyUncompletion();
    return false;
  },

  _updateCurrentProperty: function(from, to, uri, label)
  {
    if(from != null)
      this.fromObject = from;

    if(to != null)
      this.toObject = to;

    if(this.fromObject != null && this.toObject != null)
    {
      // var tmp = new Property(uri, label, this.fromObject, this.toObject);
      var tmp = PROPERTIES_POOL.create(uri, label, this.fromObject.id, this.toObject.id);
      this._resetCurrentProperty();
      return tmp;
    }

    return null;
  },

  _resetCurrentProperty: function()
  {
    this.fromObject = null; this.toObject = null;
  },


};
