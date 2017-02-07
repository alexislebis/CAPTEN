function Objective ()
{
  CAPTENClass.call(this);

  this.subClasses= [
    {subClasses:{}, name: 'Monitoring', uri: 'NAU'},
    {subClasses:{}, name: 'Adaptation', uri: 'NAU'},
  ];
}

Objective.prototype = Object.create(CAPTENClass.prototype);
