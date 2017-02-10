/**
 * A NarrativeBlock is a container dedicated to the embed the different narratives elements for describe and
 * justify the various entities of a narrated analysis process.
 *
 * One NarrativeBlock is dedicated to only one entity, belonging mostly in the APE.model. They are linked by
 * a meta property, which currently not supporting any semantic (24/01/2017).
 *
 * It is a dynamic container which grows when the designed entity receive a new descriptive element or justification.
 * The element use for description or justification is directly stocked, not only its id.
 *
 * The property linking the descriptive/justificative element to the entity is NOT stocked. The PROPERTIES_POOL
 * need to be queried in order to obtain the associated from or to id.
 *
 * Thus, from an entity, it is possible to retrieve ALL the descriptive/justificative element AND also the
 * NarrativeBlock via the PROPERTIES_POOL.
 */

function NarrativeBlock()
{
  this.id = CAPTEN.ID++;

  this.observers = [];
  this.elements = [];

  this.propertyEntity = null; //the property linking this with the entity. Used for verif if an element share the same entity
}

NarrativeBlock.isPropertyHandled = function(propToCheck)
{
  console.error("WARNING: no verification regarding the type of property used between entity & element");
  return true;
};

NarrativeBlock.prototype = {

// === OBSERVATION
  registerObserverCallbackOnChange: function(objCallback, callback)
  {
    this.observers.push([objCallback,callback]);
  },

    // === NOTIFICATION
    notifyChange: function()
    {
      this.observers.forEach(function(e)
      {
        console.log(e);
          if (typeof e[1] === "function") {
            e[1].call(e[0]);//e[0] define the `this` context for e[1]
          }
      });
    },

  resetObservers: function()
  {
    this.observers = [];
  },

// === NARRATIVE_BLOCK FUNCTION
  configure: function(property)
  {
    if(property == null)
      return;

    this.propertyEntity = property;
  },

  getLength: function()
  {
    return this.elements.length;
  },

  getOrigin: function()
  {
    return this.propertyEntity.from;
  },

  getElementById: function(id)
  {
    for(var i in this.elements)
      if(this.elements[i].id == id)
        return this.elements[i];

    return null;
  },

  addElement: function(element, propertyWEntity)
  {
    if(this.propertyEntity == null) //Abort because NarrativeBlock is not well configurated
      return;

    if(!NarrativeBlock.isPropertyHandled(propertyWEntity))
      return;

    if( propertyWEntity == null || !(propertyWEntity.from === this.propertyEntity.from && propertyWEntity.to === element.id) )
      return;

    if( this.isElementAlreadyInBlock(element) )
      return;

    this.elements.push(element);
    return element;
  },

  isElementAlreadyInBlock: function(element)
  {
    for(var i in this.elements)
    {
      if(this.elements[i].id == element.id)
        return true;
    }
    return false;
  },

  removeElement: function(element)
  {
    for(var i in this.elements)
    {
      if(this.elements[i].id == element.id)
      {
        var props = PROPERTIES_POOL.getPropertiesByExtremities(this.propertyEntity.from, element.id);

        for(var i in props)
          PROPERTIES_POOL.remove(props[i]);

        this.elements.splice(i,1);
        return true;
      }
    }
  }

};
