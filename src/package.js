/**
 * Package
 */
(function( scope, Packer ){
"use strict";

/**
 * Extend JSON setup, with circular references to items' containers.
 * Creates an array of items and virtual containers, 
 * that maps to nodes in setup tree.
 * Applies default container name.
 * @param {Object} setup packer setup
 * @param {Item} [container] parent node
 * @param {Object} [items={}] map of items to update
 * @returns {Array} array of updated/created items
 */
function parseSetup( setup, container, items ){
    items = items || {};
    var name, currentContainer;
    if( !container ){
      name = setup.name = "root"
      container = null;
    } else {
      name = setup.name || ( (container && container.name) + "_" + sNo );
      // FIXME i'm ugly
      setup.name = name;
    }
    // create item for current container
    items[ name ] = currentContainer = setup;
    Object.defineProperty(setup, "container", {value: container, writable: true});

    // create items list
    for(var sNo = 0, sLen = setup.items.length; sNo < sLen; sNo++) {
      var itemSetup = setup.items[sNo];

      // walk the tree recursively
      if(itemSetup.items){
        // FIXME I'm ugly
        // create default name
        if(!itemSetup.name){
          itemSetup.name = ( currentContainer.name + "_" + sNo );
        }
        parseSetup( itemSetup, currentContainer, items );
      } else {
        items[ itemSetup.index ] = itemSetup;
        Object.defineProperty(itemSetup, "container", {value: currentContainer, writable: true });
      }
    }
    return items;
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
 * @param {Object} [setup] packer setup
 *
 * @todo remove #elements from here
 */
function Package( setup ){
  this.setup = setup || {
    name: "root",
    direction: "rightDown",
    gap: 0,
    items: []
  };
  // XXX: this is only used by layer above (pj-srotable-tiles to match with elements)
  this.items = 
  parseSetup( this.setup );

  // this.reset();
}
// Package.prototype.elements = [];
Package.prototype.items = null;
Package.prototype.setup = null;


Package.prototype.direction = "rightDown";


/**
 * [packItems description]
 * @param {Object} setup setup of items fo pack, if not give `#setup` will be used
 * @param {Array<Element>} elements array of DOM elements to update.
 */
Package.prototype.packItems = function packItems( setup, elements ) {
  setup || (setup = this.setup);
  elements || (elements = this.elements);
  var that = this,
      packer = new Packer(setup);

  //pack rectangles, and calculate container size
  packer.items = setup.items
    .sort(this.sorter) // sort- if neded
    .map(function(itemSetup){
      // TODO: do it more lightweight
      var rect = new Rectangle(itemSetup);
      // TODO, property?
      rect.container = setup;

      if (elements) {
        var element = elements[ itemSetup.index ];
        if (!element) {
          element = elements[ itemSetup.name ];
          if (!element) {
            element = document.createElement('DIV');
            element.style.zIndex = -1;
            element.style.position = "absolute";// FIXME: should be done in css
            that.$.container.appendChild(element);
            elements[ itemSetup.name ] = element;
          }
        }
      }

      //first calculate rect width because it cannot be auto TODO: fix for downRight mode
      if( typeof rect.width == "string" && rect.width != "auto" && rect.width.indexOf("%") > 0 ){
        rect.width = ( (setup.width + setup.gap) * parseFloat(rect.width) /100  - setup.gap);
      }
      // caluclate relative size
      // we cannot use calc(xx% - gap px) as it can be in virtual container which is a sibling
      if( typeof rect.height == "string" && rect.height != "auto" && rect.height.indexOf("%") > 0 ){
        rect.height = ( (setup.height + setup.gap) * parseFloat(rect.height) /100 - setup.gap );
      }

      
      if (itemSetup.items && itemSetup.propertyIsEnumerable("items")) { // container. propertyIsEnumerable is needed to rule out virtual "items" added by juicy-tiles-editor on nested tiles
        // pack its items first, to figureout minSize
        rect = that.packItems(
          rect, // use caculated width and height
          elements
        );

      } else { // element
        if(itemSetup.height == "auto"){
          // rect.height = element.clientHeight;          
          element.style.height = ""; //slow, but I don't know another way to measure real height when element's content has shrinked other than remove height property before measuring (Marcin)
          rect.height = element.scrollHeight; //now we can measure scrollHeight because width is already set and height is not constrained
        } else {
          rect.height = parseFloat( rect.height );
        }
        if(itemSetup.width == "auto"){
          // rect.width = element.clientWidth;
          element.style.width = ""; //slow, but I don't know another way to measure real width when element's content has shrinked other than remove height property before measuring (Marcin)
          rect.width = element.scrollWidth; //now we can measure scrollHeight because width is already set and height is not constrained
        } else {
          rect.width = parseFloat( rect.width );
        }
      }

      // Pack item
      packer.add(rect);

      return rect;
  });

  //change Infinity back to real size:
  packer.height = setup.height && ( setup.height != "auto" ) ? parseFloat( setup.height ) : packer.minHeight;
  packer.width = setup.width && ( setup.width != "auto" ) ? parseFloat( setup.width ) : packer.minWidth;
  return packer;
};


/**
 * Change priority of given item
 * @param  {Item | Number | String} itemIndex    item index (the original item index in DOM), container name, or item itself
 * @param  {Boolean} increase  true - increases priority, false - decreases
 * @param  {Boolean} [end=false] true to move to the end
 * @return {juicy-tiles}        self
 * @TODO write tests
 */
Package.prototype.reprioritizeItem =  function( item, increase, end ){
  var higher, lower, item;
  // do nothing if there is nothing to rearrange
  if( this.elements.length < 2){
    return this;
  }
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

  this.saveToStorage();
  // TODO only this scope
  this.packItems( );
  return this;
};

/**
 * Resize given item.
 * @param  {SetupItemRef} item   item from list, or item index (the original item index in DOM)
 * @param  {Number} width  number of cells/columns
 * @param  {Number} height number of cells/rows
 * @return {juicy-tiles}        self
 */
Package.prototype.resizeItem = function(item, width, height){
  // if(typeof item !== 'object'){
  //     item = this.items[item];
  // }
  item.width = width;
  item.height = height;
  // this.saveToStorage();
  // re-pack only applicable branch
  // this.packItems( item.container, item.container.packer );
  // re-pack everthing
  this.packItems();

  return this;
};
/**
 * 
 * @param  {SetupItemRef} what item referrence or element index or container name
 * @param  {SetupItemRef} [where]    Reference to, or name of destination container.    If name given in *string* is not found in existing containers list, new one will be created and wrapped around given item.
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
    // this.saveToStorage();
    this.packItems();
  }

};
/**
 * Delete virtual container, move items (if any) to one above.
 * @param  {Item | String} what        Reference to, or name of the container to delete.
 * @param  {Boolean} [noRepacking=false]  `true` to prevent  re-packing after setup change.
 * @return {juicy-tiles}             self
 */
Package.prototype.deleteContainer = function( what, noRepacking ){
  // if( typeof what === "string" ){
  //   what = this.items[what];
  // }
  if( what.index ){
    throw new RangeError( "Cannot delete real element");
  }
  var container = what.container;
  if( what.name == "root" || !container ){
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
  siblingsList.splice( siblingsList.indexOf(what), 1);
  // remove item
  // delete this.items[what.name];


  if(!noRepacking){
    // this.saveToStorage();
    //TODO: repack only applicable ones
    this.packItems();
  }
  return this;
};
/**
 * Create a unique name for a container
 * @param {Object} parent container
 * @return {String}
 */
Package.prototype.generatePackageName = function (container) {
  var i = 0;
  while (this.items[container.name + '_' + i]) {
    i++;
  }
  return container.name + '_' + i;
};
/**
 * Create new empty virtual container.
 * @param  {String} name        Name for the container. If empty, a unique name will be generated
 * @param  {Item | String} [inContainer="root"] Container name or item
 * @param  {Rectangle} [rectangle]   rectangle setup (width, height, priority)
 * @param  {Boolean} [noRepacking=false] `true` block re-packing items after setup change
 * @return {item}             created container
 */
Package.prototype.createNewContainer = function( name, inContainer, rectangle, noRepacking ){
  // if( typeof inContainer === "string" ){
  //   inContainer = this.items[inContainer];
  // } else {
    inContainer = inContainer || this.setup;
  // }
  // cache smth

  if (!name) {
    name = this.generatePackageName(inContainer);
  }

  // TODO check if name exists
  var siblings = inContainer.items;

////-----------------
  var setup = {
      gap: 0,
      items: [],
      name: name,
      priority: rectangle ? rectangle.priority : getMinimumPriority(siblings)/2,
      width: (rectangle || defaultSetupNode).width,
      height: (rectangle || defaultSetupNode).height
  };
  // this.items[ name ] = containerItem;
  // 
  // XXX: setter?
  Object.defineProperty(setup, "container", { value: inContainer, writable: true });

  siblings.push(setup);

  if(!noRepacking){
    //TODO: repack only applicable ones
    // this.saveToStorage();
    this.packItems();
  }
  return setup;
};
/**
 * For an array of HTML elements, returns total size in which they would all fit in one dimension.
 * Dimension projection is read through startProp and sizeProp
 * @param {Array} elements
 * @param {String} startProp - "offsetLeft" or "offsetTop"
 * @param {String} sizeProp - "offsetWidth" or "offsetHeight"
 * @returns {Number}
 */
Package.prototype._getMinimumDimension = function (elements, startProp, sizeProp) {
  var ranges = [];

  if (elements.length < 1) {
    throw new Error("I need at least one element");
  }

  elements.sort(function (a, b) {
    return a[startProp] - b[startProp];
  });

  ranges.push({
    start: elements[0][startProp],
    end: elements[0][startProp] + elements[0][sizeProp]
  });

  for (var i = 1, ilen = elements.length; i < ilen; i++) {
    var last = ranges[ranges.length - 1];
    var start = elements[i][startProp];
    var end = elements[i][startProp] + elements[i][sizeProp];

    if (last.end < start) {
      ranges.push({
        start: start,
        end: end
      });
    }
    else if (last.end < end) {
      last.end = end;
    }
  }

  var sizeSum = 0;
  for (var i = 0, ilen = ranges.length; i < ilen; i++) {
    sizeSum += ranges[i].end - ranges[i].start;
  }

  return sizeSum;
}
/**
 * For an array of HTML elements, returns the minimum width and height where they can fit
 * @param {Array} elements
 * @returns {{width: {Number}, height: {Number}}}
 */
Package.prototype.getMinimumDimensions = function (elements) {
  return {
    width: this._getMinimumDimension(elements, 'offsetLeft', 'offsetWidth'),
    height: this._getMinimumDimension(elements, 'offsetTop', 'offsetHeight')
  }
}


// TODO: export
scope.Package = Package;

}(window, Packer));
