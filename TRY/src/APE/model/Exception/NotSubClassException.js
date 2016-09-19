function NotSubClassException(value, sourceTarget) {
   this.value = value;
   this.sourceTarget = sourceTarget;

   this.toString = function() {
      return ": "+this.value+" does not belong to the available subClasses of "+JSON.stringify(this.sourceTarget)+".";
   };
}
