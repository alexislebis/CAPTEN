var TYPE_URI      = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
var DOMAIN_URI    = "http://www.w3.org/2000/01/rdf-schema#domain";
var RANGE_URI     = "http://www.w3.org/2000/01/rdf-schema#range";
var CLASS_URI     = "http://www.w3.org/2002/07/owl#Class";
var PROPERTY_URI  = "http://www.w3.org/2002/07/owl#ObjectProperty";
var UNION_URI     = "http://www.w3.org/2002/07/owl#unionOf";
var SUBCLASS_URI  = "http://www.w3.org/2000/01/rdf-schema#subClassOf";
var GENERATES_URI = "http://www.w3.or/ns/prov#generates";

var CUSTOM_PREFIX_URI = "http://www.CAPTEN.org/SEED/ontologies/custom/";

// === CUSTOM PROPERTIES
var USED_AS = "http://www.CAPTEN.org/SEED/ontologies/usedAs";//TODO add it to the ontology OR locate it
var INFLUENCES_URI = "http://www.CAPTEN.org/SEED/ontologies/influences";//TODO add it to the ontology OR locate it
var FOLLOWED_BY_URI = "http://www.CAPTEN.org/SEED/ontologies/followedBy";
var HAS_AUTHOR_URI = "http://xmlns.com/foaf/0.1/hasAgent";
var IS_DESCRIBED_BY_URI = "http://www.CAPTEN.org/SEED/ontologies/isDescribedBy";
var HAS_NAME_URI = "http://www.CAPTEN.org/SEED/ontologies/hasName";
var HAS_CONTEXT_URI = "http://www.CAPTEN.org/SEED/ontologies/hasContext";
var HAS_OBJECTIVE_URI = "http://www.CAPTEN.org/SEED/ontologies/hasObjective";
var HAS_HYPOTHESIS_URI = "http://www.CAPTEN.org/SEED/ontologies/hasHypothesis";
var HAS_DESCRIPTION_URI = "http://www.CAPTEN.org/SEED/ontologies/description";
var HAS_TARGET_USER_URI = "http://www.CAPTEN.org/SEED/ontologies/targetUser";
var COMES_FROM_URI = "http://www.CAPTEN.org/SEED/ontologies/comesFrom";//TODO Subclass of "http://www.w3.or/ns/prov#wasGeneratedBy";
var IS_AUTHORED_BY = "http://www.CAPTEN.org/SEED/ontologies/isAuthoredBy";

// === CUSTOM NODE
var USE_CASE_URI = "http://www.CAPTEN.org/SEED/ontologies/useCase";
var NAME_URI = "http://xmlns.com/foaf/0.1/name";
var AUTHOR_URI = "http://www.CAPTEN.org/SEED/ontologies/Author";
var ANALYSIS_URI = "http://www.CAPTEN.org/SEED/ontologies/NarratedAnalysisProcess";
var OPERATOR_URI = "http://www.CAPTEN.org/SEED/ontologies/NarratedOperator";
var OBJECTIVE_URI = "http://www.CAPTEN.org/SEED/ontologies/Objective";
var HYPOTHESIS_URI = "http://www.CAPTEN.org/SEED/ontologies/Hypothesis";
var STEP_URI = "http://www.CAPTEN.org/SEED/ontologies/Step";
var TARGET_USER_URI = "http://www.CAPTEN.org/SEED/ontologies/TargetUser";
var DESCRIPTION_URI = "http://www.CAPTEN.org/SEED/ontologies/Description";

var NARRATIVE_BLOCK_URI = "http://www.CAPTEN.org/SEED/ontologies/hasNarrativeBlock";//NOTE Outside the CAPTEN ontology


// === NON INCLUDED
var COMPOSITE_URI = "http://www.CAPTEN.org/SEED/ontologies/compositeElement";
var EXTENDED_STRING_URI = "http://www.CAPTEN.org/SEED/ontologies/extendedString";
var PARAMETER_PATTERN_URI = "http://www.CAPTEN.org/SEED/ontologies/parameterPattern";
var PARAMETER_CONFIGURATION_URI = "http://www.CAPTEN.org/SEED/ontologies/parameterConfiguration";
var RGTE_URI = "http://www.CAPTEN.org/SEED/ontologies/RGTE";
var SuperRGTE_URI = "http://www.CAPTEN.org/SEED/ontologies/SUPERRGTE";



var URI_TO_LABEL = function(uri)
{
  var label = null;


  switch (uri) {
    case USED_AS:
      label = "used as";
      break;
    case INFLUENCES_URI:
      label = "influences";
      break;
    case FOLLOWED_BY_URI:
      label = "followed by";
      break;
    case HAS_AUTHOR_URI:
      label = "has for author";
      break;
    case IS_DESCRIBED_BY_URI:
      label = "described by";
      break;
    case HAS_NAME_URI:
      label = 'named';
      break;
    case HAS_CONTEXT_URI:
      label = "has for context";
      break;
    case HAS_OBJECTIVE_URI:
      label = "has for objective";
      break;
    case NARRATIVE_BLOCK_URI:
      label = "has for narrative block";
      break;
    case HAS_HYPOTHESIS_URI:
      label = "has for hypothesis";
      break;
    case HAS_DESCRIPTION_URI:
      label = "has for description";
      break;
    case HAS_TARGET_USER_URI:
      label = "has for target user";
      break;
    case COMES_FROM_URI:
      label = "comes from";
      break;
    case IS_AUTHORED_BY:
      label = "has for author";
      break;
    default:
      label = null;
  }

  return label;
};
