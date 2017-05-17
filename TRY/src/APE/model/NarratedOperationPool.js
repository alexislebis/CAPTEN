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
 }

 NarratedOperationPool.prototype =
 {
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
 }

 var NARRATED_OPERATION_POOL = new NarratedOperationPool(NARRATED_OPERATOR_POOL, NARRATED_ANALYSIS_POOL);
