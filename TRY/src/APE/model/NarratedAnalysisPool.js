/**
 * NarratedAnalysisPool is the interface for the creation of new narrated analysis.
 * It keeps track of all the existent narrated analyses in the application.
 */

 function NarratedAnalysisPool()
 {
   this.pool = [];
 }

 NarratedOperatorPool.prototype =
 {
   create: function()
   {
     var nap = new NarratedAnalysis();

     this.pool.push(nap);

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
