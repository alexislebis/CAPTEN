/**
  * ontologicalDeferencing aims to build specific path dedicated to elements coming from CAPTEN_ONTO u RGTE u NAME ...
  */

  /**
   * resolveOrigin function aims to find the parents of where the elements deferenced come from.
   * Here the expected parents for the vairous deferenced elements :
   * 1) Name      : STEP | NOP | NAP
   * 2) RGTE      : STEP | NAP
   * 3) K         : NAP
   * 4 GeneratedK : NAP
   * 4) Objective : STEP | NOP | NAP
   * 5) Addendum  : STEP | NOP | NAP
   * 6) Behaviour : NAP | NOP
   *
   * /!\ Requires to use the symbol representing its parent
   * /!\ Requires that the caller implements _resolveTermOrigin and _resolveRelationOrigin
   */
   var __RESOLVE_ORIGIN = async function(deferencesToResolve, caller)//deferencesToResolve : set: "relation"|"term", pattern: pattern, query: query, answer: tmp, symbols:[x] (from seearchEngine)
   {
     return new Promise(
       async function(resolve, reject)
       {
         var res = [];
         var resolveFunc;

         if(!deferencesToResolve)
         {
           resolve(res);
           return;
         }

         if(deferencesToResolve.set == "term")
           resolveFunc = caller._resolveTermOrigin;
         else if(deferencesToResolve.set == "relation")
           resolveFunc = caller._resolveRelationOrigin;
         else
           {resolve(res); return;}

         var tmp;

         console.log(deferencesToResolve.answer.length+" query to resolve...");

         for(var i = 0; i < deferencesToResolve.answer.length; i++)
         {
           if(!res[deferencesToResolve.pattern])
            res[deferencesToResolve.pattern] = [];
           res[deferencesToResolve.pattern].push(await resolveFunc(deferencesToResolve.answer[i]));
         }

         console.log("... end resolving.");

         resolve(res);

       });
   }

// === NAME DEFERENCING
  function nameDeferencing()
  {}

  nameDeferencing.prototype.relationReady = function()
  {
    return "?s <http://www.CAPTEN.org/SEED/ontologies/hasName> ?obj . ?obj <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?x . ?obj <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?y .";
  }
  nameDeferencing.prototype.termReady = function()
  {
    return "?s <http://www.CAPTEN.org/SEED/ontologies/hasName> ?obj . ?obj <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?x .";
  }

  nameDeferencing.prototype.getCorrespondance = function()
  {
    return {s: CAPTEN_CLASS_URI, obj: NAME_URI, x: CAPTEN_CLASS_URI, y: CAPTEN_CLASS_URI};
  }

  nameDeferencing.prototype.resolveOrigin = async function(oneQueryResult)
  {
    return new Promise(
      async function(resolve, reject)
      {
        resolve(await __RESOLVE_ORIGIN(oneQueryResult, this));
      }.bind(this)
    );
  }
    nameDeferencing.prototype._resolveRelationOrigin = async function(oneQueryResult)
    {
      return new Promise(
        async function(resolve, reject)
        {
          var res = [];

          if(!oneQueryResult)
            resolve(res);

          var query = "SELECT * WHERE { <"+oneQueryResult["s"].value+"> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?t .}";
          var tmp = await HYLAR_HANDLER.promiseToQueryOnto(query);

          if(!tmp)
          {
            console.log("tmp should not be null...");
            resolve(tmp);
            return;
          }

          var filteredTmp = [];

          for(var i in tmp)
          {
            switch (tmp[i]["t"].value) {
              case ANALYSIS_URI:
                filteredTmp.push({tmp: tmp[i], type: ANALYSIS_URI});
                break;
              case OPERATOR_URI:
                filteredTmp.push({tmp: tmp[i], type: OPERATOR_URI});
                break;
              case STEP_URI:
                filteredTmp.push({tmp: tmp[i], type: STEP_URI});
                break;
              default:
                //NTD discard of elements
            }
          }

          for(var i in filteredTmp)
            res.push({parent: oneQueryResult["s"].value, parentType : filteredTmp[i].type, current: oneQueryResult["obj"].value, currentType: NAME_URI});

          resolve(res);
        }
      )
    }

    nameDeferencing.prototype._resolveTermOrigin = async function(oneQueryResult)
    {
          //Same behavior than _resolveRelationOrigin
          return nameDeferencing.prototype._resolveRelationOrigin(oneQueryResult);//dry
    }


// === GRAPH DEFERENCING
  // == RGTE
    function rgteDeferencing()
    {}

    rgteDeferencing.prototype.relationReady = function()
    {
      return "?g <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/RGTE> . ?g  <http://www.CAPTEN.org/SEED/ontologies/hasVariable> ?x . ?g  <http://www.CAPTEN.org/SEED/ontologies/hasVariable> ?y .";
    }

    rgteDeferencing.prototype.termReady = function()
    {
        return "?g <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/RGTE>. ?g <http://www.CAPTEN.org/SEED/ontologies/hasVariable> ?x .";
    }

    rgteDeferencing.prototype.getCorrespondance = function()
    {
      return {g: RGTE_URI, x: CAPTEN_CLASS_URI, y: CAPTEN_CLASS_URI};
    }

    rgteDeferencing.prototype.resolveOrigin = async function(oneQueryResult)
    {
      return new Promise(
        async function(resolve, reject)
        {
          resolve(await __RESOLVE_ORIGIN(oneQueryResult, this));
        }.bind(this)
      );
    }

      rgteDeferencing.prototype._resolveRelationOrigin = async function(oneQueryResult)
      {
        return new Promise(
          async function(resolve, reject)
          {
            var res = [];

            if(!oneQueryResult)
              resolve(res);

            // var query = "SELECT * WHERE {?e <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?t . ?e ?r <"+oneQueryResult["g"].value+"> .}";

            //The above query isn't well handled by HYLAR. We have to decomplexify it.
            // QUICKFIX
            var query = "SELECT * WHERE {?e ?r <"+oneQueryResult["g"].value+"> .}";
            var subres = await HYLAR_HANDLER.promiseToQueryOnto(query);
            var subtmp = []; var tmp = [];

            for(var k in subres)
            {
              query = "SELECT * WHERE { <"+subres[k]['e'].value+"> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?t .}";
              subtmp = await HYLAR_HANDLER.promiseToQueryOnto(query);
              for(var k2 in subtmp)
              {
                subtmp[k2]['e'] = {value: subres[k]['e'].value};
                tmp.push(subtmp[k2]);
              }
            }

            if(!tmp)
            {
              console.log("tmp should not be null...");
              resolve(tmp);
              return;
            }

            var filteredTmp = [];

            for(var i in tmp)
            {
              switch (tmp[i]["t"].value) {
                case ANALYSIS_URI:
                  filteredTmp.push({tmp: tmp[i], type: ANALYSIS_URI});
                  break;
                case OPERATOR_URI:
                  filteredTmp.push({tmp: tmp[i], type: OPERATOR_URI});
                  break;
                case STEP_URI:
                  filteredTmp.push({tmp: tmp[i], type: STEP_URI});
                  break;
                default:
                  //NTD discard of elements
              }
            }

            for(var i in filteredTmp)
              res.push({parent: filteredTmp[i].tmp["e"].value, parentType : filteredTmp[i].type, current: oneQueryResult["g"].value, currentType: RGTE_URI});
            resolve(res);
          });
      }
      rgteDeferencing.prototype._resolveTermOrigin = async function(oneQueryResult)
      {
            return rgteDeferencing.prototype._resolveRelationOrigin(oneQueryResult);
      }

  // == KNOWLEDGE
    function knowledgeDeferencing()
    {}

    knowledgeDeferencing.prototype.relationReady = function()
    {
      return "?g <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/Knowledge> . ?g  <http://www.CAPTEN.org/SEED/ontologies/hasVariable> ?x . ?g  <http://www.CAPTEN.org/SEED/ontologies/hasVariable> ?y .";
    }

    knowledgeDeferencing.prototype.termReady = function()
    {
      console.log("quasi equivalent to: generatedKnowledgeDeferencing.prototype.termReady. give a graph in addition");
        return "?a <http://www.CAPTEN.org/SEED/ontologies/custom/knowledgeGeneratedBy> ?x . ?g <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/Knowledge> . ?g <http://www.CAPTEN.org/SEED/ontologies/hasVariable> ?x . ";
    }

    knowledgeDeferencing.prototype.getCorrespondance = function()
    {
      return {a: ANALYSIS_URI, g: KNOWLEDGE_URI, x: CAPTEN_CLASS_URI, y: CAPTEN_CLASS_URI};
    }

    knowledgeDeferencing.prototype.resolveOrigin = async function(oneQueryResult)
    {
      return new Promise(
        async function(resolve, reject)
        {
          resolve(await __RESOLVE_ORIGIN(oneQueryResult, this));
        }.bind(this)
      );
    }

      knowledgeDeferencing.prototype._resolveRelationOrigin = async function(oneQueryResult)
      {
        return new Promise(
          async function(resolve, reject)
          {
            var res = [];

            if(!oneQueryResult)
              resolve(res);

            var query = "SELECT * WHERE {?s <http://www.CAPTEN.org/SEED/ontologies/hasOutput> <"+oneQueryResult["g"].value+"> . ?a <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/NarratedAnalysisProcess> . ?a <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?s .}";
            var tmp = await HYLAR_HANDLER.promiseToQueryOnto(query);

            if(!tmp)
            {
              console.log("tmp should not be null...");
              resolve(tmp);
              return;
            }

            for(var i in tmp)
              res.push({parent: tmp[i]["a"].value, parentType : ANALYSIS_URI, current: oneQueryResult["g"].value, currentType: KNOWLEDGE_URI});

            resolve(res);
          }
        );
      }
      knowledgeDeferencing.prototype._resolveTermOrigin = async function(oneQueryResult)
      {
        return new Promise(
          async function(resolve, reject)
          {
            var res = [];

            if(!oneQueryResult)
              resolve(res);

            //for var i in tmp
            res.push({parent: oneQueryResult["a"].value, parentType: ANALYSIS_URI, current: oneQueryResult["g"].value, currentType: KNOWLEDGE_URI});

            resolve(res);
          }
        );
      }

  // === OBJECTIVE DEFERENCING
    function objectiveDeferencing()
    {}

    objectiveDeferencing.prototype.relationReady = function()
    {
      return "?s <http://www.CAPTEN.org/SEED/ontologies/hasObjective> ?obj . ?obj <http://www.CAPTEN.org/SEED/ontologies/hasContent> ?content . ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?x . ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?y .";
    }

    objectiveDeferencing.prototype.termReady = function()
    {
      return "?s <http://www.CAPTEN.org/SEED/ontologies/hasObjective> ?obj . ?obj <http://www.CAPTEN.org/SEED/ontologies/hasContent> ?content . ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?x .";
    }

    objectiveDeferencing.prototype.getCorrespondance = function()
    {
      return {s: CAPTEN_CLASS_URI, obj: OBJECTIVE_URI, content: EXTENDED_STRING_URI, x: CAPTEN_CLASS_URI, y: CAPTEN_CLASS_URI};
    }

    objectiveDeferencing.prototype.resolveOrigin = async function(oneQueryResult)
    {
      return new Promise(
        async function(resolve, reject)
        {
          resolve(await __RESOLVE_ORIGIN(oneQueryResult, this));
        }.bind(this)
      );
    }

      objectiveDeferencing.prototype._resolveRelationOrigin = async function(oneQueryResult)
      {
        return new Promise(
          async function(resolve, reject)
          {
            var res = [];

            if(!oneQueryResult)
              resolve(res);

            var query = "SELECT * WHERE { <"+oneQueryResult["s"].value+"> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?t .}";
            var tmp = await HYLAR_HANDLER.promiseToQueryOnto(query);

            if(!tmp)
            {
              console.log("tmp should not be null...");
              resolve(tmp);
              return;
            }

            var filteredTmp = [];

            for(var i in tmp)
            {
              switch (tmp[i]["t"].value) {
                case ANALYSIS_URI:
                  filteredTmp.push({tmp: tmp[i], type: ANALYSIS_URI});
                  break;
                case OPERATOR_URI:
                  filteredTmp.push({tmp: tmp[i], type: OPERATOR_URI});
                  break;
                case STEP_URI:
                  filteredTmp.push({tmp: tmp[i], type: STEP_URI});
                  break;
                default:
                  //NTD discard of elements
              }
            }

            for(var i in filteredTmp)
              res.push({parent: oneQueryResult["s"].value, parentType : filteredTmp[i].type, current: oneQueryResult["obj"].value, currentType: OBJECTIVE_URI});

            resolve(res);
          }
        );
      }

      objectiveDeferencing.prototype._resolveTermOrigin = async function(oneQueryResult)
      {
        //Same behavior than _resolveRelationOrigin
        return objectiveDeferencing.prototype._resolveRelationOrigin(oneQueryResult);//dry
      }

  // === ADDENDUM DEFERENCING
    function addendumDeferencing()
    {}

    addendumDeferencing.prototype.relationReady = function()
    {
      return "?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/Addendum> . ?s <http://www.CAPTEN.org/SEED/ontologies/hasContent> ?content . ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?x . ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?y .";
    }

    addendumDeferencing.prototype.termReady = function()
    {
      return "?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/Addendum> . ?s <http://www.CAPTEN.org/SEED/ontologies/hasContent> ?content . ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?x .";
    }

    addendumDeferencing.prototype.getCorrespondance = function()
    {
      return {s: ADDENDUM_URI, content: EXTENDED_STRING_URI, x: CAPTEN_CLASS_URI, y: CAPTEN_CLASS_URI};
    }

    addendumDeferencing.prototype.resolveOrigin = async function(oneQueryResult)
    {
      return new Promise(
        async function(resolve, reject)
        {
          resolve(await __RESOLVE_ORIGIN(oneQueryResult, this));
        }.bind(this)
      );
    }
      addendumDeferencing.prototype._resolveRelationOrigin = async function(oneQueryResult)
      {
        return new Promise(
          async function(resolve, reject)
          {
            var res = [];

            if(!oneQueryResult)
              resolve(res);

            console.error("CURRENTLY, addendumDeferencing.resolveOrigin could not work with onto 0.3");
            console.error("UPDATE ONTO: CREATE A SUPER PROPERTY HasADDENDUM, grouping description, etc...");

            var query = "SELECT * WHERE { ?a <http://www.w3.org/1999/02/22-rdf-syntax-ns#hasAddendum> <"+oneQueryResult["s"].value+"> . ?a <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?t . }";//" <"+oneQueryResult["s"].value+"> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?t2 .  }" ;
            var tmp = await HYLAR_HANDLER.promiseToQueryOnto(query);

            if(!tmp)
            {
              console.log("tmp should not be null...");
              resolve(tmp);
              return;
            }

            var filteredTmp = [];

            for(var i in tmp)
            {
              switch (tmp[i]["t"].value) {
                case ANALYSIS_URI:
                  filteredTmp.push({tmp: tmp[i], type: ANALYSIS_URI});
                  break;
                case OPERATOR_URI:
                  filteredTmp.push({tmp: tmp[i], type: OPERATOR_URI});
                  break;
                case STEP_URI:
                  filteredTmp.push({tmp: tmp[i], type: STEP_URI});
                  break;
                default:
                  //NTD discard of elements
              }
            }

            for(var i in filteredTmp)
            {
              res.push({parent: filteredTmp[i].tmp["a"].value, parentType : filteredTmp[i].type, current: oneQueryResult["obj"].value, currentType: ADDENDUM_URI});
            }

            resolve(res);
          }
        )
      }

      addendumDeferencing.prototype._resolveTermOrigin = async function(oneQueryResult)
      {
            //Same behavior than _resolveRelationOrigin
            return addendumDeferencing.prototype._resolveRelationOrigin(oneQueryResult);//dry
      }

  // === NARRATED ANALYSIS PROCESS DEFERENCING
    // == GENERATED KNOWLEDGE
      function generatedKnowledgeDeferencing()
      {}

      generatedKnowledgeDeferencing.prototype.relationReady = function()
      {
        console.error("RELATION IS CURRENTLY NOT EXPORTED DIRECTLY. CHECK THE KNOWLEDGE GRAPH INSTEAD.");
        return "";
      }

      generatedKnowledgeDeferencing.prototype.termReady = function()
      {
        return "?a <http://www.CAPTEN.org/SEED/ontologies/custom/knowledgeGeneratedBy> ?x .";
      }

      generatedKnowledgeDeferencing.prototype.getCorrespondance = function()
      {
        return {a: ANALYSIS_URI, x: CAPTEN_CLASS_URI};
      }

      generatedKnowledgeDeferencing.prototype.resolveOrigin = async function(oneQueryResult)
      {
        return new Promise(
          async function(resolve, reject)
          {
            resolve(await __RESOLVE_ORIGIN(oneQueryResult, this));
          }.bind(this)
        );
      }

        generatedKnowledgeDeferencing.prototype._resolveRelationOrigin = async function(oneQueryResult)
        {
          console.error("RELATION IS CURRENTLY NOT EXPORTED. CHECK THE KNOWLEDGE GRAPH FOR RESOLVING RELATION");
        }

        generatedKnowledgeDeferencing.prototype._resolveTermOrigin = async function(oneQueryResult)
        {
          return new Promise(
            async function(resolve, reject)
            {
              var res = [];

              if(!oneQueryResult)
                resolve(res);

              //for var i in tmp
              res.push({parent: oneQueryResult["a"].value, parentType: ANALYSIS_URI, current: oneQueryResult["a"].value, currentType: ANALYSIS_URI});

              resolve(res);
            }
          );
        }

  // === NARRATED OPERATOR DEFERENCING
    // == OUTPUT BEHAVIOR
      function outputBehaviourDeferencing()
      {}

      outputBehaviourDeferencing.prototype.relationReady = function()
      {
        return "?o <http://www.CAPTEN.org/SEED/ontologies/hasOutputBehaviour> ?g . ?g <http://www.CAPTEN.org/SEED/ontologies/hasVariable> ?x . ?g <http://www.CAPTEN.org/SEED/ontologies/hasVariable> ?y ."
      }

      outputBehaviourDeferencing.prototype.termReady = function()
      {
        return "?o <http://www.CAPTEN.org/SEED/ontologies/hasOutputBehaviour> ?g . ?g <http://www.CAPTEN.org/SEED/ontologies/hasVariable> ?x .";
      }

      outputBehaviourDeferencing.prototype.getCorrespondance = function()
      {
        return {o: OPERATION_URI, g: RGTE_URI, x: CAPTEN_CLASS_URI, y: CAPTEN_CLASS_URI};
      }

      outputBehaviourDeferencing.prototype.resolveOrigin = async function(oneQueryResult)
      {
        return new Promise(
          async function(resolve, reject)
          {
            resolve(await __RESOLVE_ORIGIN(oneQueryResult, this));
          }.bind(this)
        );
      }

        outputBehaviourDeferencing.prototype._resolveRelationOrigin = async function(oneQueryResult)
        {
          return new Promise(
            async function(resolve, reject)
            {
              var res = [];

              if(!oneQueryResult)
                resolve(res);

              var query = "SELECT * WHERE { <"+oneQueryResult["o"].value+"> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?t .}";
              var tmp = await HYLAR_HANDLER.promiseToQueryOnto(query);

              if(!tmp)
              {
                console.log("tmp should not be null...");
                resolve(tmp);
                return;
              }

              var filteredTmp = [];

              for(var i in tmp)
              {
                switch (tmp[i]["t"].value) {
                  case ANALYSIS_URI:
                    filteredTmp.push({tmp: tmp[i], type: ANALYSIS_URI});
                    break;
                  case OPERATOR_URI:
                    filteredTmp.push({tmp: tmp[i], type: OPERATOR_URI});
                    break;
                  case STEP_URI:
                    filteredTmp.push({tmp: tmp[i], type: STEP_URI});
                    break;
                  default:
                    //NTD discard of elements
                }
              }

              for(var i in filteredTmp)
                res.push({parent: oneQueryResult["o"].value, parentType : filteredTmp[i].type, current: oneQueryResult["g"].value, currentType: OUTPUT_PATTERN_URI});

              resolve(res);
            }
          );
        }

        outputBehaviourDeferencing.prototype._resolveTermOrigin = async function(oneQueryResult)
        {
          return outputBehaviourDeferencing.prototype._resolveRelationOrigin(oneQueryResult);
        }

// === STEP
function stepDeferencing()
{}

stepDeferencing.prototype.getParentAnalyses = async function(stepIDURI)
{
  return new Promise(
    async function(resolve, reset)
    {
      if(!stepIDURI)
      {
        resolve([]);
        return;
      }

      var query = "SELECT * WHERE { ?a <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/NarratedAnalysisProcess> . ?a <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> <"+stepIDURI+"> .}";
      var res = await HYLAR_HANDLER.promiseToQueryOnto(query);
      var parent = [];

      for(var i in res)
      {
        parent.push(res[i].a.value);
      }

      resolve(parent);
    }
  );
}

// === ONTOLOGICAL DEFERENCING FOR SPECIFIC QUERY BUILDER IN SEARCH ENGINE
function ontologicalDeferencing()
{}

ontologicalDeferencing.prototype.name = new nameDeferencing();
ontologicalDeferencing.prototype.graph = new rgteDeferencing();
ontologicalDeferencing.prototype.knowledge = new knowledgeDeferencing();
ontologicalDeferencing.prototype.objective = new objectiveDeferencing();
ontologicalDeferencing.prototype.addendum = new addendumDeferencing();
ontologicalDeferencing.prototype.generatedKnowledge = new generatedKnowledgeDeferencing();
ontologicalDeferencing.prototype.outputPattern = new outputBehaviourDeferencing();
ontologicalDeferencing.prototype.step = new stepDeferencing();
