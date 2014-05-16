/**
 * Rectangle tests
 **/
describe('Rectangle', function() {
  'use strict';

  var assert = chai.assert;

  describe('constructor', function() {
    it('should create itself with default values', function() {
      var rect = new Rectangle();
      assert.equal(rect.x, 0, 'x = 0');
      assert.equal(rect.y, 0, 'y = 0');
      assert.equal(rect.width, 0, 'width = 0');
      assert.equal(rect.height, 0, 'height = 0');
    });

    it('should create itself with initial values', function() {
      var rect = new Rectangle({
        x: 7,
        y: 11,
        width: 13,
        height: -2
      });
      assert.equal(rect.x, 7, 'x');
      assert.equal(rect.y, 11, 'y');
      assert.equal(rect.width, 13, 'width');
      assert.equal(rect.height, -2, 'height');
    });
  });

  describe('method contains', function() {

    var rectA = new Rectangle({
      x: 20,
      y: 10,
      width: 100,
      height: 200
    });
    it('should return `true` if rectangle contains given', function() {
      var rectB = new Rectangle({
        x: 30,
        y: 20,
        width: 10,
        height: 20
      });

      assert.strictEqual(rectA.contains(rectB), true, 'A contains B');

      rectB = new Rectangle({
        x: 30,
        y: 40
      });

      assert.strictEqual(rectA.contains(rectB), true,
        'A contains B, B is a point');

      rectB = new Rectangle({
        x: rectA.x,
        y: rectA.y,
        width: rectA.width,
        height: rectA.height
      });

      assert.strictEqual(rectA.contains(rectB), true, 'A and B are equal');
    });

    it('should return `false` if rectangle does not contain given', function() {
      var rectB = new Rectangle({
        x: 400,
        y: 50,
        width: 10,
        height: 40
      });

      assert.strictEqual(rectA.contains(rectB), false, 'A does not contain B');

      rectB = new Rectangle({
        x: rectA.x - 10,
        y: rectA.y,
        width: rectA.width,
        height: rectA.height
      });

      assert.strictEqual(rectA.contains(rectB), false,
        'A contain B. B is same size as A, but in different position');
    });
  });


  describe('method intersects', function() {

    var rectA = new Rectangle({
      x: 200,
      y: 100,
      width: 600,
      height: 400
    });
    var rectB = new Rectangle({
      x: 300,
      y: 200,
      width: 200,
      height: 100
    });


    it('should return `true` if rectangle intersects with given', function() {
      assert.strictEqual(rectA.intersects(rectB), true, 'B &isin; A, A intersects B');
      assert.strictEqual(rectB.intersects(rectA), true, 'B &isin; A, B intersects A');

      rectB.x = 100;

      assert.strictEqual(rectA.intersects(rectB), true,
        'B intersects left edge of A, A intersects B');
      assert.strictEqual(rectB.intersects(rectA), true,
        'B intersects left edge of A, B intersects A');

      rectB.y = 50;

      assert.strictEqual(rectA.intersects(rectB), true,
        'B intersects left top corner of A, A intersects B');
      assert.strictEqual(rectB.intersects(rectA), true,
        'B intersects left top corner of A, B intersects A');

    });


    it('should return `false` if rectangle does not intersects with given', function() {
      rectB.x = 0;
      rectB.y = 0;

      assert.strictEqual(rectA.intersects(rectB), false,
        'B bottom right corner touches A top left corner, A DOES NOT intersect B');
      assert.strictEqual(rectB.intersects(rectA), false,
        'B bottom right corner touches A top left corner, B DOES NOT intersect A');

      rectB.x = rectA.x - rectB.width;
      rectB.y = rectA.y;
      rectB.height = rectA.height;

      assert.strictEqual(rectA.intersects(rectB), false,
        'B is completely adjacent to A, A DOES NOT intersect B');
      assert.strictEqual(rectB.intersects(rectA), false,
        'B is completely adjacent to A, B DOES NOT intersect A');
    });
  });

  describe('can check if other rectangle `.canFit` within', function() {

    var rect = new Rectangle({
      width: 200,
      height: 100
    });
    var rectSmall = new Rectangle({
      width: 180,
      height: 80
    });
    var rectEqual = new Rectangle({
      width: 200,
      height: 100
    });
    var rectBig = new Rectangle({
      width: 220,
      height: 100
    });
    it("other rectangle can fit within", function(){
      assert.strictEqual( rect.canFit( rectSmall ), true, "smaller fits");
      assert.strictEqual( rect.canFit( rectEqual ), true, "equal fits");
      assert.strictEqual( rect.canFit( rectBig ), false, "bigger don't");
    });
    it("smaller rectangle can fit within additional buffer space", function(){
      assert.strictEqual( rect.canFit( rectSmall, 10 ), true, "smaller fits with 10 buffer");
      assert.strictEqual( rect.canFit( rectEqual, 20 ), false, "smaller don't fit with 20 buffer");
      assert.strictEqual( rect.canFit( rectEqual, 10 ), false, "equal don't");
      assert.strictEqual( rect.canFit( rectBig, 10 ), false, "bigger don't");
    });


  });

  describe('can `getSlotsAround` given rectangle inside itself', function() {

    var rectA = new Rectangle({
      height: 30,
      width: 40,
      x:10,
      y:20
    });
    it("when it's complately inside", function(){
      // 1111
      //  BB 
      //
      // - 
      // 1   
      // 1BB 
      // 1
      // -
      // 
      //  BB
      // 1111
      // -
      //    1
      //  BB1
      //    1
      var rectB = new Rectangle({
        x: 20,
        y: 30,
        width: 20,
        height: 10
      });
      var slots = rectA.getSlotsAround( rectB );
        assert.strictEqual( slots.length, 4, "4 slots around");
        var rectTop = new Rectangle({
          height: 10,
          width: 40,
          x: 10,
          y: 20
        });
        assert.include( slots, rectTop, "one on top");
        var rectLeft = new Rectangle({
          height: 30,
          width: 10,
          x: 10,
          y: 20
        });
        assert.include( slots, rectLeft, "one on left");
        var rectRight = new Rectangle({
          height: 30,
          width: 10,
          x: 40,
          y: 20
        });
        assert.include( slots, rectRight, "one on right");
        var rectBottom = new Rectangle({
          height: 10,
          width: 40,
          x: 10,
          y: 40
        });
        assert.include( slots, rectBottom, "one at the bottom");
    });

    it("when it's complately when its wider", function(){
      //  1111
      // BBBBBB
      //  2222
      var rectB = new Rectangle({
        x: 0,
        y: 30,
        width: 60,
        height: 10
      });
      var slots = rectA.getSlotsAround( rectB );
        assert.strictEqual( slots.length, 2, "2 slots around");
        var rect1 = new Rectangle({
          height: 10,
          width: 40,
          x: 10,
          y: 20
        });
        assert.include( slots, rect1, "one on top");
        var rect2 = new Rectangle({
          height: 10,
          width: 40,
          x: 10,
          y: 40
        });
        assert.include( slots, rect2, "second at the bottom");
    });
    it("when it's complately when its higher", function(){
      //  B
      // 1B22
      // 1B22
      // 1B22
      //  B
      var rectB = new Rectangle({
        x: 20,
        y: 10,
        width: 10,
        height: 50
      });
      var slots = rectA.getSlotsAround( rectB );
        assert.strictEqual( slots.length, 2, "2 slots around");
        var rect1 = new Rectangle({
          height: 30,
          width: 10,
          x: 10,
          y: 20
        });
        assert.include( slots, rect1, "one on left");
        var rect2 = new Rectangle({
          height: 30,
          width: 20,
          x: 30,
          y: 20
        });
        assert.include( slots, rect2, "second on right");
    });

  });

});