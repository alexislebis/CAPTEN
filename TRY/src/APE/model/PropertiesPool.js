/**
 * PropertiesPool is the interface for create new properties. It keeps track of all the existent properties in
 * the application
 */

function PropertiesPool(){
  this.pool = [];
}

PropertiesPool.POSITION = 0;

PropertiesPool.prototype = {

  create: function(uri, label, from, to, additionalConstraints)
  {
    var prop = new Property(uri, label, from, to, additionalConstraints);

    this._addingToPool(prop);
    // this.pool.push(prop);
    //
    // this.pool[this.pool.length-1].position = PropertiesPool.POSITION++;
    //
    // return this.pool[this.pool.length-1];
  },

  createPredefined: function(name, uri, label, from, to, additionalConstraints)
  {
    var prop;

    switch (name) {
      case 'Property':
        return this.create(uri, label, from, to, additionalConstraints);
      case 'ScientificHaecceity':
        return this._addingToPool(new ScientificHaecceity(from, to, additionalConstraints));
      case 'isJustifiedBy':
        return this._addingToPool(new isJustifiedBy(from, to, additionalConstraints));
      default:
        console.error("Warning, the predifined property "+name+" is NOT defined!");
        return this.create(null, null, from, to, additionalConstraints);
    }
  },

  _addingToPool(prop)
  {
    if(prop == null)
      return null;

      this.pool.push(prop);

      this.pool[this.pool.length-1].position = PropertiesPool.POSITION++;

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
      if(this.pool[i].id === id)
        return this.pool[i];
  },

  remove: function(prop)
  {
    var index = -1;

    for(var i = 0; i < this.pool.length; i++)
      if(this.pool[i] === prop)
        index = i;

    if(index == -1)
      return;

    this.pool.splice(index,1);
    return true;
  },

  relatedProperties: function(extremityID)
  {
    var related = [];

    for(var i in this.pool)
    {
      if(this.pool[i].from === extremityID)
        related.push(this.pool[i]);
      else if(this.pool[i].to === extremityID)
        related.push(this.pool[i]);
    }

    return related;
  },

  getPropertiesByExtremities: function(from, to)
  {
    var related = [];

    for(var i in this.pool)
    {
      if(this.pool[i].from === from && this.pool[i].to === to)
        related.push(this.pool[i]);
    }

    return related;
  },

};

var PROPERTIES_POOL = new PropertiesPool();
