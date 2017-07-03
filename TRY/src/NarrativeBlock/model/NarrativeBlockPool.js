/**
 * NarrativeBlockPool is the interface for the creation of new NarrativeBlock.
 * It keeps track of all the existent narrative block in the application.
 */

 function NarrativeBlockPool()
 {
   this.pool = [];
 }

 NarrativeBlockPool.POSITION = 0;

NarrativeBlockPool.prototype =
{
    create: function(propertyEntity)
    {
      var block = new NarrativeBlock();
      block.configure(propertyEntity);

      this.pool.push(block);
      this.pool[this.pool.length-1].position = NarrativeBlock.POSITION++;

      return block;
    },

    createFromElement: function(elem)
    {
      if(elem == null || elem.id == null)
        return null;

      var block = new NarrativeBlock();
      var prop = PROPERTIES_POOL.create(NARRATIVE_BLOCK_URI,"hasNarrativeBlock",elem.id, block.id);

      block.configure(prop, elem);

      this.pool.push(block);
      this.pool[this.pool.length-1].position = NarrativeBlock.POSITION++;

      return block;
    },

    createFull: function(prop, elem)
    {
      if(elem == null || elem.id == null)
        return null;

        var block = new NarrativeBlock();
        block.configure(prop, elem);

        this.pool.push(block);
        this.pool[this.pool.length-1].position = NarrativeBlock.POSITION++;

        return block;
    },


    getByID: function(id)
    {
      if(id == null || id < 0)
        return;

      for(var i in this.pool)
        if(this.pool[i].id == id)
          return this.pool[i];
    },

    getNarrativeBlockForID(idElement)
    {
      if(idElement == null || idElement < 0)
        return;

      var props = [];
      for(var i in this.pool)
      {
        if(this.pool[i].propertyEntity.from == idElement)
          return this.pool[i];
      }

      return null;
    },

    addElementFor(src, newElm, prop)//Override the from and the to of the prop
    {
      if(src == null || newElm == null)
        return;

      var narrativeBlock = this.getNarrativeBlockForID(src.id);

      if(narrativeBlock == null)
      {
        console.log('Their is no narrative block registered for the element#'+src.id+' inside the narrative block pool. Registering...');
        narrativeBlock = NARRATIVE_BLOCK_POOL.createFromElement(src);
        console.log('done. Registered in block#'+narrativeBlock.id);
      }

      var props = PROPERTIES_POOL.getPropertiesByExtremities(src.id, newElm.id);

      if(props.length <= 0)
      {
        console.log('the relation between the step and the name is not referenced in the pool. Referencing...');
        prop = PROPERTIES_POOL.create(prop.uri, prop.label, src.id, newElm.id, prop.additionalConstraints);
        console.log('done.');
      }
      else
      {
        //already exist
        return;
      }

      narrativeBlock.addElement(newElm, prop);

      return {block: narrativeBlock, elm: newElm, prop: prop};
    },

    getElementsOfOneTypeFor(elmt, uriType)
    {
      var res = this.getNarrativeBlockForID(elmt);

      if(res == null)
        return;

      return res.getElementsFromURIProperty(uriType);
    },

    serializeToJSON: function()
    {
      var array = [];
      for(var i in this.pool)
      {  array.push(this.pool[i].serializeToJSON());
      }

      return array;
    },
}

NarrativeBlockPool.prototype.listCompilantNarrativeBlockProperties =
         [
            {uri: 'isJustifiedBy', label: 'isJustifiedBy'},
            {uri: 'sctfStmt', label: "ScientificHaecceity"},
            {uri: HAS_OBJECTIVE_URI, label: URI_TO_LABEL(HAS_OBJECTIVE_URI)},
            {uri: HAS_HYPOTHESIS_URI, label: URI_TO_LABEL(HAS_HYPOTHESIS_URI)},
            {uri: HAS_DESCRIPTION_URI, label: URI_TO_LABEL(HAS_DESCRIPTION_URI)},
            {uri: HAS_TARGET_USER_URI, label: URI_TO_LABEL(HAS_TARGET_USER_URI)},
            {uri: COMES_FROM_URI, label: URI_TO_LABEL(COMES_FROM_URI)},
            {uri: HAS_NAME_URI, label: URI_TO_LABEL(HAS_NAME_URI)},
            {uri: IS_AUTHORED_BY, label: URI_TO_LABEL(IS_AUTHORED_BY)},
         ];

NarrativeBlockPool.prototype.listCompilantNarrativeBlockEntities =
        [
          {uri: '#hypothesis', label:'Hypothesis'},
          {uri: '#description', label: 'Description'},
          {uri: '#objective', label: 'Objective'},
          {uri: '#targetUser', label: 'Target User'},
          {uri: USE_CASE_URI, label: "Use Case"},
          {uri: HAS_NAME_URI, label: "Name"},
          {uri: AUTHOR_URI, label: "Author"},
        ];

NarrativeBlockPool.prototype.newInstanceDispatcher = function(instanceName)
{
  switch(instanceName)
  {
    case "Hypothesis":
      return new Hypothesis();
    case "Description":
      return new Description();
    case "Objective":
      return new Objective();
    case "Target User":
      return new TargetUser();
    case "Use Case":
      return new UseCase();
    case "Name":
      return new EntityName();
    case "Author":
      return new Author();
    default:
      return null;
  }
}

NarrativeBlockPool.prototype.getDefaultPropertyFor= function(item)//Not register property in the pool here
{

  if(item instanceof Hypothesis)
    return new Property(HAS_HYPOTHESIS_URI, URI_TO_LABEL(HAS_HYPOTHESIS_URI));
  if(item instanceof Description)
    return new Property(HAS_DESCRIPTION_URI, URI_TO_LABEL(HAS_DESCRIPTION_URI));
  if(item instanceof Objective)
    return new Property(HAS_OBJECTIVE_URI, URI_TO_LABEL(HAS_OBJECTIVE_URI));
  if(item instanceof TargetUser)
    return new Property(HAS_TARGET_USER_URI, URI_TO_LABEL(HAS_TARGET_USER_URI));
  if(item instanceof UseCase)
    return new Property(COMES_FROM_URI, URI_TO_LABEL(COMES_FROM_URI));
  if(item instanceof EntityName)
    return new Property(HAS_NAME_URI, URI_TO_LABEL(HAS_NAME_URI));
  if(item instanceof Author)
    return new Property(IS_AUTHORED_BY, URI_TO_LABEL(IS_AUTHORED_BY));
}

 var NARRATIVE_BLOCK_POOL = new NarrativeBlockPool();
