/**
 * The sparqlQueryCommonBehaviorBuilder is dedicated to generate the common behaviors for various SPARQL query regarding relation queries and term queries.
    For exemple, querying relation into a RGTE is slightly different than an objective (or narrative element) or in a NAP directly, despite the common ground is
    to look if x match term 1, y term 2, and there is a relation equivalent to r1 such as <x r y>.
 */

// === RELATION MATCHING PATTERN
  /** There is *SEVEN* patterns:
    *   1) Perfect matching   (r<t1,t2>)
    *   2) Prefix matching    (r<t1,_>)
    *   3) Sufix Matching     (r<_,t2>)
    *   4) Relation Matching  (r)
    *   5) DoubleTermsMatching(t1,t2)
    *   6) MonoPrefixMatching (t1)
    *   7) MonoSufixMatching  (t2)
    */
function relation()
{}

 relation.prototype.perfectMatching = function(relation, t1, t2, t1Symbol, t2Symbol, specificPart)
 {
   //like : ?x <type> <IRI:t1> . ?y <type> <IRI:t2> . ?x <IRI:rel> ?y
   var commonBehavior = "?"+t1Symbol+" <"+TYPE_URI+"> <"+t1+"> . ?"+t2Symbol+" <"+TYPE_URI+"> <"+t2+"> . ?"+t1Symbol+" <"+relation+"> ?"+t2Symbol+" .";

   var query = "SELECT * WHERE { "+specificPart+" "+commonBehavior+" }";

   return query;
 }


//Root for sparqlQueryCommonBehaviorBuilder
 function sparqlQueryCommonBehaviorBuilder()
 {

 }

 sparqlQueryCommonBehaviorBuilder.prototype.relation = new relation();
