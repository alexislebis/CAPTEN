function Token(tok, prio, patt) // REDO old class declaration
{
  this.SIMILARITY_KERNEL = SIMILARITY_KERNEL;
  this.id = TOKEN_ID++;

  if(prio)
    this.priority = prio;
  else
    this.priority = TOKEN_DEFAULT_PRIORITY_VALUE;

  if(patt)
    this.queryPattern = patt;
  else
    this.queryPattern = TOKEN_DEFAULT_QUERY_PATTERN_VALUE;

  this.similarityMatch = 5; //should be used only when queryPattern is set to TOKEN_QUERY_PATTERN_VALUE.SIMILARITY

  if(tok)
    this.token = tok;
  else
    this.token = null;
}

Token.prototype.setToken = function(tok, prio, patt)
{
  if(!tok || (!tok instanceof CAPTENClass && !tok instanceof Property))
    return null;

  this.token = tok;

  if(prio)
    this.priority = prio;
  else
    this.priority = TOKEN_DEFAULT_PRIORITY_VALUE;
  if(patt)
    this.queryPattern = patt;
  else
    this.queryPattern = TOKEN_DEFAULT_QUERY_PATTERN_VALUE;
}

Token.prototype.getToken = function() {return this.token;}

Token.prototype.getSimilarities = function()
{
  if(this.queryPattern != TOKEN_QUERY_PATTERN_VALUE.SIMILARITY)
    return [];

  var sim = [];

  return SIMILARITY_KERNEL.retrieveSimilarities(this, this.similarityMatch);
}

var TOKEN_PRIORITY = [];
TOKEN_PRIORITY.NORMAL = 3;
TOKEN_PRIORITY.LOW = 2;
TOKEN_PRIORITY.VERY_LOW = 1;
TOKEN_PRIORITY.HIGH = 4;
TOKEN_PRIORITY.VERY_HIGH = 5;

var DIMENSION_PRIORITY = [];
DIMENSION_PRIORITY.NORMAL = 3;
DIMENSION_PRIORITY.LOW = 2;
DIMENSION_PRIORITY.VERY_LOW = 1;
DIMENSION_PRIORITY.HIGH = 4;
DIMENSION_PRIORITY.VERY_HIGH = 5;

var TOKEN_ID = 0;
var TOKEN_DEFAULT_PRIORITY_VALUE = TOKEN_PRIORITY.NORMAL;
var TOKEN_DEFAULT_QUERY_PATTERN_VALUE = TOKEN_QUERY_PATTERN_VALUE.PERFECT;
// var TOKEN_DEFAULT_SIMILARITY_VALUE = SIMILARITY_VALUE.VERY_HIGH;


Token.prototype.constructor = Token;
