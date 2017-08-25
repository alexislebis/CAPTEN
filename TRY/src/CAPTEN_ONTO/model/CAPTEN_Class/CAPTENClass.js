//#8fa876

/**
 * CAPTENClass represents the classes used in the CAPTEN-ONTO for the APE description. Each CAPTENClass must have a name (materialized by its className), an URI and a set of properties
 */

function CAPTENClass(uri, label, properties)
{
    this.id = CAPTEN.ID++;

    this.uri = uri;
    this.properties = properties; //[Property]
    if(this.properties == null)
      this.properties = [];

    this.isBlank = false;

    //Dynamic inheritance system. CF Property for more details
    this.iName = "Class";

    if (label == null)
        this.label = this.uri;
    else
        this.label = label;

    this.inheritanceArray = [];
    this.subClasses = []; //Here are the classes which inherit this
    this.subClassOf = []; //Here, the classes inherited from this

    //console.log(this.uri);
    if (this.uri != null && this.uri.match(/[_].*/))
        this.isBlank = true;

    // Keep a link with the instance of the same class which was used to produce this
    // copy function MUST DEFINE this.derivedFrom attribute.
      this.derivedFrom = null;

  // === NARRATIVE_INFORMATION
    this.narrativeBlock = NARRATIVE_BLOCK_POOL.createFromElement(this); //All captenclasses are by default associated with a narrative block
    // === PREDEFINED NARRATIVE ELEMENTS
      this.author == null;
}

CAPTENClass.id = 0;

CAPTENClass.prototype = {

    hasNarrativeBlock: function()
    {
      console.log(this.id);
      console.log(this.name);
      console.log(NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id));
      return NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id) == null ? false : true;
    },
    getNarrativeBlock: function()
    {
      return NARRATIVE_BLOCK_POOL.getNarrativeBlockForID(this.id);
    },

    /** The is function give the possibility to this to evolve according to the need of the user.
     * Thus, by choosing a specific subclass, the object will evolve. Note the nested evolving possibility with the subClasses value.
     * if newName does not belong to the subClass possibilities of this, then is throw an exception.
     * Moreover, specialization cannot be redone a second time, otherwise an exception is throw.
     **/
    is: function(newName)
    {
        var find = false;
        var that = this;

        if (Object.keys(this.subClasses).length === 0 && this.subClasses.constructor === Object)
            throw new NotSubClassException(newName, this);

        //Verification if the property is already specialized. If yes, then throw an exception. The user has to create a new prop.
        this.subClasses.forEach(function(p)
        {
            if (that.name === p.name)
                throw new ClassAlreadySpecializedException(newName, that);
        });

        this.subClasses.forEach(function(e)
        {
            if (e.name === newName)
            {
                //console.log(e.subClasses);
                that.inheritanceArray.push(that.name); //memorizing the previous super class;
                that.name = e.name;
                that.subClasses = e.subClasses;
                that.uri = e.uri;
                find = true;
            }
        });

        if (!find)
            throw new NotSubClassException(newName, this);

        return;
    },

  // === OVERRIDED METHODS
    contains: function(obj)
    {
      if(obj instanceof CAPTENClass)
      {

      }

      throw new Error('Unimplemented function');
    },

    retrieveUniqueIdentifier: function()
    {
      var id = this.id;

      // if(this.idVoc != null) //If the captenClass is used inside a RGTE, in order to avoid id colision since the id is transfered into idVoc and current id is the id inside RGTE, we take the oposite
      //  id *= -1;

      return id;
    },
// ===

    equals: function(CAPTENc)
    {
        if (CAPTENc instanceof CAPTENClass)
        {
            if (this.uri === CAPTENc.uri)
                return true;
        }

        return false;
    },

    includedIn: function(arrayCls)
    {

        if(arrayCls == null)
          return -1;

        var nbIte = 0;

        for (var i in arrayCls)
        {
            nbIte++;
            if (this.equals(arrayCls[i]))
                return i;
        }

        if (nbIte === 0) //If the array is not a map, thus it has to be iterated in a normal way
        {
            for (var i = 0; i < arrayCls.length; i++)
            {
                if (this.equals(arrayCls[i]))
                    return i;
            }
        }

        return -1;
    },

    becomesSubClassOf: function(cls)
    {
        if (cls.includedIn(this.subClassOf) == -1)
          this.subClassOf.push(cls);
        if(this.includedIn(this.subClasses) == -1)
          cls.subClasses.push(this);
    },

    /**
     * Reset all the relations of subclass concerning this. For example, if "A" is a "B" and can be a "C", both "B" and "C" will lose their relations with "A" (A's arrays are reseted).
     */
    resetSubClassRelations: function()
    {

        while (this.subClassOf.length > 0)
        {
            this.removeSubClassRelationWith(this.subClassOf[0]);
        }

        while (this.subClasses.length > 0)
        {
            this.removeSubClassRelationWith(this.subClasses[0]);
        }
    },

    /**
     * Remove the relation that exist between this and "cls" regarding subclass, independetly of the fact that this is a subclass of cls or this is the super class of cls.
     *
     */
    removeSubClassRelationWith: function(cls)
    {
        var indexOfClsInThis = -1;

        indexOfClsInThis = cls.includedIn(this.subClassOf);

        //console.log(indexOfClsInThis);

        if (indexOfClsInThis != -1) //cls is a subClassOf this
        {
            this.removeASubClassOf(cls, indexOfClsInThis);
            cls.removeASuperClass(this);

            return;
        }

        indexOfClsInThis = cls.includedIn(this.subClasses);

        // //console.log(indexOfClsInThis);

        if (indexOfClsInThis != -1)
        {
            this.removeASuperClass(cls, indexOfClsInThis);
            cls.removeASubClassOf(this);

            return;
        }
    },

    removeASubClassOf: function(cls, indexOfClsInThis)
    {
        if (indexOfClsInThis == null || indexOfClsInThis < 0 || indexOfClsInThis >= this.subClassOf.length)
            indexOfClsInThis = cls.includedIn(this.subClassOf);

        if (indexOfClsInThis == -1)
            return;

        var buff1 = this.subClassOf.slice(0, indexOfClsInThis);
        var buff2 = this.subClassOf.slice(indexOfClsInThis + 1, this.subClassOf.length);

        this.subClassOf = [];
        for (var i = 0; i < buff1.length; i++)
            this.subClassOf.push(buff1[i]);
        for (var i = 0; i < buff2.length; i++)
            this.subClassOf.push(buff2[i]);

        //console.log(this.subClassOf);
    },

    removeASuperClass: function(cls, indexOfClsInThis)
    {
        if (indexOfClsInThis == null || indexOfClsInThis < 0 || indexOfClsInThis >= this.subClasses.length)
            indexOfClsInThis = cls.includedIn(this.subClasses);

        if (indexOfClsInThis == -1)
            return;

        var buff1 = this.subClasses.slice(0, indexOfClsInThis);
        var buff2 = this.subClasses.slice(indexOfClsInThis + 1, this.subClasses.length);

        this.subClasses = [];
        for (var i = 0; i < buff1.length; i++)
            this.subClasses.push(buff1[i]);
        for (var i = 0; i < buff2.length; i++)
            this.subClasses.push(buff2[i]);

        //console.log(this.subClasses);
    },

    copy: function()
    {
        var cls = new CAPTENClass(this.uri);

        for(var i in this)
          if(i != 'id' && i != 'color')
            cls[i] = this[i];
        //cls.id = this.id;
        // cls.properties = this.properties;
        // cls.isBlank = this.isBlank;
        // cls.iName = this.iName;
        // cls.label = this.label;
        // cls.inheritanceArray = this.inheritanceArray;
        // cls.subClassOf = this.subClassOf;
        // cls.subClasses = this.subClasses;

        cls.derivedFrom = this;

        return cls;
    },

    toString: function()
    {
      return this.label;
    },

    blobIt: function()
    {
      return new Blob([new String(JSON.stringify(JSON.decycle(this)))], {type: "application/json"});
    },
    // The JSON stringify does not work since it depends on recusive call
    serializeToJSON: function()
    {
        var ser = {}

        for (var i in this)
        {
          if(i !== "subClassOf" && i !== "subClasses" && i != "properties" && (typeof this[i] !== 'function') && this._isNotObserver(i))
          {
            ser[i] = this._serializationHandlingArray(i, this[i])[i];
          }
          // if(typeof this[i] !== 'function')
          // {
          //     if(this[i] && this[i].serializeToJSON)
          //       ser[i] = this[i].serializeToJSON();
          //     else if (i !== "subClassOf" && i != "subClasses" && i != "properties")
          //       ser[i] = this[i];
          // }
        }

        // console.log(this);

        ser['subClassOf'] = {};
        ser['subClasses'] = {};
        ser['properties'] = {};

        for (var i in this.subClassOf)
        {
          if(this.subClassOf[i])
          {
            ser['subClassOf'][i] = {};
            ser['subClassOf'][i].id = this.subClassOf[i].id;
            ser['subClassOf'][i].uri = this.subClassOf[i].uri;
          }
        }

        for (var i in this.subClasses)
        {
          if(this.subClasses[i])
          {
            ser['subClasses'][i] = {};
            ser['subClasses'][i].id = this.subClasses[i].id;
            ser['subClasses'][i].uri = this.subClasses[i].uri;
          }
        }

        for (var i in this.properties)
        {
          if(this.properties[i])
          {
            ser['properties'][i] = {};
            set['properties'][i].id = this.properties[i].id;
            set['properties'][i].uri = this.properties[i].uri;
          }
        }

        return ser;
    },
    _serializationHandlingArray: function(index, item)
    {
      var ser = {};

      if(item == null)
        return ser[index] = {index: null};

      if(typeof item === "function")
      {
        //NTD
      }
      else if(Array.isArray(item))
      {
        var tmp = {};
        for(var i in item)
        {
          tmp[i] = this._serializationHandlingArray(i, item[i])[i];
        }
        ser[index] = tmp;
      }
      else {
        if(index == "narrativeBlock") //cuting the narrative block here
          ser[index] = item.id;
        else if(item.serializeToJSON)
          ser[index] = item.serializeToJSON();
        else
          ser[index] = item;
      }

      return ser;
    },

    serializeToJSONv2: function()
    {
        var ser = {}

        for (var i in this)
        {
          if(i !== "subClassOf" && i !== "subClasses" && i != "properties" && i != "htmlify" && (typeof this[i] !== 'function') && this._isNotObserver(i))
          {
            ser[i] = this._serializationHandlingArrayv2(i, this[i])[i];
          }
        }

        ser['subClassOf'] = {};
        ser['subClasses'] = {};
        ser['properties'] = {};

        for (var i in this.subClassOf)
        {
          if(this.subClassOf[i])
          {
            ser['subClassOf'][i] = {};
            ser['subClassOf'][i].id = this.subClassOf[i].id;
            ser['subClassOf'][i].uri = this.subClassOf[i].uri;
          }
        }

        for (var i in this.subClasses)
        {
          if(this.subClasses[i])
          {
            ser['subClasses'][i] = {};
            ser['subClasses'][i].id = this.subClasses[i].id;
            ser['subClasses'][i].uri = this.subClasses[i].uri;
          }
        }

        for (var i in this.properties)
        {
          if(this.properties[i])
          {
            ser['properties'][i] = {};
            set['properties'][i].id = this.properties[i].id;
            set['properties'][i].uri = this.properties[i].uri;
          }
        }

        return {cpt:ser};
    },

    _serializationHandlingArrayv2: function(index, item)
    {
      var ser = {};

      if(item == null)
        return ser[index] = {index: null};

      if(typeof item === "function")
      {
        //NTD
      }
      else if(Array.isArray(item))
      {
        var tmp = {};
        for(var i in item)
        {
          tmp[i] = this._serializationHandlingArrayv2(i, item[i])[i];
        }
        ser[index] = tmp;
      }
      else {
        if(index == "narrativeBlock") //cuting the narrative block here
          ser[index] = item.id;
        else if(item.id)
          ser[index] = item.id;
        else
          ser[index] = item;
      }

      return ser;
    },

    _isNotObserver: function(i)
    {
      if(i &&
         (i.includes('observers') ||
          i.includes('observersComputed') ||
          i.includes('observersUnc') ||
          i.includes('observersReset') ||
          i.includes('observersInputs') ||
          i.includes('observersIOPCompositeRelations') ||
          i.includes('observersIOPCompositeOptions')) ||
          i.includes('innerBindingObservers') ||
          i.includes('removedElmtObservers') ||
          i.includes('addedElmtObservers') ||
          i.includes('updatedElmtObservers') ||
          i.includes('thisDeletedObservers') ||
          i.includes('KidentifiedObservers') ||
          i.includes('KdeidentifiedObservers')
        )
        return false;

      return true;
    },

    // === PARSING
    parseJSONObject: function(json, vocab)
    {
        if (json == null)
            return;

        for(var i in json)
        {
          this[i] = json[i];
          }

    },

    updateInheritences: function(vocab)
    {
      var newSCO = [];
      var newSC = [];

      console.log(this);

      for(var i in this.subClassOf)
      {
        vocab.addClass(new CAPTENClass(this.subClassOf[i].uri));
        newSCO.push(vocab.getClassFromURI(this.subClassOf[i].uri));
      }

      for(var i in this.subClasses)
      {
        vocab.addClass(new CAPTENClass(this.subClasses[i].uri));
        newSC.push(vocab.getClassFromURI(this.subClasses[i].uri));
      }

      this.subClassOf = newSCO;
      this.subClasses = newSC;

      console.log(newSCO);
      console.log(newSC);
      console.log(this);

      for(var i in this.subClassOf)
        this.becomesSubClassOf(this.subClassOf[i]);

      for(var i in this.subClasses)
        this.subClasses[i].becomesSubClassOf(this);
    },

    // Retrieve all narrative blocks concerning the elements of the CPT CLasses
    // map: The map to enrich
    mapNarrativeBlock: function(map)
    {
      if(this.narrativeBlock != null)
        this.narrativeBlock.mapNarrativeBlock(map);

      if(this.derivedFrom != null)
        this.derivedFrom.mapNarrativeBlock(map);
    },

    mapIdElementsUsed: function(map)
    {
      if(this.x) //x reprensent the state of the function. If True, somehow the propagation is cyclic and thus it is stopped
        return;
      this.x = true;

      map[this.id] = this.id;

      for(var i in this)
        this._browseThisForMapID(this[i], map);

      this.x = false;
    },
    mapElementsUsed: function(map)
    {
      if(this.x) //x reprensent the state of the function. If True, somehow the propagation is cyclic and thus it is stopped
        return;
      this.x = true;

      map[this.id] = this;

      for(var i in this)
        this._browseThisForMapObj(this[i], map);

      this.x = false;
    },

    _browseThisForMapID: function(obj, map)
    {
      if(obj == null)
        return;
      if(obj instanceof Array)
        for(var i in obj)
          this._browseThisForMapID(obj[i], map);
      else if(obj.mapIdElementsUsed && !IF_MAP_CONTAINS(map, obj.id))
        obj.mapIdElementsUsed(map);
    },
    _browseThisForMapObj: function(obj, map)
    {
      if(obj == null)
        return;
      if(obj instanceof Array)
        for(var i in obj)
          this._browseThisForMapObj(obj[i], map);
      else if(obj.mapElementsUsed && !IF_MAP_CONTAINS(map, obj.id))
        obj.mapElementsUsed(map);
    },
};
