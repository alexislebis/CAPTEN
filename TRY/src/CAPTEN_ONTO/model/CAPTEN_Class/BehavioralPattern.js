function BehavioralPattern()
{
  CAPTENClass.call(this);

  this.pattern = null; //The pattern of the element where it toggle. It can be seen as an ontologie

  this.influentSubPattern = null; //SubPattern used to influence other BehavoiralPattern.

  //Influence relations
    //Relations between differents pattern is realigned with the CAPTENClass behavior.
    //this.patternInfluence = null; //Struc: [index of this.influentSubPattern] = [relationType] = [subpattern] (for each influent sub pattern, indicate what influence it have on a target subpattern of others BP. )
    //Note that influence of relations will be made by inference engine

}

BehavioralPattern.prototype = Object.create(CAPTENClass.prototype);

/**
 * InfluentSubPattern is a subpattern of the pattern embeded inside a BehavioralPattern.
 * The particularity of it is that it represent elements that have an influence (or impact) on the evolution
 * of the element described. <br/> For example, pattern setting of metrics for correlation will influence
 * the type of correlation concept obtained. Thus the concept evolved is a linear correlation, which is a correlation.
 * <br/><br/>
 * It has to be noted though that InfluentSubPattern is designed to allow complex and nested representation.
 * Thus, a subpattern of a subpattern of an input pattern can have a specific influence over a setting pattern for example.
 * <br/>The kind of property linking two InfluentSubPattern is defined with the this.properties inherited from CAPTENClass
 */
function InfluentSubPattern()
{
  BehavioralPattern.call(this);

  this.rootPattern = null; //Any BehavioralPattern (polymorphism is ok). MUST NOT BE AN ARRAY
}
InfluentSubPattern.prototype = Object.create(BehavioralPattern.prototype);

/**
  Input pattern representing when the element using it is triggered.
  For an AP, it is the data concept, under a relational aspect, used to describe how to obtain an ExploitableOutput
*/

function InputPattern()
{
  BehavioralPattern.call(this);

}



InputPattern.prototype = Object.create(BehavioralPattern.prototype);

function OutputPattern()
{
  BehavioralPattern.call(this);
}
OutputPattern.prototype = Object.create(BehavioralPattern.prototype);

function SettingPattern()
{
  BehavioralPattern.call(this);
}
SettingPattern.prototype = Object.create(BehavioralPattern.prototype);
