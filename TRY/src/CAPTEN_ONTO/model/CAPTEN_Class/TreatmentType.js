function TreatmentType()
{
  CAPTENClass.call(this);

  this.subClasses = [
    {subClasses:{}, name: 'Analysis', uri: 'NAU'},
    {subClasses:{}, name: 'Preprocess', uri: 'NAU'},
    {subClasses:{}, name: 'Postprocess', uri: 'NAU'},
  ];
}

TreatmentType.prototype = Object.create(CAPTENClass.prototype);
