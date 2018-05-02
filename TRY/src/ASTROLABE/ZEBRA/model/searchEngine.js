function searchEngine(dimensions)
{
  this.NEED = NEED_KERNEL;
  this.CONTEXT = CONTEXT_KERNEL;

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

      var needRes = [];


      //Below all access is mutexed. No double call can be made
      if(this.dimensions && this.dimensions['need'])
      {
        needRes['dimensions'] = []; needRes['dimensions']['objective'] = [];
        // needRes['dimensions']['objective']['result'] = await this.NEED.search(this.dimensions['need']);
        needRes['dimensions']['objective']['result'] = await this.NEED.search(this.dimensions['need']);
        needRes['dimensions']['objective']['tokens'] = this.dimensions['need'];
      }

      if(this.dimensions && this.dimensions['context'])
      {
        if(!needRes['dimensions'])
          needRes['dimensions'] = [];

        needRes['dimensions']['context'] = [];

        needRes['dimensions']['context']['result'] = await this.CONTEXT.search(this.dimensions['context']);
        needRes['dimensions']['context']['tokens'] = this.dimensions['context'];
      }

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
          case CONTEXT_URI:
            specificOntologicalDeferencerFunc = SEARCH_ENGINE.ontologicalDeferencing.context;
            break;
          case INPUT_URI:
            specificOntologicalDeferencerFunc = SEARCH_ENGINE.ontologicalDeferencing.input;
            break;
          case INPUT_PATTERN_URI:
            specificOntologicalDeferencerFunc = SEARCH_ENGINE.ontologicalDeferencing.inputPattern;
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
              case TOKEN_QUERY_PATTERN_VALUE.PERFECT://Perfect matching
                specificBuilderPattern = SEARCH_ENGINE.queryPatternBuilder.relation.perfectMatching;
                pattern = "perfectMatching";
                break;
              case TOKEN_QUERY_PATTERN_VALUE.PREFIX:
                specificBuilderPattern = SEARCH_ENGINE.queryPatternBuilder.relation.prefixMatching;
                pattern = "prefixMatching";
                break;
              case TOKEN_QUERY_PATTERN_VALUE.REVERSE_PREFIX:
                specificBuilderPattern = SEARCH_ENGINE.queryPatternBuilder.relation.reversePrefixMatching;
                pattern = "reversePrefixMatching";
                break;
              case TOKEN_QUERY_PATTERN_VALUE.SUFIX:
                specificBuilderPattern = SEARCH_ENGINE.queryPatternBuilder.relation.sufixMatching;
                pattern = "sufixMatching";
                break;
              case TOKEN_QUERY_PATTERN_VALUE.REVERSE_SUFIX:
                specificBuilderPattern = SEARCH_ENGINE.queryPatternBuilder.relation.reverseSufixMatching;
                pattern = "reverseSufixMatching";
                break;
              case TOKEN_QUERY_PATTERN_VALUE.LOOSE:
                specificBuilderPattern = SEARCH_ENGINE.queryPatternBuilder.relation.looseMatching;
                pattern = "looseMatching";
                break;
              case TOKEN_QUERY_PATTERN_VALUE.DBL_TERMS:
                specificBuilderPattern = SEARCH_ENGINE.queryPatternBuilder.relation.doubleTermMatching;
                pattern = "doubleTermMatching";
                break;
              case TOKEN_QUERY_PATTERN_VALUE.MONO_PREFIX:
                specificBuilderPattern = SEARCH_ENGINE.queryPatternBuilder.relation.monoPrefixMatching;
                pattern = "monoPrefixMatching";
                break;
              case TOKEN_QUERY_PATTERN_VALUE.MONO_SUFIX:
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

  searchEngine.prototype.searchContext = function(token, range)
  {
      return this._searchKernel(CONTEXT_URI, token, range);
  }

  searchEngine.prototype.searchInput = function(token, range)
  {
    return this._searchKernel(INPUT_URI, token, range);
  }

  searchEngine.prototype.searchInputBehavior = function(token, range)
  {
    return this._searchKernel(INPUT_PATTERN_URI, token, range);
  }

// === RGTE Search


searchEngine.prototype.queryPatternBuilder = new sparqlQueryCommonBehaviorBuilder();
searchEngine.prototype.ontologicalDeferencing = new ontologicalDeferencing();
searchEngine.prototype.TMP_SIMILARITY_INFO_REDO = "";

var SEARCH_ENGINE = new searchEngine();
