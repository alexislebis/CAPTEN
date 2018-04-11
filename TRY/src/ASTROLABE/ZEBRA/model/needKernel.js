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

  var res = await this._searchNeed(this.need);
  this._organizeResult();
}

needKernel.prototype._searchNeed = async function(needTerms)
{
  return new Promise(
    async function(resolve, reject)
    {

      console.log("looking for : "+needTerms[0]);

      this.resultOrganizer = [];
      // = = = Looking into name elements
        // query = "SELECT * WHERE { ?s <http://www.CAPTEN.org/SEED/ontologies/hasName> ?obj . ?obj <http://www.CAPTEN.org/SEED/ontologies/hasContent> ?content . ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?e . ?e <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <"+needTerms[0].getIRI()+"> .}";
        var query = "SELECT * WHERE { ?s <http://www.CAPTEN.org/SEED/ontologies/hasName> ?obj . ?obj <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?e . ?e <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <"+needTerms[0].getIRI()+"> .}";
        
        // HYLAR_HANDLER.queryOnto(query, [this, this._afterNeedQueries]);
        var elm = await HYLAR_HANDLER.promiseToQueryOnto(query);

        var sortedRes = await SEARCH_ENGINE._sortingByType(elm, "s");

        this.resultOrganizer[NAME_URI] = [];
        this.resultOrganizer[NAME_URI][QUERY_RESULT] = elm;
        this.resultOrganizer[NAME_URI][MATCH_ELEMENTS] = [needTerms[0]];
        this.resultOrganizer[NAME_URI][SORTED_RESULTS] = sortedRes[0];
        this.resultOrganizer[NAME_URI][ESTIMATED_WEIGHT] = "NAME_WEIGHTING";
      // = = =

      // = = = SEARCHING INTO OBJECTIVE
        query = "SELECT * WHERE { ?s <http://www.CAPTEN.org/SEED/ontologies/hasObjective> ?obj . ?obj <http://www.CAPTEN.org/SEED/ontologies/hasContent> ?content . ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?e . ?e <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <"+needTerms[0].getIRI()+"> .}";

        elm = await HYLAR_HANDLER.promiseToQueryOnto(query);
        sortedRes = await SEARCH_ENGINE._sortingByType(elm, "s");

        this.resultOrganizer[OBJECTIVE_URI] = [];
        this.resultOrganizer[OBJECTIVE_URI][QUERY_RESULT] = elm;
        this.resultOrganizer[OBJECTIVE_URI][MATCH_ELEMENTS] = [needTerms[0]];
        this.resultOrganizer[OBJECTIVE_URI][SORTED_RESULTS] = sortedRes[0];
        this.resultOrganizer[OBJECTIVE_URI][ESTIMATED_WEIGHT] = "weight";
      // = = =
      // = = = SEARCHING INTO GRAPHS
        // Warning ; consider the case of node reported to a G1 to G2 automatically, the creation step, etc..
        query = "SELECT * WHERE { ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/RGTE>. ?s <http://www.CAPTEN.org/SEED/ontologies/hasVariable> ?v . ?v <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <"+needTerms[0].getIRI()+"> .}";

        elm = await HYLAR_HANDLER.promiseToQueryOnto(query);
        sortedRes = await SEARCH_ENGINE._sortingByType(elm, "s");

        this.resultOrganizer[RGTE_URI] = [];
        this.resultOrganizer[RGTE_URI][MATCH_ELEMENTS] = [needTerms[0]];
        this.resultOrganizer[RGTE_URI][QUERY_RESULT] = elm;
        this.resultOrganizer[RGTE_URI][SORTED_RESULTS] = sortedRes[0];
        this.resultOrganizer[RGTE_URI][ESTIMATED_WEIGHT] = "weight";
      // = = =

      // = = = SEARCHING INTO ADDENDUM (using subsumption prop to retrieve any descr.)
        query = "SELECT * WHERE { ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.CAPTEN.org/SEED/ontologies/Addendum> . ?s <http://www.CAPTEN.org/SEED/ontologies/hasContent> ?content . ?content <http://www.w3.org/1999/02/22-rdf-syntax-ns#li> ?e . ?e <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <"+needTerms[0].getIRI()+"> .}";
        elm = await HYLAR_HANDLER.promiseToQueryOnto(query);
        sortedRes = await SEARCH_ENGINE._sortingByType(elm, "s");

        this.resultOrganizer[ADDENDUM_URI] = [];
        this.resultOrganizer[ADDENDUM_URI][MATCH_ELEMENTS] = [needTerms[0]];
        this.resultOrganizer[ADDENDUM_URI][QUERY_RESULT] = elm;
        this.resultOrganizer[ADDENDUM_URI][SORTED_RESULTS] = sortedRes[0];
        this.resultOrganizer[ADDENDUM_URI][ESTIMATED_WEIGHT] = "weight";
      // = = =

      // = = = SEARCHING INTO K
        query = "SELECT * WHERE { ?a <http://www.CAPTEN.org/SEED/ontologies/custom/knowledgeGeneratedBy> ?k . ?k <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <"+needTerms[0].getIRI()+"> .}";
        elm = await HYLAR_HANDLER.promiseToQueryOnto(query);
        //No need to sort (the data struc is ok)
        // sortedRes = await this._sortingByType(elm, )

        this.resultOrganizer[KNOWLEDGE_URI] = [];
        this.resultOrganizer[KNOWLEDGE_URI][MATCH_ELEMENTS] = [needTerms[0]];
        this.resultOrganizer[KNOWLEDGE_URI][QUERY_RESULT] = elm;
        this.resultOrganizer[KNOWLEDGE_URI][SORTED_RESULTS] = ["NO NEED TO SORT"];
        this.resultOrganizer[KNOWLEDGE_URI][ESTIMATED_WEIGHT] = "weight";
      // = = =

      console.log(sortedRes);
      console.log("REMINDER| Improve queries by using similar property. ?x similar ?y. ?s ?p ?o. ?o type ?x OR ?y.");

      resolve(this.resultOrganizer);

    }.bind(this));
}

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
