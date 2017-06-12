/**
 * NarratedOperationPool is the global querying interface for the creation, the interrogation
 * and the access of both narrator operator  and analyses
 * It keeps track of all the created analysis and operations.
 *
 * Note that this pool acts as a encapsulation bridge between
 * the NarratedOperatorPool and NarratedAnalysisPool.
 *
 * This pool allows to do cross checking with a simple encapsulation
 *
 * This pool depends on RGTE_POOL in order to maintain a comprehensive and coherent RGTE pool
 */

 function NarratedOperationPool(nopPool, napPool)
 {
   this.nopPool = nopPool;
   this.napPool = napPool;


   this.nopPool.registerObserverCallbackOnChange(this, this.notifyChange);
   this.napPool.registerObserverCallbackOnChange(this, this.notifyChange);

   this.observers = [];
 }

 NarratedOperationPool.prototype =
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
   createNOP: function()
   {
      return this.nopPool.create();
   },

   createNAP: function()
   {
     return this.napPool.create();
   },

   getNOPByID: function(id)
   {
     return this.nopPool.getByID(id);
   },

   getNAPByID: function(id)
   {
     return this.napPool.getByID(id);
   },

   registerNOP: function(nop)
   {
     return this.nopPool.register(nop);
   },

   unregisterNOP: function(nop)
   {
     return this.nopPool.unregister(nop);
   },

   registerNAP: function(nap)
   {
     return this.napPool.register(nap);
   },

   getAvailableOperations: function()
   {
     return this.nopPool.pool.concat(this.napPool.pool);
   },

   findStepByID: function(stepID)
   {
     var res = this.napPool.findStepByID(stepID);

     return res != null ? res : this.nopPool.findStepByID(stepID);
   },
 }

 var NARRATED_OPERATION_POOL = new NarratedOperationPool(NARRATED_OPERATOR_POOL, NARRATED_ANALYSIS_POOL);
