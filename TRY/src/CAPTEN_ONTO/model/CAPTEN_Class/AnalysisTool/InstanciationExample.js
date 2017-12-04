function InstanciationExample()
  {
    CAPTENClass.call(this);

    this.uri = INSTANCIATION_EXMPLE_URI;
  }

  InstanciationExample.prototype = Object.create(CAPTENClass.prototype);
