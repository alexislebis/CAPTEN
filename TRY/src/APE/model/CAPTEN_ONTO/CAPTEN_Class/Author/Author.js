/**
* It is the implementation of the FOAF Agent class. An author is an agent creating something. Here in CAPTEN,
* it concerns AP, step, IndepOp, etc...
 */
class Author extends CAPTENClass
{
  constructor(name)
  {
    this.uri = "http://xmlns.com/foaf/0.1/Agent";
    this.name = name;
  }
}
