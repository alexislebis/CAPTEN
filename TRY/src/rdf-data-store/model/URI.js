var OWL_IRI         = "http://www.w3.org/2002/07/owl";
var RDF_SCHEMA_IRI  = "http://www.w3.org/2000/01/rdf-schema";

// === RDF
var TYPE_URI        = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

// === RDF SCHEMA
var DOMAIN_URI      = RDF_SCHEMA_IRI+"#domain";
var RANGE_URI       = RDF_SCHEMA_IRI+"#range";
var SUBCLASS_URI    = RDF_SCHEMA_IRI+"#subClassOf";
var SUBPROPOF_URI   = RDF_SCHEMA_IRI+"#subPropertyOf";

// === OWL
var CLASS_URI           = OWL_IRI+"#Class";
var PROPERTY_URI        = OWL_IRI+"#ObjectProperty";
var UNION_URI           = OWL_IRI+"#unionOf";
var EQUIVALENCE_URI     = OWL_IRI+"#equivalentClass";
var DISJOINT_URI        = OWL_IRI+"#disjointWith";
var EQUIV_PROP_URI      = OWL_IRI+"#equivalentProperty";
var SAME_AS_URI         = OWL_IRI+"#sameAs";
var INVERSE_OF_URI      = OWL_IRI+"#inverseOf";
var TRANSITIVE_PROP_URI = OWL_IRI+"#TransitiveProperty";
var SYMETRIC_PROP_URI   = OWL_IRI+"#SymmetricProperty";

// === OTHER STANDARDS / SPECS
var GENERATES_URI   = "http://www.w3.or/ns/prov#generates";
var HAS_AUTHOR_URI  = "http://xmlns.com/foaf/0.1/hasAgent";
var NAME_URI        = "http://xmlns.com/foaf/0.1/name";

// === CUSTOM IRI SECTION
var CUSTOM_PREFIX_URI = "http://www.CAPTEN.org/SEED/ontologies/custom/";

// === CUSTOM IRI PREFIX
var CAPTEN_ONTO_IRI = "http://www.CAPTEN.org/SEED/ontologies/"; //TODO handle subblock of step matching a concept
var CAPTEN_VOCAB_IRI_PREFIX = "/vocabulary/"; //Used to identify the vocabulary elements created by the community. e.g: CAPTEN_ONTO_IRI + CAPTEN_VOCAB_IRI_PREFIX + Vocab.Class.name();
                                              //TODO Should be stored in an hashmap to prevent duplicata

var CAPTEN_VOCAB_IRI = CAPTEN_ONTO_IRI + CAPTEN_VOCAB_IRI_PREFIX;
// === CUSTOM PROPERTIES
var USED_AS                 = CAPTEN_ONTO_IRI+"usedAs";//TODO add it to the ontology OR locate it
var INFLUENCES_URI          = CAPTEN_ONTO_IRI+"influences";//TODO add it to the ontology OR locate it
var FOLLOWED_BY_URI         = CAPTEN_ONTO_IRI+"followedBy";
var IS_DESCRIBED_BY_URI     = CAPTEN_ONTO_IRI+"isDescribedBy";
var HAS_NAME_URI            = CAPTEN_ONTO_IRI+"hasName";
var HAS_CONTEXT_URI         = CAPTEN_ONTO_IRI+"hasContext";
var HAS_OBJECTIVE_URI       = CAPTEN_ONTO_IRI+"hasObjective";
var HAS_HYPOTHESIS_URI      = CAPTEN_ONTO_IRI+"hasHypothesis";
var HAS_DESCRIPTION_URI     = CAPTEN_ONTO_IRI+"description";
var HAS_TARGET_USER_URI     = CAPTEN_ONTO_IRI+"targetUser";
var COMES_FROM_URI          = CAPTEN_ONTO_IRI+"comesFrom";//TODO Subclass of "http://www.w3.or/ns/prov#wasGeneratedBy";
var IS_AUTHORED_BY          = CAPTEN_ONTO_IRI+"isAuthoredBy";

// === CUSTOM NODE
var USE_CASE_URI            = CAPTEN_ONTO_IRI+"useCase";
var AUTHOR_URI              = CAPTEN_ONTO_IRI+"Author";
var ANALYSIS_URI            = CAPTEN_ONTO_IRI+"NarratedAnalysisProcess";
var OPERATOR_URI            = CAPTEN_ONTO_IRI+"NarratedOperator";
var OBJECTIVE_URI           = CAPTEN_ONTO_IRI+"Objective";
var HYPOTHESIS_URI          = CAPTEN_ONTO_IRI+"Hypothesis";
var STEP_URI                = CAPTEN_ONTO_IRI+"Step";
var TARGET_USER_URI         = CAPTEN_ONTO_IRI+"TargetUser";
var DESCRIPTION_URI         = CAPTEN_ONTO_IRI+"Description";

// === NON INCLUDED IN THE ONTOLOGY
var NARRATIVE_BLOCK_URI     = CAPTEN_ONTO_IRI+"hasNarrativeBlock";//NOTE Outside the CAPTEN ontology
var COMPOSITE_URI           = CAPTEN_ONTO_IRI+"compositeElement";
var EXTENDED_STRING_URI     = CAPTEN_ONTO_IRI+"extendedString";
var PARAMETER_PATTERN_URI   = CAPTEN_ONTO_IRI+"parameterPattern";
var RGTE_URI                = CAPTEN_ONTO_IRI+"RGTE";
var SuperRGTE_URI           = CAPTEN_ONTO_IRI+"SUPERRGTE";
var PARAMETER_CONFIGURATION_URI = CAPTEN_ONTO_IRI+"parameterConfiguration";

// MARK: anchor-name
//// Test
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
