//FIXME Evolutive class representation. Maybe an hierarchical structure is not really well adapted/
//If users want to add some new targetUser, how to proceed ? By creating a new NewTargetUser.js file extending
//targetUser and then loaded intot the app ?

class TargetUser extends CAPTENClass
{
  constructor()
  {

  }
}

class TargetStudent extends TargetUser
{
  constructor()
  {

  }
}

class TargetTeacher extends TargetUser
{

}

class TargetInstitution extends TargetUser
{

}
