/*
 * The extended string handle the possibility to create string pointing to other entities than just characters
 */

 function ExtendedString()
 {
   this.array = [];

   this.mustBeReseted = false;
   this.indexToRemove;//Index of the element desynchronized
 }

 ExtendedString.prototype = {

   resetVerification: function()
   {
     if(this.mustBeReseted)
      {
        console.error("This exString is waiting to be reseted. Therefore, no modification can be applied");
        return;
      }
   },

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
     this.resetVerification();

     this.array = [];

     for(var i in str)
     {
       this.array.push(str[i]);
     }
   },

   add: function(obj, pos)//Add the obj to this.array. If pos is null, at the end, otherwise, at the indicate position
   {
     this.resetVerification();

     if(pos == null)
      pos = this.array.length;
     this.array.splice(pos, 0, obj);
   },

   addString: function(str, pos)
   {
     this.resetVerification();

     if(pos == null)
      pos = this.array.length;

      var offset = 0;
      for(var i in str)
      {
        this.array.splice(pos+offset, 0, str[i]);
        offset++;
      }
   },

   // @IMPROVE
   update: function(text)//Basic function. Compare until value is consummed, then add. If difference exist, reset must be made.
   {
     this.resetVerification();

     if(text == null || typeof text == 'undefined')
      return;

      console.log("basic update. Don't handle suppression");
      if(text.value != null)
        text = text.value;
      else
        text = text;
      var current = this.getString();
      var maxText = text.length
      var i = 0;
      var offset = 0;

      if(maxText > current.length) //in the case of addition
      {
        for(i; i < current.length; i++)
        {
          if(current[i] != text[i+offset])
          {
            var idxSE = this._isSpecialElement(current[i], i);

            if( idxSE != -1)
            {
              this.mustBeReseted = true;
              this.indexToRemove = idxSE;
              return -1;//Notification of error: string must be reseted;
            }
            else {
              this.array.splice(this._alignIndex(i), 0, text[i+offset]);
              //Maintening synchro between this.string and text.
              //If a new element is spotted, then indice should not move
              //In order to compare it to the next element of text. So the offset
              i--;//Prevent the incrementation of the for
              offset++;
            }
          }
        }
        for(i; i+offset < maxText; i++ )
        {
          this.add(text[i+offset]);
        }
      }
      else if(maxText == current.length) //in the case of replacement
      {
        for(i; i < current.length; i++)
        {
          if(current[i] != text[i])
          {
            var idxSE = this._isSpecialElement(current[i], i);

            if(idxSE != -1)
            {
              this.mustBeReseted = true;
              this.indexToRemove = idxSE;
              return -1;//Notification of error: string must be reseted;
            }
            else {
              this.array[this._alignIndex(i)] = text[i];
            }
          }
        }
        for(i; i < maxText; i++ )
        {
          this.add(text[i]);
        }
      }
      else {
        for(i; i+offset < current.length; i++)
        {
          if(current[i+offset] != text[i])
          {
            var idxSE = this._isSpecialElement(current[i+offset], i);

            if( idxSE != -1)
            {
              this.mustBeReseted = true;
              this.indexToRemove = idxSE;
              return -1;//Notification of error: string must be reseted;
            }
            else {
              this.array.splice(this._alignIndex(i), 1);
              //Maintening synchro between this.string and text.
              //If a new element is spotted, then indice should not move
              //In order to compare it to the next element of text. So the offset
              i--;//Prevent the incrementation of the for
              offset++;
            }
          }
        }
        // for(i; i+offset < maxText; i++ )
        // {
        //   this.add(text[i+offset]);
        // }
      }

      return true;
   },

   deleteFlagged: function()
   {
     if(this.array == null || this.indexToRemove == -1)
      return;

    this.array.splice(this.indexToRemove,1);
    this.mustBeReseted = false;
    this.indexToRemove = -1;
   },

   abortReset: function()
   {
     this.mustBeReseted = false;
     this.indexToRemove = -1;
   },

   getObjectWithStringIndex: function(index)
   {
     return this.array[this._alignIndex(index)];
   },

   _isSpecialElement: function(caracter, index)
   {
     var oldPos = -1;
     var pos = -1;

     for(var i in this.array)
     {
       if(typeof this.array[i] === 'object')
       {
         oldPos = pos;
         pos += this.array[i].toString().length;

         if(oldPos <= index && index <= pos)
         {
           return i;
         }
       }
       else
        pos++;

      if(pos > index)
        return -1;
     }

     return -1;
   },

   _alignIndex: function(index, charac)
   {
     var oldPos = -1;
     var pos = -1;

     for(var i in this.array)
     {
       oldPos = pos;
       if(typeof this.array[i] === 'object')
         pos += this.array[i].toString().length;
       else
        pos++;

        if(oldPos <= index && index <= pos)
          return i;
     }

     return -1;
   },

   reset: function()
   {
     this.array = [];
     this.mustBeReseted = false;
   },

   remove: function(quantity, pos)
   {
     if(pos == null)
      pos = this.array.length-1;
    this.array.splice(quantity, pos);
   },

   serializeToJSON: function()
   {
     var res = {array: [], mustBeReseted : this.mustBeReseted};

     for(var i in this.array)
      {
          if(this.array[i].serializeToJSON)
            res.array.push(this.array[i].serializeToJSON());
          else
            res.array.push(this.array[i]);
      }

      return {extString: res};
   },

 };
