class ScientificHaecceity extends Property
{

  /**
   * Give access to the specific voc of ScientificHaecceity.
   */
  static newScientificProperty(){
    return [  "{name: reliesOn, uri: NAU}",
              "{inconsistentWith, uri: NAU}",
              "{respects, uri: NAU}",
              "{completes, uri: NAU}",
              "{implies, uri: NAU}",
              "{alternativeTo, uri: NAU}",
              "{isConditionedBy, uri: NAU}",
              "{discusses, uri: NAU}",
              "{isJustifiedBy, uri: NAU}",
              "{consistentWith, uri: NAU}"  ];
  }
}
