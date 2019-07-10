// SEARCH KERNEL (like this one) should not be called alone, but always with
// a searchEngine call.

//@TODO From parent get the Knowledge graph for SPARQL query, then display

// initialDataKernel USED TO : search inital data graph and detec which K can be obtained from them
function initialInputKernel()
{
  this.currentInitialInput = null;//extstring ?
  this.resultOrganizer = [];
}

initialInputKernel.prototype.setInitialInput = function(initialInput)
{
  this.currentInitialInput = initialInput;
}

initialInputKernel.prototype.search = async function(initialInput)
{
  if(initialInput)
    this.initialInput = initialInput ;

  var res = await this._searchInitialInput(this.initialInput);

  return res;
}

contextKernel.prototype._searchInitialInput = async function(initialInput)
{
  return new Promise(
    async function(resolve, reject)
    {
      if(!initialInput)
        return null;

      // == Querying
        /**
         * Elements queried by default are :
         * 1) Input graph of analysis
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
        // console.log("INFORMATION: Only perfect search for the moment");
        // res[i]["K"] = await SEARCH_ENGINE.searchKnowledge(token,[pattern]);//, [0,3]);//, [0,1,5]));
        // res[i]["O"] = await SEARCH_ENGINE.searchObjective(token,[pattern]);//, [0,1,5]));
        // res[i]["C"] = await SEARCH_ENGINE.searchContext(token, [pattern]);
        // res[i]["N"] = await SEARCH_ENGINE.searchName(token,[pattern]);//, [0,3]);//, [0,1,5]));
        // res[i]["I"] = await SEARCH_ENGINE.searchInput(token, [pattern]);
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

      // console.log(this.computeParentRelevancy(origins));
      resolve(this.establishingParentRevelancy(origins));
    }.bind(this)
  );
}

initialInput.prototype.resolveOriginFromResults = async function(res)
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
          if(j == "IB")
          {
            for(var k in res[i][j])//each elements of the answer
            {
              switch (j) {
                case "IB":
                  origins[i]["IG"] = ( await SEARCH_ENGINE.ontologicalDeferencing.inputPattern.resolveOrigin(res[i][j][k]));
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
initialInput.prototype.establishingParentRevelancy = async function(origins)
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
initialInput.prototype._sortingStep = async function(parentRelevace)
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
