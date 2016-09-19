function Annotation()
{
  CAPTENClass.call(this);
  this.uri = "https://www.w3.org/ns/oa#Annotation";
}

Annotation.prototype = Object.create(CAPTENClass.prototype);

function Description(){
  Annotation.call(this);
  this.uri = "NAU";
}

Description.prototype = Object.create(Annotation.prototype);

function ReadingInstruction(){
    Annotation.call(this);
    this.uri = "NAU";
}

ReadingInstruction.prototype = Object.create(Annotation.prototype);

function ExampleOfUse(){
  Annotation.call(this);
  this.uri = "NAU";
}

ExampleOfUse.prototype = Object.create(Annotation.prototype);
