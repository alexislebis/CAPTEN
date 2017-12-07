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

  this.entity = null; //V2 update. direct reference to the entity
  this.propertyEntity = null; //the property linking this with the entity. Used for verif if an element share the same entity
}

NarrativeBlock.isPropertyHandled = function(propToCheck)
{
  console.log("WARNING: no verification regarding the type of property used between entity & element");
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
  configure: function(property, elmt)
  {
    if(property && property instanceof Property)
      this.propertyEntity = property;

    if(elmt)
      this.entity = elmt;
  },

  getLength: function()
  {
    return this.elements.length;
  },

  getOriginID: function()
  {
    if(this.propertyEntity)
      return this.propertyEntity.from;
    return null;
  },

  getOrigin: function()
  {
    return this.entity;
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

    this.notifyChange();

    return element;
  },

  replaceElement: function(old, newElmt)
  {
    if(old == null || newElmt == null)
      return;

    var indexToRemove = null;
    var prop = null;
    for(var i in this.elements)
    {
      if(this.elements[i].id == old.id)
      {
        prop = PROPERTIES_POOL.getPropertiesByExtremities(this.propertyEntity.from, old.id);
        indexToRemove = i;

        this.elements.push(newElmt);
        PROPERTIES_POOL.create(prop.uri, prop.label, this.propertyEntity.from, newElmt.id);
      }
    }

    if(indexToRemove == null)
      return;

    this.elements.splice(i,1); //replace dry prog with removeElement
    PROPERTIES_POOL.remove(prop);

    return true;
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

        for(var j in props)
          PROPERTIES_POOL.remove(props[j]);

        this.elements.splice(i,1);
        this.notifyChange();
        return true;
      }
    }
  },

  //Search the relation of the element of the narrative block, such as "qualify"
  getPropertyOfElement: function(element)
  {
    if(element == null)
      return;

    if(this.getElementById(element.id) == null)
      return;

    var props = PROPERTIES_POOL.getPropertiesByExtremities(this.propertyEntity.from, element.id);

    if(props == null || props.length == 0)
      return;

    return props[0];
  },

  getElementsFromURIProperty: function(uri)
  {
    var tmp = null;
    var res = [];

    for(var i in this.elements)
    {
      tmp = PROPERTIES_POOL.getPropertiesByExtremities(this.propertyEntity.from, this.elements[i].id);
      for(var j in tmp)
      {
        if(tmp[j] && tmp[j].uri == uri)
          res.push(this.elements[i]);
      }
    }

    return res;
  },

  updateElmtAttribute: function(elmt, attr, value)
  {
    if(elmt == null || attr == null)
      return;

    var res = this.getElementById(elmt.id);

    if(res == null)
      return;

    if(res.updateAttribute) // In prevision of overriding function
      res.updateAttribute(attr, value);
    else
      res[attr] = value;

    return res;
  },

  getElementsByTag: function(tag)
  {
    var res = [];

    for(var i in this.elements)
    {
      prop = PROPERTIES_POOL.getPropertiesByExtremities(this.propertyEntity.from, this.elements[i].id);
      if(prop.length <= 0)
        return null;

      if(tag == "ALL")
      {
        res.push({element: this.elements[i], property: prop[0] });
      }
      else // tag == null or others : retrieve all untagged elements
      {
        if(this.elements[i].tag == null)
        {
          res.push({element: this.elements[i], property: prop[0]});
        }
      }

    }

    return res;
  },

  blobIt: function()
  {
    var res2 = '';

    for(var i in this)
    {
      if(typeof this[i] !== 'function')
        res2 += i;
    }

    console.log(res2);
    var res = JSON.stringify(JSON.decycle(this));
    return new Blob([new String(JSON.stringify(JSON.decycle(this)))], {type: "application/json"});
  },

  serializeToJSON: function()
  {
    var res = {id: null, elements: [], propertyEntity: null, entity: null};

    res.id = this.id;

    for(var i in this.elements)
      {res.elements.push(this.elements[i].serializeToJSON());
      }

    res.propertyEntity = this.propertyEntity;

    if(this.entity)
      res.entity = this.entity.serializeToJSON();

    // var res = JSON.stringify(res);
    return res;
  },

  serializeToJSONv2: function()
  {
    var res = {id: null, elements: [], propertyEntity: null, entity: null};

    res.id = this.id;

    for(var i in this.elements)
    {
      res.elements.push(this.elements[i].id);
    }

    res.propertyEntity = this.propertyEntity.id;

    if(this.entity)
      res.entity = this.entity.id;

    // var res = JSON.stringify(res);
    return {narr: res};
  },

  mapNarrativeBlock: function(map)
  {
    map[this.id] = this;

    for(var i in this.elements)
    {
      this.elements[i].mapNarrativeBlock(map);
    }

    if(this.propertyEntity)
      this.propertyEntity.mapNarrativeBlock(map);
  },

  mapIdElementsUsed: function(map)
  {
    if(this.x) //x reprensent the state of the function. If True, somehow the propagation is cyclic and thus it is stopped
      return;
    this.x = true;

    map[this.id] = this.id;

    for(var i in this.elements)
      if(!IF_MAP_CONTAINS(map, this.elements[i].id))
        this.elements[i].mapIdElementsUsed(map);

    if(this.entity && this.entity.mapIdElementsUsed && !IF_MAP_CONTAINS(map, this.entity.id))
      this.entity.mapIdElementsUsed(map);

    if(this.propertyEntity && this.propertyEntity.mapIdElementsUsed && !IF_MAP_CONTAINS(map, this.propertyEntity.id))
      this.propertyEntity.mapIdElementsUsed(map);

    this.x = false;
  },

  mapElementsUsed: function(map)
  {
    if(this.x) //x reprensent the state of the function. If True, somehow the propagation is cyclic and thus it is stopped
      return;
    this.x = true;

    map[this.id] = this;

    for(var i in this.elements)
      if(!IF_MAP_CONTAINS(map, this.elements[i].id))
        this.elements[i].mapElementsUsed(map);

    if(this.entity && this.entity.mapElementsUsed && !IF_MAP_CONTAINS(map, this.entity.id))
      this.entity.mapElementsUsed(map);

    if(this.propertyEntity && this.propertyEntity.mapElementsUsed && !IF_MAP_CONTAINS(map, this.propertyEntity.id))
      this.propertyEntity.mapElementsUsed(map);

    this.x = false;
  },

  // === ONTOLOGY EXPORT

  getN3Ready: function()
  {
    if(this.entity == null)
      return null;

    var map = {}; var subMap = {};
    map[this.entity.getN3ID()] = [];

    for(var i in this.elements) //create direct n3 relation with the range
    {
      map[this.entity.getN3ID()].push([PROPERTIES_POOL.getPropertiesByExtremities(this.entity.id, this.elements[i].id)[0].uri, this.elements[i]]);

      if(this.elements[i].getN3Ready) //propagation of relation
      {
          subMap = this.elements[i].getN3Ready();
          N3_EXPORTER.n3MapsMerger(map, subMap);
      }
      else
        console.log(this.elements[i]+" is not N3Ready");
    }

    return map;
  },

};
