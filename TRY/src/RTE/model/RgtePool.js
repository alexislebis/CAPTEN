/**
 * RgtePool is the interface for the creation of new rgte.
 * It keeps track of all the existent rgtes in the application.
 */

 function RgtePool()
 {
   this.pool = [];
 }

 RgtePool.prototype =
 {
   create: function()
   {
     var rgte = new RGTE();

     this.pool.push(rgte);

     return rgte;
   },

   delete: function(rgte)
   {
     if(rgte == null)
      return;

     var res = this.getByID(rgte.id);

     if(res == null)
      return;

    res._delete();
    return this.unregister(res);
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

   register: function(rgte)
   {
     if( rgte == null || !(rgte instanceof RGTE) )
       return null;

     for(var i = 0; i < this.pool.length; i++) //Prevent duplicata
       if(this.pool[i].id == rgte.id)
         return null;

     this.pool.push(rgte);

     return this.pool[this.pool.length-1];
   },

   unregister: function(rgte)
   {
     if(rgte == null || !(rgte instanceof RGTE))
       return null;

     for(var i = 0; i < this.pool.length; i++) //Prevent duplicata
       if(this.pool[i].id == rgte.id)
         return this.pool.splice(i,1);

     return null;
   },

   getPool: function()
   {
     return this.pool;
   },

 }


 var RGTE_POOL = new RgtePool();
