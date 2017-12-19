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

// N3Exporter.prototype.exportObjToN3Ready = function(obj)//@ redo //@DO NO USE
// {
//   if(!obj.getPropertiesRelations || !obj.getN3ID || obj.id == null)
//     return null;
//
//   var n3ID = obj.getN3ID();
//   var map = {};
//   var propsRel = [];
//   var res = obj.getPropertiesRelations();
//
//   map[n3ID] = [];
//
//   for(var i =0; i < res.length; i++)
//   {
//     propsRel = res[i];
//
//     if(propsRel[1] !== null && typeof propsRel[1] === 'object')
//       if(!propsRel[1].getN3ID)
//         console.error("WARNING. The element is identified as an object but does not have getN3ID!");
//       else
//         propsRel[1] = propsRel[1].getN3ID();
//     // Otherwise, we don't try to transcript the element in propsRel[1] into smth like <#ID>
//
//     map[n3ID].push(propsRel);
//   }
//
//   return map;
// }

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

  // CLEANING NULL VALUE
  console.log("CLEANING NULL VALUE");

  for(var i in map)
  {
    for(var j = map[i].length-1; j >=0; j--)
    {
      if(!map[i][j][0] || !map[i][j][1])
        map[i].splice(j, 1);
    }
  }

  console.log("CLEANING GOSTH REFERENCING"); //Prevent to have a <d> <p> <r> where <r> is not defined anywher

  for(var i in map)
  {
    for(var j = map[i].length-1; j >= 0; j--)
    {
      if(map[i][j][1].indexOf("<#") != -1 && !map[map[i][j][1]])
        map[i].splice(j,1);
    }
  }

  return map;
}

N3Exporter.prototype.n3Caller = function(array)//Call, for each element of array their associated getN3Ready function
{
  if(array == null)
    return;

  var mainMap = {};
  var subMap = {};

  for(var i in array)
  {
    if(array[i] && array[i].getN3ID && array[i].getN3Ready)
    {
      subMap = array[i].getN3Ready();
      this.n3MapsMerger(mainMap, subMap);
    }
  }

  return mainMap;
}

N3Exporter.prototype.dedicatedVocN3Readier = function(vocab, customcls, customprops)
{
  var mainMap = {};
  var subMap = {};
  var concatCls = [];
  var res;
  var additionalProps = []; // [] of [domain, prop, range] as obj

  this.n3MapsMerger(mainMap, this.n3Caller(vocab.getProperties()));
  this.n3MapsMerger(mainMap, this.n3Caller(customprops));
  concatCls = vocab.getClasses().concat(customcls);
  this.n3MapsMerger(mainMap, this.n3Caller(concatCls));

  for(var i = 0; i < concatCls.length; i++)
  {
    for(var j in concatCls[i].subClassOf)
    {
      subMap[concatCls[i].getN3ID()] = [];
      subMap[concatCls[i].getN3ID()].push([SUBCLASS_URI, concatCls[i].subClassOf[j]]);
    }
    for(var j in concatCls[i].subClasses)
    {
      subMap[concatCls[i].subClasses[j].getN3ID()] = [];
      subMap[concatCls[i].subClasses[j].getN3ID()].push([SUBCLASS_URI, concatCls[i]]);
    }
  }

  this.n3MapsMerger(mainMap,subMap);

  //Retrieving properties between classes (e.g. smth is a)
  for(var i = 0; i < concatCls.length; i++)
  {
    for(var j = 0; j < concatCls.length; j++)
    {
      res = PROPERTIES_POOL.getPropertiesByExtremitiesHashedPool(concatCls[i].id, concatCls[j].id);
      if(res && res.length > 0)
      {
        subMap[concatCls[i].getN3ID()] = [];
        subMap[concatCls[i].getN3ID()].push([res.getURI(), concatCls[j]]);
      }
    }
  }

  this.n3MapsMerger(mainMap, subMap);

  return mainMap;
}

//Transform a n3 map into a common n3 string
N3Exporter.prototype.n3Formater = function(n3Map)
{
  var n3String = "";
  var tmpN3 = "";
  var p = ""; var r = "";

  for(var i in n3Map)
  {
    tmpN3 += ""+i+" "; //TODO prevent to format a single key without any prop and range (this could happen if all elements were null)

    for(var j = 0; j < n3Map[i].length; j++)
    {
      p = n3Map[i][j][0];
      if(p.charAt(0) != "<")
        p = "<"+p+">";
      r = n3Map[i][j][1];
      if(r.charAt(0) != "<")
        r = "<"+r+">";
      tmpN3 += p+" "+r;
      if(j == n3Map[i].length-1)
        tmpN3 += " .\n";
      else
        tmpN3 += " ;\n";
    }

    n3String += tmpN3 + "\n";
    tmpN3 = "";
  }

  return n3String;
}

// save a n3 string
N3Exporter.prototype.n3Saver = function(n3String)
{
  var blob = new Blob([n3String], {type: "text/plain;charset=utf-8"});
  var url  = URL.createObjectURL(blob);

  var a = document.createElement('a');
  a.download    = "CAPTEN_TURTLE_EXPORT.json";
  a.href        = url;
  a.click();

  setTimeout(function(){  // fixes firefox html removal bug
  window.URL.revokeObjectURL(url);
  a.remove();
  }, 500);

  // document.body.removeChild(element);
  // var a = document.createElement('a');
  // a.download    = "CAPTEN_TURTLE_EXPORT.ttl";
  // a.href        = "type:texte/turtle;charset=utf-8," + n3String;
  // document.body.appendChild(a);
  // a.click();
  // document.body.removeChild(a);
  // delete a;
}

//Serialize into n3 the whole application defined by NAP/NOP, VOCAB and NarrBCK
N3Exporter.prototype.n3MainSerializer = function(vocab, customcls, customprops)
{
  PROPERTIES_POOL.updateHashedPool();

  var mainMap = {};

  mainMap = this.dedicatedVocN3Readier(vocab, customcls, customprops);

  this.n3MapsMerger(mainMap, this.n3Caller(NARRATED_OPERATOR_POOL.pool));

  this.n3MapsMerger(mainMap, this.n3Caller(NARRATED_ANALYSIS_POOL.pool));

  this.n3Saver(this.n3Formater(this.n3MapSolver(mainMap)));

}

var N3_EXPORTER = new N3Exporter();



// then must merge maps with the same key

// then must transcript all maps into N3 format
