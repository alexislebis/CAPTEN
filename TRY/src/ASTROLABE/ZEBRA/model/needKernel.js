// SEARCH KERNEL (like this one) should not be called alone, but always with
// a searchEngine call.

function needKernel()
{
  this.currentNeed = null;//extstring ?
  this.resultOrganizer = [];
}

needKernel.prototype.setNeed = function(need)
{
  this.currentNeed = need;
}

needKernel.prototype.search = async function(need)
{
  if(need)
    this.need = need

  var res = await this._searchNeed2(this.need);

  return res;
}

needKernel.prototype._searchNeed2 = async function(need)
{
  return new Promise(
    async function(resolve, reject)
    {
      // var rel1 = new Property();
      // rel1.uri = "http://www.CAPTEN.org/SEED/ontologies/custom/writing";
      // rel1.from = "http://www.CAPTEN.org/SEED/ontologies/custom/Etudiant";
      // rel1.to = "http://www.CAPTEN.org/SEED/ontologies/custom/Exercice";
      var cl = new CAPTENClass();
      cl.uri = "http://www.CAPTEN.org/SEED/ontologies/custom/Etudiant";
      console.log("==TEST");
      console.log(await HYLAR_HANDLER.promiseToQueryOnto("SELECT * WHERE { <http://www.CAPTEN.org/SEED/identifier/#55883> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?t .}"));
      console.log(await HYLAR_HANDLER.promiseToQueryOnto("SELECT * WHERE { <http://www.CAPTEN.org/SEED/identifier/#88888> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?t .}"));
      console.log(await HYLAR_HANDLER.promiseToQueryOnto("SELECT * WHERE { <http://www.CAPTEN.org/SEED/identifier/#49885> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?t .}"));
      console.log(await HYLAR_HANDLER.promiseToQueryOnto("SELECT * WHERE { ?s <http://www.CAPTEN.org/SEED/ontologies/hasObjective> ?obj . ?obj <http://www.CAPTEN.org/SEED/ontologies/hasContent> ?content . ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?x . ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?y . ?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/NarratedAnalysisProcess> .}"));
      console.log(await HYLAR_HANDLER.promiseToQueryOnto("SELECT * WHERE { ?s <http://www.CAPTEN.org/SEED/ontologies/hasObjective> ?obj . ?obj <http://www.CAPTEN.org/SEED/ontologies/hasContent> ?content . ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?x . ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?y . ?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/NarratedAnalysisProcess> . ?y <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/custom/Apprenant> .}"));
      console.log(await HYLAR_HANDLER.promiseToQueryOnto("SELECT * WHERE { ?x <http://www.CAPTEN.org/SEED/ontologies/custom/classify> ?t .}"));
      console.log(await HYLAR_HANDLER.promiseToQueryOnto("SELECT * WHERE { ?x <http://www.CAPTEN.org/SEED/ontologies/custom/categorise> ?t .}"));


      var rel2 = new Property();
      rel2.uri = "http://www.CAPTEN.org/SEED/ontologies/custom/categorise";
      rel2.from = ANALYSIS_URI;
      rel2.to = "http://www.CAPTEN.org/SEED/ontologies/custom/Apprenant";

      need = [];
      need.push(cl);
      need.push(rel2);
      // need.push(cl);
      console.log("==END TEST");

      if(!need)
        return null;
     /*
      "SELECT * WHERE { ?s <http://www.CAPTEN.org/SEED/ontologies/hasObjective> ?obj .
                        ?obj <http://www.CAPTEN.org/SEED/ontologies/hasContent> ?content .
                        ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?x .
                        ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?y .
                        ?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/NarratedAnalysisProcess> .
                        ?y <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/custom/Apprenant> .
                        ?x <http://www.CAPTEN.org/SEED/ontologies/custom/categorise> ?y .
                      }"
      */
      //la func doit découper le need en token pour le search engine


      // == Querying
        /**
         * Elements queried by default are :
         * 1) Knowledge
         * 2) Objective
         * 3) Name
         * 4) Behaviour of operation
         * 5) Addendum (annex rsc)
         * 6) RGTE in general
         */
      var token;
      var res = [];
      var tmp;

      console.log("Querying onto for each token...");
      for(var i = 0; i < need.length; i++)
      {
        token = need[i];
        res[i] = [{token: token}];
        console.log("INFORMATION: Only perfect search for the moment");
        res[i]["K"] = await SEARCH_ENGINE.searchKnowledge(need[i]);//, [0,1,5]));
        res[i]["O"] = await SEARCH_ENGINE.searchObjective(need[i]);//, [0,1,5]));
        res[i]["N"] = await SEARCH_ENGINE.searchName(need[i]);//, [0,1,5]));
        res[i]["B"] = await SEARCH_ENGINE.searchOutputBehavior(need[i]);//, [0,1,5]));
        res[i]["A"] = await SEARCH_ENGINE.searchAddendum(need[i]);//, [0,1,5]));
        res[i]["G"] = await SEARCH_ENGINE.searchRgte(need[i]);//, [0,1,5]));
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

needKernel.prototype.resolveOriginFromResults = async function(res)
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
          if(j == "K" || j == "O" || j == "N" || j == "B" || j == "A" || j == "G")
          {
            for(var k in res[i][j])//each elements of the answer
            {
              switch (j) {
                case "K":
                  origins[i]["K"] = ( await SEARCH_ENGINE.ontologicalDeferencing.knowledge.resolveOrigin(res[i][j][k]));
                  break;
                case "O":
                  origins[i]["O"] = ( await SEARCH_ENGINE.ontologicalDeferencing.objective.resolveOrigin(res[i][j][k]));
                  break;
                case "N":
                  origins[i]["N"] = ( await SEARCH_ENGINE.ontologicalDeferencing.name.resolveOrigin(res[i][j][k]));
                  break;
                case "B":
                  origins[i]["B"] = ( await SEARCH_ENGINE.ontologicalDeferencing.outputPattern.resolveOrigin(res[i][j][k]));
                  break;
                case "A":
                  origins[i]["A"] = ( await SEARCH_ENGINE.ontologicalDeferencing.addendum.resolveOrigin(res[i][j][k]));
                  break;
                case "G":
                  origins[i]["G"] = ( await SEARCH_ENGINE.ontologicalDeferencing.graph.resolveOrigin(res[i][j][k]));
                  break;
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
needKernel.prototype.establishingParentRevelancy = async function(origins)
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
needKernel.prototype._sortingStep = async function(parentRelevace)
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

needKernel.prototype.computeParentRelevancy = function(origins)
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

needKernel.prototype.evaluateWeightQueryPattern = function(queryPattern)
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

needKernel.prototype.evaluateWeightOfTokenType = function(tokenType)
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

needKernel.prototype.evaluateWeightOfToken = function(token)
{
  console.log("CURRENTLY, ANY TOKEN WEIGHT IS DEFINED AS 1");
  return 1;
}

//=== OLD
needKernel.prototype.defineMatrix = function(res,origins, need)//for a specific token
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

needKernel.prototype.computeScore = function(tokenMatrix, tokenWeight, weightVector)
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

needKernel.prototype.getParent = function(currentStr, originArray)
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

needKernel.prototype.defineTokenWeight = function(token, need)
{
  console.log("CURRENTLY, ANY TOKEN WEIGHT IS DEFINED AS 1/N");
  return (1/need.length);
}

needKernel.prototype.defineWeightVector = function(tokenMatrix)
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

needKernel.prototype.evaluateWeightOfTokenType = function(tokenType)
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

needKernel.prototype.defineTokenMatrix = function(token, origins)
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
needKernel.prototype.defineMatrixRow = function(lineQPattern)//one specific query pattern, for a specific token
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

// needKernel.prototype._searchNeed = async function(needTerms)
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

needKernel.prototype._organizeResult = function()
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

var NEED_KERNEL = new needKernel();

var QUERY_RESULT = "q_res";
var MATCH_ELEMENTS = "m_elmt";
var SORTED_RESULTS = "sorted_res";
var ESTIMATED_WEIGHT = "estim_w";
