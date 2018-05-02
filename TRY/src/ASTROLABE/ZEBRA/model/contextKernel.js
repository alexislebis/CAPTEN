// SEARCH KERNEL (like this one) should not be called alone, but always with
// a searchEngine call.

// contextKernel STAND FOR Context kernel after name revision of v0.0.4

function contextKernel()
{
  this.currentContext = null;//extstring ?
  this.resultOrganizer = [];
}

contextKernel.prototype.setContext = function(context)
{
  this.currentContex= context;
}

contextKernel.prototype.search = async function(context)
{
  if(context)
    this.context = context

  var res = await this._searchContext(this.context);

  return res;
}

contextKernel.prototype._searchContext = async function(context)
{
  return new Promise(
    async function(resolve, reject)
    {
      if(!context)
        return null;

      // == Querying
        /**
         * Elements queried by default are :
         * 1) Context
         * 2) Input graph of analysis
         * 3) Name
         */
      var token;
      var pattern;
      var res = [];
      var tmp;

      console.log("Querying onto for each token...");
      for(var i = 0; i < context.length; i++)
      {
        console.log("TOKEN:"+i);
        token = context[i].token;
        pattern = context[i].queryPattern;
        res[i] = [{token: token}];
        console.log("INFORMATION: Only perfect search for the moment");
        // res[i]["K"] = await SEARCH_ENGINE.searchKnowledge(token,[pattern]);//, [0,3]);//, [0,1,5]));
        // res[i]["O"] = await SEARCH_ENGINE.searchObjective(token,[pattern]);//, [0,1,5]));
        res[i]["C"] = await SEARCH_ENGINE.searchContext(token, [pattern]);
        res[i]["N"] = await SEARCH_ENGINE.searchName(token,[pattern]);//, [0,3]);//, [0,1,5]));
        res[i]["I"] = await SEARCH_ENGINE.searchInput(token, [pattern]);
        res[i]["IB"] = await SEARCH_ENGINE.searchInputBehavior(token, [pattern]);
        // res[i]["B"] = await SEARCH_ENGINE.searchOutputBehavior(token,[pattern]);//, [0,1,5]));
        // res[i]["A"] = await SEARCH_ENGINE.searchAddendum(token,[pattern]);//, [0,1,5]));
        // res[i]["G"] = await SEARCH_ENGINE.searchRgte(token,[pattern]);//, [0,1,5]));
      }
      console.log("...done.");

      console.log("Resolving origins for results");

      var origins = await this.resolveOriginFromResults(res);

      console.log("...done.");
      console.log(origins);
      //console.log(await SEARCH_ENGINE.ontologicalDeferencing.knowledge.resolveOrigin(res[i][1][1]));
      console.log(res);

      console.log(this.computeParentRelevancy(origins));
      resolve(this.establishingParentRevelancy(origins));
    }.bind(this)
  );
}

contextKernel.prototype.resolveOriginFromResults = async function(res)
{
  return new Promise(
    async function(resolve, reject)
    {
      if(!res)
        {resolve([]);return res;}

      var origins = [];
      for(var i in res)//each token
      {
        origins[i]= [];
        origins[i]["token"] = res[i][0]; //retrieving the token;
        for(var j in res[i])//each elements checked in onto
        {
          if(j == "C" || j == "N" || j == "I" || j == "IB")
          {
            for(var k in res[i][j])//each elements of the answer
            {
              switch (j) {
                // case "K":
                //   origins[i]["K"] = ( await SEARCH_ENGINE.ontologicalDeferencing.knowledge.resolveOrigin(res[i][j][k]));
                //   break;
                // case "O":
                //   origins[i]["O"] = ( await SEARCH_ENGINE.ontologicalDeferencing.objective.resolveOrigin(res[i][j][k]));
                //   break;
                case "C":
                  origins[i]["C"] = ( await SEARCH_ENGINE.ontologicalDeferencing.context.resolveOrigin(res[i][j][k]));
                  break;
                case "N":
                  origins[i]["N"] = ( await SEARCH_ENGINE.ontologicalDeferencing.name.resolveOrigin(res[i][j][k]));
                  break;
                case "I":
                  origins[i]["I"] = ( await SEARCH_ENGINE.ontologicalDeferencing.input.resolveOrigin(res[i][j][k]));
                  break;
                case "IB":
                  origins[i]["IG"] = ( await SEARCH_ENGINE.ontologicalDeferencing.inputPattern.resolveOrigin(res[i][j][k]));
                  break;
                // case "B":
                //   origins[i]["B"] = ( await SEARCH_ENGINE.ontologicalDeferencing.outputPattern.resolveOrigin(res[i][j][k]));
                //   break;
                // case "A":
                //   origins[i]["A"] = ( await SEARCH_ENGINE.ontologicalDeferencing.addendum.resolveOrigin(res[i][j][k]));
                //   break;
                // case "G":
                //   origins[i]["G"] = ( await SEARCH_ENGINE.ontologicalDeferencing.graph.resolveOrigin(res[i][j][k]));
                //   break;
                default:

              }
            }
          }
        }
      }
      resolve(origins);
    }
  );
}

//Compared to computeParentRelevancy, establishingParentRevelancy is designed to
// create a map listing all the elements of a parent contribution.
/*
 *  Parent (e.g. NAP)
 *  |__Token1
 *  |  |__PerfectMatching
          |
          |__K...
          |__A
 *  |  |__PrefixMatching
 *  |
 *  |__Token2
 *  |
 */
contextKernel.prototype.establishingParentRevelancy = async function(origins)
{
  var parentRelevace = [];
  var ori;

  for(var idToken = 0; idToken < origins.length; idToken++) //each token
  {
    for(var symbol in origins[idToken])//each element checked, such as Knowledge, etc...
    {
      if(symbol != "token")
      {
        for(var pattern in origins[idToken][symbol])
        {
          for(var idRelation in origins[idToken][symbol][pattern])
          {
            for(var relationNum in origins[idToken][symbol][pattern][idRelation])
            {
              ori = origins[idToken][symbol][pattern][idRelation][relationNum];

              if(!parentRelevace[ori.parent])
                parentRelevace[ori.parent] = {type: ori.parentType, nbTokenAnswered: -1};
              if(!parentRelevace[ori.parent][idToken])
                parentRelevace[ori.parent][idToken] = {token: origins[idToken].token};
              if(!parentRelevace[ori.parent][idToken][pattern])
                parentRelevace[ori.parent][idToken][pattern] = [];
              if(!parentRelevace[ori.parent][idToken][pattern][symbol])
                parentRelevace[ori.parent][idToken][pattern][symbol] = [];

              parentRelevace[ori.parent][idToken][pattern][symbol].push({current: ori.current, currentType: ori.currentType, selfKey: false});//selfKey means that current is a key of parentRelevace
            }
          }
        }
      }
    }
  }

  return await this._sortingStep(parentRelevace);
}

//After calling establishingParentRevelancy (or even computeParentRelevancy),
//steps are not aggregated under their NAP parent. This function do this by
//placing a step result under the NAP[idToken][Pattern][symbol]<--StepKey
contextKernel.prototype._sortingStep = async function(parentRelevace)
{
  return new Promise(
    async function(resolve, reject)
    {

      var parent;
      for(var parentID in parentRelevace)
      {
        if(parentRelevace[parentID].type == STEP_URI)
        {
          parent = await SEARCH_ENGINE.ontologicalDeferencing.step.getParentAnalyses(parentID);

          for(var i in parent)
          {
            for(var tokenStep in parentRelevace[parentID])
            {
              if(tokenStep != "nbTokenAnswered" && tokenStep != "type")
              {
                for(var patternStep in parentRelevace[parentID][tokenStep])
                {
                  if(patternStep != "token")
                  {
                    for(var symbolStep in parentRelevace[parentID][tokenStep][patternStep])
                    {
                      if(!parentRelevace[parent[i]])
                        parentRelevace[parent[i]] = {type: ANALYSIS_URI, nbTokenAnswered: -1};
                      if(!parentRelevace[parent[i]][tokenStep])
                        parentRelevace[parent[i]][tokenStep] = {token: parentRelevace[parentID][tokenStep].token};
                      if(!parentRelevace[parent[i]][tokenStep][patternStep])
                        parentRelevace[parent[i]][tokenStep][patternStep] = [];
                      if(!parentRelevace[parent[i]][tokenStep][patternStep]["S"])
                        parentRelevace[parent[i]][tokenStep][patternStep]["S"] = [];

                      parentRelevace[parent[i]][tokenStep][patternStep]["S"].push({current: parentID, currentType: STEP_URI, selfKey: true});
                    }
                  }
                }
              }
            }
          }
        }
      }

      resolve(parentRelevace);
    }
  );
}

contextKernel.prototype.computeParentRelevancy = function(origins)
{
  var parentRelevace = [];
  var nbTokens = origins.length;

  for(var idToken = 0; idToken < origins.length; idToken++) //each token
  {
    for(var symbol in origins[idToken])//each element checked, such as Knowledge, etc...
    {
      if(symbol != "token")
      {
        for(var pattern in origins[idToken][symbol])
        {
          for(var idRelation in origins[idToken][symbol][pattern])
          {
            for(var relationNum in origins[idToken][symbol][pattern][idRelation])
            {
              if(!origins[idToken][symbol][pattern][idRelation][relationNum].value)
                origins[idToken][symbol][pattern][idRelation][relationNum].value = 1;

                //On Développe l'opération sur les matrices ici. Tout les résultats on la division et la multiplication effectuée. C'est donc équivalent
                // 1/N*k ( Pi(v1*w1 + ... + vn*wn) + ... + Pj(v1'*w1' + ... + vn'w'n) )
              origins[idToken][symbol][pattern][idRelation][relationNum].score = origins[idToken][symbol][pattern][idRelation][relationNum].value * this.evaluateWeightOfTokenType(origins[idToken][symbol][pattern][idRelation][relationNum].currentType);

              if(!parentRelevace[origins[idToken][symbol][pattern][idRelation][relationNum].parent])
                parentRelevace[origins[idToken][symbol][pattern][idRelation][relationNum].parent] = {computedScore: 0, score: [], nb: []};
              if(!parentRelevace[origins[idToken][symbol][pattern][idRelation][relationNum].parent].score[idToken])
              {
                parentRelevace[origins[idToken][symbol][pattern][idRelation][relationNum].parent].score[idToken] = [];
                parentRelevace[origins[idToken][symbol][pattern][idRelation][relationNum].parent].nb[idToken] = [];
              }
              if(!parentRelevace[origins[idToken][symbol][pattern][idRelation][relationNum].parent].score[idToken][pattern])
              {
                parentRelevace[origins[idToken][symbol][pattern][idRelation][relationNum].parent].score[idToken][pattern] = 0;
                parentRelevace[origins[idToken][symbol][pattern][idRelation][relationNum].parent].nb[idToken][pattern] = 0;
              }
              parentRelevace[origins[idToken][symbol][pattern][idRelation][relationNum].parent].score[idToken][pattern] += origins[idToken][symbol][pattern][idRelation][relationNum].score;
              parentRelevace[origins[idToken][symbol][pattern][idRelation][relationNum].parent].nb[idToken][pattern]++;

              // //Adding tokens to know how many token have been encountered
              // if(!parentRelevace[origins[idToken][symbol][pattern][idRelation][relationNum].parent].tokens)
              //   parentRelevace[origins[idToken][symbol][pattern][idRelation][relationNum].parent].tokens = [];
              // if(parentRelevace[origins[idToken][symbol][pattern][idRelation][relationNum].parent].tokens.indexOf(idToken) == -1)
              //   parentRelevace[origins[idToken][symbol][pattern][idRelation][relationNum].parent].tokens.push(idToken);
            }
          }
        }
      }
    }
  }

  var tmpPatternScore;
  var nbPattern;
  var nbIdToken = origins.length;
  var tmpTokenScore;

  for(var parentURI in parentRelevace)
  {
    tmpTokenScore = 0;
    for(var idToken in parentRelevace[parentURI].score)
    {
      tmpPatternScore = 0;
      nbPattern = 0;
      for(var pattern in parentRelevace[parentURI].score[idToken])
      {
        tmpPatternScore += this.evaluateWeightQueryPattern(pattern) * (parentRelevace[parentURI].score[idToken][pattern]/parentRelevace[parentURI].nb[idToken][pattern]);
        nbPattern++;
      }
      tmpTokenScore += this.evaluateWeightOfToken(idToken) * (tmpPatternScore / nbPattern);
    }
      parentRelevace[parentURI].computedScore = tmpTokenScore / nbIdToken;
  }

  return parentRelevace;
}

contextKernel.prototype.evaluateWeightQueryPattern = function(queryPattern)
{
  switch (queryPattern) {
    case "perfectMatching":
      return 1;
    case "prefixMatching":
      return 0.75;
    case  "reversePrefixMatching":
      return 0.75;
    case  "sufixMatching":
      return 0.75;
    case  "reverseSufixMatching":
      return 0.75;
    case  "looseMatching":
      return 0.5;
    case  "doubleTermMatching":
      return 0.5;
    case  "monoPrefixMatching":
      return 0.25;
    case  "monoSufixMatching":
      return 0.25;
    default:
      return 0;
  }
}

contextKernel.prototype.evaluateWeightOfTokenType = function(tokenType)
{
  switch (tokenType) {
    case NAME_URI:
      return 0.2;
      break;
    case RGTE_URI:
      return 0.3;
      break;
    case KNOWLEDGE_URI:
      return 0.9;
      break;
    case OBJECTIVE_URI:
      return 0.8;
      break;
    case ADDENDUM_URI:
      return 0.1;
      break;
    case ANALYSIS_URI:
      return 0.9;
      break;
    case OUTPUT_PATTERN_URI:
      return 0.4;
      break;
    default:
      return 0;
      break;
  }
}

contextKernel.prototype.evaluateWeightOfToken = function(token)
{
  console.log("CURRENTLY, ANY TOKEN WEIGHT IS DEFINED AS 1");
  return 1;
}

//=== OLD
contextKernel.prototype.defineMatrix = function(res,origins, need)//for a specific token
{
  if(!res || !origins)
    return;

  var tokenMatrix;
  var queryPatterns = [];
  var tokenWeight;
  var weightVector;
  var score;

  for(var i in res)
  {
    tokenMatrix   = this.defineTokenMatrix(res[i][0].token, origins);
    tokenWeight   = this.defineTokenWeight(res[i][0].token, need);
    weightVector  = this.defineWeightVector(tokenMatrix);
    score = this.computeScore(tokenMatrix, tokenWeight, weightVector);
  }
}

contextKernel.prototype.computeScore = function(tokenMatrix, tokenWeight, weightVector)
{
  var tokenVector = [];

  for(var i = 0; i < tokenMatrix.rowSignification.length; i++)
  {
    for(var j in tokenMatrix.matrix[i])
    {
      if(!tokenVector[j])
        tokenVector[j] = 0;
      tokenVector[j] += tokenMatrix.matrix[i][j];
    }
  }

  for(var i in tokenVector)
    tokenVector[i] = {weight: (tokenVector[i]/tokenMatrix.rowSignification.length) * weightVector.weightMapVector[i], parent: this.getParent(i, tokenMatrix.mapOrigin[i])} ;

    console.log(tokenVector);
}

contextKernel.prototype.getParent = function(currentStr, originArray)
{
  if(!currentStr)
    return;

    var res = [];
  for(var i in originArray)
  {
    if(currentStr == originArray[i].current)
      res.push({parent: originArray[i].parent, parentType: originArray[i].parentType});
  }

  return res;
}

contextKernel.prototype.defineTokenWeight = function(token, need)
{
  console.log("CURRENTLY, ANY TOKEN WEIGHT IS DEFINED AS 1/N");
  return (1/need.length);
}

contextKernel.prototype.defineWeightVector = function(tokenMatrix)
{
  var weightVector = [];
  var weightMapVector = [];

  for(var i = 0; i < tokenMatrix.rowSignification.length; i++)
  {
    for(var j in tokenMatrix.matrix[i]) //for each element of the matrix, need to find the type
    {
      for(var k in tokenMatrix.mapOrigin[tokenMatrix.rowSignification[i]])
      {
        if(j == tokenMatrix.mapOrigin[tokenMatrix.rowSignification[i]][k].current)
        {
          weightVector.push(this.evaluateWeightOfTokenType(tokenMatrix.mapOrigin[tokenMatrix.rowSignification[i]][k].currentType));
          if(!weightMapVector[j])
            weightMapVector[j] = [];
          weightMapVector[j]=this.evaluateWeightOfTokenType(tokenMatrix.mapOrigin[tokenMatrix.rowSignification[i]][k].currentType);
          break;
        }
      }
    }
  }

  return {weightVector:weightVector,weightMapVector: weightMapVector};
}

contextKernel.prototype.evaluateWeightOfTokenType = function(tokenType)
{
  switch (tokenType) {
    case NAME_URI:
      return 0.2;
      break;
    case RGTE_URI:
      return 0.3;
      break;
    case KNOWLEDGE_URI:
      return 0.9;
      break;
    case OBJECTIVE_URI:
      return 0.8;
      break;
    case ADDENDUM_URI:
      return 0.1;
      break;
    case ANALYSIS_URI:
      return 0.9;
      break;
    case OUTPUT_PATTERN_URI:
      return 0.4;
      break;
    default:
      return 0;
      break;
  }
}

contextKernel.prototype.defineTokenMatrix = function(token, origins)
{
  var currentOrigin;
  var mapQueryPattern = [];

  for(var j in origins)
  {
    if(origins[j].token.token.id == token.id)
      currentOrigin = origins[j];
  }

  for(var i in currentOrigin)
  {
    for(k in currentOrigin[i])
    {
      if(!mapQueryPattern[k])
        mapQueryPattern[k] = [];
      for(var l in currentOrigin[i][k]) //planning the structure
        for(var m in currentOrigin[i][k][l])
          mapQueryPattern[k].push(currentOrigin[i][k][l][m]);
    }
  }

  var matrix = []; var correspondance = [];

  for(var i in mapQueryPattern)
  {
    if(i != "token")
    {
      matrix.push(this.defineMatrixRow(mapQueryPattern[i]));
      correspondance.push(i);
    }
  }

  return {matrix: matrix, rowSignification: correspondance, mapOrigin: mapQueryPattern};
}
// Tj
contextKernel.prototype.defineMatrixRow = function(lineQPattern)//one specific query pattern, for a specific token
{
  if(!lineQPattern)
    return;

  var mapElements = [];

  for(var i in lineQPattern) //reducing the line by removing same occurence
  {
    mapElements[lineQPattern[i].current] = 1;
  }

  return mapElements;
}

// contextKernel.prototype._searchNeed = async function(needTerms)
// {
//   return new Promise(
//     async function(resolve, reject)
//     {
//
//       console.log("looking for : "+needTerms[0]);
//
//       this.resultOrganizer = [];
//       // = = = Looking into name elements
//         // query = "SELECT * WHERE { ?s <http://www.CAPTEN.org/SEED/ontologies/hasName> ?obj . ?obj <http://www.CAPTEN.org/SEED/ontologies/hasContent> ?content . ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?e . ?e <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <"+needTerms[0].getIRI()+"> .}";
//         //var query = "SELECT * WHERE { ?s <http://www.CAPTEN.org/SEED/ontologies/hasName> ?obj . ?obj <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?e . ?e <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <"+needTerms[0].getIRI()+"> .}";
//         // query = "SELECT * WHERE { ?g <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/RGTE> . ?g  <http://www.CAPTEN.org/SEED/ontologies/hasVariable> ?x . ?g  <http://www.CAPTEN.org/SEED/ontologies/hasVariable> ?y . ?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/custom/Framboise> . ?y <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/custom/Exercice> . ?x <http://www.CAPTEN.org/SEED/ontologies/custom/writing> ?y .}";
//
//         // query = "?g <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/RGTE> . ?g  <http://www.CAPTEN.org/SEED/ontologies/hasVariable> ?x . ?g  <http://www.CAPTEN.org/SEED/ontologies/hasVariable> ?y .";
//         // var rel = "http://www.CAPTEN.org/SEED/ontologies/custom/writing"; var t1 = "http://www.CAPTEN.org/SEED/ontologies/custom/Framboise" ;var t2 = "http://www.CAPTEN.org/SEED/ontologies/custom/Exercice";
//         // query = SEARCH_ENGINE.queryPatternBuilder.relation.perfectMatching(rel, t1, t2, "x","y",query);
//
//         // query = "SELECT * WHERE { ?r <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/custom/writing> .}";
//
//         // HYLAR_HANDLER.queryOnto(query, [this, this._afterNeedQueries]);
//         var query = SEARCH_ENGINE.queryPatternBuilder.term.perfectMatching(needTerms[0].getIRI(), "x", SEARCH_ENGINE.ontologicalDeferencing.name.termReady());
//         var elm = await HYLAR_HANDLER.promiseToQueryOnto(query);
//
//         console.log("REDO Sorting func");
//         var sortedRes = await SEARCH_ENGINE._sortingByType(elm, "s");
//
//         this.resultOrganizer[NAME_URI] = [];
//         this.resultOrganizer[NAME_URI][QUERY_RESULT] = elm;
//         this.resultOrganizer[NAME_URI][MATCH_ELEMENTS] = [needTerms[0]];
//         this.resultOrganizer[NAME_URI][SORTED_RESULTS] = sortedRes[0];
//         this.resultOrganizer[NAME_URI][ESTIMATED_WEIGHT] = "NAME_WEIGHTING";
//       // = = =
//
//       // = = = SEARCHING INTO OBJECTIVE
//         // query = "SELECT * WHERE { ?s <http://www.CAPTEN.org/SEED/ontologies/hasObjective> ?obj . ?obj <http://www.CAPTEN.org/SEED/ontologies/hasContent> ?content . ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?e . ?e <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <"+needTerms[0].getIRI()+"> .}";
//
//         query = SEARCH_ENGINE.queryPatternBuilder.term.perfectMatching(needTerms[0].getIRI(), "x", SEARCH_ENGINE.ontologicalDeferencing.objective.termReady());
//
//         elm = await HYLAR_HANDLER.promiseToQueryOnto(query);
//
//         console.log("REDO Sorting func");
//         sortedRes = await SEARCH_ENGINE._sortingByType(elm, "s");
//
//         this.resultOrganizer[OBJECTIVE_URI] = [];
//         this.resultOrganizer[OBJECTIVE_URI][QUERY_RESULT] = elm;
//         this.resultOrganizer[OBJECTIVE_URI][MATCH_ELEMENTS] = [needTerms[0]];
//         this.resultOrganizer[OBJECTIVE_URI][SORTED_RESULTS] = sortedRes[0];
//         this.resultOrganizer[OBJECTIVE_URI][ESTIMATED_WEIGHT] = "weight";
//       // = = =
//       // = = = SEARCHING INTO GRAPHS
//         // Warning ; consider the case of node reported to a G1 to G2 automatically, the creation step, etc..
//         // query = "SELECT * WHERE { ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/RGTE>. ?s <http://www.CAPTEN.org/SEED/ontologies/hasVariable> ?v . ?v <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <"+needTerms[0].getIRI()+"> .}";
//
//         query = SEARCH_ENGINE.queryPatternBuilder.term.perfectMatching(needTerms[0].getIRI(), "x", SEARCH_ENGINE.ontologicalDeferencing.graph.termReady());
//
//         elm = await HYLAR_HANDLER.promiseToQueryOnto(query);
//
//         console.log("REDO Sorting func");
//         sortedRes = await SEARCH_ENGINE._sortingByType(elm, "s");
//
//         this.resultOrganizer[RGTE_URI] = [];
//         this.resultOrganizer[RGTE_URI][MATCH_ELEMENTS] = [needTerms[0]];
//         this.resultOrganizer[RGTE_URI][QUERY_RESULT] = elm;
//         this.resultOrganizer[RGTE_URI][SORTED_RESULTS] = sortedRes[0];
//         this.resultOrganizer[RGTE_URI][ESTIMATED_WEIGHT] = "weight";
//       // = = =
//
//       // = = = SEARCHING INTO ADDENDUM (using subsumption prop to retrieve any descr.)
//         //query = "SELECT * WHERE { ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/Addendum> . ?s <http://www.CAPTEN.org/SEED/ontologies/hasContent> ?content . ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?e . ?e <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <"+needTerms[0].getIRI()+"> .}";
//
//         query = SEARCH_ENGINE.queryPatternBuilder.term.perfectMatching(needTerms[0].getIRI(), "x", SEARCH_ENGINE.ontologicalDeferencing.addendum.termReady());
//         elm = await HYLAR_HANDLER.promiseToQueryOnto(query);
//
//         console.log("REDO Sorting func");
//         sortedRes = await SEARCH_ENGINE._sortingByType(elm, "s");
//
//         this.resultOrganizer[ADDENDUM_URI] = [];
//         this.resultOrganizer[ADDENDUM_URI][MATCH_ELEMENTS] = [needTerms[0]];
//         this.resultOrganizer[ADDENDUM_URI][QUERY_RESULT] = elm;
//         this.resultOrganizer[ADDENDUM_URI][SORTED_RESULTS] = sortedRes[0];
//         this.resultOrganizer[ADDENDUM_URI][ESTIMATED_WEIGHT] = "weight";
//       // = = =
//
//       // = = = SEARCHING INTO K PRODUCED
//         //query = "SELECT * WHERE { ?a <http://www.CAPTEN.org/SEED/ontologies/custom/knowledgeGeneratedBy> ?k . ?k <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <"+needTerms[0].getIRI()+"> .}";
//         query = SEARCH_ENGINE.queryPatternBuilder.term.perfectMatching(needTerms[0].getIRI(), "x", SEARCH_ENGINE.ontologicalDeferencing.generatedKnowledge.termReady());
//         elm = await HYLAR_HANDLER.promiseToQueryOnto(query);
//         //No need to sort (the data struc is ok)
//         // sortedRes = await this._sortingByType(elm, )
//
//         this.resultOrganizer[KNOWLEDGE_URI] = [];
//         this.resultOrganizer[KNOWLEDGE_URI][MATCH_ELEMENTS] = [needTerms[0]];
//         this.resultOrganizer[KNOWLEDGE_URI][QUERY_RESULT] = elm;
//         this.resultOrganizer[KNOWLEDGE_URI][SORTED_RESULTS] = ["NO NEED TO SORT"];
//         this.resultOrganizer[KNOWLEDGE_URI][ESTIMATED_WEIGHT] = "weight";
//       // = = =
//
//       console.log(sortedRes);
//       console.log("REMINDER| Improve queries by using similar property. ?x similar ?y. ?s ?p ?o. ?o type ?x OR ?y.");
//
//       resolve(this.resultOrganizer);
//
//     }.bind(this));
// }

contextKernel.prototype._organizeResult = function()
{
  var res = [];

  for(var i in this.resultOrganizer)
  {
    for(var j in this.resultOrganizer[i][SORTED_RESULTS])
    {
      for(var k in this.resultOrganizer[i][SORTED_RESULTS][j])
      {
        if(!res[this.resultOrganizer[i][SORTED_RESULTS][j][k]]) //e.g. if Analysis type not created -> we create it
          res[this.resultOrganizer[i][SORTED_RESULTS][j][k]] = [];

          res[this.resultOrganizer[i][SORTED_RESULTS][j][k]].push(j);
    }
  }
  }

  console.log("todo : step of nap/nop. Puis previous steps puis belonging to which. Le faire directement das les requêtes initiales ?");

  console.log(res);
  return res;
}

var CONTEXT_KERNEL = new contextKernel();

var QUERY_RESULT = "q_res";
var MATCH_ELEMENTS = "m_elmt";
var SORTED_RESULTS = "sorted_res";
var ESTIMATED_WEIGHT = "estim_w";
