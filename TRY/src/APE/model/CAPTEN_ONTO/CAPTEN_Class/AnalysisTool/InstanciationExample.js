function InstanciationExample()
  {
    CAPTENClass.call(this);
  }

  InstanciationExample.prototype = Object.create(CAPTENClass.prototype);
