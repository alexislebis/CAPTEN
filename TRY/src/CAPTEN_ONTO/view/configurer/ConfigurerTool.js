var CONFIGURER_NOTIFY_CLOSE_SIGNAL_ID = "-OPigv7zdaq2gez5faf";
var CONFIGURER_NOTIFY_VALIDATION_SIGNAL_ID = "-LJEuvne5887a6Sgh";

var CONFIGURER_NOTIFY_CLOSE_SIGNAL_BUILDER = function(src, entity, event){

  if(entity == null)
    return null;

  src.fire(CONFIGURER_NOTIFY_CLOSE_SIGNAL_ID, {'entity':entity, 'event':event});
  return true;
};

var CONFIGURER_NOTIFY_VALIDATION_SIGNAL_BUILDER = function(src, entity, event){

  if(entity == null)
    return null;

  src.fire(CONFIGURER_NOTIFY_VALIDATION_SIGNAL_ID, {'entity':entity, 'event':event});
  return true;
};
