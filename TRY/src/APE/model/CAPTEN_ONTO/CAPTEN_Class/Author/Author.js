/**
* It is the implementation of the FOAF Agent class. An author is an agent creating something. Here in CAPTEN,
* it concerns AP, step, IndepOp, etc...
 */
function Author(authorName)
  {
    CAPTENClass.call(this);
    this.uri = "http://xmlns.com/foaf/0.1/Agent";
    this.authorName = name;
}

Author.prototype = Object.create(CAPTENClass.prototype);
