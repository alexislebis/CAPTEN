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

};

var PROPERTIES_POOL = new PropertiesPool();
