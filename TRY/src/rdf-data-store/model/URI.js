var OWL_IRI         = "http://www.w3.org/2002/07/owl";
var RDF_SCHEMA_IRI  = "http://www.w3.org/2000/01/rdf-schema";

// === RDF
var TYPE_URI        = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
var SEQUENCE_URI    = "http://www.w3.org/1999/02/22-rdf-syntax-ns#Seq";
var ORDERED_LIST_URI= "http://www.w3.org/1999/02/22-rdf-syntax-ns#li";

// === RDF SCHEMA
var DOMAIN_URI            = RDF_SCHEMA_IRI+"#domain";
var RANGE_URI             = RDF_SCHEMA_IRI+"#range";
var SUBCLASS_URI          = RDF_SCHEMA_IRI+"#subClassOf";
var SUBPROPOF_URI         = RDF_SCHEMA_IRI+"#subPropertyOf";
var DATE_TIME_URI         = RDF_SCHEMA_IRI+"#dateTime";
var POSITIVE_INTEGER_URI  = RDF_SCHEMA_IRI+"#positiveInteger";
var NON_NEG_INTEGER_URI   = RDF_SCHEMA_IRI+"#nonNegativeInteger";
var STRING_URI            = RDF_SCHEMA_IRI+"#string";

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
var GENERATES_URI        = "http://www.w3.or/ns/prov#generates";
var WAS_GENERATED_BY_URI = "http://www.w3.or/ns/prov#wasGeneratedBy";
var HAS_AUTHOR_URI       = "http://xmlns.com/foaf/0.1/hasAgent";
var NAME_URI             = "http://xmlns.com/foaf/0.1/name";
var ANNOTATION_URI       = "https://www.w3.org/ns/oa#Annotation";
var RESEARCH_OBJECT_URI  = "http://purl.org/wf4ever/ro#ResearchObject"


// === CUSTOM IRI SECTION
  // BASED ON VERSION 0.2.5 & 0.3
var CUSTOM_PREFIX_URI = "http://www.CAPTEN.org/SEED/ontologies/custom/";

// === CUSTOM IRI PREFIX
var CAPTEN_ONTO_IRI = "http://www.CAPTEN.org/SEED/ontologies/"; //TODO handle subblock of step matching a concept
var CAPTEN_ONTO_IDENTIFIER_IRI  = "http://www.CAPTEN.org/SEED/identifier/";
var CAPTEN_VOCAB_IRI_PREFIX = "/vocabulary/"; //Used to identify the vocabulary elements created by the community. e.g: CAPTEN_ONTO_IRI + CAPTEN_VOCAB_IRI_PREFIX + Vocab.Class.name();
                                              //TODO Should be stored in an hashmap to prevent duplicata

var CAPTEN_CLASS_URI  = CAPTEN_ONTO_IRI+"Thing";
var CAPTEN_PROP_URI   = CAPTEN_ONTO_IRI+"haveAProperty";

// var CAPTEN_VOCAB_IRI = CAPTEN_ONTO_IRI + CAPTEN_VOCAB_IRI_PREFIX;
var CAPTEN_VOCAB_IRI = CUSTOM_PREFIX_URI;

// === CUSTOM PROPERTIES
  // === OPERATOR PROPS
  var EQUIVALENT_OPERATION_TO_URI = CAPTEN_ONTO_IRI+"equivalentOperationTo";
  var PROTOTYPICAL_USE_URI        = CAPTEN_ONTO_IRI+"prototypicalUse";
  var IS_INSTANCIABLE_IN_URI      = CAPTEN_ONTO_IRI+"isInstanciableIn";
  var IS_DEPICTED_BY_URI          = CAPTEN_ONTO_IRI+"isDepictedBy";
  var INFORMATIVE_CONTENT_URI     = CAPTEN_ONTO_IRI+"informativeContent";
  var IMPLEMENTATION_INFO_URI     = CAPTEN_ONTO_IRI+"implementationInformation";
  var TOOL_VERSION_URI            = CAPTEN_ONTO_IRI+"toolVersion";
  var TOOL_NAME_URI               = CAPTEN_ONTO_IRI+"toolName";
  var IS_CONSTRAINED_BY_URI       = CAPTEN_ONTO_IRI+"isConstrainedBy";
  var HAS_DATA_CONSTRAINTS        = CAPTEN_ONTO_IRI+"hasDataConstraints"; // @NEW : ADDED ASTOLABE 0.0.3 ONTO
  // var WAS_GENERATED_BY_URI   // ALREADY DEFINED ABOVE
  var MODIFIES_URI                = CAPTEN_ONTO_IRI+"modifies";
  var SUB_PART_OF_URI             = CAPTEN_ONTO_IRI+"subPartOf";
  var SUB_VARIABLES_OF            = CAPTEN_ONTO_IRI+"subVariablesOf"; // @NEW : ADDED ASTROLABE 0.0.3 ONTO
  var IS_CONCEPTUALIZED_BY_URI    = CAPTEN_ONTO_IRI+"isConceptualizedBy";
  var IS_VALUABLE_URI             = CAPTEN_ONTO_IRI+"isValuable";
  var HAS_SELECTION_METHOD_URI    = CAPTEN_ONTO_IRI+"hasSelectionMethod";
  var CONTAINS_URI                = CAPTEN_ONTO_IRI+"contains";
  var CONSISTS_OF_URI             = CAPTEN_ONTO_IRI+"consistsOf";
  var HAS_OBJECTIVE_URI           = CAPTEN_ONTO_IRI+"hasObjective";
  var HAS_BEHAVIOUR_URI           = CAPTEN_ONTO_IRI+"hasBehaviour";
    var HAS_INPUT_BEHAVIOUR_URI   = CAPTEN_ONTO_IRI+"hasInputBehaviour"; //TODO IMPORTANT child property of HAS_BEHAVIOUR_URI where domain is INPUT_PATTERN_URI
    var HAS_OUTPUT_BEHAVIOUR_URI  = CAPTEN_ONTO_IRI+"hasOutputBehaviour"; // TODO IMPORTANT child property of HAS_BEHAVIOUR_URI
    var HAS_PARAMETER_BEHAVIOUR_URI = CAPTEN_ONTO_IRI+"hasParameterBehaviour"; // TODO IMPORTANT child
  var IS_CONFIGURED_BY_URI        = CAPTEN_ONTO_IRI+"isConfiguredBy";
  var DEPENDANCES_URI             = CAPTEN_ONTO_IRI+"dependances"; // @NEW : ADDEDE ASTROLABE 0.0.3 ONTO
    var DEPENDS_ON_URI            = CAPTEN_ONTO_IRI+"dependsOn";
    var UTILISATION_RESTRIC_URI   = CAPTEN_ONTO_IRI+"utilisationRestrictions"; // @NEW ; ADDED ASTROLABE 0.0.3 ONTO
  var IS_SPECIALIZED_BY_URI       = CAPTEN_ONTO_IRI+"isSpecializedBy"; // @NEW : ADDED ASTROLABE 0.0.3 ONTO
    var SPECIALIZE_UTILISATION_URI= CAPTEN_ONTO_IRI+"specializeUtilisation"; // @NEW : ADDED ASTROLABE 0.0.3 ONTO
  var HAS_INFLUENCE_URI           = CAPTEN_ONTO_IRI+"hasInfluence";
  var HAS_INPUT_URI               = CAPTEN_ONTO_IRI+"hasInput";
  var HAS_OUTPUT_URI              = CAPTEN_ONTO_IRI+"hasOutput";
  var HAS_OPERATION_URI           = CAPTEN_ONTO_IRI+"hasOperation";

  var HAS_VARIABLE_URI            = CAPTEN_ONTO_IRI+"hasVariable"; // TODO Important GRAPHs (Input, Output...) have variables in onto
  var HAS_CONTENT_URI             = CAPTEN_ONTO_IRI+"hasContent"; // TODO The content of an element, possibly only a narrative element
  var CONTENT_URI                 = CAPTEN_ONTO_IRI+"Content"; //The content of smth, principally of a narrative element
  var HAS_STEPS_URI               = CAPTEN_ONTO_IRI+"hasSteps"; //TODO add in the onto

  var HAS_PREVIOUS_STEP           = CAPTEN_ONTO_IRI+"hasPreviousStep";

    var K_GENERATED_BY_URI        = CAPTEN_VOCAB_IRI+"knowledgeGeneratedBy"; // @NEW : ADDEDE ASTROLABE 0.0.3 ONTO

  // === NAP PROPS
  // === STEP PROPS
  // === SCIENTIFIC STATEMENTS PROPS
  var HAS_HAECCEITY                 = CAPTEN_ONTO_IRI+"hasHaecceity";
    var HAS_SCIENTIFIC_HAECCEITY_URI= CAPTEN_ONTO_IRI+"hasScientificHaecceity";
    var HAS_SCIENTIFIC_RESOURCE_URI = CAPTEN_ONTO_IRI+"hasScientificResource";
    var DESCRIBED_BY_URI            = CAPTEN_ONTO_IRI+"describedBy";
    var HAS_STRUCTURAL_HAECCEITY_URI= CAPTEN_ONTO_IRI+"hasStructuralHaecceity";
    // var IS_CONDITIONED_BY // TODO Remove it in version3.5?
      var COMPLETES_URI             = CAPTEN_ONTO_IRI+"completes";
      var RESPECTS_URI              = CAPTEN_ONTO_IRI+"respects";
      var IMPLIES_URI               = CAPTEN_ONTO_IRI+"implies";
      var RELIES_ON_URI             = CAPTEN_ONTO_IRI+"reliesOn";
      var ALTERNATIVE_TO_URI        = CAPTEN_ONTO_IRI+"alternativeTo";
      var CONSISTENT_WITH_URI       = CAPTEN_ONTO_IRI+"consistentWith";
      var INCONSISTENT_WITH_URI     = CAPTEN_ONTO_IRI+"inconsistentWith";//TODO Inverse of CONSISTENT_WITH_URI;
      var DESCRIBES_URI             = CAPTEN_ONTO_IRI+"describes";
      var DISCUSSES_URI             = CAPTEN_ONTO_IRI+"discusses";
      var IS_JUSTIFIED_BY_URI       = CAPTEN_ONTO_IRI+"isJustifiedBy";
  // === KNOWLEDGE PROPS

//TODO check conflicts below for props @onto 0.2.5/0.3
var USED_AS                 = CAPTEN_ONTO_IRI+"usedAs";//TODO add it to the ontology OR locate it
var INFLUENCES_URI          = CAPTEN_ONTO_IRI+"influences";//TODO add it to the ontology OR locate it
var FOLLOWED_BY_URI         = CAPTEN_ONTO_IRI+"followedBy";
var IS_DESCRIBED_BY_URI     = CAPTEN_ONTO_IRI+"isDescribedBy";
  var OPERATION_DESCRIB_URI = CAPTEN_ONTO_IRI+"operationDescribedBy"; // @NEW : ADDED ASTROLABE 0.0.3 ONTO
  var STATEMENT_DESCR_URI   = CAPTEN_ONTO_IRI+"statementDescription"; // @NEW : ADDED ASTROLABE 0.0.3 ONTO
var HAS_NAME_URI            = CAPTEN_ONTO_IRI+"hasName";
var HAS_CONTEXT_URI         = CAPTEN_ONTO_IRI+"isContextualizedBy";
var HAS_OBJECTIVE_URI       = CAPTEN_ONTO_IRI+"hasObjective";
var HAS_HYPOTHESIS_URI      = CAPTEN_ONTO_IRI+"hasHypothesis";
var HAS_DESCRIPTION_URI     = CAPTEN_ONTO_IRI+"description";
var HAS_TARGET_USER_URI     = CAPTEN_ONTO_IRI+"targetUser";
var COMES_FROM_URI          = CAPTEN_ONTO_IRI+"comesFrom";//TODO Subclass of "http://www.w3.or/ns/prov#wasGeneratedBy";
var IS_AUTHORED_BY          = CAPTEN_ONTO_IRI+"isAuthoredBy";

// === CUSTOM CLASSES
  var OPERATION_URI           = CAPTEN_ONTO_IRI+"NarratedOperation";
  // === OPERATOR CLS
  var OPERATOR_URI            = CAPTEN_ONTO_IRI+"NarratedOperator";
  var IMPLEMENTED_OPERATOR_URI= CAPTEN_ONTO_IRI+"ImplementedOperator";
  var INSTANCIATION_EXMPLE_URI= CAPTEN_ONTO_IRI+"InstanciationExample"; //TODO INSTANCIATION_EXMPLE_URI is a SUBCLASS_URI of EXAMPLE_URI
  var RELATED_INFORMATION_URI = CAPTEN_ONTO_IRI+"RelatedInformation"; //TODO Check if RELATED_INFORMATION_URI is a narrative element such as it is a SUBCLASS_URI of THING_URI;
  var ANALYSIS_TOOL_URI       = CAPTEN_ONTO_IRI+"AnalysisTool";
  var DATA_FORMAT_URI         = CAPTEN_ONTO_IRI+"DataFormat";
  var BEHAVIOURAL_RULE_URI    = CAPTEN_ONTO_IRI+"BehaviouralRule";
    var INPUT_PATTERN_URI     = BEHAVIOURAL_RULE_URI+"/InputPattern";
    var OUTPUT_PATTERN_URI    = BEHAVIOURAL_RULE_URI+"/OutputPattern";
    var SETTING_PATTERN_URI   = BEHAVIOURAL_RULE_URI+"/SettingPattern";
  var SETTING_URI             = CAPTEN_ONTO_IRI+"Setting";
    var PARAMETER_URI         = CAPTEN_ONTO_IRI+"Parameter";
  var INPUT_URI               = CAPTEN_ONTO_IRI+"Input"; //WARNING : Only for operator. Potential conflict
  var VALUE_URI               = CAPTEN_ONTO_IRI+"Value";
  var SELECTION_METHOD_URI    = CAPTEN_ONTO_IRI+"SelectionMethod";
    var ARBITRARY_URI         = SELECTION_METHOD_URI+"#Arbitrary";
    var EMPIRICAL_URI         = SELECTION_METHOD_URI+"#Empirical";
    var FORMAL_URI            = SELECTION_METHOD_URI+"#Formal";
  // var RESEARCH_OBJECT_URI     = "wf4ever:RO";// TODO Comment this line and write the appropriate from wf4ever works.

  // === NAP  CLS
  var ANALYSIS_URI            = CAPTEN_ONTO_IRI+"NarratedAnalysisProcess";
  var TARGET_USER_URI         = CAPTEN_ONTO_IRI+"TargetUser";
    // var STUDENT_URI           = CAPTEN_ONTO_IRI+"Student";     //HANDLED BY CUSTOM VOCABULARY ELEMENT
    // var INSTITUTION_URI       = CAPTEN_ONTO_IRI+"Institution";
  var REFEFRENCE_URI          = CAPTEN_ONTO_IRI+"Reference";
  var EXPERIMENTATION_URI     = CAPTEN_ONTO_IRI+"Experimentation";
  var CONTEXT_URI             = CAPTEN_ONTO_IRI+"Context";
  var INITIAL_RGTE_URI        = CAPTEN_ONTO_IRI+"InitialRGTE"; // initial RGTE. It's either the subelements of a graph used as a boostrap of an analysis, or the whole graph
  var EXAMPLE_URI             = CAPTEN_ONTO_IRI+"Example";

  // === STEP  CLS
  var STEP_URI                = CAPTEN_ONTO_IRI+"Step";
  var TREATMENT_TYPE_URI      = CAPTEN_ONTO_IRI+"TreatmentType";
    var POST_TREATMENT_URI    = TREATMENT_TYPE_URI+"#PostTreatment";
    var PRE_TREATMENT_URI     = TREATMENT_TYPE_URI+"#PreTreatment";
    var ANALYSIS_TREATMENT_URI= TREATMENT_TYPE_URI+"#AnalysisTreatment";
  var OPTIONALITY_URI         = CAPTEN_ONTO_IRI+"OptionalState"; // Optional + prop hasOption for describing
  // var CONTEXT_URI    //ALREADY DEFINED BELOW
  // var OPERATOR_URI   //ALREADY DEFINED ABOVE

  // === SCIENTIFIC STATEMENTS CLS
  // var AUTHOR_URI              = CAPTEN_ONTO_IRI+"Author"; // ALREADY DEFINED ABOVE By xmlns
    // RETROCOMPATIBILITY ONLY
    var AUTHOR_URI = HAS_AUTHOR_URI;
    // ==================
  var STATEMENT_URI           = CAPTEN_ONTO_IRI+"Statement";
    var SCIENTIFIC_STATEMENT_URI  = STATEMENT_URI+"/ScientificStatement";
      var HYPOTHESIS_URI          = CAPTEN_ONTO_IRI+"Hypothesis";
  var DESCRIPTION_URI         = CAPTEN_ONTO_IRI+"Description";
  var USE_CASE_URI            = CAPTEN_ONTO_IRI+"useCase";
  var OBJECTIVE_URI           = CAPTEN_ONTO_IRI+"Objective";

  // === KNOWLEDGE CLS
  var KNOWLEDGE_URI           = CAPTEN_ONTO_IRI+"Knowledge"; // EQUIVALENT TO ExploitableOutput
  var READING_INSTRUCTION_URI = CAPTEN_ONTO_IRI+"ReadingInstruction";
  var CONTEXT_VALIDITY_URI    = CAPTEN_ONTO_IRI+"ContextValidity";
  //var Example (#ALREADY DEFINED ABOVE)
  var LEARNING_ENVIRONMENT_URI= CAPTEN_ONTO_IRI+"LearningEnvironment";
  var MONITORING_URI          = CAPTEN_ONTO_IRI+"Monitoring";
  var ADAPTATION_URI          = CAPTEN_ONTO_IRI+"Adaptation";
  var EXPLOITATION_TYPE_URI   = CAPTEN_ONTO_IRI+"ExploitationType";
    var MODEL_URI             = EXPLOITATION_TYPE_URI+"#Model";
    var INDICATOR_URI         = EXPLOITATION_TYPE_URI+"#Indicator";
  // var VOCABULARY_ELEMENT_URI  = CAPTEN_ONTO_IRI+"VocabularyElement";
  var VOCABULARY_ELEMENT_URI  = CAPTEN_VOCAB_IRI; //Pointer to the element belongign to the voc
  var VOC_SUMMARY_URI         = CAPTEN_ONTO_IRI+"VocSummary";
  var EXPLOITABLE_OUTPUT_URI  = CAPTEN_ONTO_IRI+"ExploitableOutput";


// === NON INCLUDED IN THE ONTOLOGY
var NARRATIVE_ELEMENT_URI   = CAPTEN_ONTO_IRI+"NarrativeElement";
var NARRATIVE_BLOCK_URI     = CAPTEN_ONTO_IRI+"hasNarrativeBlock";//NOTE Outside the CAPTEN ontology
var COMPOSITE_URI           = CAPTEN_ONTO_IRI+"compositeElement";
var EXTENDED_STRING_URI     = CAPTEN_ONTO_IRI+"extendedString";
var PARAMETER_PATTERN_URI   = CAPTEN_ONTO_IRI+"parameterPattern";
var RGTE_URI                = CAPTEN_ONTO_IRI+"RGTE";
var SuperRGTE_URI           = CAPTEN_ONTO_IRI+"SUPERRGTE";
var PARAMETER_CONFIGURATION_URI = CAPTEN_ONTO_IRI+"parameterConfiguration";
var ADDENDUM_URI            = CAPTEN_ONTO_IRI+"Addendum"; //TODO Add in onto
var TAG_URI                 = CAPTEN_ONTO_IRI+"TAG";  // TODO Add in ontology
var COMMENT_URI             = CAPTEN_ONTO_IRI+"Comment"; //TODO Add in ontology
var ANALYSIS_STAGE_URI      = CAPTEN_ONTO_IRI+"Stage"; // TODO Add in ontology; Correspond to various pa type such as descripive
  var DESCRIPTIVE_ANALYSIS_URI  = ANALYSIS_STAGE_URI+"#Descriptive"; // TODO Add/Complete in ontology
  var DIAGNOSTIC_ANALYSIS_URI   = ANALYSIS_STAGE_URI+"#Diagnostic"; // TODO Add/Complete in ontology
  var PREDICTIVE_ANALSYSIS_URI  = ANALYSIS_STAGE_URI+"#Predictive"; // TODO Add/Complete in ontology
  var PRESCRIPTIVE_ANALYSIS_URI = ANALYSIS_STAGE_URI+"#Prescriptive"; // TODO Add/Complete in ontology

var A_SEQUENCE_URI              = A_URI; //TODO ? Used to represent smth a rdf:Seq
var A_URI                       = "a";
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
