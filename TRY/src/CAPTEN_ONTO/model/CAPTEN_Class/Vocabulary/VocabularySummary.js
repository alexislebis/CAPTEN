function VocabularySummary()
{
  CAPTENClass.call(this);
    this.uri = VOC_SUMMARY_URI;
    
    this.summary = null;
    this.keyword = null;//Keyword belongs to this.summary & must be used for inference purpose only. FIXME other wy to use summary ?
}

VocabularySummary.prototype = Object.create(CAPTENClass.prototype);
