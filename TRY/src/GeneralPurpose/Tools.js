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
