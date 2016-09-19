function ImplementedOperator()
{
   CAPTENClass.call(this);

    this.analysisTool = null;
    this.version = null;
    this.technicalRelatedInformation = null;
}

ImplementedOperator.prototype = Object.create(CAPTENClass.prototype);
