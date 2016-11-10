/**
 * CONTROLLED_VOCABULARY represent the controlled vocabulary used for the expressivity inside SEED.
 * It is constituated by an rdf store representing the ontology existing between the different terms and
 * others elements
 */

function CONTROLLED_VOCABULARY() {
    this.observers = [];

    this.rdfStore = null;

    this.parsingNeeded = false; //A parsing is of the store is needed for updating the classes & properties used
    this.isRecomputeNonBlankNodesNeeded = true;
    this.isRecomputeBlankNodesNeeded = true;

    this.classes = null;
    this.nonBlankNodes = null;
    this.blankNodes = null; // blankNodes = this.classes \ this.nonBlankNodes
    this.properties = null;
    this.unions = null;
    this.intersections = null;
}

CONTROLLED_VOCABULARY.prototype = {

    // === GETTERS ===
    getRDFStore: function() {
        return this.rdfStore;
    },

    getGraph: function(callback) {
        this.rdfStore.graph(function(e, g) {
            callback(g);
        });
    },

    getClasses: function() {
        if (this.isRecomputeNonBlankNodesNeeded) {
            this._recomputeNodes();
        }

        return this.nonBlankNodes;
    },

    /**
     * return all the classes, even the blank nodes
     */
    getAllClasses: function() {
        return this.classes;
    },

    getBlankNodes: function() {
        if (this.isRecomputeBlankNodesNeeded) {
            this._recomputeNodes();
        }

        return this.blankNodes;
    },

    getProperties: function() {
        return this.properties;
    },

    /**
     * Return the URI of all properties stocked after the parsing in an Array of String
     */
    getURIProperties: function() {
        var uris = [];
        for (var index in this.properties) {
            uris.push(this.properties[index].uri);
        }

        console.log(this.properties);
        return uris;
    },

    getRelationsForClass: function(classC) {
        //TODO parser les propriétés et lister toutes celle en relations avec le noeud en question.
        //Prendre en compte les unions
    },
    // ===

    // === SETTERS ===
    setRDFStore: function(store) {
        this.rdfStore = store;
        this.parseClassesAndProperties(function() {
            console.log(this.classes);
            this.notifyChange();
        }.bind(this));
    },
    // ===

    // === OBSERVATION
    registerObserverCallbackOnChange: function(objCallback, callback) {
        this.observers.push([objCallback, callback]);
    },

    // === NOTIFICATION
    notifyChange: function() {
        this.observers.forEach(function(e) {
            console.log(e);
            if (typeof e[1] === "function") {
                e[1].call(e[0]); //e[0] define the `this` context for e[1]
            }
        });
    },

    // ===


    // === METHODS ===

    parseClassesAndProperties: function(callback) {
        this.classes = [];
        this.properties = [];
        this.isRecomputeNonBlankNodesNeeded = true;
        this.isRecomputeBlankNodesNeeded = true;
        //var that = this;

        this.rdfStore.execute("SELECT distinct ?class { ?class <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#Class> }", function(err, results) {
            console.log(err);
            if (!err) {
                // console.log(results);
                results.forEach(function(r) {
                    if (!this.classes.includes(r.class.value))
                        if (!r.class.value.match(/[_].*/))
                            this.classes.push(r.class.value);
                }.bind(this));
            } else {
                console.log(err);
            }


            this.rdfStore.execute("SELECT distinct ?prop ?o { ?prop <http://www.w3.org/2000/01/rdf-schema#domain> ?o }", function(err, results) {
                if (!err) {
                    console.log(results);
                    results.forEach(function(r) {
                        if (!this.classes.includes(r.o.value))
                        // if (!r.o.value.match(/[_].*/))
                            this.classes.push(r.o.value);

                        // if (!this.properties.includes(r.prop.value))
                        //     this.properties.push(r.prop.value);
                        if (this.properties[r.prop.value] == null)
                            this.properties[r.prop.value] = new Property(r.prop.value); //{"uri":r.prop.value};
                        if (this.classes.includes(r.o.value))
                            if (this.properties[r.prop.value].from == null)
                                this.properties[r.prop.value].from = [];
                        this.properties[r.prop.value].from.push(r.o.value);
                    }.bind(this));
                } else {
                    console.log(err);
                }



                this.rdfStore.execute("SELECT distinct * { ?s <http://www.w3.org/2000/01/rdf-schema#range> ?o }", function(err, results) {
                    if (!err) {
                        console.log(results);
                        results.forEach(function(r) {
                            if (!this.classes.includes(r.o.value))
                            // if (!r.o.value.match(/[_].*/))
                                this.classes.push(r.o.value);
                            // if(!this.properties.includes(r.s.value))
                            //   this.properties.push( r.s.value);
                            if (this.properties[r.s.value] == null)
                                this.properties[r.s.value] = new Property(r.s.value); //{"uri":r.s.value};
                            if (this.classes.includes(r.o.value))
                                if (this.properties[r.s.value].to == null)
                                    this.properties[r.s.value].to = [];
                            this.properties[r.s.value].to.push(r.o.value);
                        }.bind(this));
                    } else {
                        console.log(err);
                    }

                    console.log(this.properties);

                    this._solveUnion(function(){

                      callback();
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }.bind(this));

    },

    // ===

    // === SERIALIZATION
      serializeToN3: function()
      {

      },
    // ===

    // === ADDING METHODS
    addClass: function(cl)
    {

    },
    // ===

    addProperty: function(pr)
    {

    },
    // ===

    // === PRIVATE METHODS ===
    _recomputeNodes: function() {
        this.nonBlankNodes = [];
        this.blankNodes = [];

        for (var i = 0; i < this.classes.length; i++) {
            if (!this.classes[i].match(/[_].*/))
                this.nonBlankNodes.push(this.classes[i]);
            else
                this.blankNodes.push(this.classes[i]);
        }

        this.isRecomputeNonBlankNodesNeeded = false;
    },

    _solveUnion: function(callback) {
        this.unionOf = null;
        this.unionOf = [];

        this._retrieveUnion(function(s) {
            for(var i = 0; i < s.length; i++)
            {
              for(var j = 0; j < s[i].length; j++)
              {
                if(this.unionOf[s[i][j].x.value] == null)
                  this.unionOf[s[i][j].x.value] = [];
                this.unionOf[s[i][j].x.value].push(s[i][j].d.value);
              }
            }

            callback();
          }.bind(this));
    },

    _retrieveUnion: function(callback, iteration, solutions) {
        var initialQueryHeader = "SELECT ?x ?d where { ?x <http://www.w3.org/2002/07/owl#unionOf>/";
        var initialQueryTail = "<http://www.w3.org/1999/02/22-rdf-syntax-ns#first> ?d }";
        var rdfRest = "<http://www.w3.org/1999/02/22-rdf-syntax-ns#rest>/";
        var queryVariation = "";

        if (iteration == null)
            iteration = 0;

        if (solutions == null)
            solutions = [];

        for (var i = 0; i < iteration; i++) {
            queryVariation += rdfRest;
        }
        //TODO recursively call this syntax while r still ![] by adding one <http://www.w3.org/1999/02/22-rdf-syntax-ns#rest>/
        //  this.rdfStore.execute( 'PREFIX <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
        //               SELECT ?x ?d where { ?x <http://www.w3.org/2002/07/owl#unionOf>/<http://www.w3.org/1999/02/22-rdf-syntax-ns#rest>/<http://www.w3.org/1999/02/22-rdf-syntax-ns#first> ?d }',
        // this.rdfStore.execute("SELECT * { ?x ?p ?o}",
        this.rdfStore.execute(initialQueryHeader + queryVariation + initialQueryTail,
            function(err, results) {
                if (!err) {
                    if (results.length > 0) {
                        solutions.push(results);
                        this._retrieveUnion(callback, ++iteration, solutions);
                    } else {
                        callback(solutions);
                    }
                }

            }.bind(this));
    },
    // ==
};
