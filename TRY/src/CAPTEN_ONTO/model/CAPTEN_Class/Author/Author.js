/**
* It is the implementation of the FOAF Agent class. An author is an agent creating something. Here in CAPTEN,
* it concerns AP, step, IndepOp, etc...
 */
function Author(authorName, email)
  {
    CAPTENClass.call(this);
    this.uri = AUTHOR_URI;
    this.authorName = authorName;
    this.email = email;
}

Author.prototype = new CAPTENClass();
Author.prototype.constructor = Author;

Author.prototype.isEmpty = function()
{
  if(this.authorName)
    return false;
  return true;
},

// === POLYMER ELEMENT
  // === NAMER ELEMENT
  Author.namerElement = Polymer(
  {
    is : 'author-namer-element',

    properties:
    {
      entity:
      {
        type: Object,
        notify: true,
      },
    },

    factoryImpl: function(item)
    {
      this.entity = item;
    },
  });
  // === END NAMER ELEMENT
  // === CONFIGURER ELEMENT
    Author.configurerElement =  Polymer(
    {
        is: "author-configurer-element",

        properties:
        {
            entity:
            {
                type: Object,
                notify: true,
                observer: "_updateField",
            },
            authName:
            {
                type: Object,
                notify: true,
            },
            cascaded:
            {
              type: Boolean,
              notify: true,
            },
        },

        factoryImpl: function(item)
        {
          console.log(item);
          this.entity = item;
        },

        _updateAuthor: function(e)
        {
          if(this.entity == null)
            return;

          this.entity.authorName = this.authName;

          if(!this.cascaded)
            CONFIGURER_NOTIFY_VALIDATION_SIGNAL_BUILDER(this, this.entity, e);
        },

        _updateField: function()
        {
          if(this.entity == null)
            return;

          this.authName = this.entity.authorName;
        },
    });
  // === END CONFIGURER ELEMENT

// === GLOBAL AUTHOR ASSIGNEMENT
  var AUTHOR_SET = function(item, author) //replace the author element
  {
    if(author == null)
      return;

    var block = item.narrativeBlock;
    if(block == null)
    {
      console.error("RETRIEVE POOL HERE");
    }


    var res = block.replaceElement(item.author, author);

    if(res == null)
    {
      block.addElement(author, new Property(IS_AUTHORED_BY, URI_TO_LABEL(IS_AUTHORED_BY), block.getOriginID(), author.id));
    }
    item.author = author;
  };

// === BOOTSTRAP INFO
var DEFAULT_AUTHOR = new Author("Default user", "user@capten.org");
