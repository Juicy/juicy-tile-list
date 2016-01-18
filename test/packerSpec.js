/**
 * Packer tests
 */
describe('Packer', function() {
    'use strict';


    var assert = chai.assert;


    describe("when created", function() {
      it("with default (`horizontal`) direction, makes itself infinitely tall, regardless of `height` given", function(){
        var pkr = new Packer({
          width: 3,
          height: 10
        });
        assert.strictEqual( pkr.height, Number.POSITIVE_INFINITY);
      });
      it("with `vertical` direction, makes itself infinitely wide, regardless of `width` given", function(){
        var pkr = new Packer({
          width: 3,
          height: 10,
          direction: "vertical"
        });
        assert.strictEqual( pkr.width, Number.POSITIVE_INFINITY);
      });
    });

    describe("`.add`ing Rectangles", function() {
      var pkr = new Packer({
        width: 3
      });

      // 122
      // 145
      // 333
      // xxx
      // xxx
      var rect1 = new Rectangle({
        width: 1,
        height: 2
      });
      var rect2 = new Rectangle({
        width: 2,
        height: 1
      });
      var rect3 = new Rectangle({
        width: 3,
        height: 1
      });
      var rect4 = new Rectangle({
        width: 1,
        height: 1
      });
      var rect5 = new Rectangle({
        width: 1,
        height: 1
      });

      pkr.add(rect1);
      pkr.add(rect2);
      pkr.add(rect3);
      pkr.add(rect4);
      pkr.add(rect5);

      it("packs them with as few 'holes' as possible, while trying to preserve given order", function() {
        assert.equal(rect1.x, 0, 'rect1.x top left');
        assert.equal(rect1.y, 0, 'rect1.y top left');
        assert.equal(rect2.x, 1, 'rect2.x top right');
        assert.equal(rect2.y, 0, 'rect2.y top right');
        assert.equal(rect3.x, 0, 'rect3.x bottom');
        assert.equal(rect3.y, 2, 'rect3.y bottom');
        assert.equal(rect4.x, 1, 'rect4.x center center');
        assert.equal(rect4.y, 1, 'rect4.y center center');
        assert.equal(rect5.x, 2, 'rect5.x center left');
        assert.equal(rect5.y, 1, 'rect5.y center left');
      });

      it("leaves free space at the bottom", function() {

        // bottom slot is open
        assert.equal(pkr.slots.length, 1, 'one slot open');
        var slot = pkr.slots[0];
        assert.equal(slot.width, 3, 'slot.width');
        assert.equal(slot.height, Number.POSITIVE_INFINITY, 'slot.height');
        assert.equal(slot.x, 0, 'slot.x');
        assert.equal(slot.y, 3, 'slot.y');
      });

      it("calculates minWidth, and minHeight required to pack all already added items", function() {
        assert.equal(pkr.minWidth, 3, '3x3');
        assert.equal(pkr.minHeight, 3, '3x3');
      });

      describe("when there is already `.placed` one", function() {
        it('pack items around, still without holes and in given order', function() {
          var pkr = new Packer({
            width: 3
          });

          // 235
          // 211
          // 24x
          // x4x
          // xxx
          //  

          var rect1 = new Rectangle({
            width: 2,
            height: 1,
            x: 1,
            y: 1
          });
          var rect2 = new Rectangle({
            width: 1,
            height: 3
          });
          var rect3 = new Rectangle({
            width: 1,
            height: 1
          });
          var rect4 = new Rectangle({
            width: 1,
            height: 2
          });
          var rect5 = new Rectangle({
            width: 1,
            height: 1
          });

          pkr.placed(rect1);
          pkr.add(rect2);
          pkr.add(rect3);
          pkr.add(rect4);
          pkr.add(rect5);

          // 235
          // 211
          // 24x
          // x4x
          // xxx

          assert.equal(rect2.x, 0, 'rect2.x top left');
          assert.equal(rect2.y, 0, 'rect2.y top left');
          assert.equal(rect3.x, 1, 'rect3.x top center');
          assert.equal(rect3.y, 0, 'rect3.y top center');
          assert.equal(rect4.x, 1, 'rect4.x bottom center');
          assert.equal(rect4.y, 2, 'rect4.y bottom center');
          assert.equal(rect5.x, 2, 'rect5.x top right');
          assert.equal(rect5.y, 0, 'rect5.y top right');

          assert.equal(pkr.slots.length, 3, '3 slots left');

        });
      });
      describe("with `direction: 'vertical'`", function() {
        var pkr = new Packer({
          height: 3,
          direction: 'vertical'
        });

        // 153xx
        // 223xx
        // 443xx

        var rect1 = new Rectangle({
          width: 1,
          height: 1
        });
        var rect2 = new Rectangle({
          width: 2,
          height: 1
        });
        var rect3 = new Rectangle({
          width: 1,
          height: 3
        });
        var rect4 = new Rectangle({
          width: 2,
          height: 1
        });
        var rect5 = new Rectangle({
          width: 1,
          height: 1
        });

        pkr.add(rect1);
        pkr.add(rect2);
        pkr.add(rect3);
        pkr.add(rect4);
        pkr.add(rect5);

        it('packs them in vertical layers', function addVertical() {
          assert.equal(rect1.x, 0, 'rect1.x top left');
          assert.equal(rect1.y, 0, 'rect1.y top left');

          assert.equal(rect2.x, 0, 'rect2.x center left');
          assert.equal(rect2.y, 1, 'rect2.y center left');

          assert.equal(rect3.x, 2, 'rect3.x top right');
          assert.equal(rect3.y, 0, 'rect3.y top right');

          assert.equal(rect4.x, 0, 'rect4.x bottom left');
          assert.equal(rect4.y, 2, 'rect4.y bottom left');

          assert.equal(rect5.x, 1, 'rect5.x top center');
          assert.equal(rect5.y, 0, 'rect5.y top center');
        });
        it('leaves slot on right', function slotsVertical() {
          assert.equal(pkr.slots.length, 1, 'one slot open');
          var slot = pkr.slots[0];
          assert.equal(slot.width, Number.POSITIVE_INFINITY, 'slot.width');
          assert.equal(slot.height, 3, 'slot.height');
          assert.equal(slot.x, 3, 'slot.x top right');
          assert.equal(slot.y, 0, 'slot.y top right');

        });
      });

      describe("with (default) infinite dimensions", function() {
        var pkr = new Packer();

        // 12hh
        // 12hh
        //   hh
        //   hh

        var rect1 = new Rectangle({
          width: 1,
          height: 2
        });
        var rect2 = new Rectangle({
          width: 1,
          height: 2
        });
        var huge = new Rectangle({
          width: Number.POSITIVE_INFINITY,
          height: Number.POSITIVE_INFINITY
        });

        pkr.add(rect1);
        pkr.add(rect2);
        pkr.add(huge);

        it('should pack finite size rectangles', function addVertical() {
          assert.equal(rect1.x, 0, 'rect1.x top left');
          assert.equal(rect1.y, 0, 'rect1.y top left');

          assert.equal(rect2.x, 1, 'rect2.x top 2nd left');
          assert.equal(rect2.y, 0, 'rect2.y top 2nd left');

        });
        it('and still have space for infinitely big rectangle', function addVertical() {
          assert.equal(huge.x, 2, 'huge.x top right');
          assert.equal(huge.y, 0, 'huge.y top right');

          assert.equal(pkr.slots.length, 1, 'one slot left');
          assert.equal(pkr.slots[0].x, 0, 'bellow rect1 & rect2');
          assert.equal(pkr.slots[0].y, 2, 'bellow rect1 & rect2');

        });
      });


      it('that are bigger than package, should trim them, and place in correct order', function slotsVertical() {
        // 122
        // 145
        // 333
        // 666|6
        // 7xx
        // .xx
        // ---
        // 7    
        var rect6 = new Rectangle({
          width: 4,
          height: 1
        });

        pkr.add(rect6);
        assert.equal(rect6.x, 0, 'rect6.x bottom left');
        assert.equal(rect6.y, 3, 'rect6.y bottom left');
        assert.equal(rect6.width, 3, 'wide as package');

      });
    });
});