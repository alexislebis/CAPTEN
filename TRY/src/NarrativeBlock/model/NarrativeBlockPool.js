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

    getByID: function(id)
    {
      if(id == null || id < 0)
        return;

      for(var i in this.pool)
        if(this.pool[i].id == id)
          return this.pool[i];
    },

    getNarrativeBlockFor(idElement)
    {
      if(id == null || id < 0)
        return;

      var props = [];
      for(var i in this.pool)
      {
        props = PROPERTIES_POOL.getPropertiesByExtremities(idElement,this.pool[i].id);

        for(var j in props)
          if(props[j].uri == NARRATIVE_BLOCK_URI)
            return this.pool[i];
      }

      return null;
    },
}


 var NARRATIVE_BLOCK_POOL = new NarrativeBlockPool();
