/**
 * Package tests
 */
describe('Package', function() {
  var expect = chai.expect;
  describe('constructor', function() {

    it('should create `#allItems` map from given setup', function() {
      var item0 = {
        id: 0,
        width: 10,
        height: 10,
        priority: 1
      };
      var item1 = {
        id: 1,
        width: 50,
        height: 100,
        priority: 0
      };
      var pkg = new Package({
        items: [item0, item1]
      });
      chai.assert.equal(pkg.allItems[0], item0);
      chai.assert.equal(pkg.allItems[1], item1);
    });

  });

  describe('packItems method', function() {

    it('by default should pack everything `#setup` in constructor effectively, according to priority', function() {
      var setup = {
        width: 150,
        items: [{
          id: 1,
          priority: 0.9, // 0.6,
          height: 50,
          width: 100
        }, {
          id: 2,
          priority: 0.8, // 0.9,
          height: 50,
          width: 100
        }, {
          id: 0,
          priority: 0.7, // 0.3,
          height: 100,
          width: 50
        }, {
          id: 3,
          priority: 0.6,
          height: 50,
          width: 50
        }]
      };
      var expected = {
        "width": 150,
        "items": [{
          "id": 1,
          "priority": 0.9,
          "height": 50,
          "width": 100,
          "x": 0,
          "y": 0
        }, {
          "id": 2,
          "priority": 0.8,
          "height": 50,
          "width": 100,
          "x": 0,
          "y": 50
        }, {
          "id": 0,
          "priority": 0.7,
          "height": 100,
          "width": 50,
          "x": 100,
          "y": 0
        }, {
          "id": 3,
          "priority": 0.6,
          "height": 50,
          "width": 50,
          "x": 0,
          "y": 100
        }],
        "id": "root",
        "height": null,
        "slots": [{
          "x": 50,
          "y": 100,
          "width": 100,
          "height": null
        }, {
          "x": 0,
          "y": 150,
          "width": 150,
          "height": null
        }],
        "minWidth": 150,
        "minHeight": 150
      };
      var pkg = new Package(setup);
      var packedTree = pkg.packItems();
      chai.assert.equal(JSON.stringify(packedTree), JSON.stringify(expected));
    });

    describe('should support groups', function() {
      it('absolute nested', function() {
        var setup = {
          width: 150,
          items: [{
            id: 1,
            priority: 0.9, // 0.6,
            height: 50,
            width: 100
          }, {
            id: "group",
            priority: 0.8, // 0.9,
            height: 200,
            width: 200,
            gutter: 0,
            items: [{
              id: 3,
              priority: 1,
              height: 50,
              width: 50
            }, {
              id: "nestedgroup",
              priority: 0.8, // 0.9,
              height: 200,
              width: 200,
              gutter: 0,
              items: [{
                id: 2,
                priority: 0.4,
                height: 50,
                width: 50
              }, {
                id: 5,
                priority: 0.8,
                height: 50,
                width: 50
              }]
            }, {
              id: 4,
              priority: 0.8,
              height: 50,
              width: 50
            }]
          }, {
            id: 0,
            priority: 0.7, // 0.3,
            height: 100,
            width: 50
          }]
        };
        var pkg = new Package(setup);
        var packedTree = pkg.packItems();
        chai.assert.equal(JSON.stringify(packedTree), JSON.stringify({
          "width": 150,
          "items": [{
            "id": 1,
            "priority": 0.9,
            "height": 50,
            "width": 100,
            "x": 0,
            "y": 0
          }, {
            "id": "group",
            "priority": 0.8,
            "height": 200,
            "width": 150,
            "gutter": 0,
            "items": [{
              "id": 3,
              "priority": 1,
              "height": 50,
              "width": 50,
              "x": 0,
              "y": 0
            }, {
              "id": "nestedgroup",
              "priority": 0.8,
              "height": 200,
              "width": 200,
              "gutter": 0,
              "items": [{
                "id": 2,
                "priority": 0.4,
                "height": 50,
                "width": 50,
                "x": 0,
                "y": 0
              }, {
                "id": 5,
                "priority": 0.8,
                "height": 50,
                "width": 50,
                "x": 50,
                "y": 0
              }],
              "x": 0,
              "y": 50,
              "slots": [{
                "x": 100,
                "y": 0,
                "width": 100,
                "height": null
              }, {
                "x": 0,
                "y": 50,
                "width": 200,
                "height": null
              }],
              "minWidth": 100,
              "minHeight": 50
            }, {
              "id": 4,
              "priority": 0.8,
              "height": 50,
              "width": 50,
              "x": 50,
              "y": 0
            }],
            "x": 0,
            "y": 50,
            "slots": [{
              "x": 100,
              "y": 0,
              "width": 100,
              "height": 50
            }, {
              "x": 0,
              "y": 250,
              "width": 200,
              "height": null
            }],
            "minWidth": 200,
            "minHeight": 250
          }, {
            "id": 0,
            "priority": 0.7,
            "height": 100,
            "width": 50,
            "x": 0,
            "y": 250
          }],
          "id": "root",
          "height": null,
          "slots": [{
            "x": 100,
            "y": 0,
            "width": 50,
            "height": 50
          }, {
            "x": 50,
            "y": 250,
            "width": 100,
            "height": null
          }, {
            "x": 0,
            "y": 350,
            "width": 150,
            "height": null
          }],
          "minWidth": 150,
          "minHeight": 350
        }));
      });
      it("with items in relative sizes", function(){
        var setup = {
          width: 200,
          items: [{
            id: "group",
            items:[
              {
                id: 0,
                priority: 0.9,
                height: 50,
                width: 100
              },{
                id: 1,
                priority: 0.7,
                height: 50,
                width: "50%"
              }
            ],
            priority: 0.9,
            height: 50,
            width: 200
          }]
        };
        var pkg = new Package(setup);
        var packedTree = pkg.packItems();
        // first absolute child
        expect(packedTree.items[0].items[0]).to.have.property("x").equal(0, "should be packed first");
        expect(packedTree.items[0].items[0]).to.have.property("y").equal(0, "should be packed first");
        // second relative child
        expect(packedTree.items[0].items[1]).to.have.property("x").equal(100, "should be packed after first one");
        expect(packedTree.items[0].items[1]).to.have.property("y").equal(0, "in the first row");
        expect(packedTree.items[0].items[1]).to.have.property("width").equal(100, "should be 100 == 200 * 50% wide");
      });
    });

    describe('should support gutter', function() {
      it('in root', function() {
        var setup = {
          width: 150,
          gutter: 10,
          items: [{
            id: 0,
            priority: 0.9, // 0.6,
            height: 50,
            width: 100
          }, {
            id: 1,
            priority: 0.7, // 0.3,
            height: 100,
            width: 50
          }]
        };
        var pkg = new Package(setup);
        var packedTree = pkg.packItems();
        expect(packedTree.items[0]).to.have.property("x").equal(0);
        expect(packedTree.items[0]).to.have.property("y").equal(0);

        expect(packedTree.items[1]).to.have.property("x").equal(0, "should not fit in second column");
        expect(packedTree.items[1]).to.have.property("y").equal(60, "second row should be 10 (gutter) lower");
      });
      it('in root (more complicated example (issue #17)', function() {
        var setup = {
          "gutter": 25,
          "items": [

            {
              "id": 0,
              "priority": 0.9,
              "height": 25,
              "width": 200,
            },
            {
              "id": 1,
              "priority": 0.8,
              "height": 75,
              "width": 100
            },
            {
              "id": 2,
              "priority": 0.7,
              "height": 25,
              "width": 100
            },
            {
              "id": 3,
              "priority": 0.6,
              "height": 25,
              "width": 100
            }
          ],
          "id": "root",
          "width": 350
        };
        var pkg = new Package(setup);
        var packedTree = pkg.packItems();
        expect(packedTree.items[0]).to.have.property("x").equal(0);
        expect(packedTree.items[0]).to.have.property("y").equal(0);

        expect(packedTree.items[1]).to.have.property("x").equal(225, "should fit 25 after #0");
        expect(packedTree.items[1]).to.have.property("y").equal(0);

        expect(packedTree.items[2]).to.have.property("x").equal(0);
        expect(packedTree.items[2]).to.have.property("y").equal(50, "should fit 25 below #0");

        expect(packedTree.items[3]).to.have.property("x").equal(0, "should not fit between #1 and #2, should be below");
        expect(packedTree.items[3]).to.have.property("y").equal(100);
      });
      it('in containers', function() {
        var setup = {
          width: 150,
          gutter: 10,
          items: [{
            id: "group",
            gutter: 5,
            priority: 0.7, // 0.3,
            height: 100,
            width: 100,
            items: [{
              id: 0,
              priority: 0.8,
              height: 25,
              width: 25
            }, {
              id: 1,
              priority: 0.7,
              height: 25,
              width: 25
            }]
          }]
        };
        var pkg = new Package(setup);
        var packedTree = pkg.packItems();
        var packedGroup = packedTree.items[0];
        expect(packedTree.items[0]).to.have.property("x").equal(0, "container should be placed on top");
        expect(packedTree.items[0]).to.have.property("y").equal(0, "container should be placed on left");

        expect(packedGroup.items[0]).to.have.property("x").equal(0, "first item should be placed in top");
        expect(packedGroup.items[0]).to.have.property("y").equal(0, "first item should be placed in left");

        expect(packedGroup.items[1]).to.have.property("x").equal(25 + 5, "second item should be placed 5 on right from first");
        expect(packedGroup.items[1]).to.have.property("y").equal(0, "but still in same row");
      });
    });
    it('should support relative dimensions', function() {
      var setup = {
        width: 200,
        height: 100,
        gutter: 0,
        items: [{
          id: 0,
          priority: 0.9, // 0.6,
          height: "50%",
          width: 100
        }, {
          id: 1,
          priority: 0.7, // 0.3,
          height: 50,
          width: "100%"
        }]
      };
      var pkg = new Package(setup);
      var packedTree = pkg.packItems();
      expect(packedTree.items[0]).to.have.property("x").equal(0);
      expect(packedTree.items[0]).to.have.property("y").equal(0);
      expect(packedTree.items[0]).to.have.property("height").equal(50, "packed tree should have height calculated to 100*50%");

      expect(packedTree.items[1]).to.have.property("x").equal(0, "should not fit in second column");
      expect(packedTree.items[1]).to.have.property("y").equal(50, "should be in second row");
      expect(packedTree.items[1]).to.have.property("width").equal(setup.width, "packed tree should have height calculated to "+setup.width+"*100%");
    });
    it('should support precalculateHeight for containers', function() {
      var setup = {
        width: 150,
        gutter: 10,
        items: [{
          id: "group",
          gutter: 5,
          priority: 0.7, // 0.3,
          precalculateHeight: true,
          width: 100,
          items: [{
            id: 0,
            priority: 0.8,
            height: 25,
            width: 100
          }, {
            id: 1,
            priority: 0.7,
            height: 50,
            width: 25
          }]
        }]
      };
      var pkg = new Package(setup);
      var packedTree = pkg.packItems();
      expect(packedTree.items[0]).to.have.property("height").equal(80, "packed tree should have height calculated to minHeight that covers all items");
    });
    it('should support precalculateWidth for containers (with vertical orientation)', function() {
      var setup = {
        width: 150,
        gutter: 10,
        items: [{
          id: "group",
          gutter: 5,
          priority: 0.7, // 0.3,
          height: 100,
          direction: "vertical",
          precalculateWidth: true,
          items: [{
            id: 0,
            priority: 0.8,
            height: 75,
            width: 50
          }, {
            id: 1,
            priority: 0.7,
            height: 25,
            width: 25
          }]
        }]
      };
      var pkg = new Package(setup);
      var packedTree = pkg.packItems();
      expect(packedTree.items[0]).to.have.property("width").equal(80, "packed tree should have width calculated to minWidth that covers all items");
    });

    it('should support hidden items (will not be packed)', function() {
      var setup = {
        width: 200,
        gutter: 0,
        items: [{
          id: 0,
          priority: 1,
          height: 100,
          width: 100
        }, {
          id: 1,
          priority: 0.7,
          height: 100,
          width: 100,
          hidden: true
        }, {
          id: 2,
          priority: 0.5,
          height: 100,
          width: 100
        }]
      };
      var pkg = new Package(setup);
      var packedTree = pkg.packItems();
      expect(packedTree.items[1]).to.equal(setup.items[1], "packed hidden item should be same as given one");
      expect(packedTree.items[2]).to.have.property("x").equal(100, "third item should be packed just after first");
      expect(packedTree.items[2]).to.have.property("y").equal(0, "third item should be packed just after first");
    });

    it('should support hidden groups (none of items will be packed)', function() {
      var setup = {
        width: 200,
        gutter: 0,
        items: [{
          id: 0,
          priority: 1,
          height: 100,
          width: 100
        }, {
          id: 'group',
          priority: 0.7,
          height: 100,
          width: 100,
          hidden: true,
          items:[{
              id: 0,
              priority: 1,
              height: 100,
              width: 100
            }, {
              id: 3,
              priority: 0.7,
              height: 100,
              width: 100,
              hidden: true
            }
          ]
        }, {
          id: 2,
          priority: 0.5,
          height: 100,
          width: 100
        }]
      };
      var pkg = new Package(setup);
      var packedTree = pkg.packItems();
      expect(packedTree.items[1]).to.equal(setup.items[1], "packed hidden item should be same as given one");
      expect(packedTree.items[2]).to.have.property("x").equal(100, "third item should be packed just after first");
      expect(packedTree.items[2]).to.have.property("y").equal(0, "third item should be packed just after first");
    });

  });

  describe('method generateUniqueName', function() {

    it('should create a unique id with parentId_0 if this is a first child container in its parent', function() {
      var pkg = new Package({
        items: []
      });
      chai.assert.equal(pkg.generatePackageName(pkg.allItems.root), 'root_0');
    });

    it('should create a unique id with lowest possible integer suffix', function() {
      var pkg = new Package({
        items: [{
            id: 'root_0',
            items: []
          }, //currently 'items' property qualify an item to be considered as a container by Package
          {
            id: 'root_2',
            items: []
          }
        ]
      });
      chai.assert.equal(pkg.generatePackageName(pkg.allItems.root), 'root_1');
    });

  });

  describe('method createNewContainer', function() {

    it('by default should create empty virtual container', function() {
      var pkg = new Package({
        items: []
      });
      pkg.createNewContainer();
      expect( pkg.allItems["root_0"] ).to.be.defined;
      expect( pkg.allItems["root_0"] ).to.have.property("items");
    });

    it('should create empty virtual container with given id', function() {
      var pkg = new Package({
        items: []
      });
      pkg.createNewContainer("givenName");
      expect( pkg.allItems["givenName"] ).to.be.defined;
      expect( pkg.allItems["givenName"] ).to.have.property("items");
    });

    it('should create empty virtual container in given container', function() {
      var pkg = new Package({
        items: []
      });
      var givenContainer = pkg.createNewContainer("givenContainer");
      var createdContainer = pkg.createNewContainer("another", givenContainer);
      expect( pkg.allItems["another"] ).to.be.defined;
      expect( pkg.allItems["another"] ).to.have.property("items");
      expect( pkg.allItems["givenContainer"] ).property("items").to.contain(createdContainer);
    });

    it('should create new containers with unique ids', function() {
      var pkg = new Package({
        items: []
      });
      var first = pkg.createNewContainer();
      var second = pkg.createNewContainer();
      var third_nested = pkg.createNewContainer(undefined, second);
      expect( first ).to.have.property("id");
      expect( second ).to.have.property("id").not.equal(first.id);
      expect( third_nested ).to.have.property("id").not.equal(first.id);
      expect( third_nested ).to.have.property("id").not.equal(second.id);

      expect( pkg.allItems ).to.have.property( "root_0", first );
      expect( pkg.allItems ).to.have.property( "root_1", second );
      expect( pkg.allItems ).to.have.property( "root_1_0", third_nested );
    });

  });

  // describe('method getMinimumDimensions', function () {

  //   it('for a single element should return the element', function () {
  //     var pkg = new Package({
  //       items: []
  //     });
  //     var elements = [
  //       {
  //         offsetLeft: 100,
  //         offsetTop: 100,
  //         offsetWidth: 256,
  //         offsetHeight: 128
  //       }
  //     ];
  //     var dimensions = pkg.getMinimumDimensions([elements[0]]);
  //     chai.assert.equal(dimensions.width, 256);
  //     chai.assert.equal(dimensions.height, 128);
  //   });

  //   it('for 2 elements, that do not overlap, should return sum of their dimensions', function () {
  //     var pkg = new Package({
  //       items: []
  //     });
  //     var elements = [
  //       {
  //         offsetLeft: 100,
  //         offsetTop: 100,
  //         offsetWidth: 256,
  //         offsetHeight: 128
  //       },
  //       {
  //         offsetLeft: 400,
  //         offsetTop: 400,
  //         offsetWidth: 256,
  //         offsetHeight: 128
  //       }
  //     ];
  //     var dimensions = pkg.getMinimumDimensions([elements[0], elements[1]]);
  //     chai.assert.equal(dimensions.width, 512);
  //     chai.assert.equal(dimensions.height, 256);
  //   });

  //   it('for 2 elements, that overlap, should return projection of their dimensions', function () {
  //     var pkg = new Package({
  //       items: []
  //     });
  //     var elements = [
  //       {
  //         offsetLeft: 100,
  //         offsetTop: 100,
  //         offsetWidth: 256,
  //         offsetHeight: 128
  //       },
  //       {
  //         offsetLeft: 200,
  //         offsetTop: 200,
  //         offsetWidth: 256,
  //         offsetHeight: 128
  //       }
  //     ];
  //     var dimensions = pkg.getMinimumDimensions([elements[0], elements[1]]);
  //     chai.assert.equal(dimensions.width, 356);
  //     chai.assert.equal(dimensions.height, 228);
  //   });

  //   it('for 2 elements, that overlap, should return projection of their dimensions (reverse order)', function () {
  //     var pkg = new Package({
  //       items: []
  //     });
  //     var elements = [
  //       {
  //         offsetLeft: 100,
  //         offsetTop: 100,
  //         offsetWidth: 256,
  //         offsetHeight: 128
  //       },
  //       {
  //         offsetLeft: 200,
  //         offsetTop: 200,
  //         offsetWidth: 256,
  //         offsetHeight: 128
  //       }
  //     ];
  //     var dimensions = pkg.getMinimumDimensions([elements[1], elements[0]]);
  //     chai.assert.equal(dimensions.width, 356);
  //     chai.assert.equal(dimensions.height, 228);
  //   });
  // });
});
