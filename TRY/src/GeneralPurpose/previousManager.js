// === PREVIOUS MANAGER
window.onkeydown = function (e) {
  if(TOOL_EVENT.isAltLeftArrowClick(e))
  {
    e.preventDefault();

    // var url = HISTORY_MANAGER._getRedirectionURL(HISTORY_MANAGER.back());
    //
    // if(url != null)
    // {
    //   window.location.href = HISTORY_MANAGER.route + url;
    // }
    // else {
    //   HISTORY_MANAGER.notifyFailure();
    // }
    var ev = new Event(HISTORY_PREVIOUS_REQUESTED_SIGNAL_ID, {"bubbles":true, "cancelable":false});
    ev.data = {current: HISTORY_MANAGER.getCurrentItem(), callback: proceedBack, initialEvent: e, callbackFail: doNotProceedBack};
    document.dispatchEvent(ev);
  }
  else if (TOOL_EVENT.isAltRightArrowClick(e))
  {
    var url = HISTORY_MANAGER._getRedirectionURL(HISTORY_MANAGER.forward());

    if(url != null)
    {
      window.location.href = HISTORY_MANAGER.route + url;
    }

  }
  // else NTD
}

function proceedBack(e)
{
  e.preventDefault();

  var url = HISTORY_MANAGER._getRedirectionURL(HISTORY_MANAGER.back());

  if(url != null)
  {
    window.location.href = HISTORY_MANAGER.route + url;
  }
  else {
    HISTORY_MANAGER.notifyFailure();
  }
}

function doNotProceedBack(e)
{
  e.preventDefault();
}

function PreviousManager()//Object to rename
{
  this.history = [];
  this.index = -1;

  this.redirectState = false; //Boolean indicating that the redirection has been made and therefore the next stack invok should not be takeninto account

  this.route = (window.location.href).split("#")[0]+'#';

  this.observers = []; // For notification of failure

  this.observersChange = [];


  this.vocab = [];
  this.customcls = [];
  this.customprops = [];
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

  registerObserverCallbackOnChange: function(objCallback, callback)
  {
    if(PREVENT_REDUDANCY_OBSERVATION(objCallback, this.observersChange))
      this.observersChange.push([objCallback,callback]);
  },

    // === NOTIFICATION
    notifyChange: function()
    {
      this.observersChange.forEach(function(e)
      {
          if (typeof e[1] === "function") {
            e[1].call(e[0]);//e[0] define the `this` context for e[1]
          }
      });
    },
  // ===================

  stack: function(item)
  {
    if(item == null)
      return;

    if(this.redirectState)
    {
      if(this.history[this.index].id != null && item && item.id != this.history[this.index].id)
        this.history[this.index] = item; //update of the item because the pool created new element
      this.redirectState = false;
      return;
    }
    // if(this.index != -1 && this.history.length > 0)
    //   return null;//NTD since the current element is the element. Due to direct access

    // === PREVENTING DOUBLE INSERTION
    if(item.id)
      if(this.history[this.index] && item.id == this.history[this.index].id)
        return;
    else if(item == this.history[this.index])
      return;
    //===============

    if(this.index == this.history.length-1)
    {
      this.index++;
      this.history.push(item);
    }
    else {
        this.index++
        this.history.splice(this.index);
        this.history.push(item);
      // this.history.push(item); // The item is supposed to be from where the new history is built
      // this.index++;
    }

    this.notifyChange();
  },

  // consume: function()
  // {
  //   return this.history.splice(this.history.length-1, 1)[0];
  // },
  back: function()
  {
    if(this.history.length < 1 || this.index < 0)
      return null;

    this.index--;
    this.redirectState = true;
    return this.history[this.index];

    // return res;
  },

  forward: function()
  {
    if(this.history.length < 1)
      return null;

    if(this.index >= this.history.length -1 )
      return null;

    this.index++;
    this.redirectState = true;
    var res = this.history[this.index];

    return res;
  },


  reset: function()
  {
    this.index = 0;
    this.history = [];
    this.notifyChange();
    this.redirectState = false;
  },

  getFirstAntichronologicalElement: function(instance)//If null, retrieve the first element encountered from the current position
  {
    if(instance == null)
    {
      if(this.index >= 0)
        return this.history[this.index];
      else
        return null;
    }
    for(var i = this.index; i >= 0; i--)
    {
      if(this.history[i] instanceof instance)
        return this.history[i];
    }

    return null;
  },

  getCurrentItem: function()
  {
    return this.history[this.index];
  },

  _getRedirectionURL: function(item)
  {
    if(item == null)
      return;
    else if(item instanceof NarratedAnalysisProcess)
      return "/analysis/"+item.id;
    else if(item instanceof NarratedOperator)
      return "/nop/"+item.id;
    else if(item instanceof Step)
      return "/step/"+item.id;
    else if(item instanceof RGTE)
      return '/rgte/'+item.id;
    else if(item instanceof NarrativeBlock)
      return '/narration/pathtodo';
    else if(item == "VOCABULARY")
      return "/vocabulary";
    else if(item.includes && item.includes("terminology") )
      return item;
  },

  setVocabulary: function(vocab, cls, props)
  {
    this.vocab = vocab;
    this.customcls = cls;
    this.customprops = props;
  },
  getURL: function(item)
  {
    if(item == null)
      return;
    else if(item instanceof NarratedAnalysisProcess)
      return "/analysis/"+item.id;
    else if(item instanceof NarratedOperator)
      return "/nop/"+item.id;
    else if(item instanceof Step)
      return "/step/"+item.id;
    else if(item instanceof RGTE)
      return '/rgte/'+item.id;
    else if(this._belongsToVocabulary(item))
    {
      if(item.idVoc)
        return '/terminology/'+item.idVoc.id;
      else
        return '/terminology/'+item.id;
    }
  },
    _belongsToVocabulary: function(item)
    {
      if(item == null || this.vocab == null)
        return;

      rdfclasses = this.vocab.getClasses();
      rdfprops = this.vocab.getProperties();

      if(item.idVoc)
      {
        for(var i in rdfclasses)
          if(rdfclasses[i].id == item.idVoc.id)
            return true;
        for(var i in this.customcls)
          if(this.customcls[i].id == item.idVoc.id)
            return true;
        for(var i in this.customprops)
          if(this.customprops[i].id == item.idVoc.id)
            return true;
        for(var i in rdfprops)
          if(rdfprops[i].id == item.idVoc.id)
            return true;
        return false;
      }

      for(var i in rdfclasses)
        if(rdfclasses[i].id == item.id)
          return true;
      for(var i in this.customcls)
        if(this.customcls[i].id == item.id)
          return true;
      for(var i in this.customprops)
        if(this.customprops[i].id == item.id)
          return true;
      for(var i in rdfprops)
        if(rdfprops[i].id == item.id)
          return true;
      return false;
    },
};

var HISTORY_MANAGER = new PreviousManager();
