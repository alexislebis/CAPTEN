function CustomEntitiesHandler()
{
  this.customcls = null;
  this.customprops = null;
}


CustomEntitiesHandler.prototype = {
  setCustoms : function(cls, props)
  {
    this.customcls = cls;
    this.customprops = props;
  },

  serializeToJSONN3WithVocabularyIntegration: function(vocab)
  {
    if(vocab == null)
      return;

    var voc = vocab.clone();

    for(var i in this.customcls)
      voc.addClass(this.customcls[i]);

    var res = {vocabProps : null};

    var array = [];
    for(var i in this.customprops)
      array.push(this.customprops[i]);
    var tmp = vocab.getPropertiesArrayed()
    for(var i in tmp)
      array.push(tmp[i])

    res.vocabProps = array;

    var nods = [];
    for(var i in this.customcls)
      nods.push(this.customcls[i].serializeToJSON());
    tmp = vocab.getClasses();
    for(var i in this.tmp)
      nods.push(tmp[i].serializeToJSON());

    res.vocabClasses = nods;

    res.n3 = voc.serializeToN3();
    return res;
  },

  VocabularyIntegrationv2: function(vocab)
  {
    if(vocab == null)
      return;

    var voc = vocab.clone();

    for(var i in this.customcls)
      voc.addClass(this.customcls[i]);

    var res = {vocabProps : null};

    var array = [];
    for(var i in this.customprops)
      array.push(this.customprops[i]);
    var tmp = vocab.getPropertiesArrayed()
    for(var i in tmp)
      array.push(tmp[i])

    res.vocabProps = array;

    var nods = [];
    for(var i in this.customcls)
      nods.push(this.customcls[i]);
    tmp = vocab.getClasses();
    for(var i in this.tmp)
      nods.push(tmp[i]);

    res.vocabClasses = nods;

    // res.n3 = voc.serializeToN3();
    return res;
  }
}

var CUSTOM_ENTITIES_HANDLER = new CustomEntitiesHandler();
