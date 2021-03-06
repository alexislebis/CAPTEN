function ParameterConfiguration(pattern)
{
  NarrativeElement.call(this);

  this.uri = PARAMETER_CONFIGURATION_URI;

  this.pattern = pattern;

  this.content = null;

  if(this.pattern && this.pattern.getContent() != null)
    this.htmlify = this.pattern.getContent().getString();
  else
    this.htmlify = "a parameter configuration";
}

ParameterConfiguration.prototype = new NarrativeElement();
ParameterConfiguration.prototype.constructor = ParameterConfiguration;

ParameterConfiguration.prototype.updateElement = function(content)
{
  if(content == null)
    return;

  this.content = content;
}

ParameterConfiguration.prototype.getContent = function()
{
  return this.content;
}

// === POLYMER ELEMENT
  // === NAMER ELEMENT
  ParameterConfiguration.namerElement = Polymer(
  {
    is : 'parameter-configuration-namer-element',

    properties:
    {
      entity:
      {
        type: Object,
        notify: true,
      },

      rgtes: //Used for the multi link to pick up voc in it
      {
        type: Array,
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
      '_onRGTESChanged(rgtes.*)',
    ],

    _onRGTESChanged(e)
    {
      console.log(this.rgtes);
    },

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
