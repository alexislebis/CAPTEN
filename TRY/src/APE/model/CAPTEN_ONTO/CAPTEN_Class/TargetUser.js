//SubClasses class variable allows this to represents its subclasses with an evolution prospect with the use.
//If this had used an extends relationship, then the evolution possibility will be near 0

function TargetUser()
  {
    CAPTENClass.call(this);

    this.subClasses = [
      {subClasses:{}, name: 'Student', uri: 'NAU'},
      {subClasses:{}, name: 'Teacher', uri: 'NAU'},
      {subClasses:{}, name: 'Institution', uri: 'NAU'},
    ];
}

// class TargetStudent extends TargetUser
// {
//   constructor()
//   {
//
//   }
// }
//
// class TargetTeacher extends TargetUser
// {
//
// }
//
// class TargetInstitution extends TargetUser
// {
//
// }
