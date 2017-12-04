function TreatmentType()
{
  CAPTENClass.call(this);

  this.uri = TREATMENT_TYPE_URI;

  this.subClasses = [
    {subClasses:{}, name: ANALYSIS_TREATMENT_URI, uri: 'NAU'},
    {subClasses:{}, name: PRE_TREATMENT_URI, uri: 'NAU'},
    {subClasses:{}, name: POST_TREATMENT_URI, uri: 'NAU'},
  ];
}

TreatmentType.prototype = Object.create(CAPTENClass.prototype);
