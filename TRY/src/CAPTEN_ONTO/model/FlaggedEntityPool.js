/**
 * The FlaggedEntityPool store all the noticable* elements created inside the application in order to identify and retrieve them
 * anywhere in the application.
 * To put an element inside this pool is equivalent to flag him for futur reuse anywhere in the application.
 *
 * * noticable stand for the property to an element to bear intrinsicatly relevant information. Thus, user may want to
 * describe them for further documentation and reuse.
 * They can also be share since they are relevant 
 */

function FlaggedEntityPool()
{
  this.pool = [];
}

FlaggedEntityPool.POSITION = 0;

FlaggedEntityPool.prototype = {

};

var FLAGGED_ENTITY_POOL = new NoteworthyEntityPool();
