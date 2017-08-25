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

  isAltClick: function(event)
  {
    if(event == null)
      return false;

    return event.altKey;
  },

  isLeftArrowClick: function(event)
  {
    if(event == null)
      return false;

    return event.key == 'ArrowLeft';
  },

  isRightArrowClick: function(event)
  {
    if(event == null)
      return false;

    return event.key == "ArrowRight";
  },

  isCtrlLeftClick: function(event)
  {
    return (this.isCtrlClick(event) && this.isLeftClick(event));
  },

  isAltLeftArrowClick: function(event)
  {
    return (this.isAltClick(event) && this.isLeftArrowClick(event));
  },

  isAltRightArrowClick: function(event)
  {
    return (this.isAltClick(event) && this.isRightArrowClick(event));
  },

};

var TOOL_EVENT = new ToolEvent();

var IS_EMPTY = function(entity)
{
  if(entity == null)
    return true;

  if(entity instanceof Array)
    if(entity.length == 0)
      return true;

  if(entity.isEmpty == null)//If entity does not have any function for evaluate its emptyness, the test stuck with the null evaluation only
  {
    console.log("The following element does not have a 'isEmpty' function: "+entity.label);
    return false;
  }

  return entity.isEmpty();
};

// === PROTECTION FOR MULTIPLE INSTANCE OF AN ELEMENT LISTENING THIS
var PREVENT_REDUDANCY_OBSERVATION = function(elmInstance, observersArray)
{
  for(var i in observersArray)
    if(observersArray[i][0] == elmInstance)
      return false;

  return true;
};

// === TRANSLATER FOR NAP SPECIFICITY (LIKE INITIAL Step)
var TRANSLATE_NAP_SPECIFICITY = function(spec, position)
{
  switch(spec)
  {
    case "INITIAL_CONCEPTS_NAP":
      return "Part of the initial concepts required for the analysis";
    case "LAST_IN_NAP":
      return "The last expected concepts you produced";
    case "PRODUCED_IN_NAP":
      return position != null ? "Concepts produced in the analysis" : "Concepts produced in the "+position+" step of the analysis";
    default:
      return;
  }
}
var DEL_COUNT_CALL = 0;
var DEL_COUNT_EXISTS = 0;
var DEL_COUNT_ABORT = 0;
// === Check if the given map contains the element
var IF_MAP_CONTAINS = function(map, element)
{
  DEL_COUNT_CALL++;

  if(map == null || element == null)
    {DEL_COUNT_ABORT++;return false;}

  for(var i in map)
    if(map[i] && (map[i] == element || map[i].id == element))
      {DEL_COUNT_EXISTS++; return true;}

  return false;
}


// === COLORS
  var KNOWLEDGE_COLOR = "#57bb8a";
  var DEFAULT_RELATION_COLOR = "#97C2FC";
