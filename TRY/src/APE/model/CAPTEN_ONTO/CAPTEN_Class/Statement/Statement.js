
function Statement()
  {
    CAPTENClass.call(this);

    this.name = "Statement";
    this.content = null;//NOTE: Equivalent to description in CAPTEN-ONTO-After_REU_29/08/16
    this.researchObjects = null;

    this.addendum = null;

    this.subClasses = [
      {subClasses:{}, name: "ScientificStatement", uri: "NAU"},

    ];
}

Statement.prototype = Object.create(CAPTENClass.prototype);
