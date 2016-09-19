function Value()
  {
    CAPTENClass.call(this);
    this.value = null;
    this.seletionMethod = null;
}

Value.prototype = Object.create(CAPTENClass.prototype);
