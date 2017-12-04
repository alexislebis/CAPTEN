function AnalyticType() // REDO old class declaration
{
  CAPTENClass.call(this);

  this.uri = ANALYSIS_STAGE_URI;

  this.subClasses = [
    {subClasses:{}, uri:PREDICTIVE_ANALSYSIS_URI, name: 'PredictiveAnalytic'},
    {subClasses:{}, uri:DESCRIPTIVE_ANALYSIS_URI, name: 'DescriptiveAnalytic'},
    {subClasses:{}, uri:DIAGNOSTIC_ANALYSIS_URI, name: 'DiagnosticAnalytic'},
    {subClasses:{}, uri:PRESCRIPTIVE_ANALYSIS_URI, name: 'PrescriptiveAnalytic'},
  ];
}

AnalyticType.prototype = Object.create(CAPTENClass.prototype);
