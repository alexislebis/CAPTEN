//#8fa876

/**
 * CAPTENClass represents the classes used in the CAPTEN-ONTO for the APE description. Each CAPTENClass must have a name (materialized by its className), an URI and a set of properties
 */

function CAPTENClass(uri, properties) {
    this.uri = uri;
    this.properties = this.properties; //[Property]

    //Dynamic inheritance system. CF Property for more details
    this.iName = "Class";
    this.name = this.iName;
    this.inheritanceArray = [];
    this.subClasses = [];

}

CAPTENClass.prototype = {

    /** The is function give the possibility to this (ScientificHaecceity) to evolve according to the need of the user.
     * Thus, by choosing a specific subclass, the object will evolve. Note the nested evolving possibility with the subClasses value.
     * if newName does not belong to the subClass possibilities of this (ScientificHaecceity), then is throw an exception.
     * Moreover, specialization cannot be redone a second time, otherwise an exception is throw.
     **/
    is: function(newName) {
        var find = false;
        var that = this;

        if (Object.keys(this.subClasses).length === 0 && this.subClasses.constructor === Object)
            throw new NotSubClassException(newName, this);

        //Verification if the property is already specialized. If yes, then throw an exception. The user has to create a new prop.
        this.subClasses.forEach(function(p) {
            if (that.name === p.name)
                throw new ClassAlreadySpecializedException(newName, that);
        });

        this.subClasses.forEach(function(e) {
            if (e.name === newName) {
                console.log(e.subClasses);
                that.inheritanceArray.push(that.name); //memorizing the previous super class;
                that.name = e.name;
                that.subClasses = e.subClasses;
                that.uri = e.uri;
                find = true;
            }
        });

        if (!find)
            throw new NotSubClassException(newName, this);

        return;
    },

};
