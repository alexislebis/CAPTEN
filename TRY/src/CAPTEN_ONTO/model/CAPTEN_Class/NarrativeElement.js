/**
 * NarrativeElement is the superclass of all the elements that will be used to
 * add information to other elements
 */

function NarrativeElement()
{
  CAPTENClass.call(this);

  this.uri = "NAU#NarrativeElement";

  this.content = "null";
  this.htmlify = " a narrative element";
  this.narrativeCategory = NARRATIVE_CATEGORY_UNKNOWN;
}

NarrativeElement.prototype = new CAPTENClass();
NarrativeElement.prototype.constructor = NarrativeElement;


var NARRATIVE_CATEGORY_UNKNOWN = "unkwon";
var NARRATIVE_CATEGORY_WHAT = "what";
var NARRATIVE_CATEGORY_WHO = "who";
var NARRATIVE_CATEGORY_WHERE = "where";
var NARRATIVE_CATEGORY_WHEN = "when";
var NARRATIVE_CATEGORY_HOW = "how";
