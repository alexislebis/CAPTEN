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
    this.unionOf = null;
    this.intersections = null;

    this.versions = [];//[] of [] : User, usermail, date, comment
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
      serializeToN3: function()//TODO
      {
        var turtleResult = "##### Designed by :\n";

        for(var i = 0; i < this.versions.length; i++)
        {
          turtleResult += "\t# "+ this.versions[i].username +" - "+ this.versions[i].email +" - "+ this.versions[i].comment;
        }

        turtleResult += "\n######################\n#\tCLASSES\n######################\n\n";

        this.nonBlankNodes.forEach(function(n)
        {
            if (n.substr(0, 4).indexOf("http") !== -1)
                turtleResult += "<" + n + "> ";
            else
              turtleResult += ":"+n+" ";

            turtleResult += "<"+TYPE_URI+"> <"+CLASS_URI+"> .\n\n";
        });

        turtleResult += "\n\n######################\n#\tPROPERTIES\n######################\n\n";
        console.log(this);
        for(var k in this.properties){
          var e = this.properties[k];
          //PROPERTY
          if (e.uri.substr(0, 4).indexOf("http") !== -1)
              turtleResult += "<" + e.uri + "> ";
          else
            turtleResult += ":"+e.uri+" ";

          turtleResult += "<"+TYPE_URI+"> <"+PROPERTY_URI+"> ;\n";

            //FROM
            turtleResult += " "+ this._serializePropertyDomainPredicatesToN3(e);
            //TO
            turtleResult += "\n "+ this._serializePropertyRangePredicatesToN3(e);

            turtleResult += '.\n\n';
        }
        turtleResult += "###  Generated by the CAPTEN (version 0.0.1.20161114-0913) https://github.com/alexislebis/CAPTEN"

        return turtleResult;
      },
    // ===

    // === ADDING METHODS
    addClass: function(cl, editionProfil)
    {
      if(editionProfil != null)
        this.versions.push(editionProfil);


      if(!this.classes.includes(cl))
      {
        this.classes.push(cl);

        return true;
      }

      return false;
    },
    // ===

    addProperty: function(pr, editionProfil)
    {
      if(pr.uri == null || pr.to == null || pr.from == null)
        return ;

      if(editionProfil != null)
        this.versions.push(editionProfil);

      //If the property does not exist, need to add it and enriched the class section
      if(!this.properties[pr.uri] == null)
      {
        var res = false;

        for(var i = 0; i < pr.from.length; i++)
          res &= this.addClass(pr.from[i]);
        for(var j = 0; j < pr.from.length; j++)
          res &= this.addClass(pr.to[j]);

        this.properties[pr.uri] = pr;
      }
      else { //otherwise, the property exist and the need is to stack up the class in rray.
        //While the serialization, stacked classes must be transformed in unionOf
        this.properties[pr.uri].from = pr.from;
        this.properties[pr.uri].to = pr.to;
      }

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

    _serializePropertyDomainPredicatesToN3: function(p)
    {
      var buff = "";
      var isUnion = false;

      if(p.from.length > 1)
        isUnion = true;

      for(var i = 0; i < p.from.length; i++)
      {
        if(!p.from[i].match(/[_].*/))//If it is not a blank not
        {
          console.log('notBN');
          if(p.from[i].substr(0,4).indexOf("http") !== -1)
            buff += "<" + p.from[i] + "> \n";
          else
            buff += ":" + p.from[i] + "\n";
        }
        else {
          isUnion = true;
          var nodeUnion = this.unionOf[p.from[i]];

          for(var j = 0; j < nodeUnion.length; j++)
          {
            if(nodeUnion[j].substr(0,4).indexOf("http") !== -1)
              buff += "<" + nodeUnion[j] + "> \n";
            else
              buff += ":" + nodeUnion[j] + "\n";
          }
        }
      }

      if(!isUnion)
      {
        buff[buff.length-2] = " ";
        buff[buff.length-1] = ";";
        return "<"+ DOMAIN_URI +"> " + buff +" ;";
      }
      else
      {
        return "<"+DOMAIN_URI + "> [ <"+ TYPE_URI +"> <"+ CLASS_URI +"> ; \n<"+ UNION_URI + "> ("+ buff +')'+"] ;";
      }
    },

    _serializePropertyRangePredicatesToN3: function(p)
    {
      var buff = "";
      var isUnion = false;

      if(p.to.length > 1)
        isUnion = true;

      for(var i = 0; i < p.to.length; i++)
      {
        if(!p.to[i].match(/[_].*/))//If it is not a blank not
        {
          if(p.to[i].substr(0,4).indexOf("http") !== -1)
            buff += "<" + p.to[i] + "> \n";
          else
            buff += ":" + p.to[i] + "\n";
        }
        else {
          isUnion = true;
          var nodeUnion = this.unionOf[e.to[i]]
          for(var j = 0; j < nodeUnion.length; j++)
          {
            if(nodeUnion[j].substr(0,4).indexOf("http") !== -1)
              buff += "<" + nodeUnion[j] + "> \n";
            else
              buff += ":" + nodeUnion[j] + "\n";
          }
        }
      }

      if(!isUnion)
      {
        buff[buff.length-2] = " ";
        buff[buff.length-1] = ";";
        return "<"+ RANGE_URI +"> "+ buff ;
      }
      else
      {
        return "<"+RANGE_URI + "> [ "+ +"<"+TYPE_URI +"> <"+ CLASS_URI +"> ; \n"+ +"<"+UNION_URI + "> ("+ buff +')'+"] ;";
      }
    },
    // ==
};
