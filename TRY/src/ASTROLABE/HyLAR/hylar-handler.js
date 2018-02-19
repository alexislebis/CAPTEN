function HylarHandler()
{
  var atLeastLoadedOnce = false;
}

HylarHandler.prototype.loadOntology = function(onto, mime, kOV)
{
  if(!onto)
    return null;

  if(!this.isMimeTypeValid(mime))
    return null;

  var that = this;
  HYLAR.load(onto, mime, kOV)
    .then(response => {
      that.atLeastLoadedOnce = true;
      console.log(`${response}`);
    });
}

HylarHandler.prototype.queryOnto = function(query, recall)//Recall : function to call after completion
{
  if(!query)
    return;
  if(!this.atLeastLoadedOnce)
  {
    console.error("No ontology has been loaded yet. No queries can be run! Aborting");
    return;
  }

  HYLAR.query(query)
    .then(result => {
      recall[1].call(recall[0],result);
    });
}

HylarHandler.prototype.cascadingQueryOnto = function(queries, results, recall)
{
  if(!results || results.length == 0)
    results = [];
  if(!queries || queries.length <= 0)
  {
    recall[1].call(recall[0],results);
    return;
  }

  results.push({"query" : queries[0]});

  if(!this.atLeastLoadedOnce)
  {
    console.error("No ontology has been loaded so far. No queries can be run! Aborting");
    return;
  }

  var that = this;

  HYLAR.query(queries[0])
    .then(result => {
      queries.splice(0,1);
      for(var i in result)
        results.push(result[i]);
      this.cascadingQueryOnto(queries, results, recall);
    });
}

HylarHandler.prototype.promiseToQueryOnto = async function(query)
{
  return new Promise(
    async function(resolve, reject)
    {
      if(!query)
        reject("Query is EMPTY!!");

      if(!this.atLeastLoadedOnce)
        reject("No ontology has been loaded so far. No queries can be run! Aborting");

        HYLAR.query(query)
          .then(result => {
            resolve(result);
          });
  }.bind(this));
}

HylarHandler.prototype.promiseToQueriesOnto = async function(queries)
{
  return new Promise(
    async function(resolve, reject)
    {
      let results = [];

      if(!this.atLeastLoadedOnce)
        reject("No ontology has been loaded so far. No queries can be run! Aborting");

      for(let i in queries)
      {
        results.push({"query":queries[i]});
        let tmp = await this.promiseToQueryOnto(queries[i]);

        for(let j in tmp)
          results.push(tmp[j]);
      }
      resolve(results);
    }.bind(this));
}



HylarHandler.prototype.isMimeTypeValid = function(mime)
{
  if( mime == "application/rdf+xml" ||
      mime == "text/turtle"         ||
      mime == "text/n3"             ||
      mime == "application/ld+json" )
      return true;
  return false;
}

HylarHandler.prototype.isReady = function()
{
  return this.atLeastLoadedOnce;
}

var HYLAR_HANDLER = new HylarHandler();
