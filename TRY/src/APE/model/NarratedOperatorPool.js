/**
 * NarratedOperatorPool is the interface for the creation of new narrated operator.
 * It keeps track of all the existent narrated operators in the application.
 */

function NarratedOperatorPool()
{
  this.pool = [];

  this.observers = [];
}

NarratedOperatorPool.prototype =
{
  // === OBSERVATION ===
  registerObserverCallbackOnChange: function(objCallback, callback)
  {
    if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.observers))
      this.observers.push([objCallback,callback]);
  },

    // === NOTIFICATION
    notifyChange: function()
    {
      this.observers.forEach(function(e)
      {
          if (typeof e[1] === "function") {
            e[1].call(e[0]);//e[0] define the `this` context for e[1]
          }
      });
    },
  // ===================

  create: function()
  {
    var nop = new NarratedOperator();
    nop.isRegistered = true;

    this.pool.push(nop);
    RGTE_POOL.register(nop.behaviors['output']);
    RGTE_POOL.register(nop.behaviors['input']);

    this.notifyChange();

    return nop;
  },

  register: function(nop)
  {

    if( this._isBadNOP(nop) )
      return null;

    for(var i = 0; i < this.pool.length; i++) //Prevent duplicata
      if(this.pool[i].id == nop.id)
        return null;

    nop.isRegistered = true;
    this.pool.push(nop);

    RGTE_POOL.register(nop.behaviors['output']);
    RGTE_POOL.register(nop.behaviors['input']);

    this.notifyChange();

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
        this.pool[i].isRegistered = null;
        res = this.pool.splice(i,1);
        break;
      }
    }

    if(nop.behaviors)
    {
      RGTE_POOL.unregister(nop.behaviors['output']);
      RGTE_POOL.unregister(nop.behaviors['input']);
    }

    this.notifyChange();

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
  },

  findStepByID: function(stepID)
  {
    if(stepID == null)
     return;

   for(var i = 0; i < this.pool.length; i++)
   {
     for(var j in this.pool[i].steps)
     {
       if(this.pool[i].steps[j].id == stepID)
         return {operation: this.pool[i], index: j, step: this.pool[i].steps[j]};
     }
   }
  },

}

var NARRATED_OPERATOR_POOL = new NarratedOperatorPool();
