/**
 * Package tests
 */
describe('Package', function() {

  describe('method generateUniqueName', function() {

    it('should create a unique name with index 0 if this is a first child container in its parent', function() {
      var pkg = new Package({
        items: []
      });
      chai.assert.equal(pkg.generatePackageName(pkg.items.root), 'root_0');
    });

    it('should create a unique name with lowest possible integer suffix', function() {
      var pkg = new Package({
        items: [
          {name: 'root_0', items: []}, //currently 2 properties 'name' and 'items' qualify an item to be considered as a container by Package
          {name: 'root_2', items: []}
        ]
      });
      chai.assert.equal(pkg.generatePackageName(pkg.items.root), 'root_1');
    });

  });

  describe('method getMinimumDimensions', function () {

    it('for a single element should return the element', function () {
      var pkg = new Package({
        items: []
      });
      var elements = [
        {
          offsetLeft: 100,
          offsetTop: 100,
          offsetWidth: 256,
          offsetHeight: 128
        }
      ];
      var dimensions = pkg.getMinimumDimensions([elements[0]]);
      chai.assert.equal(dimensions.width, 256);
      chai.assert.equal(dimensions.height, 128);
    });

    it('for 2 elements, that do not overlap, should return sum of their dimensions', function () {
      var pkg = new Package({
        items: []
      });
      var elements = [
        {
          offsetLeft: 100,
          offsetTop: 100,
          offsetWidth: 256,
          offsetHeight: 128
        },
        {
          offsetLeft: 400,
          offsetTop: 400,
          offsetWidth: 256,
          offsetHeight: 128
        }
      ];
      var dimensions = pkg.getMinimumDimensions([elements[0], elements[1]]);
      chai.assert.equal(dimensions.width, 512);
      chai.assert.equal(dimensions.height, 256);
    });

    it('for 2 elements, that overlap, should return projection of their dimensions', function () {
      var pkg = new Package({
        items: []
      });
      var elements = [
        {
          offsetLeft: 100,
          offsetTop: 100,
          offsetWidth: 256,
          offsetHeight: 128
        },
        {
          offsetLeft: 200,
          offsetTop: 200,
          offsetWidth: 256,
          offsetHeight: 128
        }
      ];
      var dimensions = pkg.getMinimumDimensions([elements[0], elements[1]]);
      chai.assert.equal(dimensions.width, 356);
      chai.assert.equal(dimensions.height, 228);
    });

    it('for 2 elements, that overlap, should return projection of their dimensions (reverse order)', function () {
      var pkg = new Package({
        items: []
      });
      var elements = [
        {
          offsetLeft: 100,
          offsetTop: 100,
          offsetWidth: 256,
          offsetHeight: 128
        },
        {
          offsetLeft: 200,
          offsetTop: 200,
          offsetWidth: 256,
          offsetHeight: 128
        }
      ];
      var dimensions = pkg.getMinimumDimensions([elements[1], elements[0]]);
      chai.assert.equal(dimensions.width, 356);
      chai.assert.equal(dimensions.height, 228);
    });
  });
});