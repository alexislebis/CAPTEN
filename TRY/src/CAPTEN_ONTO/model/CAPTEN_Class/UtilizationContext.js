/**
 * Define the utilization contexte of something.
 */
function UtilizationContext()
{
  CAPTENClass.call(this);
  this.uri = USE_CASE_URI;
}

UtilizationContext.prototype = Object.create(CAPTENClass.prototype);
