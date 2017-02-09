function Addendum()
{
  CAPTENClass.call(this);
  this.uri = "NAU";

  this.content = null;
  this.htmlify = 'an addendum';
}

Addendum.prototype = new CAPTENClass();
Addendum.prototype.constructor = Addendum;
Addendum.prototype.setContent = function(content)
{
  if(content == null)
    return;

  this.content = content;
  this.htmlify = this.content;
};

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

  this.htmlify = this.content;//CARE DESYNCHROI
}

Description.prototype = new Addendum();
Description.prototype.constructor = Description;
  // === POLYMER ELEMENT
  Description.namerElement = Polymer(
  {
    is : 'description-namer-element',

    properties:
    {
      entity:
      {
        type: Object,
        notify: true,
      }
    },

    factoryImpl: function(item)
    {
      this.entity = item;
      console.log(this.entity);
    },
  });
  // === END POLYMER ELEMENT



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
