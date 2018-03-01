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

      if(this.mutex)
        return;

      if(!HYLAR_HANDLER.isReady())
        return;

      this.mutex = true;

      this.dimensions = dimensions;

      //Below all access is mutexed. No double call can be made
      if(this.dimensions && this.dimensions['need'])
        this.NEED.search(this.dimensions['need']);

      this.mutex = false;

      resolve("OWARI~~");//TODO remplace avec data
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

var SEARCH_ENGINE = new searchEngine();
