( function( scope ) {
"use strict";

/**
 * [Rectangle description]
 * version: 0.1.0
 * @param {Object} [props] rectangle properties
 * @param {Number} [props.x=0] rectangle position
 * @param {Number} [props.y=0] rectangle position
 * @param {Number} [props.width=0] rectangle width
 * @param {Number} [props.height0] rectangle height
 */
function Rectangle( props ) {
  for ( var prop in props ) {
    this[ prop ] = props[ prop ];
  }
}
Rectangle.prototype.x = 0;
Rectangle.prototype.y = 0;
Rectangle.prototype.width = 0;
Rectangle.prototype.height = 0;

/**
 * Does this rectangle contains another (entire) rectangle or point.
 * `this` &supe; `another`
 * @param {Rectangle} rect
 * @returns {Boolean}
**/
Rectangle.prototype.contains = function( another ) {
  return this.x <= another.x &&
    this.y <= another.y &&
    this.x + this.width >= another.x + (another.width || 0) &&
    this.y + this.height >= another.y + (another.height || 0);
};

/**
 * Does this rectangle intersects with another?
 * `this` &cap; `another` &ne; &empty;
 * @param {Rectangle} another
 * @returns {Boolean}
**/
Rectangle.prototype.intersects = function( another ) {
  return this.x < another.x + another.width && // this left end < another's right
    this.x + this.width > another.x && // this right end > another's left
    this.y < another.y + another.height && // this top end < another's bottom
    this.y + this.height > another.y; // this bottom end > another's top
};

/**
 * @param {Rectangle} what - the overlapping rectangle
 * @returns {Array<Rectangle>} slots - free slots (rectangles) around the `what`
 * @todo  write tests, esspecialy for bigger ones (tomalec)
**/
Rectangle.prototype.getSlotsAround = function( what ) {

  // if no intersection, return false
  if ( !this.intersects( what ) ) {
    return false;
  }

  var slots = [],
      thisRight  = this.x + this.width,
      thisBottom = this.y + this.height,
      whatRight  = what.x + what.width,
      whatBottom = what.y + what.height;

  // top
  if ( this.y < what.y ) {
    slots.push(
      new Rectangle({
        x: this.x,
        y: this.y,
        width: this.width,
        height: what.y - this.y
      })
    );
  }

  // right
  if ( thisRight > whatRight ) {
    slots.push(
      new Rectangle({
        x: whatRight,
        y: this.y,
        width: thisRight - whatRight,
        height: this.height
      })
    );
  }

  // bottom
  if ( thisBottom > whatBottom ) {
    slots.push(
      new Rectangle({
        x: this.x,
        y: whatBottom,
        width: this.width,
        height: thisBottom - whatBottom
      })
    );
  }

  // left
  if ( this.x < what.x ) {
    slots.push(
      new Rectangle({
        x: this.x,
        y: this.y,
        width: what.x - this.x,
        height: this.height
      })
    );
  }

  return slots;
};
/**
 * Can `what` rectangle fit inside ours, with optional `buffer`space left (in both directions)?
 * @param  {Rectangle} what   ractangle to fit
 * @param  {Number} [buffer=0] amount of additional space required
 * @return {Boolean}
 * @TODO write tests for `buffer` (tomalec)
 */
Rectangle.prototype.canFit = function( what, buffer ) {
  buffer || (buffer = 0);
  return this.width >= buffer + what.width && this.height >= buffer + what.height;
};


// TODO: export
scope.Rectangle = Rectangle;

})( window );
