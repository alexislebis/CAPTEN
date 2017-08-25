/**
 * NarratedAnalysisPool is the interface for the creation of new narrated analysis.
 * It keeps track of all the existent narrated analyses in the application.
 */

 function NarratedAnalysisPool()
 {
   this.pool = [];

   this.observers = [];
 }

 NarratedAnalysisPool.prototype =
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
     var nap = new NarratedAnalysis();

     nap.isRegistered = true;

     this.pool.push(nap);
     this.notifyChange();

     return nap;
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

   register: function(nap)
   {

     if( this._isBadNAP(nap) )
       return null;

     for(var i = 0; i < this.pool.length; i++) //Prevent duplicata
       if(this.pool[i].id == nap.id)
         return null;

      nap.isRegistered = true;
     this.pool.push(nap);

     this.notifyChange();

     return this.pool[this.pool.length-1];
   },

   _isBadNAP: function(nap)
   {
     if(    nap == null
         || !(nap instanceof NarratedAnalysisProcess)  )
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

   serializeToJSON: function()
   {
     var array = [];
     for(var i in this.pool)
      array.push(this.pool[i].serializeToJSON());

    return array;
   },

   serializeToJSONv2: function()
   {
     var array = [];
     for(var i in this.pool)
      array.push(this.pool[i].serializeToJSONv2());

    return array;
   },

 }

 var NARRATED_ANALYSIS_POOL = new NarratedAnalysisPool();
