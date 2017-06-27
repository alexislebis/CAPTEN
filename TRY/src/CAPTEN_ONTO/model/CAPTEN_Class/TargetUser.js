//SubClasses class variable allows this to represents its subclasses with an evolution prospect with the use.
//If this had used an extends relationship, then the evolution possibility will be near 0

function TargetUser()
{
  NarrativeElement.call(this);

  this.uri = "http://www.CAPTEN.org/SEED/ontologies/targetUser";
  this.htmlify = "an target user";

  this.subClasses = [ //OLD
    {subClasses:{}, name: 'Student', uri: 'NAU'},
    {subClasses:{}, name: 'Teacher', uri: 'NAU'},
    {subClasses:{}, name: 'Institution', uri: 'NAU'},
  ];
}

TargetUser.prototype = new NarrativeElement();
TargetUser.prototype.constructor = TargetUser;

// === POLYMER ELEMENT
  // === NAMER ELEMENT
  TargetUser.namerElement = Polymer(
  {
    is : 'target-user-namer-element',

    properties:
    {
      entity:
      {
        type: Object,
        notify: true,
      },

      // content://ExString
      // {
      //   type: Object,
      //   notify: true,
      // },
    },

    observers:
    [
      '_onEntityChanged(entity)',
      '_onContentChanged(content)',
    ],

    _onEntityChanged: function(entity)
    {
      var c = this.entity.getContent();
      if(c != null)
        this.content = c;
    },

    _onContentChanged: function(content)
    {
      if(this.entity == null)
        return;

      this.entity.updateElement(content);
    },

    factoryImpl: function(item)
    {
      this.entity = item;
    },


  });
  // === END NAMER ELEMENT

// class TargetStudent extends TargetUser
// {
//   constructor()
//   {
//
//   }
// }
//
// class TargetTeacher extends TargetUser
// {
//
// }
//
// class TargetInstitution extends TargetUser
// {
//
// }
