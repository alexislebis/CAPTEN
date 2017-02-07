
function Statement()
  {
    CAPTENClass.call(this);

    this.name = "Statement";
    this.content = null;//NOTE: Equivalent to description in CAPTEN-ONTO-After_REU_29/08/16
    this.researchObjects = null;

    this.addendum = null;

    var inheritanceSCTFSTMT = [ {subClasses:{}, name: "Hypothesis", uri: "NAU"},
                                {subClasses:{}, name: "Proposition", uri: "NAU"},
                                {subClasses:{}, name: "Theory", uri: "NAU"},
                                {subClasses:{}, name: "Defintion", uri: "NAU"},
                                {subClasses:{}, name: "Axiom", uri: "NAU"},
                                {subClasses:{}, name: "Conjecture", uri: "NAU"}, ];

    this.subClasses = [
      {subClasses:inheritanceSCTFSTMT, name: "ScientificStatement", uri: "NAU"},

    ];
}

Statement.prototype = Object.create(CAPTENClass.prototype);
