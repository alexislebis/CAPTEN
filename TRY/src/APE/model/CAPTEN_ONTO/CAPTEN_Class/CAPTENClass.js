//#8fa876

/**
 * CAPTENClass represents the classes used in the CAPTEN-ONTO for the APE description. Each CAPTENClass must have a name (materialized by its className), an URI and a set of properties
 */

function CAPTENClass(uri, properties) {
    this.uri = uri;
    this.properties = this.properties; //[Property]
    this.isBlank = false;

    //Dynamic inheritance system. CF Property for more details
    this.iName = "Class";
    this.name = this.iName;
    this.inheritanceArray = [];
    this.subClasses = [];//Here are the classes which inherit this
    this.subClassOf = [];//Here, the classes inherited from this


    if(this.uri != null && this.uri.match(/[_].*/))
      this.isBlank = true;
}

CAPTENClass.prototype = {

    /** The is function give the possibility to this to evolve according to the need of the user.
     * Thus, by choosing a specific subclass, the object will evolve. Note the nested evolving possibility with the subClasses value.
     * if newName does not belong to the subClass possibilities of this, then is throw an exception.
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

    equals: function(CAPTENc)
    {
      if(CAPTENc instanceof CAPTENClass)
      {
        if(this.uri === CAPTENc.uri)
          return true;
      }

      return false;
    },

    includedIn: function(arrayCls)
    {
      var nbIte = 0;

      for(var i in arrayCls)
       {
         nbIte++;
         if(this.equals(arrayCls[i]))
          return i;
       }

       if(nbIte === 0)//If the array is not a map, thus it has to be iterated in a normal way
        {
          for(var i = 0; i < arrayCls.length; i++)
          {
            if(this.equals(arrayCls[i]))
              return i;
          }
        }

       return -1;
    },

    becomesSubClassOf: function(cls)
    {
      if(cls.includedIn(this.subClassOf) !== -1)
        return;

      this.subClassOf.push(cls);
      cls.subClasses.push(this);
    },

};
