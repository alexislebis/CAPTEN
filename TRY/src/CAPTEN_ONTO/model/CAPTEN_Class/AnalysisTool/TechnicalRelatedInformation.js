/**
 * TechnicalRelatedInformation gives insights concerning constraints implementation & utilization of AT or implementedOperator
 * This class is for information purpose only for users. The system will not use these info to infere adaptation for the automatic generation of instructions
 */

 function TechnicalRelatedInformation()
 {
   CAPTENClass.call(this);

   this.uri = RELATED_INFORMATION_URI; //TODO confirm coherence
 }

 TechnicalRelatedInformation.prototype = Object.create(CAPTENClass.prototype);
