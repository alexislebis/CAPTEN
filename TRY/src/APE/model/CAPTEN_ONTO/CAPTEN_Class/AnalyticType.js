function AnalyticType()
{
  CAPTENClass.call(this);

  this.subClasses = [
    {subClasses:{}, uri:"NAU", name: 'PredictiveAnalytic'},
    {subClasses:{}, uri:"NAU", name: 'DescriptiveAnalytic'},
    {subClasses:{}, uri:"NAU", name: 'DiagnosticAnalytic'},
    {subClasses:{}, uri:"NAU", name: 'PrescriptiveAnalytic'},
  ];
}

AnalyticType.prototype = Object.create(CAPTENClass.prototype);
