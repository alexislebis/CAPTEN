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

    res.vocabProps = array;
    res.n3 = voc.serializeToN3();
    return res;
  }
}

var CUSTOM_ENTITIES_HANDLER = new CustomEntitiesHandler();
