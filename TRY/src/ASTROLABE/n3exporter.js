// === N3 EXPORT
// Export an object of the CAPTEN in a map N3 ready.
// It must return an map where the obj id is the key containing an array of array for each <prop> <class>, like:
//
//
// <obj.id> (a.k.a. domain)
//    |____[prop1] [obj1] (a.k.a. range)
//    |____[prop2] [obj2] (a.k.a. range)
//    |____...
//    |____[prop3] [obj3] (a.k.a. range)
//
// It requires the obj can retrieve its couple <properties;elements> according
// to the CAPTEN onto. get PropertiesRelations must return [ [propX] [rangeX] ]

// getPropertiesRelations return for each cell a property already matching the
// onto and the range as an object

function N3Exporter()
{

}

N3Exporter.prototype.exportObjToN3Ready = function(obj)//@ redo
{
  if(!obj.getPropertiesRelations || !obj.getN3ID || obj.id == null)
    return null;

  var n3ID = obj.getN3ID();
  var map = {};
  var propsRel = [];
  var res = obj.getPropertiesRelations();

  map[n3ID] = [];

  for(var i =0; i < res.length; i++)
  {
    propsRel = res[i];

    if(propsRel[1] !== null && typeof propsRel[1] === 'object')
      if(!propsRel[1].getN3ID)
        console.error("WARNING. The element is identified as an object but does not have getN3ID!");
      else
        propsRel[1] = propsRel[1].getN3ID();
    // Otherwise, we don't try to transcript the element in propsRel[1] into smth like <#ID>

    map[n3ID].push(propsRel);
  }

  return map;
}

//merge map2 into map1. Do not remove duplicata of entry for key
//return all the new keys inserted in map1
N3Exporter.prototype.n3MapsMerger = function(map1, map2)
{
  var newKeys = [];

  for(var i in map2)
  {
    if(map2[i].length > 0)
    {
      if(map1[i] == null)
      {
        map1[i] = [];
        newKeys.push(i);
      }

      for(var j in map2[i])
      {
        map1[i].push(map2[i][j]);
      }
    }
  }

  return newKeys;
}

// Solve a n3 map, which means that for each key, check if the range is an object
// if yes, then the object must also be n3ified and added to the map. After that
// check any duplicata and erase them
N3Exporter.prototype.n3MapSolver = function(map)
{
  // SOLVING N3 Object in range
  console.log("SOLVING N3 Object IN range");
  var submap;
  var recheckKeys = [];

  do
  {
    for(var i in map)
    {
      if(recheckKeys.indexOf(i) != -1)//We're just treating an element that we have to recheck
        recheckKeys.splice(i,1);

      for(var j in map[i])
      {
        if(map[i][j][1] !== null && typeof map[i][j][1] === 'object')//If the range is still an object, retrieve its serialization + replace it by its n3 id
        {
          if(!map[i][j][1].getN3Ready || !map[i][j][1].getN3ID)
            console.error(map[i][j][1]+" does not have getN3ID or Ready. Can't proceed with it! Should abort");
          else
          {
            submap = map[i][j][1].getN3Ready();
            map[i][j][1] = map[i][j][1].getN3ID();

            Array.prototype.push.apply(recheckKeys,N3_EXPORTER.n3MapsMerger(map, submap));
          }
        }
      }
    }
  }while(recheckKeys.length > 0);

  // REMOVING DUPLICATA
  console.log("REMOVING DUPLICATA");
  var tmpChecker = {};
  var key;

  for(var i in map)
  {
    for(var j = map[i].length-1; j >= 0; j--)
    {
      key = map[i][j].join();
      if(!tmpChecker[key])
        tmpChecker[key] = true;
      else
        map[i].splice(j, 1);
    }
    key = null;
    tmpChecker = {};
  }

  return map;
}

var N3_EXPORTER = new N3Exporter();



// then must merge maps with the same key

// then must transcript all maps into N3 format
