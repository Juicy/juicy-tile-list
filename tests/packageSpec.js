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
});