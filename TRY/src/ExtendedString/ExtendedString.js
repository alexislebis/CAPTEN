/*
 * The extended string handle the possibility to create string pointing to other entities than just characters
 */

 function ExtendedString()
 {
   this.array = [];
 }

 ExtendedString.prototype = {


   getString: function(baliseAround)//define the html balise to put around custom elmt
   {
     var str = "";

     var closingBalise = baliseAround;
     if(baliseAround != null)
      closingBalise.splice(1,0,'\\');
    else
    {
      baliseAround = "";
      closingBalise = "";
    }

     for(var i in this.array)
     {
        if(this.array[i].toString)
          str += baliseAround + this.array[i].toString() + closingBalise;
        else
          str += this.array[i];
     }

     return str;
   },

   getSpecialElements: function()
   {
     var res = [];

     for(var i in this.array)
      if(!this.array[i] instanceof String)
        res.push(this.array[i]);

      return res;
   },

   setString: function(str)
   {
     this.array = [];

     for(var i in str)
     {
       this.array.push(str[i]);
     }
   },

   add: function(obj, pos)//Add the obj to this.array. If pos is null, at the end, otherwise, at the indicate position
   {
     if(pos == null)
      pos = this.array.length;
     this.array.splice(pos, 0, obj);
   },

   addString: function(str, pos)
   {
     if(pos == null)
      pos = this.array.length;

      var offset = 0;
      for(var i in str)
      {
        this.array.splice(pos+offset, 0, str[i]);
        offset++;
      }
   },

   remove: function(quantity, pos)
   {
     if(pos == null)
      pos = this.array.length-1;
    this.array.splice(quantity, pos);
   },

 };
