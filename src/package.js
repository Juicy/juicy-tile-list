/**
 * Package
 * version: 0.1.0
 */
(function( scope, Packer ){
"use strict";

/**
 * Extend JSON setup, with circular references to items' containers.
 * Creates an array of all items and virtual containers, 
 * that maps to nodes in setup tree.
 * Applies default container id.
 * @param {Object} setup packer setup
 * @param {Item} [container] parent node
 * @param {Object} [allItems={}] map of items to update
 * @returns {Array} array of updated/created items
 */
function parseSetup( setup, container, allItems ){
    allItems = allItems || {};
    var id, currentContainer;
    if( !container ){
      id = setup.id = "root";
      container = null;
    } else {
      id = setup.id || ( (container && container.id) + "_" + sNo );
      // FIXME i'm ugly
      setup.id = id;
    }
    // create item for current container
    allItems[ id ] = currentContainer = setup;
    Object.defineProperty(setup, "container", {value: container, writable: true});

    // create allItems list
    for(var sNo = 0, sLen = setup.items.length; sNo < sLen; sNo++) {
      var itemSetup = setup.items[sNo];

      // walk the tree recursively
      if(itemSetup.items){
        // FIXME I'm ugly
        // create default id
        if(!itemSetup.id){
          itemSetup.id = ( currentContainer.id + "_" + sNo );
        }
        parseSetup( itemSetup, currentContainer, allItems );
      } else {
        // TODO: make index/id not mandatory (tomalec)
        allItems[ itemSetup.id ] = itemSetup;
        Object.defineProperty(itemSetup, "container", {value: currentContainer, writable: true });
      }
    }
    return allItems;
}
 /**
 * Returns the minimum value of the priority property from the given array of objects
 * @param {Array<Object>} arr
 * @return {Number} number in range from 0 to 1
 * @TODO DRY
 */
function getMinimumPriority(arr) {
  var min = 1;
  for (var i = 0, ilen = arr.length; i < ilen; i++) {
    if (arr[i].priority < min) {
      min = arr[i].priority;
    }
  }
  if (min < 0) {
    min = 0;
  }
  return min;
}

/**
 * [Package description]
 * @param {Object} [setup] packer setup (*Warning*: object will be modified!)
 * @IDEA remove this.items (tomalec)
 */
function Package( setup ){
  if(setup){
    this.setup = setup;
    // XXX: this is used only by layer above (juicy-tile-list to match with elements)
    this.allItems = parseSetup( setup );
  }else{
    this.setup = {
      id: "root",
      direction: "rightDown",
      gutter: 0,
      items: []
    };
    this.allItems = {root: this.setup};
  }
}
Package.prototype.allItems = null;
Package.prototype.setup = null;


Package.prototype.direction = "rightDown";

/**
 * [packItems description]
 * @param {Object} setup setup of items fo pack, if not give `#setup` will be used
 */
Package.prototype.packItems = function packItems( setup ) {
  setup || (setup = this.setup);
  var that = this,
      packer = new Packer(setup);

  //pack rectangles, and calculate container size
  packer.items = setup.items
    .sort(this.sorter) // sort- if neded
    .map(function(itemSetup){
      if(itemSetup.hidden){
        return itemSetup;
      }
      // TODO: do it more lightweight
      var rect = new Rectangle(itemSetup);

      //first calculate rect width because it cannot be auto TODO: fix for downRight mode
      if( !rect.widthAuto && typeof rect.width == "string" && rect.width.indexOf("%") > 0 ){
        rect.width = ( (setup.width + setup.gutter) * parseFloat(rect.width) /100  - setup.gutter);
      } else {
        rect.width = parseFloat( rect.width );
      }
      // caluclate relative size
      // we cannot use calc(xx% - gutter px) as it can be in virtual container which is a sibling
      if( !rect.heightAuto && typeof rect.height == "string" && rect.height.indexOf("%") > 0 ){
        rect.height = ( (setup.height + setup.gutter) * parseFloat(rect.height) /100 - setup.gutter );
      } else {
        rect.height = parseFloat( rect.height );
      }

      
      if (itemSetup.items ) { // container
        // pack its items first, to figureout minSize
        rect = that.packItems(
          rect // use caculated width and height
        );

      }

      // Pack item
      packer.add(rect);

      return rect;
  });

  //change Infinity back to real size:
  packer.height = setup.heightAuto ? packer.minHeight : parseFloat( setup.height );
  packer.width = setup.widthAuto ? packer.minWidth : parseFloat( setup.width );
  return packer;
};


/**
 * Change priority of given item
 * @//param  {Item | Number | String} itemIndex    item/container id (by default the original item index in DOM), or item itself
 * @param  {Item} item    item to be re-prioritized
 * @param  {Boolean} increase  true - increases priority, false - decreases
 * @param  {Boolean} [end=false] true to move to the end
 * @return {juicy-tile-list}        self
 * @TODO write tests
 */
Package.prototype.reprioritizeItem =  function( item, increase, end ){
  var higher, lower, item;
  // if( typeof item !== 'object'){
  //   item = this.items[item];
  // }
  var itemSetup = item;
  // use parent items
  var collection = item.container && item.container.items;
  // do nothing for root
  if( !collection ){
    throw new RangeError( "Cannot reprioritize root container");
    return false;
  }
  // do nothing if there is nothing to rearrange
  if( collection.length < 2){
    return this;
  }
  var sortedIndex = collection.indexOf( itemSetup );

  // move to the end
  if( end ||
      increase && (sortedIndex <= 1) ||
      !increase && (sortedIndex >= collection.length - 2 )
  ){
      // top
      if(increase){
          // already on top
          if(itemSetup.priority == 1){
              return this;
          }
          higher = collection[0];
          // already there, but with different priority
          if(higher == item){
              itemSetup.priority = 1;
              // do not rearrange
              return this;
          } else {
              // move to the middle
              higher.priority = (collection[1].priority + 1)/2;
              itemSetup.priority = 1;
          }
      } else { // bottom
          // already at the bottom
          if(itemSetup.priority == 0){
              return this;
          }
          lower = collection[collection.length -1 ];
          // already there, but with different priority.
          if(lower == item){
              itemSetup.priority = 0;
              return this;
          } else {
              // move to the middle
              lower.priority = collection[collection.length -2].priority/2;
              itemSetup.priority = 0;
          }

      }
  } else {
      // top
      if(increase){
          higher = collection[sortedIndex-2];
          lower = collection[sortedIndex-1];
      } else {
          higher = collection[sortedIndex+1];
          lower = collection[sortedIndex+2];
      }
      itemSetup.priority = (higher.priority + lower.priority)/2;
  }

  // TODO only this scope
  this.packItems( );
  return this;
};

/**
 * Resize given item.
 * @//param  {SetupItemRef} item   item from list, or item id (by default the original item index in DOM)
 * @param  {SetupItemRef} item   item from list
 * @param  {Number} width  number of cells/columns
 * @param  {Number} height number of cells/rows
 * @return {juicy-tile-list}        self
 */
Package.prototype.resizeItem = function(item, width, height){
  // if(typeof item !== 'object'){
  //     item = this.items[item];
  // }
  item.width = width;
  item.height = height;
  // re-pack only applicable branch
  // this.packItems( item.container, item.container.packer );
  // re-pack everthing
  this.packItems();

  return this;
};
/**
 * 
 * @//param  {SetupItemRef | String} what item reference or id
 * @param  {SetupItemRef} what item reference
 * @//param  {SetupItemRef} [where]    Reference to, or id of destination container.    If id given in *string* is not found in existing containers list, new one will be created and wrapped around given item.
 * @param  {SetupItemRef} [where]    Reference to destination container.
 * @param {Boolean} [noPacking=false]
 * @return {[type]}              [description]
 */
Package.prototype.moveToContainer = function( what, where, noPacking ){
  // if( typeof what !== "object" ){
  //   what = this.items[what];
  // }
  var from = what.container && what.container.items;
  // do nothing for root
  if( !from ){
    throw new RangeError( "Cannot move root container");
    return false;
  }
  var to;
  // if( typeof where === "string" ){
  //   // container given by key
  //   where = this.items[where] || 
  //   // or new one
  //           this.createNewContainer(where, from, what, true);
  // }
  to = where.items;
  // origin == destination
  if( from == to ){
    return false;
  }

  from.splice( from.indexOf(what), 1);
  what.container = where;
  to.push(what);

  if(!noPacking){
    //TODO: repack only applicable ones
    this.packItems();
  }

};
/**
 * Delete virtual container, move items (if any) to one above.
 * @//param  {Item | String} what        Reference to, or id of the container to delete.
 * @param  {Item} what        Reference to the container to delete.
 * @param  {Boolean} [noRepacking=false]  `true` to prevent  re-packing after setup change.
 * @return {Object}             deleted item
 */
Package.prototype.deleteContainer = function( what, noRepacking ){
  // if( typeof what === "string" ){
  //   what = this.items[what];
  // }
  if( what.items === undefined ){
    throw new RangeError( "Cannot delete real element");
  }
  var container = what.container;
  if( what.id == "root" || !container ){
    throw new RangeError( "Cannot delete root container");
  }
  // cache some stuff;
  var siblingsList = container.items;
  // move all items to container above
  var itemNo = what.items.length;
  while( itemNo-- ){
    // XXX do batch move (tomalec)
    // XXX keep items list in item object
    this.moveToContainer( what.items[itemNo], container, true);
  }

  // remove setup
  var removed = siblingsList.splice( siblingsList.indexOf(what), 1)[0];
  // remove item
  delete this.allItems[what.id];


  if(!noRepacking){
    //TODO: repack only applicable ones
    this.packItems();
  }
  return removed;
};
/**
 * Create a unique id for a container
 * @param {Object} parent container
 * @return {String}
 */
Package.prototype.generatePackageName = function (container) {
  var i = 0;
  while (this.allItems[container.id + '_' + i]) {
    i++;
  }
  return container.id + '_' + i;
};
/**
 * Create new empty virtual container.
 * @param  {String} id        Id for the container. If empty, a unique id will be generated
 * @//param  {Item | String} [inContainer="root"] Container item or id
 * @param  {Item} [inContainer=root container] Container item
 * @param  {Rectangle} [rectangle]   rectangle setup (width, height, priority)
 * @param  {Boolean} [noRepacking=false] `true` block re-packing items after setup change
 * @return {item}             created container
 */
Package.prototype.createNewContainer = function( id, inContainer, rectangle, noRepacking ){
  // if( typeof inContainer === "string" ){
  //   inContainer = this.items[inContainer];
  // } else {
    inContainer = inContainer || this.setup;
  // }
  // cache smth

  if (!id) {
    id = this.generatePackageName(inContainer);
  }

  var siblings = inContainer.items;

////-----------------
  var setup = {
      gutter: 0,
      items: [],
      id: id,
      priority: rectangle ? rectangle.priority : getMinimumPriority(siblings)/2,
      width: rectangle && rectangle.width || 0,  // consider use of this.defaultTileSetup
      height: rectangle && rectangle.height || 0 // consider use of this.defaultTileSetup
  };
  this.allItems[ id ] = setup;
  // 
  // XXX: setter?
  Object.defineProperty(setup, "container", { value: inContainer, writable: true });

  siblings.push(setup);

  if(!noRepacking){
    //TODO: repack only applicable ones
    this.packItems();
  }
  return setup;
};


// TODO: export
scope.Package = Package;

}(window, Packer));
