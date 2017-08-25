/**
 * A Super RGTE is a RGTE made from RGTE. It's a super structure that allows to
 * encapsulate the various sources of concepts under the same logical paradigm
 * than a RGTE.
 *
 * Important note:
 * The nodes of the sources ARE NOT COPIED. They are used as it by using the reference.
 * If a node is updated somewhere else, modificiation will appear. However,
 * this superRGTE must be notified when a source change, otherwise, no modif could not be done.
 **/

 function SuperRGTE()
 {
   RGTE.call(this);

   this.sources = []; //RGTE

   this.uri = SuperRGTE_URI;

 }

SuperRGTE.prototype = new RGTE();
SuperRGTE.prototype.constructor = SuperRGTE;

SuperRGTE.prototype.addSource= function(rgte)
{
  if(rgte == null)
    return;

  for(var i in this.sources)
    if(this.sources[i].id == rgte.id)
      return;

  this.sources.push(rgte);
  this._observe(rgte);
  this._updateNodes(rgte);
  this._updateEdges(rgte);
  this._updateK(rgte);

  this.notifyAdd();
}

SuperRGTE.prototype._observe= function(rgte)
{
  rgte.registerObserverCallbackElementAdded(this, this._callbackRGTEReceiveAdd);
  rgte.registerObserverCallbackElementRemoved(this, this._callbackRGTEReceiveRemove);
  rgte.registerObserverCallbackElementUpdated(this, this._callbackRGTEReceiveUpdate);
  rgte.registerObserverCallbackGraphDeleted(this, this._callbackRGTEDeleted);
}

    SuperRGTE.prototype._callbackRGTEReceiveAdd= function(from, elmt)
    {
      this._regenerate();
      this.notifyAdd(elmt);
    }
    SuperRGTE.prototype._callbackRGTEReceiveRemove= function(from, elmt)
    {
      this._regenerate();
      this.notifyRemove(elmt);
    }
    SuperRGTE.prototype._callbackRGTEReceiveUpdate= function(from, elmt)
    {
      this._regenerate();
      this.notifyUpdate(elmt);
    }
    SuperRGTE.prototype._callbackRGTEDeleted= function(graphID)
    {
      this.removeSource(graphID);
      this._regenerate();
      this.notifyChange();
    }

SuperRGTE.prototype._updateNodes= function(rgte)
{
  for(var i in rgte.nodes)
  {
    this.nodes.push(rgte.nodes[i]);
  }
}

SuperRGTE.prototype._updateEdges= function(rgte)
{
  for(var i in rgte.edges)
  {
    this.edges.push(rgte.edges[i]);
  }
}

SuperRGTE.prototype._updateK = function(rgte)
{
  for(var i in rgte.knowledges)
    this.knowledges.push(rgte.knowledges[i]);
}

SuperRGTE.prototype.removeSource= function(graphID)
{
  var index;

  for(var i in this.sources)
  {
    if(this.sources[i].id == graphID)
    {
      index = i;
      break;
    }
  }

  if(index)
    this.sources.splice(i,1);
}

SuperRGTE.prototype._regenerate= function()
{
  this.nodes = [];
  this.edges = [];
  this.knowledges = [];

  for(var i in this.sources)
  {
    this._observe(this.sources[i]);
    for(var j in this.sources[i].nodes)
    {
      this.nodes.push(this.sources[i].nodes[j]);
    }

    for(var k in this.sources[i].edges)
    {
      this.edges.push(this.sources[i].edges[k]);
    }

    for(var l in this.sources[i].knowledges)
    {
      this.knowledges.push(this.sources[i].knowledges[l]);
    }
  }
}

SuperRGTE.prototype.serializeToJSON= function()
{
  var seri = {};

  seri['id'] = this.id;
  seri['type'] = 'SUPER_RGTE';
  seri['uri'] = SuperRGTE_URI;

  seri[RGTE.NODES] = {};
  seri[RGTE.EDGES] = {};
  seri[RGTE.CARDI] = {};
  seri[RGTE.KNOWLEDGES] = {};

  for(var i in this.nodes)
  {
    seri[RGTE.NODES][i] = {};
    seri[RGTE.NODES][i] = this.nodes[i].serializeToJSON();
  }

  for(var i in this.edges)
  {
    seri[RGTE.EDGES][i] = {};
    seri[RGTE.EDGES][i] = this.edges[i].serializeToJSON();
  }

  for(var i in this.edgesCardinality)
  {
    seri[RGTE.CARDI][i] = {};
    seri[RGTE.CARDI][i] = this.edgesCardinality[i];
  }

  seri['narrativeBlock'] = this.narrativeBlock.id;

  for(var i in this.knowledges)
  {
    seri[RGTE.KNOWLEDGES][i] = {};
    seri[RGTE.KNOWLEDGES][i] = this.knowledges[i].serializeToJSON();
  }

  seri['sources'] = {};
  for(var i in this.sources)
  {
    seri['sources'][i] = this.sources[i].id;
  }

  // console.log(seri);
  return seri;
}

SuperRGTE.prototype.serializeToJSONv2= function()
{
  var seri = {};

  seri['id'] = this.id;
  seri['type'] = 'SUPER_RGTE';
  seri['uri'] = SuperRGTE_URI;

  seri[RGTE.NODES] = {};
  seri[RGTE.EDGES] = {};
  seri[RGTE.CARDI] = {};
  seri[RGTE.KNOWLEDGES] = {};

  for(var i in this.nodes)
  {
    seri[RGTE.NODES][i] = {};
    seri[RGTE.NODES][i] = this.nodes[i].id;
  }

  for(var i in this.edges)
  {
    seri[RGTE.EDGES][i] = {};
    seri[RGTE.EDGES][i] = this.edges[i].id;
  }

  for(var i in this.edgesCardinality)
  {
    seri[RGTE.CARDI][i] = {};
    seri[RGTE.CARDI][i] = this.edgesCardinality[i];
  }

  seri['narrativeBlock'] = this.narrativeBlock.id;

  for(var i in this.knowledges)
  {
    seri[RGTE.KNOWLEDGES][i] = {};
    seri[RGTE.KNOWLEDGES][i] = this.knowledges[i].id;
  }

  seri['sources'] = {};
  for(var i in this.sources)
  {
    seri['sources'][i] = this.sources[i].id;
  }

  // console.log(seri);
  return {srgte: seri};
}

SuperRGTE.prototype.mapNarrativeBlock= function(map)
{
  this.narrativeBlock.mapNarrativeBlock(map);

  for(var i in this.nodes)
    if(this.nodes[i] != null)
      this.nodes[i].mapNarrativeBlock(map);
  for(var i in this.properties)
    if(this.properties[i] != null)
      this.properties[i].mapNarrativeBlock(map);
  for(var i in this.knowledges)
    if(this.knowledges[i] != null)
      this.knowledges[i].mapNarrativeBlock(map);

  if(this.derivedFrom != null)
    this.derivedFrom.mapNarrativeBlock(map);

  for(var i in this.sources)
    this.sources[i].mapNarrativeBlock(map);
}

SuperRGTE.prototype.mapIdElementsUsed = function(map)
{
  if(this.x) //x reprensent the state of the function. If True, somehow the propagation is cyclic and thus it is stopped
    return;
  this.x = true;

  map[this.id] = this.id;

  for(var i in this.nodes)
    if(this.nodes[i] && this.nodes[i].mapIdElementsUsed && !IF_MAP_CONTAINS(map, this.nodes[i].id))
      this.nodes[i].mapIdElementsUsed(map);
  // for(var i in this.properties)
  //   if(this.properties[i] && this.properties[i].mapIdElementsUsed)
  //     this.properties[i].mapIdElementsUsed(map);
  for(var i in this.knowledges)
    if(this.knowledges[i] && !IF_MAP_CONTAINS(map, this.knowledges[i].id))
      this.knowledges[i].mapIdElementsUsed(map);
  for(var i in this.sources)
    if(!IF_MAP_CONTAINS(map, this.sources[i].id))
      this.sources[i].mapIdElementsUsed(map);

  if(this.derivedFrom && !IF_MAP_CONTAINS(map, this.derivedFrom.id))
    this.derivedFrom.mapIdElementsUsed(map);

  this.x = false;
}

SuperRGTE.prototype.mapElementsUsed = function(map)
{
  if(this.x) //x reprensent the state of the function. If True, somehow the propagation is cyclic and thus it is stopped
    return;
  this.x = true;

  map[this.id] = this;

  for(var i in this.nodes)
    if(this.nodes[i] && this.nodes[i].mapElementsUsed && !IF_MAP_CONTAINS(map, this.nodes[i].id))
      this.nodes[i].mapElementsUsed(map);
  // for(var i in this.properties)
  //   if(this.properties[i] && this.properties[i].mapIdElementsUsed)
  //     this.properties[i].mapIdElementsUsed(map);
  for(var i in this.knowledges)
    if(this.knowledges[i] && !IF_MAP_CONTAINS(map, this.knowledges[i].id))
      this.knowledges[i].mapElementsUsed(map);
  for(var i in this.sources)
    if(!IF_MAP_CONTAINS(map, this.sources[i].id))
      this.sources[i].mapElementsUsed(map);

  if(this.derivedFrom && !IF_MAP_CONTAINS(map, this.derivedFrom.id))
    this.derivedFrom.mapElementsUsed(map);

  this.x = false;
}
