/**
 * A CompositeElement is a superstructure which regroups an infinity of elements.
 *
 * This superstructure **HAS** a semantic. The semantic is defined by the following :
 *                      Ui->n e[i]
 *
 * It is used to deploy narration on complex elements structuration. This is done by
 * encapsuling these elements in one superstructure.
 *
 * Each CompositeElement has options. They are automanaged entries of the options
 * array representing some configuration for this composite element. The verification
 * and the quality of the options is delegated to the objects using it.
 *
 * Thus, a CompositeElement can only have one NarrativeBlock, and can serve as
 * narrative elements for other ones.
 */

function CompositeElement()
{
  this.id = CAPTEN.ID++;

  // === Observers
    this.observers = [];
    this.observersDelete = [];


  this.elements = [];
  this.options = {};//List of custom options. can be anything. verif is delegated to objs using it
}

CompositeElement.prototype =
{
  // === OBSERVATION
    registerObserverCallbackOnChange: function(objCallback, callback)
    {
      this.observers.push([objCallback,callback]);
    },

      // === NOTIFICATION
      notifyChange: function()
      {
        this.observers.forEach(function(e)
        {
          console.log(e);
            if (typeof e[1] === "function") {
              e[1].call(e[0]);//e[0] define the `this` context for e[1]
            }
        });
      },

    registerObserverCallbackOnDeletion: function(objCallback, callback)
    {
      this.observersDelete.push([objCallback,callback]);
    },

      // === NOTIFICATION
      notifyDeletion: function()
      {
        this.observersDelete.forEach(function(e)
        {
          console.log(e);
            if (typeof e[1] === "function") {
              e[1].call(e[0]);//e[0] define the `this` context for e[1]
            }
        });
      },

    resetObservers: function()
    {
      this.observers = [];
    },
  // === END OBSERVATION


  // === MANAGING COMPOSITE ELEMENT CONSTITUTION
    addElement: function(e)
    {
      if(e == null)
      {
        console.log("Element is null. Not included inside the CompositeElement");
        return;
      }

      this.elements.push(e);
    },

    addElements: function(e)
    {
      for(var i in e)
      {
        this.addElement(e[i]);
      }

      this.notifyChange();
    },

    removeElement: function(e)
    {
      for(var i = 0; i < this.elements.length; i++)
      {
        if(this.e.id == this.elements[i].id)
        {
          var elmt = this.elements.splice(i,1);
          this.notifyChange();
          return elmt;
        }
      }
    },

    delete: function()
    {
      this.elements = [];
      this.options = {};

      this.notifyDeletion();
    },
  // === END MANAGING COMPOSITE ELEMENT CONSTITUTION
};
