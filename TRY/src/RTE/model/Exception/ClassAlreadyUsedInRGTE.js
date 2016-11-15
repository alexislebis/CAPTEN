function ClassAlreadyUsedInRGTE(value, sourceTarget) {
   this.value = value;
   this.sourceTarget = sourceTarget;

   this.toString = function() {
      return ": "+ this.sourceTarget +" is already used in the RGTE and thus cannot be added a second time into "+this.value+".";
   };
}
