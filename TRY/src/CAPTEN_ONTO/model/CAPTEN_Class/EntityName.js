/**
 * EntityName represents the name that an user can give to an entity. For example : for a step, an entityname could be "My favorite step"
 */

 function EntityName(name)
{
  NarrativeElement.call(this);
  this.name = new ExtendedString();
  this.name.update(name);

  this.uri = "http://xmlns.com/foaf/0.1/name"; //Imply to be a thing

}

EntityName.prototype = new NarrativeElement();
EntityName.prototype.constructor = EntityName;

EntityName.prototype.setName = function(name)
{
  if(name instanceof ExtendedString)
    this.name = name;
  else
  {
    this.name = new ExtendedString();
    this.name.update(name);
  }
}

EntityName.prototype.getName = function()
{
  return this.name.getString();
}

EntityName.prototype.getNameObject = function()
{
  return this.name;
}

EntityName.prototype.updateElement = function(content)
{
  if(content == null)
    return;

  this.name = content;
}

EntityName.prototype.isEmpty = function()
{
  if(this.name)
    return false;
  return true;
}

EntityName.prototype.updateAttribute = function(attr, value)
{
  switch (attr)
  {
    case "name":
      this.setName(value);
      break;
    default:
      break;
  }
  return;
}

// === POLYMER ELEMENT
  // === NAMER ELEMENT
  EntityName.namerElement = Polymer(
  {
    is : 'entity-name-namer-element',

    properties:
    {
      entity:
      {
        type: Object,
        notify: true,
      },
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
  // === CONFIGURER ELEMENT
    EntityName.configurerElement =  Polymer(
    {
        is: "entity-name-configurer-element",

        properties:
        {
            entity:
            {
                type: Object,
                notify: true,
                observer: "_updateField",
            },
            name:
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

        _update: function(e)
        {
          if(this.entity == null)
            return;

          this.entity.setName(this.name);

          if(!this.cascaded)
            CONFIGURER_NOTIFY_VALIDATION_SIGNAL_BUILDER(this, this.entity, e);
        },

        _updateField: function()
        {
          if(this.entity == null)
            return;

          this.name = this.entity.name;
        },
    });
  // === END CONFIGURER ELEMENT
