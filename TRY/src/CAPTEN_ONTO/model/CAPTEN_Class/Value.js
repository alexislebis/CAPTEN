function Value()
  {
    CAPTENClass.call(this);
    this.uri = VALUE_URI;
    
    this.value = null;
    this.seletionMethod = null;
}

Value.prototype = Object.create(CAPTENClass.prototype);
