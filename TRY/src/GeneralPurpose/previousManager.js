// === PREVIOUS MANAGER
window.onkeydown = function (e) {
  if(TOOL_EVENT.isAltLeftArrowClick(e))
  {
    alert("Handle deplacement gauche droite avec liste");
    e.preventDefault();

    var url = PREVIOUS_MANAGER._getRedirectionURL(PREVIOUS_MANAGER.consume());

    if(url != null)
    {
      window.location.href = PREVIOUS_MANAGER.route + url;
    }
    else {
      PREVIOUS_MANAGER.notifyFailure();
    }
  }

  // else NTD
}

function PreviousManager()
{
  this.previousStack = [];
  this.route = (window.location.href).split("#")[0]+'#';

  this.observers = []; // For notification of failure
}

PreviousManager.prototype = {

  // === OBSERVATION ===
  registerObserverCallbackOnFail: function(objCallback, callback)
  {
    if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.observers))
      this.observers.push([objCallback,callback]);
  },

    // === NOTIFICATION
    notifyFailure: function()
    {
      this.observers.forEach(function(e)
      {
          if (typeof e[1] === "function") {
            e[1].call(e[0]);//e[0] define the `this` context for e[1]
          }
      });
    },
  // ===================

  stack: function(item)
  {
    this.previousStack.push(item);
  },

  consume: function()
  {
    return this.previousStack.splice(this.previousStack.length-1, 1)[0];
  },

  reset: function()
  {
    this.previousStack = [];
  },

  _getRedirectionURL: function(item)
  {
    if(item instanceof NarratedAnalysisProcess)
      return "/analysis/"+item.id;
    else if(item instanceof NarratedOperator)
      return "/nop/"+item.id;
    else if(item instanceof Step)
      return "/step/"+item.id;
  },
};

var PREVIOUS_MANAGER = new PreviousManager();
