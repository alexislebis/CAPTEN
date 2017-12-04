/**
 * VocabularyElement must linked with the element parsed in the rdf file and ones added by users
 */
function VocabularyElement()
{
  CAPTENClass.call(this);
  this.uri = VOCABULARY_ELEMENT_URI;
}

VocabularyElement.prototype = Object.create(CAPTENClass.prototype);
