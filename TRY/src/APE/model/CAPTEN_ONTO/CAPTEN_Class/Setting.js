class Setting extends CAPTENClass{
  constructor()
  {
    this.scientificeStatement = null;
  }
}

class SettingInputRGTE extends Setting{
  constructor()
  {

  }
}

class SettingParameter extends Setting{
    constructor()
    {
      this.value = null;//If the parameter is valuable, then a property isValuable exists, pointing to a Value object
    }
}
