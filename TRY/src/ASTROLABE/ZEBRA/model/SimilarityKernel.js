/**
 * SimilarityKernel is desgined to handle similarities between tokens.
 * Currently, it is hard coded, but shoud evolve according to user input and
 * ontological evolution.
 *
 * For each token :
 * [TOK1] : {[TOK2, SIM_VALUE2], [TOK3, SIM_VALUE3]}
 * [TOK2] : {//NOTHING}
 * [TOK3] : {[TOK1, SIM_VALUE1]} // WITH SIM_VALUE1 != SIM_VALUE3
 *
 *  TERM.uri  -> TERM
              -> R(T1,T2)
 *
 * RELATION.uri ->
 */

 var SIMILARITY_VALUE = [];
 SIMILARITY_VALUE.NORMAL = 3;
 SIMILARITY_VALUE.LOW = 2;
 SIMILARITY_VALUE.VERY_LOW = 1;
 SIMILARITY_VALUE.HIGH = 4;
 SIMILARITY_VALUE.VERY_HIGH = 5;

 function SimilarityKernel()
 {
   this.similarities = [];

   // HARD DEFINITION
   var rel; var c;

   var c = new CAPTENClass(); c.uri = "http://www.CAPTEN.org/SEED/ontologies/custom/Lyceen";
   this.similarities["http://www.CAPTEN.org/SEED/ontologies/custom/Etudiant"] = [];
   this.similarities["http://www.CAPTEN.org/SEED/ontologies/custom/Etudiant"].push([new Token(c), SIMILARITY_VALUE.VERY_HIGH]);

   rel = new Property(); rel.uri = "http://www.CAPTEN.org/SEED/ontologies/custom/faitPar"; rel.from = 'http://www.CAPTEN.org/SEED/ontologies/custom/Actions'; rel.to = "http://www.CAPTEN.org/SEED/ontologies/custom/Etudiant";
   this.similarities["http://www.CAPTEN.org/SEED/ontologies/custom/Parcours"] = [];
   this.similarities["http://www.CAPTEN.org/SEED/ontologies/custom/Parcours"].push([new Token(rel), SIMILARITY_VALUE.VERY_HIGH]);

   rel = new Property(); rel.uri ="http://www.CAPTEN.org/SEED/ontologies/custom/decouvre"; rel.from ='http://www.CAPTEN.org/SEED/ontologies/custom/Actions'; rel.to = "http://www.CAPTEN.org/SEED/ontologies/custom/Etudiant";
   this.similarities["http://www.CAPTEN.org/SEED/ontologies/custom/assimilableA(http://www.CAPTEN.org/SEED/ontologies/custom/Parcours,http://www.CAPTEN.org/SEED/ontologies/custom/Pattern)"] = [];
   this.similarities["http://www.CAPTEN.org/SEED/ontologies/custom/assimilableA(http://www.CAPTEN.org/SEED/ontologies/custom/Parcours,http://www.CAPTEN.org/SEED/ontologies/custom/Pattern)"].push([new Token(rel), SIMILARITY_VALUE.VERY_HIGH]);
   rel = new Property(); rel.uri = "http://www.CAPTEN.org/SEED/ontologies/custom/decouvre"; rel.from = "http://www.CAPTEN.org/SEED/ontologies#NarratedAnalysisProcess"; rel.to = "http://www.CAPTEN.org/SEED/ontologies/custom/Pattern";
   this.similarities["http://www.CAPTEN.org/SEED/ontologies/custom/assimilableA(http://www.CAPTEN.org/SEED/ontologies/custom/Parcours,http://www.CAPTEN.org/SEED/ontologies/custom/Pattern)"].push([new Token(rel), SIMILARITY_VALUE.LOW]);

   c = new CAPTENClass(); c.uri="http://www.CAPTEN.org/SEED/ontologies/custom/Categorie";
   this.similarities["http://www.CAPTEN.org/SEED/ontologies/custom/categorise"] = [];
   this.similarities["http://www.CAPTEN.org/SEED/ontologies/custom/categorise"].push([new Token(c), SIMILARITY_VALUE.VERY_HIGH]);
 }

 SimilarityKernel.prototype.getDefaultSimilarityValue = function()
 {
   return SIMILARITY_VALUE.VERY_HIGH;
 },

 SimilarityKernel.prototype.retrieveSimilarities= function(token, tresh)
 {
   if(!token)
    return [];

   if(token.token instanceof CAPTENClass)
    return this._filterKeyWithThreshold(token.token.uri, tresh);
   else if(token.token instanceof Property)
   {
    var array = []; var tmpA= [];
    array = this._filterKeyWithThreshold(token.token.uri+"("+token.token.from+","+token.token.to+")",tresh);
    tmpA = this._filterKeyWithThreshold(token.token.uri+"("+token.token.from+",)");
    for(var i in tmpA)
      array.push(tmpA[i]);
    tmpA = this._filterKeyWithThreshold(token.token.uri+"(,"+token.token.to+")");
    for(var j in tmpA)
      array.push(tmpA[j]);
    tmpA = this.retrieveLimitedSimilarities(token, tresh);
    for(k in tmpA)
      array.push(tmpA[k]);

    return array;
   }

   return [];
 },

 //Retrieve only URI of the root token. IE : for relation, will not check into from & to
 SimilarityKernel.prototype.retrieveLimitedSimilarities = function(token, tresh)
 {
   if(!token)
    return [];
   return this._filterKeyWithThreshold(token.token.uri, tresh);
 },

 SimilarityKernel.prototype._filterKeyWithThreshold = function(key, thrshld)
 {
   if(!this.similarities[key])
    return [];

    var array = [];

    for(var i in this.similarities[key])
    {
      if(this.similarities[key][i][1] >= thrshld)
        array.push(this.similarities[key][i]);
    }

    return array;
 }


var SIMILARITY_KERNEL = new SimilarityKernel();
