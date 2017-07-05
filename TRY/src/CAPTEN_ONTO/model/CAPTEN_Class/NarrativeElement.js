/**
 * NarrativeElement is the superclass of all the elements that will be used to
 * add information to other elements
 */

function NarrativeElement()
{
  CAPTENClass.call(this);

  this.uri = "NAU#NarrativeElement";

  this.content = null;
  this.htmlify = " a narrative element";
  this.narrativeCategory = NARRATIVE_CATEGORY_UNKNOWN;
}

NarrativeElement.prototype = new CAPTENClass();
NarrativeElement.prototype.constructor = NarrativeElement;

NarrativeElement.prototype.updateElement = function(content)
{
  if(content == null)
    return;

  this.content = content;
}

NarrativeElement.prototype.getContent = function()
{
  return this.content;
}

NarrativeElement.prototype.selfBuildingWithJson = function(thisjson, alignements) // alignements is an array keeping the correspondance old.id new.id. Check CAPTENLoader
{
  if(thisjson == null)
    return;

  for(var i in thisjson)
  {
    if(typeof thisjson === 'function')
    {
      // NTD
    }
    else if(i == "extString")
    {
      var exSt = new ExtendedString();

      exSt.selfBuildingWithJson(thisjson[i], alignements);

      CAPTEN_LOADER_ALIGNMENTS_NEW_ROW(alignements, thisjson[i].id, exSt, null);

      this[i] = exSt;
    }
    else if(typeof thisjson[i] === 'object')
    {
      if(i == "name" || i == "content")
      {
        if(thisjson[i]['extString'])
        {
          var exSt = new ExtendedString();

          exSt.selfBuildingWithJson(thisjson[i]['extString'], alignements);

          if(thisjson[i]['extString'].id)
            CAPTEN_LOADER_ALIGNMENTS_NEW_ROW(alignements, thisjson[i]['extString'].id, exSt, null);

          this[i] = exSt;
        }
      }
      else
      {
        console.log("doing nothing but it's subclasses information and others");
      }
    }
    else
    {
      if(i != "id")
        this[i] = thisjson[i];
    }
  }
  // if(thisjson.uri)
  //   this.uri = thisjson.uri;
  //
  // if(thisjson.htmlify)
  //   this.htmlify = thisjson.htmlify;
  //
  // if(thisjson.narrativeCategory)
  //   this.narrativeCategory = thisjson.narrativeCategory;
  //
  // if(thisjson.content)
  // {
  //   if(thisjson.content.uri == EXTENDED_STRING_URI)
  //   {
  //     var exSt = new ExtendedString();
  //
  //     exSt.selfBuildingWithJson(thisjson.content, alignements);
  //     this.content = exSt;
  //   }
  //   else
  //   {
  //     console.log("default behavior");
  //     this.content = thisjson.content;
  //   }
  //
  // }
}


var NARRATIVE_CATEGORY_UNKNOWN = "unkwon";
var NARRATIVE_CATEGORY_WHAT = "what";
var NARRATIVE_CATEGORY_WHO = "who";
var NARRATIVE_CATEGORY_WHERE = "where";
var NARRATIVE_CATEGORY_WHEN = "when";
var NARRATIVE_CATEGORY_HOW = "how";
