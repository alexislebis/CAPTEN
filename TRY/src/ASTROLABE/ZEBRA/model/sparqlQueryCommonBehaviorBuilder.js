/**
 * The sparqlQueryCommonBehaviorBuilder is dedicated to generate the common behaviors for various SPARQL query regarding relation queries and term queries.
    For exemple, querying relation into a RGTE is slightly different than an objective (or narrative element) or in a NAP directly, despite the common ground is
    to look if x match term 1, y term 2, and there is a relation equivalent to r1 such as <x r y>.
 */

var TOKEN_QUERY_PATTERN_VALUE = [];
TOKEN_QUERY_PATTERN_VALUE.PERFECT = 0;
TOKEN_QUERY_PATTERN_VALUE.PREFIX = 1;
TOKEN_QUERY_PATTERN_VALUE.REVERSE_PREFIX = 2;
TOKEN_QUERY_PATTERN_VALUE.SUFIX = 3;
TOKEN_QUERY_PATTERN_VALUE.REVERSE_SUFIX = 4;
TOKEN_QUERY_PATTERN_VALUE.LOOSE = 5;
TOKEN_QUERY_PATTERN_VALUE.DBL_TERMS = 6;
TOKEN_QUERY_PATTERN_VALUE.MONO_PREFIX = 7;
TOKEN_QUERY_PATTERN_VALUE.MONO_SUFIX = 8;
// === RELATION MATCHING PATTERN
  /** There is *NINE* patterns:
    *   1) Perfect matching   (r<t1,t2>)
    *   2) Prefix matching    (r<t1,_>)
    *   3) Reverse Prefix Matching (r<_,t1>)
    *   4) Sufix Matching     (r<_,t2>)
    *   5) Reverse Sufix Matching (r<t2,_>)
    *   6) Loose Matching  (r)
    *   7) DoubleTermsMatching(t1,t2)
    *   8) MonoPrefixMatching (t1)
    *   9) MonoSufixMatching  (t2)
    */
function relation()
{}

  // relation.prototype.buildQuery = function(specificClause, commonClause, header)
  // {
  //   if(!header)
  //     header = "SELECT * WHERE ";
  //
  //   var query = header + "{ "+specificClause +" "+ commonClause + " }";
  //
  //   return query;
  // }

 relation.prototype.perfectMatching = function(relation, t1, t2, t1Symbol, t2Symbol, specificPart)
 {
   //like : ?x <type> <IRI:t1> . ?y <type> <IRI:t2> . ?x <IRI:rel> ?y
   var commonBehavior = "?"+t1Symbol+" <"+TYPE_URI+"> <"+t1+"> . ?"+t2Symbol+" <"+TYPE_URI+"> <"+t2+"> . ?"+t1Symbol+" <"+relation+"> ?"+t2Symbol+" .";

   return __RELATION_QUERY_BUILDER(specificPart, commonBehavior);
 }

 relation.prototype.prefixMatching = function(relation, t1, t2, t1Symbol, t2Symbol, specificPart)
 {
   var commonBehavior = "?"+t1Symbol+" <"+TYPE_URI+"> <"+t1+"> . ?"+t1Symbol+" <"+relation+"> ?autoSymb .";
   return __RELATION_QUERY_BUILDER(specificPart, commonBehavior);
 }

 relation.prototype.reversePrefixMatching = function(relation, t1, t2, t1Symbol, t2Symbol, specificPart)
 {
   var commonBehavior = "?"+t1Symbol+" <"+TYPE_URI+"> <"+t1+"> . ?autoSymb <"+relation+"> ?"+t1Symbol+" .";
   return __RELATION_QUERY_BUILDER(specificPart, commonBehavior);
 }

 relation.prototype.sufixMatching = function(relation, t1, t2, t1Symbol, t2Symbol, specificPart)
 {
   var commonBehavior = "?"+t2Symbol+" <"+TYPE_URI+"> <"+t2+"> . ?autoSymb <"+relation+"> ?"+t2Symbol+" .";
   return __RELATION_QUERY_BUILDER(specificPart, commonBehavior);
 }

 relation.prototype.reverseSufixMatching = function(relation, t1, t2, t1Symbol, t2Symbol, specificPart)
 {
   var commonBehavior = "?"+t2Symbol+" <"+TYPE_URI+"> <"+t2+"> . ?"+t2Symbol+" <"+relation+"> ?autoSymb .";
   return __RELATION_QUERY_BUILDER(specificPart, commonBehavior);
 }

 relation.prototype.looseMatching = function(relation, t1, t2, t1Symbol, t2Symbol, specificPart)
 {
   var commonBehavior = "?"+t1Symbol+" <"+relation+"> <?"+t2Symbol+"> .";

   return __RELATION_QUERY_BUILDER(specificPart, commonBehavior);
 }

 relation.prototype.doubleTermMatching = function(relation, t1, t2, t1Symbol, t2Symbol, specificPart)
 {
   var commonBehavior = "?"+t1Symbol+" <"+TYPE_URI+"> <"+t1+"> ." + "?"+t2Symbol+" <"+TYPE_URI+"> <"+t2+"> .";

   return __RELATION_QUERY_BUILDER(specificPart, commonBehavior);
 }

 relation.prototype.monoPrefixMatching = function(relation, t1, t2, t1Symbol, t2Symbol, specificPart)
 {
   var commonBehavior = "?"+t1Symbol+" <"+TYPE_URI+"> <"+t1+"> .";
   return __RELATION_QUERY_BUILDER(specificPart, commonBehavior);
 }

 relation.prototype.monoSufixMatching = function(relation, t1, t2, t1Symbol, t2Symbol, specificPart)//dry
 {
   return this.monoPrefixMatching(t2, t2Symbol, specificPart);
 }

 var __RELATION_QUERY_BUILDER = function(specificClause, commonClause, header)
 {
   if(!header)
     header = "SELECT * WHERE ";

   var query = header + "{ "+specificClause +" "+ commonClause + " }";

   return query;
 };

// === TERM MATCHING PATTERN
  /** Ther is *ONEù pattern
    * 1) Perfect matching   (t1)
  */
  function term()
  {}
  term.prototype.perfectMatching = function(t1, t1Symbol, specificPart)
  {
    var commonBehavior = "?"+t1Symbol+" <"+TYPE_URI+"> <"+t1+"> .";

    var query = "SELECT * WHERE { "+specificPart+" "+commonBehavior+" }";

    return query;
  }

//Root for sparqlQueryCommonBehaviorBuilder
 function sparqlQueryCommonBehaviorBuilder()
 {}

 sparqlQueryCommonBehaviorBuilder.prototype.relation = new relation();
 sparqlQueryCommonBehaviorBuilder.prototype.term = new term();
