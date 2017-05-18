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

 }

 var NARRATED_ANALYSIS_POOL = new NarratedAnalysisPool();
