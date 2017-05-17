/**
 * NarratedOperatorPool is the interface for the creation of new narrated operator.
 * It keeps track of all the existent narrated operators in the application.
 */

function NarratedOperatorPool()
{
  this.pool = [];
}

NarratedOperatorPool.prototype =
{
  create: function()
  {
    var nop = new NarratedOperator();

    this.pool.push(nop);
    RGTE_POOL.register(nop.behaviors['output']);
    RGTE_POOL.register(nop.behaviors['input']);

    return nop;
  },

  register: function(nop)
  {

    if( this._isBadNOP(nop) )
      return null;

    for(var i = 0; i < this.pool.length; i++) //Prevent duplicata
      if(this.pool[i].id == nop.id)
        return null;

    this.pool.push(nop);

    RGTE_POOL.register(nop.behaviors['output']);
    RGTE_POOL.register(nop.behaviors['input']);


    return this.pool[this.pool.length-1];
  },

  unregister: function(nop)
  {
    if(nop == null || !(nop instanceof NarratedOperator))
      return null;

    var res = null;

    for(var i = 0; i < this.pool.length; i++) //Prevent duplicata
    {
      if(this.pool[i].id == nop.id)
      {
        res = this.pool.splice(i,1);
        break;
      }
    }

    if(nop.behaviors)
    {
      RGTE_POOL.unregister(nop.behaviors['output']);
      RGTE_POOL.unregister(nop.behaviors['input']);
    }

    return res;
  },

  getByID: function(id)
  {
    if(id == null || id < 0)
     return;

     for(var i = 0; i < this.pool.length; i++)
       if(this.pool[i].id == id)
         return this.pool[i];

     return null;
  },


  _isBadNOP: function(nop)
  {
    if(    nop == null
        || !(nop instanceof NarratedOperator)
        || nop.behaviors == null
        || nop.behaviors['output'] == null
        || nop.behaviors['input'] == null     )
      return true;

    return false;
  }

}

var NARRATED_OPERATOR_POOL = new NarratedOperatorPool();
