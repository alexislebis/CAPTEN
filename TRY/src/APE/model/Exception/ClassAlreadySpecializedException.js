function ClassAlreadySpecializedException(value, sourceTarget) {
   this.value = value;
   this.sourceTarget = sourceTarget;

   this.toString = function() {
      return ": "+JSON.stringify(this)+" is already specialized and thus cannot be specialized into "+value+".";
   };
}
