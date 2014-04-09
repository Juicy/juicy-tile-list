/**
 * Package of rectangles
 * bin-packing algorithm
 */
(function( scope ){
"use strict";

/**
 * [Package description]
 * @param {Object} [props] package properties
 * @param {Number} [props.width=0] package width (in px)
 * @param {Number} [props.height=0] package height (in px)
 * @param {String} [props.direction="rightDown"] packing direction `"rightDown"|"downRight"`
 */
function Package( props /*width, height, direction*/ ){
  for ( var prop in props ) {
    this[ prop ] = props[ prop ];
  }
  this.reset();
}
Package.prototype.width = 0;
Package.prototype.height = 0;
Package.prototype.direction = "rightDown";

/**
 * Reset all free slots in package.
 */
Package.prototype.reset = function() {
  this.slots = [];
  var initialSlot = new Rectangle({
    x: 0,
    y: 0,
    width: this.width,
    height: this.height
  });

  this.slots.push( initialSlot );

  // set sorter
  this.sorter = sorters[ this.direction ] || sorters.rightDown;
};

/**
 * Find a slot and place rectanle there
 * @param {Rectanlge} rectangle  to add
 * @returns {Package} package itself
 */
Package.prototype.add = function( rectangle ) {
  for ( var si=0, len = this.slots.length; si < len; si++ ) {
    var slot = this.slots[si];
	//CHANGEME
    if ( slot.canFit( rectangle ) ) {
      this.placeAt( rectangle, slot );
      break;
    }
  }
  return this;
};
/** 
 * Place element at specyfic slot
 * @param  {Rectangle} rectangle  [description]
 * @param  {Rectangle | Object} slot slot to place, or at least object with position
 * @param  {Number} slot.x
 * @param  {Number} slot.y
 * @return {Rectangle}       placed rectangle
 * @IDEA implement version for placing at given slot (not point), to prevent iterating in #placed
 */
Package.prototype.placeAt = function( rectangle, slot ) {
  // place rectangle in slot
  rectangle.x = slot.x;
  rectangle.y = slot.y;

  this.placed( rectangle );
  return rectangle;
};


/**
 * Update all free slots, for given new `rectangle`.
 * @param  {Rectangle} rectangle being added
 */
Package.prototype.placed = function( rectangle ) {
  // update slots
  var revisedSlots = [];
  for ( var i=0, len = this.slots.length; i < len; i++ ) {
    var slot = this.slots[i];
    var newSlots = slot.getSlotsAround( rectangle );
    if ( newSlots ) { 
      // slot intersects with rectangle, add all slots around
      revisedSlots.push.apply( revisedSlots, newSlots );
    } else { 
      // this slot does not intersect with one to add
      revisedSlots.push( slot );
    }
  }

  this.slots = revisedSlots;

  Package.cleanRedundant( this.slots );

  this.slots.sort( this.sorter );
};

/**
 * Remove redundant rectangle from array of rectangles
 * @param {Array<Rectangle>} rectangles array to clean
 * @returns {Array<Rectangle>} cleaned array
**/
Package.cleanRedundant = function( rectangles ) {
  for ( var rectNo=0, len = rectangles.length; rectNo < len; rectNo++ ) {
    var currentRect = rectangles[rectNo];
    // skip over this rectangle if it was already removed
    if ( !currentRect ) {
      continue;
    }
    // clone rectangles we're testing
    var compareRects = rectangles.slice(0);
    // do not compare with self
    compareRects.splice( rectNo, 1 );
    // compare currentRect with others
    var removedCount = 0;
    for ( var compareNo=0, cLen = compareRects.length; compareNo < cLen; compareNo++ ) {
      var compareRect = compareRects[compareNo];
      var afterCurrentRect = rectNo > compareNo ? 0 : 1;
      if ( currentRect.contains( compareRect ) ) {
        // if currentRect contains another,
        // remove that rectangle from test collection
        rectangles.splice( compareNo + afterCurrentRect - removedCount, 1 );
        removedCount++;
      }
    }
  }

  return rectangles;
};


var sorters = {
  // align in horizontal layers
  rightDown: function( a, b ) {
    return a.y - b.y || a.x - b.x;
  },
  // align in vertical layers
  downRight: function( a, b ) {
    return a.x - b.x || a.y - b.y;
  }
};


// TODO: export
scope.Package = Package;

}(window));