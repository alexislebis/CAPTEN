function Annotation()
{
  CAPTENClass.call(this);
  this.uri = "https://www.w3.org/ns/oa#Annotation";
  this.content = null;
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

function Tag(){ //@TODO Should be considered as an array
    Annotation.call(this);
    this.uri = "NAU";

    this.value = null;
}

Tag.prototype = Object.create(Annotation.prototype);

function Comment(){
  Annotation.call(this);
  this.uri = "NAU";

  this.value = null;
}

Comment.prototype = Object.create(Annotation.prototype);
