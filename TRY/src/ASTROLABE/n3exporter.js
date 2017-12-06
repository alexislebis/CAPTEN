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

var exportObjToN3Ready = function(obj)
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

// then must merge maps with the same key

// then must transcript all maps into N3 format
