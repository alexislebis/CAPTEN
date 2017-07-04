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
    this.isRecomputeNonBlankNodesNeeded = true;
    this.isRecomputeBlankNodesNeeded = true;

    this.classes = null;
    this.nonBlankNodes = null;
    this.blankNodes = null; // blankNodes = this.classes \ this.nonBlankNodes
    this.properties = null;
    this.unionOf = null;
    this.intersections = null;

    this.versions = []; //[] of [] : User, usermail, date, comment
}

CONTROLLED_VOCABULARY.prototype = {

    // === GETTERS ===
    getRDFStore: function()
    {
        return this.rdfStore;
    },

    getGraph: function(callback)
    {
        this.rdfStore.graph(function(e, g)
        {
            callback(g);
        });
    },

    getClassFromURI: function(uriClass)
    {
      var indice = (new CAPTENClass(uriClass)).includedIn(this.classes);

      console.log(uriClass);
      console.log(indice);

      if(indice == -1)
        return;

      return this.classes[indice];
    },


    getClasses: function()
    {
        if (this.isRecomputeNonBlankNodesNeeded)
        {
            this._recomputeNodes();
        }


        console.log(this.classes);
        console.log(this.nonBlankNodes);
        return this.nonBlankNodes.slice();//cp of the array
    },

    /**
     * return all the classes, even the blank nodes
     */
    getAllClasses: function()
    {
        return this.classes.slice();
    },

    getBlankNodes: function()
    {
        if (this.isRecomputeBlankNodesNeeded)
        {
            this._recomputeNodes();
        }

        return this.blankNodes.slice();
    },

    getProperties: function()
    {
        return this._cloneArrayMap(this.properties);
    },

    getPropertiesArrayed: function() //return the properties, set in a standard array
    {
      var clonedArray = [];

      for(var i in this.properties){
        clonedArray.push(this.properties[i]);
      }

      return clonedArray;
    },

    /**
     * Return the URI of all properties stocked after the parsing in an Array of String
     */
    getURIProperties: function()
    {
        var uris = [];
        for (var index in this.properties)
        {
            uris.push(this.properties[index].uri);
        }

        console.log(this.properties);
        return uris;
    },

    getRelationsForClass: function(classC)
    {
        //TODO parser les propriétés et lister toutes celle en relations avec le noeud en question.
        //Prendre en compte les unions
    },

    getUnionOf: function()
    {
      this._cloneArrayMap(this.unionOf);
    },

    getIntersectionOf: function()
    {
      this._cloneArrayMap(this.intersections);
    },
    // ===

    // === SETTERS ===
    setRDFStore: function(store)
    {
        this.rdfStore = store;
        this.parseClassesAndProperties(function()
        {
            console.log(this.classes);
            this.notifyChange();
        }.bind(this));
    },
    // ===

    // === OBSERVATION
    registerObserverCallbackOnChange: function(objCallback, callback)
    {
        this.observers.push([objCallback, callback]);
    },

    // === NOTIFICATION
    notifyChange: function()
    {
        this.observers.forEach(function(e)
        {
            console.log(e);
            if (typeof e[1] === "function")
            {
                e[1].call(e[0]); //e[0] define the `this` context for e[1]
            }
        });
    },

    // ===


    // === METHODS ===

    /**
     * Check if the vocab this contains the class identified by the uri uri in its this.classes
     *
     * return -1 if uri is not found, otherwise the index
     */
    classesContain: function(uriClass)
    {
      console.log("WARNING CALL!! COPY OF THE DETECTED CLASS");
        return (new CAPTENClass(uriClass)).includedIn(this.classes);
    },

    parseClassesAndProperties: function(callback)
    {
        this.classes = [];
        this.properties = [];
        this.isRecomputeNonBlankNodesNeeded = true;
        this.isRecomputeBlankNodesNeeded = true;
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
                            this.classes[r.class.value] = new CAPTENClass(r.class.value, r.class.value);
                }.bind(this));
            }
            else
            {
                console.log(err);
            }


            this.rdfStore.execute("SELECT distinct ?prop ?o { ?prop <http://www.w3.org/2000/01/rdf-schema#domain> ?o }", function(err, results)
            {
                if (!err)
                {
                    console.log(results);
                    results.forEach(function(r)
                    {
                        if (this.classes[r.o.value] == null)
                            this.classes[r.o.value] = new CAPTENClass(r.o.value, r.o.value);

                        // if (!this.properties.includes(r.prop.value))
                        //     this.properties.push(r.prop.value);
                        if (this.properties[r.prop.value] == null)
                            this.properties[r.prop.value] = PROPERTIES_POOL.create(r.prop.value, r.prop.value); //{"uri":r.prop.value};
                        if (this.classes[r.o.value] != null)
                            if (this.properties[r.prop.value].from == null)
                                this.properties[r.prop.value].from = [];
                        this.properties[r.prop.value].from.push(new CAPTENClass(r.o.value, r.o.value));
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
                            if (this.classes[r.o.value] == null)
                                this.classes[r.o.value] = new CAPTENClass(r.o.value, r.o.value);
                            // if(!this.properties.includes(r.s.value))
                            //   this.properties.push( r.s.value);
                            if (this.properties[r.s.value] == null)
                                this.properties[r.s.value] = PROPERTIES_POOL.create(r.s.value, r.s.value); //{"uri":r.s.value};
                            if (this.classes[r.o.value] != null)
                                if (this.properties[r.s.value].to == null)
                                    this.properties[r.s.value].to = [];
                            this.properties[r.s.value].to.push(new CAPTENClass(r.o.value, r.o.value));
                        }.bind(this));
                    }
                    else
                    {
                        console.log(err);
                    }

                    this.rdfStore.execute("SELECT distinct *{ ?s <http://www.w3.org/2000/01/rdf-schema#subClassOf> ?o }", function(err, results)
                    {
                        if (!err)
                        {
                            results.forEach(function(r)
                            {
                                if (this.classes[r.s.value] != null && this.classes[r.o.value] != null)
                                {
                                    this.classes[r.s.value].becomesSubClassOf(this.classes[r.o.value]);
                                }
                            }.bind(this));

                        }
                        else
                        {
                            console.log(err);
                        }

                        this._solveUnion(function()
                        {

                            callback();
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }.bind(this));

    },

    // ===

    // === SERIALIZATION
    serializeToN3: function() //TODO
        {
            this._recomputeNodes();

            console.log(this);

            var turtleResult = "##### Designed by :\n";

            for (var i = 0; i < this.versions.length; i++)
            {
                turtleResult += "\t# " + this.versions[i].username + " - " + this.versions[i].email + " - " + this.versions[i].comment;
            }

              turtleResult += "######################\n#\tPREFIXES\n######################\n\n"+ "@prefix : <"+CUSTOM_PREFIX_URI /*+this.pname*/+"#> .\n\n\n";

            turtleResult += "\n######################\n#\tCLASSES\n######################\n\n";

            console.log(this.nonBlankNodes);
            this.nonBlankNodes.forEach(function(n)
            {
                if (n.uri.substr(0, 4).indexOf("http") !== -1)
                    turtleResult += "<" + n.uri + "> ";
                else
                    turtleResult += ":" + n.uri + " ";

                turtleResult += "<" + TYPE_URI + "> <" + CLASS_URI + ">"

                if (n.subClassOf.length > 0)
                {
                  turtleResult += " ;\n";
                  var buffer = "";

                  for(var i in n.subClassOf)
                  {
                    if (n.subClassOf[i].uri.substr(0, 4).indexOf("http") !== -1)
                        buffer += "<" + n.subClassOf[i].uri + "> ";
                    else
                        buffer += ":" + n.subClassOf[i].uri + " ";

                    buffer += ", ";
                  }

                  buffer = buffer.substr(0,buffer.length-2); //removing the last coma

                  turtleResult += "<"+SUBCLASS_URI+"> " + buffer;
                }

                turtleResult += " .\n\n";
            });

            turtleResult += "\n\n######################\n#\tPROPERTIES\n######################\n\n";
            console.log(this);
            for (var k in this.properties)
            {
                var e = this.properties[k];
                //PROPERTY
                if (e.uri.substr(0, 4).indexOf("http") !== -1)
                    turtleResult += "<" + e.uri + "> ";
                else
                    turtleResult += ":" + e.uri + " ";

                turtleResult += "<" + TYPE_URI + "> <" + PROPERTY_URI + "> ;\n";

                //FROM
                turtleResult += " " + this._serializePropertyDomainPredicatesToN3(e);
                //TO
                turtleResult += "\n " + this._serializePropertyRangePredicatesToN3(e);

                turtleResult += '.\n\n';
            }
            turtleResult += "###  Generated by the CAPTEN (version 0.0.1.20161114-0913) https://github.com/alexislebis/CAPTEN"

            return turtleResult;
        },
    // ===

    // === ADDING METHODS
    addClass: function(cl, editionProfil)//Edition profil : who add the classes
    {
        if(this.classes == null)
          this.classes = [];

        this.isRecomputeNonBlankNodesNeeded = true;
        this.isRecomputeBlankNodesNeeded = true;

        if (editionProfil != null)
            this.versions.push(editionProfil);


        if (cl.includedIn(this.classes) == -1)
        {
            this.classes.push(cl);

            return true;
        }

        return false;
    },
    // ===

    addProperty: function(pr, editionProfil)
    {
        if(this.properties == null)
          this.properties = [];

        this.isRecomputeNonBlankNodesNeeded = true;
        this.isRecomputeBlankNodesNeeded = true;

        console.log(pr);
        console.log(this.properties);

        if (pr.uri == null || pr.to == null || pr.from == null)
            return;

        if (editionProfil != null)
            this.versions.push(editionProfil);

        //If the property does not exist, need to add it and enriched the class section
        if (this.properties[pr.uri] == null)
        {
            var res = false;

            for (var i = 0; i < pr.from.length; i++)
                res &= this.addClass(pr.from[i]);
            for (var j = 0; j < pr.from.length; j++)
                res &= this.addClass(pr.to[j]);

            this.properties[pr.uri] = pr;
        }
        else
        { //otherwise, the property exist and the need is to stack up the class in rray.
            //While the serialization, stacked classes must be transformed in unionOf
            this.properties[pr.uri].from.concat(pr.from);
            this.properties[pr.uri].to.concat(pr.to);
        }

    },
    // ===

    // === PRIVATE METHODS ===
    _recomputeNodes: function()
    {
        this.nonBlankNodes = [];
        this.blankNodes = [];

        var v = 0;

        for (var i in this.classes)
        {
            if (this.classes[i].isBlank)
                this.blankNodes.push(this.classes[i]);
            else{
                this.nonBlankNodes.push(this.classes[i]);
              }
        }

        this.isRecomputeNonBlankNodesNeeded = false;
        this.isRecomputeBlankNodesNeeded = false;
    },

    _solveUnion: function(callback)
    {
        this.unionOf = null;
        this.unionOf = [];

        this._retrieveUnion(function(s)
        {
            for (var i = 0; i < s.length; i++)
            {
                for (var j = 0; j < s[i].length; j++)
                {
                    if (this.unionOf[s[i][j].x.value] == null)
                        this.unionOf[s[i][j].x.value] = [];
                    this.unionOf[s[i][j].x.value].push(new CAPTENClass(s[i][j].d.value, s[i][j].d.value));
                }
            }

            callback();
        }.bind(this));
    },

    _retrieveUnion: function(callback, iteration, solutions)
    {
        var initialQueryHeader = "SELECT ?x ?d where { ?x <http://www.w3.org/2002/07/owl#unionOf>/";
        var initialQueryTail = "<http://www.w3.org/1999/02/22-rdf-syntax-ns#first> ?d }";
        var rdfRest = "<http://www.w3.org/1999/02/22-rdf-syntax-ns#rest>/";
        var queryVariation = "";

        if (iteration == null)
            iteration = 0;

        if (solutions == null)
            solutions = [];

        for (var i = 0; i < iteration; i++)
        {
            queryVariation += rdfRest;
        }
        //TODO recursively call this syntax while r still ![] by adding one <http://www.w3.org/1999/02/22-rdf-syntax-ns#rest>/
        //  this.rdfStore.execute( 'PREFIX <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
        //               SELECT ?x ?d where { ?x <http://www.w3.org/2002/07/owl#unionOf>/<http://www.w3.org/1999/02/22-rdf-syntax-ns#rest>/<http://www.w3.org/1999/02/22-rdf-syntax-ns#first> ?d }',
        // this.rdfStore.execute("SELECT * { ?x ?p ?o}",
        this.rdfStore.execute(initialQueryHeader + queryVariation + initialQueryTail,
            function(err, results)
            {
                if (!err)
                {
                    if (results.length > 0)
                    {
                        solutions.push(results);
                        this._retrieveUnion(callback, ++iteration, solutions);
                    }
                    else
                    {
                        callback(solutions);
                    }
                }

            }.bind(this));
    },

    _serializePropertyDomainPredicatesToN3: function(p)
    {
        var buff = "";
        var isUnion = false;

        if (p.from.length > 1)
            isUnion = true;

        for (var i = 0; i < p.from.length; i++)
        {
            if (!p.from[i].isBlank) //If it is not a blank not
            {
                console.log(p.from[i]);
                if (p.from[i].uri.substr(0, 4).indexOf("http") !== -1)
                    buff += "<" + p.from[i].uri + "> \n";
                else
                    buff += ":" + p.from[i].uri + "\n";
            }
            else
            {
                isUnion = true;
                var nodeUnion = this.unionOf[p.from[i].uri];

                for (var j = 0; j < nodeUnion.length; j++)
                {
                    if (nodeUnion[j].uri.substr(0, 4).indexOf("http") !== -1)
                        buff += "<" + nodeUnion[j].uri + "> \n";
                    else
                        buff += ":" + nodeUnion[j].uri + "\n";
                }
            }
        }

        if (!isUnion)
        {
            buff[buff.length - 2] = " ";
            buff[buff.length - 1] = ";";
            return "<" + DOMAIN_URI + "> " + buff + " ;";
        }
        else
        {
            return "<" + DOMAIN_URI + "> [ <" + TYPE_URI + "> <" + CLASS_URI + "> ; \n<" + UNION_URI + "> (" + buff + ')' + "] ;";
        }
    },

    _serializePropertyRangePredicatesToN3: function(p)
    {
        var buff = "";
        var isUnion = false;

        if (p.to.length > 1)
            isUnion = true;

        for (var i = 0; i < p.to.length; i++)
        {
            if (!p.to[i].isBlank) //If it is not a blank not
            {
                if (p.to[i].uri.substr(0, 4).indexOf("http") !== -1)
                    buff += "<" + p.to[i].uri + "> \n";
                else
                    buff += ":" + p.to[i].uri + "\n";
            }
            else
            {
                isUnion = true;
                var nodeUnion = this.unionOf[e.to[i].uri]
                for (var j = 0; j < nodeUnion.length; j++)
                {
                    if (nodeUnion[j].uri.substr(0, 4).indexOf("http") !== -1)
                        buff += "<" + nodeUnion[j].uri + "> \n";
                    else
                        buff += ":" + nodeUnion[j].uri + "\n";
                }
            }
        }

        if (!isUnion)
        {
            buff[buff.length - 2] = " ";
            buff[buff.length - 1] = ";";
            return "<" + RANGE_URI + "> " + buff;
        }
        else
        {
            return "<" + RANGE_URI + "> [ " + +"<" + TYPE_URI + "> <" + CLASS_URI + "> ; \n" + +"<" + UNION_URI + "> (" + buff + ')' + "] ;";
        }
    },

    // ===

    // === CLONING METHODS
    clone: function()
    {
        var vc = new CONTROLLED_VOCABULARY();

        vc.classes = this._cloneArrayMap(this.classes);
        vc.properties = this.getProperties();
        vc.unionOf = this._cloneArrayMap(this.unionOf);
        vc.intersections = this._cloneArrayMap(this.intersections);

        return vc;
    },

    _cloneArrayMap: function(arrayMap)
    {
      var clonedArray = [];

      for(var i in arrayMap){
        clonedArray[i] = arrayMap[i];
      }

      return clonedArray;
    },

    _cloneProperties: function()
    {
      var clonedProps = [];

      for(var i in this.properties)
        clonedProps[i] = this.properties[i];

      return clonedProps;
    },
    // ==
};
