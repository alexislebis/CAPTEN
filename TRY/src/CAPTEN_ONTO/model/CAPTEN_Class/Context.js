/**
 * Define the context in which something is. Not to be mingled with UtilizationContext, which represent an
 * utilization context i.e. where something is applicable.
 */

 function Context()
{
  CAPTENClass.call(this);
}

Context.prototype = Object.create(CAPTENClass.prototype);
