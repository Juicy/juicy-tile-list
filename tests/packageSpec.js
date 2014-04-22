/**
 * Package tests
 */
describe('Package', function() {
    'use strict';
    debugger
    var assert = chai.assert;
    describe("`.add`ing Rectangles", function() {
      var pkg = new Package({
        width: 3,
        height: 10
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

      pkg.add(rect1);
      pkg.add(rect2);
      pkg.add(rect3);
      pkg.add(rect4);
      pkg.add(rect5);

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
        assert.equal(pkg.slots.length, 1, 'one slot open');
        var slot = pkg.slots[0];
        assert.equal(slot.width, 3, 'slot.width');
        assert.equal(slot.height, 7, 'slot.height');
        assert.equal(slot.x, 0, 'slot.x');
        assert.equal(slot.y, 3, 'slot.y');
      });

      describe("when there is already `.placed` one", function() {
        it('pack items around, still without holes and in given order', function() {
          var pkg = new Package({
            width: 3,
            height: 10
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

          pkg.placed(rect1);
          pkg.add(rect2);
          pkg.add(rect3);
          pkg.add(rect4);
          pkg.add(rect5);

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

          assert.equal(pkg.slots.length, 3, '3 slots left');

        });
      });
      describe("with `direction: 'downRight'`", function() {
        var pkg = new Package({
          width: 10,
          height: 3,
          direction: 'downRight'
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

        pkg.add(rect1);
        pkg.add(rect2);
        pkg.add(rect3);
        pkg.add(rect4);
        pkg.add(rect5);

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

          // bottom slot is open
        });
        it('leaves slot on right', function slotsVertical() {
          assert.equal(pkg.slots.length, 1, 'one slot open');
          var slot = pkg.slots[0];
          assert.equal(slot.width, 7, 'slot.width');
          assert.equal(slot.height, 3, 'slot.height');
          assert.equal(slot.x, 3, 'slot.x top right');
          assert.equal(slot.y, 0, 'slot.y top right');

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

        pkg.add(rect6);
        assert.equal(rect6.x, 0, 'rect6.x bottom left');
        assert.equal(rect6.y, 3, 'rect6.y bottom left');
        assert.equal(rect6.width, 3, 'wide as package');

      });
    });
});