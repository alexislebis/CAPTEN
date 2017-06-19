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

      block.configure(prop);

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
        var newProp = PROPERTIES_POOL.create(prop.uri, prop.label, this.id, newElm.id, prop.additionalConstraints);
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
}

NarrativeBlockPool.prototype.listCompilantNarrativeBlockProperties =
         [
            {uri: 'isJustifiedBy', label: 'isJustifiedBy'},
            {uri: 'sctfStmt', label: "ScientificHaecceity"},
         ];

NarrativeBlockPool.prototype.listCompilantNarrativeBlockEntities =
        [
          {uri: '#hypothesis', label:'Hypothesis'},
          {uri: '#description', label: 'Description'},
        ];

 var NARRATIVE_BLOCK_POOL = new NarrativeBlockPool();
