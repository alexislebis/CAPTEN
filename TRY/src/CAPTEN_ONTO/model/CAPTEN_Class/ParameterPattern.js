function ParameterPattern ()
{
  NarrativeElement.call(this);

  this.uri = PARAMETER_PATTERN_URI;

  this.content = null;
  this.htmlify = "a parameter pattern";
}

ParameterPattern.prototype = new NarrativeElement();
ParameterPattern.prototype.constructor = ParameterPattern;

ParameterPattern.prototype.updateElement = function(content)
{
  if(content == null)
    return;

  this.content = content;
}

ParameterPattern.prototype.getContent = function()
{
  return this.content;
}

// === POLYMER ELEMENT
  // === NAMER ELEMENT
  ParameterPattern.namerElement = Polymer(
  {
    is : 'parameter-pattern-namer-element',

    properties:
    {
      entity:
      {
        type: Object,
        notify: true,
      },

      // content://ExString
      // {
      //   type: Object,
      //   notify: true,
      // },
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
