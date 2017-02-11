var NARRATIVE_BLOCK_NOTIFY_SIGNAL_ID = "-fiIJeiefg554zaz3247";

var NARRATIVE_BLOCK_NOTIFY_SIGNAL_BUILDER = function(src, entity, event){

  if(entity == null)
    return null;

  src.fire(NARRATIVE_BLOCK_NOTIFY_SIGNAL_ID, {'entity':entity, 'event':event});
  return true;
};
