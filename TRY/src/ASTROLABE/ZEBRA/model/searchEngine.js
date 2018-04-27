function searchEngine(dimensions)
{
  this.NEED = NEED_KERNEL;

  this.dimensions = dimensions;
  this.mutex = false;
}

searchEngine.prototype.execute = function(dimensions)
{
  return new Promise(
    async function(resolve, reject)
    {
      console.error("Important info: OWL:equivalentProperty not handled currently");
      if(this.mutex)
        return;

      if(!HYLAR_HANDLER.isReady())
        return;

      this.mutex = true;

      this.dimensions = dimensions;

      var needRes;

      // ===============================================================
      // ==================         TEST        ========================
      // ===============================================================

      var need = [];

      // === TEST 1 : find smth working on Question Defaillante
        // var t1c1 = new CAPTENClass();
        // var t1c2 = new CAPTENClass();
        // t1c1.uri = "http://www.CAPTEN.org/SEED/ontologies/custom/Proportion_de_Succes";
        // t1c2.uri = "http://www.CAPTEN.org/SEED/ontologies/custom/QCM";
        //
        // need.push(t1c1);
        // need.push(t1c2);

      // === TEST 2 : Find an NarratedAnalysisProcess aiming to categorise a Apprenant (student)
        var cl = new CAPTENClass();
        cl.uri = "http://www.CAPTEN.org/SEED/ontologies/custom/Etudiant";
        var rel2 = new Property();
        rel2.uri = "http://www.CAPTEN.org/SEED/ontologies/custom/categorise";
        rel2.from = ANALYSIS_URI;
        rel2.to = "http://www.CAPTEN.org/SEED/ontologies/custom/Etudiant";
        need.push(cl);
        need.push(rel2);

      // === TEST 3 : Find a NarratedAnalysisProcess aiming to discover parcours made by students, where the parcours is supposed to be a pattern
        // var t3r1 = new Property();
        // var t3r2 = new Property();
        // var t3r3 = new Property();
        //
        // t3r1.uri = "http://www.CAPTEN.org/SEED/ontologies/custom/decouvre";
        // t3r2.uri = "http://www.CAPTEN.org/SEED/ontologies/custom/faitPar";
        // t3r3.uri = "http://www.CAPTEN.org/SEED/ontologies/custom/assimilableA";
        //
        // t3r1.from = ANALYSIS_URI;
        // t3r2.from = "http://www.CAPTEN.org/SEED/ontologies/custom/Parcours";
        // t3r3.from = "http://www.CAPTEN.org/SEED/ontologies/custom/Parcours";
        //
        // t3r1.to = "http://www.CAPTEN.org/SEED/ontologies/custom/Parcours";
        // t3r2.to = "http://www.CAPTEN.org/SEED/ontologies/custom/Apprenant";
        // t3r3.to = "http://www.CAPTEN.org/SEED/ontologies/custom/Pattern";
        //
        // SEARCH_ENGINE.TMP_SIMILARITY_INFO_REDO = "The property: http://www.CAPTEN.org/SEED/ontologies/custom/assimilableA is a special one. It implies similarity check between "+t3r3.from+" and "+t3r3.to + "<br/> Adding a property : ANALYSIS_URI http://www.CAPTEN.org/SEED/ontologies/custom/decouvre http://www.CAPTEN.org/SEED/ontologies/custom/Pattern" ;
        // console.log("The property: <http://www.CAPTEN.org/SEED/ontologies/custom/assimilableA> is a special one. It implies similarity check between "+t3r3.from+" and "+t3r3.to);
        // console.log("Adding a property : ANALYSIS_URI http://www.CAPTEN.org/SEED/ontologies/custom/decouvre http://www.CAPTEN.org/SEED/ontologies/custom/Pattern");
        // t3r4 = new Property();
        // t3r4.uri = "http://www.CAPTEN.org/SEED/ontologies/custom/decouvre";
        // t3r4.from = ANALYSIS_URI;
        // t3r4.to = "http://www.CAPTEN.org/SEED/ontologies/custom/Pattern";
        //
        // need.push(t3r1); need.push(t3r2); need.push(t3r3); need.push(t3r4);

        this.dimensions['need'] = need;
      console.log("==END TEST");

      // ===============================================================
      // ==============         END TEST        ========================
      // ===============================================================


      //Below all access is mutexed. No double call can be made
      if(this.dimensions && this.dimensions['need'])
        needRes = this.NEED.search(this.dimensions['need']);



      // == END OF MUTEX
      this.mutex = false;

      resolve(needRes);//TODO remplace avec data
    }.bind(this)
  );
}

// sort by looking type. Result array is the result from a querry handled
//by HYLAR_HANDLER.query and sourceID represent what has to be tested (such as ?source ).
//return an array containing two array: one a mapped sorting of result according to sourceID, other the direct results
searchEngine.prototype._sortingByType = async function(resultArray, sourceID)
{
  return new Promise(
    async function(resolve, reject)
    {
      if(!resultArray || resultArray.length <= 0)
      {
        let a = []; a.push([]); a.push([]);
        resolve(a);
      }

      var headQuery = "SELECT ?type WHERE {<";
      var tailQuery = "> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?type .}";
      var queries = [];
      var results = [];

      for(var i in resultArray)
      {
        if(resultArray[i][sourceID])
        {
          var tmp = await HYLAR_HANDLER.promiseToQueryOnto(headQuery+resultArray[i][sourceID].value+tailQuery);

          for(var j in tmp)
          {
            tmp[j][sourceID] = resultArray[i][sourceID];
            results.push(tmp[j]);
          }
        }
          // queries.push(headQuery+resultArray[i][sourceID].value+tailQuery);
      }

      // MAPPING
      var map = [];
      for(var i in results)
      {
        if(!map[results[i][sourceID].value])
          map[results[i][sourceID].value] = [];

        for(var j in results[i])
        {
          if(results[i][j].value != results[i][sourceID].value)
          {
            //Prevent duplicata during insertion
            var alreadyExist = false;
            for(var k in map[results[i][sourceID].value])
            {
              if(map[results[i][sourceID].value][k] == results[i][j].value)
                alreadyExist = true;

              if(alreadyExist)
                break;
            }
            if(!alreadyExist)
              map[results[i][sourceID].value].push(results[i][j].value);
          }
        }
      }

      var endResults = []; endResults.push(map); endResults.push(results);

      // HYLAR_HANDLER.cascadingQueryOnto(queries, [], [this, this._testCascading]);
      resolve(endResults);
    }
  )
}

// === SEARCH
  //token is either a term or a prop
  //iif a relation (i.e. property). range determine which patterns should be executed
  searchEngine.prototype._searchKernel = async function(elmtSearched, token, range)
  {
    return new Promise(
      async function(resolve, reject)
      {
        var res = [];

        if(!elmtSearched)
        { console.error("unknown element"); resolve(res);}
        if(!token)
        { console.error("token is null"); resolve(res);}

        var specificOntologicalDeferencerFunc = null;

        switch (elmtSearched) {
          case OBJECTIVE_URI:
            specificOntologicalDeferencerFunc = SEARCH_ENGINE.ontologicalDeferencing.objective;
            break;
          case NAME_URI:
            specificOntologicalDeferencerFunc = SEARCH_ENGINE.ontologicalDeferencing.name;
            break;
          case RGTE_URI:
            specificOntologicalDeferencerFunc = SEARCH_ENGINE.ontologicalDeferencing.graph;
            break;
          case ADDENDUM_URI:
            specificOntologicalDeferencerFunc = SEARCH_ENGINE.ontologicalDeferencing.addendum;
            break;
          case KNOWLEDGE_URI:
            specificOntologicalDeferencerFunc = SEARCH_ENGINE.ontologicalDeferencing.knowledge;
            break;
          case K_GENERATED_BY_URI:
            specificOntologicalDeferencerFunc = SEARCH_ENGINE.ontologicalDeferencing.generatedKnowledge;
            break;
          case OUTPUT_PATTERN_URI:
            specificOntologicalDeferencerFunc = SEARCH_ENGINE.ontologicalDeferencing.outputPattern;
            break;
          default:
            console.error("unknown element");
            resolve(res);
        }

        if(token instanceof CAPTENClass)
        {
          var query = SEARCH_ENGINE.queryPatternBuilder.term.perfectMatching(token.getIRI(), "x", specificOntologicalDeferencerFunc.termReady());
          var tmp = await HYLAR_HANDLER.promiseToQueryOnto(query);
          res.push({set: "term", pattern: "perfectMatching", query: query, answer: tmp, symbols: specificOntologicalDeferencerFunc.getCorrespondance()});
        }
        else if(token instanceof Property)
        {
          var query;
          var tmp;
          var specificBuilderPattern;
          var pattern;

          // == checking if range exist
          if(!range || range.length == 0)
            {range = []; range.push(0);}

          for(var i = 0; i < range.length; i++)
          {
            switch (range[i]) {
              case 0://Perfect matching
                specificBuilderPattern = SEARCH_ENGINE.queryPatternBuilder.relation.perfectMatching;
                pattern = "perfectMatching";
                break;
              case 1:
                specificBuilderPattern = SEARCH_ENGINE.queryPatternBuilder.relation.prefixMatching;
                pattern = "prefixMatching";
                break;
              case 2:
                specificBuilderPattern = SEARCH_ENGINE.queryPatternBuilder.relation.reversePrefixMatching;
                pattern = "reversePrefixMatching";
                break;
              case 3:
                specificBuilderPattern = SEARCH_ENGINE.queryPatternBuilder.relation.sufixMatching;
                pattern = "sufixMatching";
                break;
              case 4:
                specificBuilderPattern = SEARCH_ENGINE.queryPatternBuilder.relation.reverseSufixMatching;
                pattern = "reverseSufixMatching";
                break;
              case 5:
                specificBuilderPattern = SEARCH_ENGINE.queryPatternBuilder.relation.looseMatching;
                pattern = "looseMatching";
                break;
              case 6:
                specificBuilderPattern = SEARCH_ENGINE.queryPatternBuilder.relation.doubleTermMatching;
                pattern = "doubleTermMatching";
                break;
              case 7:
                specificBuilderPattern = SEARCH_ENGINE.queryPatternBuilder.relation.monoPrefixMatching;
                pattern = "monoPrefixMatching";
                break;
              case 8:
                specificBuilderPattern = SEARCH_ENGINE.queryPatternBuilder.relation.monoSufixMatching;
                pattern = "monoSufixMatching";
                break;
              default:
                console.error("range unknown, aborting the whole procedure");
                resolve(res);
            }

            query = specificBuilderPattern(token.getURI(), token.from, token.to, "x", "y", specificOntologicalDeferencerFunc.relationReady());
            tmp = await HYLAR_HANDLER.promiseToQueryOnto(query);
            res.push({set: "relation", pattern: pattern, query: query, answer: tmp, symbols: specificOntologicalDeferencerFunc.getCorrespondance()});
          }
        }
        else
        {
          console.error("unrecognized token");
          resolve(res);
        }
        resolve(res);
      });
  }

  searchEngine.prototype.computeScore = function(toDEFINE)
  {
    //For each dimension
    /*
    *  for each token
    *    getMatrix
    *    getTokenPonderation
    *    getMatrixPonderationDimension
    */
  }

  searchEngine.prototype.searchObjective = function(token, range)
  {
    return this._searchKernel(OBJECTIVE_URI, token, range);
  }

  searchEngine.prototype.searchName = function(token, range)
  {
    return this._searchKernel(NAME_URI, token, range);
  }

  searchEngine.prototype.searchRgte = function(token, range)
  {
    return this._searchKernel(RGTE_URI, token, range);
  }

  searchEngine.prototype.searchAddendum = function(token, range)
  {
    return this._searchKernel(ADDENDUM_URI, token,range);
  }

  searchEngine.prototype.searchKnowledge = function(token, range)
  {
    return this._searchKernel(KNOWLEDGE_URI, token, range);
  }

  searchEngine.prototype.searchOnlyProducedKnowledge = function(token, range)
  {
    return this._searchKernel(K_GENERATED_BY_URI, token, range);
  }

  searchEngine.prototype.searchOutputBehavior = function(token, range)
  {
    return this._searchKernel(OUTPUT_PATTERN_URI, token, range);
  }

// === RGTE Search


searchEngine.prototype.queryPatternBuilder = new sparqlQueryCommonBehaviorBuilder();
searchEngine.prototype.ontologicalDeferencing = new ontologicalDeferencing();
searchEngine.prototype.TMP_SIMILARITY_INFO_REDO = "";

var SEARCH_ENGINE = new searchEngine();
