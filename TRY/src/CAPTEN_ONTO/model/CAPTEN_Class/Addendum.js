function Addendum()
{
  NarrativeElement.call(this);
  this.uri = "NAU";

  this.content = null;
  this.htmlify = 'an addendum';
}

Addendum.prototype = new NarrativeElement();
Addendum.prototype.constructor = Addendum;

var ADDENDUM_AVAILABLE_TYPES = [
                            "Description",
                          ];

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
Description.prototype.updateHTML = function(){
  this.htmlify = this.content;
};
  // === POLYMER ELEMENT
    // === NAMER ELEMENT
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
    // === END NAMER ELEMENT

    // === CONFIGURER ELEMENT
    Description.configurerElement = Polymer({
        is : "description-configurer-element",

        properties:
        {
          entity:
          {
            type: Object,
            notify: true,
          },

          val:
          {
            type: Object,
            notify: true,
            val: function(){if(this.entity != null)this.val = this.entity.content;},
            observer: "_updateEntityHTML",
          },

          cascaded:
          {
            type: Boolean,
            notify: true,
            value: false,
          },

        },

        factoryImpl: function(item)
        {
          this.entity = item;
          console.log(this.entity);
        },

        attached: function()
        {
          if(this.entity == null)
            return;

          this.val = this.entity.content;
        },

        _updateEntityHTML: function(e)
        {
          // if(this.entity == null)
          //   return null;
          //
          // this.entity.content = this.val;
          //
          // this.entity.updateHTML();
        },

        _update: function()
        {
          if(this.entity == null)
            return null;

          this.entity.content = this.val;

          this.entity.updateHTML();

          if(!this.cascaded)
            CONFIGURER_NOTIFY_VALIDATION_SIGNAL_BUILDER(this, this.entity, null);
        },
      });
    // === END CONFIGURER ELEMENT
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
