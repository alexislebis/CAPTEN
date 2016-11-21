function NoCAPTENClassMatchesException(value, sourceTarget) {
  Error.call(this);

   this.value = value;
   this.sourceTarget = sourceTarget;

   this.toString = function() {
      return this.value+" does not match in the tested CAPTENClasses : "+sourceTarget+" .\n"+this.stack;
   };
}

NoCAPTENClassMatchesException.prototype = Object.create(Error);
