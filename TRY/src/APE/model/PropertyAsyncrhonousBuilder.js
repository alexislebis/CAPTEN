/**
 * A PropertyAsyncrhonousBuilder (PAB) allow to handle the asynchronous creation of properties (array) between two OBJECT (prerequisite is that these objects must implement a contains function).
 * Use a PAB when user has to create several bind between differents objects. Note that the ID key of the array MUST BE a unique reference of the TO object in the properety relation <From-To> (likely its ID)
 */

//TODO add constraints. The array is validated iff all the contraints (i.e. all the to.uniqueIdentifier supplied) are satisfied

function PropertyAsyncrhonousBuilder(A, B, length)
{
  this.id = PropertyAsyncrhonousBuilder.id;
  PropertyAsyncrhonousBuilder.id++;

  this.A = A; //The first object, mostly the FROM. Please note that if A == B, then A will also be considered as TO
  this.B = B; //The second object

  this.observers = [];

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
  // ===

  verifyCompatibility: function(smth)
  {
    this.verifyContainsExistence(smth);
    this.verifyRetrieveUniqueIdentifierExistence(smth);
  },

  verifyContainsExistence: function(smth)
  {
    if(typeof smth.contains !== "function")
      throw new Error(smth+' does not implement: contains');
  },

  verifyRetrieveUniqueIdentifierExistence: function(smth)
  {
    if(typeof smth.retrieveUniqueIdentifier !== 'function')
      throw new Error(smth+' does not implement: retrieveUniqueIdentifier');
  },

  bind: function(evalObj, uriProp, labelProp)
  {
    console.log("===WARNING===");
    console.log("Currently, if A and B are identical, then always the 'from' clause will be filled");
    console.log("=============");

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
    this.arrayToFill = null;
    this.arrayToFill = [];
  },

  _addPropertyToArray: function(property)
  {
    console.log(property);
    // if(this.arrayToFill[property.to.retrieveUniqueIdentifier()] === undefined)
    //   throw new Error('The array of '+this+" does not include such a key "+property.to.retrieveUniqueIdentifier());

    this.arrayToFill[property.to.retrieveUniqueIdentifier()] = property;

    this.verifyArrayFilling();
  },

  verifyArrayFilling: function()
  {
    if(this.arrayToFill == null || this.arrayToFill.length == 0)
      return false;

    // for(var i in this.arrayToFill)
    // {
    //   if(this.arrayToFill[i] == null)
    //     return false;
    // }

    var counter = 0;
    for(var i in this.arrayToFill)
      counter++;

    if(counter == this.lengthArray)
      this.notifyCompletion();

    return true;
  },

  _updateCurrentProperty: function(from, to, uri, label)
  {
    if(from != null)
      this.fromObject = from;

    if(to != null)
      this.toObject = to;

    if(this.fromObject != null && this.toObject != null)
    {
      var tmp = new Property(uri, label, this.fromObject, this.toObject);
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
