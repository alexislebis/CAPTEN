function VisRedrawerEngine()
{
  this.redrawStack = [];
  this.procTime = 100;
  this.isInProcess = false;
  this.isInRedraw = false;
}

VisRedrawerEngine.prototype =
{
  redraw: function(network)
  {
    if(this.isInRedraw)
    {
      setTimeout(this.redraw(network), 50);
      return;
    }
    else
    {
      // console.log("Adding to stack");
      this.redrawStack.push(network);
    }

    if(!this.isInProcess)
    {
      this.isInProcess = true;

      setTimeout(function(){
        this.beginRedraw();
      }.bind(this), this.procTime);
    }
    else {
      // console.log('In process. Not doing anything.');
    }
  },

  beginRedraw: function()
  {
    // console.log("Redraw.begins: "+this.redrawStack.length);
    this.isInRedraw = true;
    var conservedNetwork = [];
    var duplicataIndex = [];
    var isFound = false;

    for(var l = this.redrawStack.length, i = l - 1; i >= 0; i-- )
    {
      if(this._indexNotContained(i,duplicataIndex))
      {
        for(var j = l - 1; j >= 0; j--)
        {
          if(j != i && this.redrawStack[i] == this.redrawStack[j])
          {
            duplicataIndex.push(j);
            isFound = true;
          }
        }

        if(!isFound)
        {
          conservedNetwork.push(this.redrawStack[i]);
          isFound = false;
        }
      }
    }

    for(var k = 0, p = conservedNetwork.length; k < p; k++)
      conservedNetwork[k].redraw();

    this.redrawStack = [];
    this.isInRedraw = false;
    this.isInProcess = false;
    // console.log("Redraw ends");
  },

  _indexNotContained: function(idx, tab)
  {
    for(var i = 0; i < tab.length; i++)
      if(tab[i] == idx)
        return false;
    return true;
  },
}


var VIS_REDRAWER_ENGINE = new VisRedrawerEngine();
