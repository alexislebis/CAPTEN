/**
 * A PropertyAsyncrhonousBuilder (PAB) allow to handle the asynchronous creation of properties (array) between two OBJECT (prerequisite is that these objects must implement a contains function).
 * Use a PAB when user has to create several bind between differents objects. Note that the ID key of the array MUST BE a unique reference of the TO object in the properety relation <From-To> (likely its ID)
 */

function PropertyAsyncrhonousBuilder(A, B, arrayToFill)
{
  this.id = PropertyAsyncrhonousBuilder.id;
  PropertyAsyncrhonousBuilder.id++;

  this.A = A; //The first object, mostly the FROM. Please note that if A == B, then A will also be considered as TO
  this.B = B; //The second object

  this.observers = [];

  this.arrayToFill = arrayToFill;
  if(this.arrayToFill == null)
    this.arrayToFill = [];

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

  bind: function(evalObj, uriProp, labelProp)
  {
    console.log("===WARNING===");
    console.log("Currently, if A and B are identical, then always the 'from' clause will be filled");
    console.log("=============");

    console.log("===WARNING===");
    console.log("Need to check if A & B are Contains.");
    console.log("=============");

    console.log("===WARNING===");
    console.log("Need to check if A & B are RetrieveUniqueIdentifier.");
    console.log("=============");

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

  setArray: function(array)
  {
    this.arrayToFill = array;

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
      this.arrayToFill[i] = null;
    }
  },

  _addPropertyToArray: function(property)
  {
    console.log(property);
    if(this.arrayToFill[property.to.retrieveUniqueIdentifier()] === undefined)
      throw new Error('The array of '+this+" does not include such a key "+property.to.retrieveUniqueIdentifier());

    this.arrayToFill[property.to.retrieveUniqueIdentifier()] = property;

    this.verifyArrayFilling();
  },

  verifyArrayFilling: function()
  {
    if(this.arrayToFill == null)
      return false;

    for(var i in this.arrayToFill)
    {
      if(this.arrayToFill[i] == null)
        return false;
    }

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
