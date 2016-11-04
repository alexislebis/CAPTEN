/**
 * CONTROLLED_VOCABULARY represent the controlled vocabulary used for the expressivity inside SEED.
 * It is constituated by an rdf store representing the ontology existing between the different terms and
 * others elements
 */

 function CONTROLLED_VOCABULARY()
 {
   this.observers = [];

   this.rdfStore = null;

   this.parsingNeeded = false; //A parsing is of the store is needed for updating the classes & properties used

   this.classes = null;
   this.properties = null;
 }

 CONTROLLED_VOCABULARY.prototype = {

 // === GETTERS ===
  getRDFStore: function()
  {
    return this.rdfStore;
  },

  getGraph: function(callback)
  {
    this.rdfStore.graph(function(e, g){
      callback(g);
    });
  },

  getClasses: function()
  {
    return this.classes;
  },

  getProperties: function()
  {
    return this.properties;
  },
 // ===

 // === SETTERS ===
  setRDFStore: function(store)
  {
    this.rdfStore = store;
    this.parseClassesAndProperties(function(){
      console.log(this.classes);
      this.notifyChange();
    }.bind(this));
  },
 // ===

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

 // ===


 // === METHODS ===
  parseClassesAndProperties: function(callback)
  {
        this.classes = [];
        this.properties = [];
        //var that = this;

        this.rdfStore.execute("SELECT distinct ?class { ?class <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#Class> }", function(err, results)
        {
          console.log(err);
            if (!err)
            {
                // console.log(results);
                results.forEach(function(r)
                {
                    if (!this.classes.includes(r.class.value))
                        if (!r.class.value.match(/[_].*/))
                            this.classes.push(r.class.value);
                }.bind(this));
            }
            else
            {
                console.log(err);
            }


        this.rdfStore.execute("SELECT distinct ?prop { ?prop <http://www.w3.org/2000/01/rdf-schema#domain> ?osef }", function(err, results)
        {
            if (!err)
            {
                console.log(results);
                results.forEach(function(r)
                {
                    if (!this.classes.includes(r.prop.value))
                        this.properties.push(r.prop.value);
                }.bind(this));
            }
            else
            {
                console.log(err);
            }



        this.rdfStore.execute("SELECT distinct * { ?s <http://www.w3.org/2000/01/rdf-schema#range> ?o }", function(err, results)
        {
            if (!err)
            {
                console.log(results);
                results.forEach(function(r)
                {
                    if (!this.classes.includes(r.o.value))
                      if (!r.o.value.match(/[_].*/))
                        this.classes.push(r.o.value);
                    if(!this.properties.includes(r.s.value))
                      this.properties.push( r.s.value);
                }.bind(this));
            }
            else
            {
                console.log(err);
            }
            callback();
              }.bind(this));
            }.bind(this));
        }.bind(this));

  },
 // ===

 };
