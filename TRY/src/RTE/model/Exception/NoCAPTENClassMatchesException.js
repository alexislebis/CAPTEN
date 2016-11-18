function NoCAPTENClassMatchesException(value, sourceTarget) {
   this.value = value;
   this.sourceTarget = sourceTarget;

   this.toString = function() {
      return this.value+" does not match in the tested CAPTENClasses : "+sourceTarget+" .";
   };
}
