/**
 * Represent a use case (cas d'usage) of an anlysis. This can be used to
 * indicate the provenance of the data, as well as for which use NAP is made.
 */


function UseCase()
{
  NarrativeElement.call(this);

  this.uri = USE_CASE_URI;
  this.htmlify = "a use case";
}

UseCase.prototype = new NarrativeElement();
UseCase.prototype.constructor = UseCase;

// === POLYMER ELEMENT
  // === NAMER ELEMENT
  UseCase.namerElement = Polymer(
    {
      is : 'use-case-namer-element',

      properties:
      {
        entity:
        {
          type: Object,
          notify: true,
        }
      },

      observers:
      [
        '_onEntityChanged(entity)',
        '_onContentChanged(content)',
      ],

      _onEntityChanged: function(entity)
      {
        var c = this.entity.getContent();
        if(c != null)
          this.content = c;
      },

      _onContentChanged: function(content)
      {
        if(this.entity == null)
          return;

        this.entity.updateElement(content);
      },

      factoryImpl: function(item)
      {
        this.entity = item;
      },
    });
    // === END NAMER ELEMENT
