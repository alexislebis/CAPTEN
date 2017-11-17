var TYPE_URI      = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
var DOMAIN_URI    = "http://www.w3.org/2000/01/rdf-schema#domain";
var RANGE_URI     = "http://www.w3.org/2000/01/rdf-schema#range";
var CLASS_URI     = "http://www.w3.org/2002/07/owl#Class";
var PROPERTY_URI  = "http://www.w3.org/2002/07/owl#ObjectProperty";
var UNION_URI     = "http://www.w3.org/2002/07/owl#unionOf";
var SUBCLASS_URI  = "http://www.w3.org/2000/01/rdf-schema#subClassOf";
var GENERATES_URI = "http://www.w3.or/ns/prov#generates";

var CUSTOM_PREFIX_URI = "http://www.CAPTEN.org/SEED/ontologies/custom/";

// === CUSTOM IRI PREFIX
var CAPTEN_ONTO_IRI = "http://www.CAPTEN.org/SEED/ontologies/"; //TODO handle subblock of step matching a concept
// === CUSTOM PROPERTIES
var USED_AS = CAPTEN_ONTO_IRI+"usedAs";//TODO add it to the ontology OR locate it
var INFLUENCES_URI = CAPTEN_ONTO_IRI+"influences";//TODO add it to the ontology OR locate it
var FOLLOWED_BY_URI = CAPTEN_ONTO_IRI+"followedBy";
var HAS_AUTHOR_URI = "http://xmlns.com/foaf/0.1/hasAgent";
var IS_DESCRIBED_BY_URI = CAPTEN_ONTO_IRI+"isDescribedBy";
var HAS_NAME_URI = CAPTEN_ONTO_IRI+"hasName";
var HAS_CONTEXT_URI = CAPTEN_ONTO_IRI+"hasContext";
var HAS_OBJECTIVE_URI = CAPTEN_ONTO_IRI+"hasObjective";
var HAS_HYPOTHESIS_URI = CAPTEN_ONTO_IRI+"hasHypothesis";
var HAS_DESCRIPTION_URI = CAPTEN_ONTO_IRI+"description";
var HAS_TARGET_USER_URI = CAPTEN_ONTO_IRI+"targetUser";
var COMES_FROM_URI = CAPTEN_ONTO_IRI+"comesFrom";//TODO Subclass of "http://www.w3.or/ns/prov#wasGeneratedBy";
var IS_AUTHORED_BY = CAPTEN_ONTO_IRI+"isAuthoredBy";

// === CUSTOM NODE
var USE_CASE_URI = CAPTEN_ONTO_IRI+"useCase";
var NAME_URI = "http://xmlns.com/foaf/0.1/name";
var AUTHOR_URI = CAPTEN_ONTO_IRI+"Author";
var ANALYSIS_URI = CAPTEN_ONTO_IRI+"NarratedAnalysisProcess";
var OPERATOR_URI = CAPTEN_ONTO_IRI+"NarratedOperator";
var OBJECTIVE_URI = CAPTEN_ONTO_IRI+"Objective";
var HYPOTHESIS_URI = CAPTEN_ONTO_IRI+"Hypothesis";
var STEP_URI = CAPTEN_ONTO_IRI+"Step";
var TARGET_USER_URI = CAPTEN_ONTO_IRI+"TargetUser";
var DESCRIPTION_URI = CAPTEN_ONTO_IRI+"Description";

var NARRATIVE_BLOCK_URI = CAPTEN_ONTO_IRI+"hasNarrativeBlock";//NOTE Outside the CAPTEN ontology


// === NON INCLUDED
var COMPOSITE_URI = CAPTEN_ONTO_IRI+"compositeElement";
var EXTENDED_STRING_URI = CAPTEN_ONTO_IRI+"extendedString";
var PARAMETER_PATTERN_URI = CAPTEN_ONTO_IRI+"parameterPattern";
var PARAMETER_CONFIGURATION_URI = CAPTEN_ONTO_IRI+"parameterConfiguration";
var RGTE_URI = CAPTEN_ONTO_IRI+"RGTE";
var SuperRGTE_URI = CAPTEN_ONTO_IRI+"SUPERRGTE";



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
