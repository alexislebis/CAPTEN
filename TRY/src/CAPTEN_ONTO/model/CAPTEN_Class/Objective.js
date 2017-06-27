function Objective ()
{
  CAPTENClass.call(this);

  this.subClasses= [
    {subClasses:{}, name: 'Monitoring', uri: 'NAU'},
    {subClasses:{}, name: 'Adaptation', uri: 'NAU'},
  ];

  this.content = null;
  this.htmlify = "an objective";
  this.addendum = []; //TODO Add addendum to objective
}

Objective.prototype = new CAPTENClass();
Objective.prototype.constructor = Objective;

Objective.prototype.updateElement = function(content)
{
  if(content == null)
    return;

  this.content = content;
}

Objective.prototype.getContent = function()
{
  return this.content;
}

Objective.prototype.isEmpty = function()
{
  if(this.addendum == null || this.addendum.length == 0)
    return true;
  return false;
}

Objective.prototype.addAddendum = function(content)
{
  console.log(content);

  if(content.id == null)
  {
    console.error('content must have an id');
    return null;
  }

  if(!(content instanceof Addendum))
  {
    console.error('content must be an Addendum');
    return null;
  }

  var props = PROPERTIES_POOL.getPropertiesByExtremities(this.id, content.id);
  var prop = null;

  if(props.length <= 0)
  {
    console.log('the relation between the objective and the addendum is not referenced in the pool. Referencing...');
    prop = PROPERTIES_POOL.create(IS_DESCRIBED_BY_URI,URI_TO_LABEL(IS_DESCRIBED_BY_URI),this.id, content.id);
    console.log('done.');
  }
  else
    prop = props[0];

  var narrativeblock = NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);
  if(narrativeblock == null)
  {
    console.log('Their is no narrative block registered for the element#'+this.id+' inside the narrative block pool. Registering...');
    narrativeblock = NARRATIVE_BLOCK_POOL.createFromElement(this);
    console.log('done. Registered in block#'+narrativeblock.id);
  }

  console.log(narrativeblock);
  narrativeblock.addElement(content, prop);//Adding the new addendum inside the corresponding narrative block

  this.addendum.push(content); //update addendum array
},

// === POLYMER ELEMENT
  // === NAMER ELEMENT
  Objective.namerElement = Polymer(
  {
    is : 'objective-namer-element',

    properties:
    {
      entity:
      {
        type: Object,
        notify: true,
      },

      // content://ExString
      // {
      //   type: Object,
      //   notify: true,
      // },
    },

    observers:
    [
      '_onEntityChanged(entity)',
      '_onContentChanged(content)',
    ],

    _onEntityChanged: function(entity)
    {
      var c = this.entity.getContent();
      if(c != null)
        this.content = c;
    },

    _onContentChanged: function(content)
    {
      if(this.entity == null)
        return;

      this.entity.updateElement(content);
    },

    factoryImpl: function(item)
    {
      this.entity = item;
    },


  });
  // === END NAMER ELEMENT
  // === CONFIGURER ELEMENT
    Objective.configurerElement = Polymer({
      is : "objective-configurer-element",

      properties:
      {
        entity:
        {
          type: Object,
          notify: true,
        },

        addendum: //Its an array !
        {
          type: Object,
          notify: true,
        },

        newAddendum:
        {
          type: Object,
          notify: true,
          value: null,
          observer: "_onNewAddendum",
        },

        isCreationActive:
        {
          type: Boolean,
          notify: true,
          value: false,
        },

        cascaded:
        {
          type: Boolean,
          notify: true,
          value: false,
        },

      },

      factoryImpl: function(item)
      {
        this.entity = item;
      },

      _isEntityAnObjective: function(entity)
      {
        console.log(entity);
        if(this.entity instanceof Objective)
          return true;

        return false;
      },

      _loadAppropriateAddendum: function()
      {
        if(this.entity == null)
          return null;

        if( IS_EMPTY(this.entity.addendum) )
          this._deleteCurrentAddendum();

        for(var i in this.entity.addendum)
        {
          if( (this.entity.addendum[i].constructor).configurerElement == null ) //There is no configurer element, thus aborting
            return null;

          var div = document.createElement('div');
          var createdElmt = new (this.entity.addendum[i].constructor).configurerElement(this.entity.addendum[i]);

          div.appendChild(createdElmt);

          if(Polymer.dom(this.root).querySelector('#addendumConfig') == null)
            return;

          Polymer.dom(this.root).querySelector('#addendumConfig').appendChild(div);
        }
      },

      _deleteCurrentAddendum: function()
      {
        var myNode = this.$$("#currentAddendum");

        if(myNode)
          while (myNode.firstChild)
              myNode.removeChild(myNode.firstChild);
      },

      _toggleCreation: function()
      {
        console.log(this.isCreationActive);
        this.isCreationActive = !this.isCreationActive;
        console.log(this.isCreationActive);
      },

      _onNewAddendum: function(e)
      {
        if(this.newAddendum == null)
          return;

          console.log('onChange Addendum !');
        this.entity.addAddendum(this.newAddendum);
      },

      _updateObjective: function()
      {
        if(Polymer.dom(this.root).querySelector('#addendumCrt'))
          Polymer.dom(this.root).querySelector('#addendumCrt')._update();

        if(!this.cascaded)
          CONFIGURER_NOTIFY_VALIDATION_SIGNAL_BUILDER(this, this.entity, null);
      },
    });
  // === END CONFIGURER ELEMENT
