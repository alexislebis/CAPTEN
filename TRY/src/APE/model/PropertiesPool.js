/**
 * PropertiesPool is the interface for create new properties. It keeps track of all the existent properties in
 * the application
 */

function PropertiesPool(){
  this.pool = [];
  this._hashedPool = {}; //The hashed pool store properties in an indexed map of key <from.id;to.id>
}

PropertiesPool.POSITION = 0;

PropertiesPool.prototype = {

  create: function(uri, label, from, to, additionalConstraints)
  {
    var prop = new Property(uri, label, from, to, additionalConstraints);
    prop.isRegistered = true;

    return this._addingToPool(prop);
    // this.pool.push(prop);
    //
    // this.pool[this.pool.length-1].position = PropertiesPool.POSITION++;
    //
    // return this.pool[this.pool.length-1];
  },

  //IRRELEVANT
  // createPredefined: function(name, uri, label, from, to, additionalConstraints)
  // {
  //   var prop;
  //
  //   switch (name) {
  //     case 'Property':
  //       return this.create(uri, label, from, to, additionalConstraints);
  //     case 'ScientificHaecceity':
  //       return this._addingToPool(new ScientificHaecceity(from, to, additionalConstraints));
  //     case 'isJustifiedBy':
  //       return this._addingToPool(new isJustifiedBy(from, to, additionalConstraints));
  //     default:
  //       console.error("Warning, the predifined property "+name+" is NOT defined!");
  //       return this.create(null, null, from, to, additionalConstraints);
  //   }
  // },

  add: function(prop)
  {
    if(prop == null)
      return;

    for(var i in this.pool)
      if(this.pool[i].id == prop.id)
        return;

    this.pool.push(prop);

    // = ADDING TO HASHED POOL
    if(prop.from && prop.to)
      this._hashedPool[prop.from+";"+prop.to] = prop;
  },

  _addingToPool: function(prop)
  {
    if(prop == null)
      return null;

      this.pool.push(prop);

      this.pool[this.pool.length-1].position = PropertiesPool.POSITION++;

      // = ADDING TO HASHED POOL
      if(prop.from && prop.to)
        this._hashedPool[prop.from+";"+prop.to] = prop;

      return this.pool[this.pool.length-1];
  },

  getByPosition: function(pos)
  {
    for(var i = 0; i <this.pool.length; i++)
      if(this.pool[i].position == pos)
        return this.pool[pos];

    return null;
  },

  getByID: function(id)
  {
    for(var i in this.pool)
      if(this.pool[i].id == id)
        return this.pool[i];
  },

  remove: function(prop)
  {
    var index = -1;

    for(var i = 0; i < this.pool.length; i++)
      if(this.pool[i] == prop)
      {
        index = i;
        this.pool[index].isRegistered = null;
        this.pool.splice(index,1);
        return true;
      }

    if(index == -1)
      return;
  },

  relatedProperties: function(extremityID)
  {
    var related = [];

    for(var i in this.pool)
    {
      if(this.pool[i].from == extremityID)
        related.push(this.pool[i]);
      else if(this.pool[i].to == extremityID)
        related.push(this.pool[i]);
    }

    return related;
  },

  relatedPropertiesOfArray: function(extremitiesArray, resMap)
  {
    // console.log("Estimated complexity: "+this.pool.length*extremitiesArray.length/5);

    var counter = 0;
    var poolLength = this.pool.length;

    for(var i in extremitiesArray)
    {
      this.mapRelatedProperties(extremitiesArray[i], resMap, counter);

      counter++;
      if(counter%1000 == 0)
        console.log(counter*poolLength+" occurences performed.");
    }
  },

  mapAllPropertiesUsed: function(mapchecked, map)
  {
    for(var i in mapchecked)
      this.mapRelatedProperties(i, map);
  },


  mapRelatedProperties: function(extremityID, map)
  {
    for(var i in this.pool)
    {
      if(this.pool[i].from == extremityID)
        map[this.pool[i].id] = this.pool[i];
      else if(this.pool[i].to == extremityID)
        map[this.pool[i].id] = this.pool[i];
    }
  },

  getPropertiesByExtremities: function(from, to)
  {
    // var related = [];
    //
    // for(var i in this.pool)
    // {
    //   if(this.pool[i].from == from && this.pool[i].to == to)
    //     related.push(this.pool[i]);
    // }
    //
    // return related;

    if(!from || !to)
      return [];

    if(!this._hashedPool[from+";"+to])
      return [];
    else
      return [this._hashedPool[from+";"+to]];
  },

  serializeToJSON: function()
  {
    var res = [];

    for(var i in this.pool)
      res.push(this.pool[i].serializeToJSON());

    return res;
  },

  serializeArrayToJSON: function(arrayToSerialized)
  {
    var res = [];

    for(var i in arrayToSerialized)
      res.push(arrayToSerialized[i].serializeToJSONv2());

    return res;
  },

  register: function(prop)
  {
    if(prop == null)
      return;

    for(var i in this.pool)
      if(this.pool[i].id == prop.id)
        return;

    this._addingToPool(prop);
  },

  mapAll: function(map)
  {
    for(var i in this.pool)
    {
      map[this.pool[i].id] = this.pool[i];
    }
  },

  // === ASTROLABE ADD
  updateHashedPool: function()
  {
    this._hashedPool = {};

    for(var i in this.pool)
    {
      if(this.pool[i].from && this.pool[i].to)
        this._hashedPool[this.pool[i].from+";"+this.pool[i].to] = this.pool[i];
    }
  },

}

var PROPERTIES_POOL = new PropertiesPool();
