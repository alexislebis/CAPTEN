/**
 * Property represents a property linking two elements between them. For example: Student _making_ MCQ
 * The name gave describe the prop.
 *
 * The additionalConstraint parameter allows to express more complex logic in future realese, such as, Student _commingFrom_ MOOC iff max 1 MOOC.
 */
class Property{
  constructor(name, uri, From, to, additionalConstraints)
  {
    this.name = name;
    this.from = From;
    this.to = to;
    this.constraints = additionalConstraints;
  }
}
