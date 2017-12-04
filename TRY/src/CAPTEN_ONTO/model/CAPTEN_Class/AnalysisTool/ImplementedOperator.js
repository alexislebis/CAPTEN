function ImplementedOperator()
{
   CAPTENClass.call(this);

   this.uri = IMPLEMENTED_OPERATOR_URI;

    this.analysisTool = null;
    this.version = null;
    this.technicalRelatedInformation = null;
}

ImplementedOperator.prototype = Object.create(CAPTENClass.prototype);
