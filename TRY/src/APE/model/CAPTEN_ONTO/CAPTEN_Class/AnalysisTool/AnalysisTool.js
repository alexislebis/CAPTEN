function AnalysisTool()
{
    CAPTENClass.call(this);

    this.version = null;
    this.toolName = null;
    this.implementedOperator = null;//A List
    this.dataFormat = null;//List of supported FORMAT. FIXME: need a CAPTENClass ?
    this.technicalRelatedInformation = null;
}

AnalysisTool.prototype = Object.create(CAPTENClass.prototype);
