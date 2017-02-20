function ToolEvent()
{

}

ToolEvent.prototype = {
  isCtrlClick: function(event)
  {
    if(event == null || event.srcEvent == null)
      return false;

    return event.srcEvent.ctrlKey;
  },

  isLeftClick: function(event)
  {
    if(event == null || event.srcEvent == null)
      return false;

    return (event.srcEvent.button == 0);
  },

  isCtrlLeftClick: function(event)
  {
    return (this.isCtrlClick(event) && this.isLeftClick(event));
  },

};

var TOOL_EVENT = new ToolEvent();

var IS_EMPTY = function(entity)
{
  if(entity == null)
    return true;

  if(entity.isEmpty == null)//If entity does not have any function for evaluate its emptyness, the test stuck with the null evaluation only
  {
    console.log("The following element does not have a 'isEmpty' function: "+entity.label);
    return false;
  }
  
  return entity.isEmpty();
};
