# &lt;juicy-tile-list&gt; ![Bower Version](https://badge.fury.io/bo/juicy-tile-list.svg)

> `<juicy-tile-list>` is masonry-like Polymer Element for sortable tiles that packs efficiently without changing HTML structure (changes CSS only).

## Features 

It gives you:
 - masonry-like, gap-less layout (bin-packing), 
 - prioritizing items, 
 - grouping into virtual, nested containers,
 - alignment in different orientations/directions,
 - dynamically changing size,
 - auto adjusting container sizes,
 - gutter/cell-spacing between tiles,
 - adapting to window size changes.


## Demo

[Check it live!](http://juicy.github.io/juicy-tile-list)

## Usage

1. Install the component using [Bower](http://bower.io/):

    ```sh
    $ bower install juicy-tile-list --save
    ```

2. Import Web Components' polyfill:

    ```html
    <script src="bower_components/webcomponentsjs/webcomponents.js"></script>
    ```

3. Import Custom Element:

    ```html
    <link rel="import" href="../juicy-tile-list/dist/juicy-tile-list.html">
    ```

4. Start using it!

    ```html
    <juicy-tile-list></juicy-tile-list>
    ```

## Options

Attribute                    | Options             | Default      | Description
---                          | ---                 | ---          | ---
`defaultTileSetup`           | *Object*            | see below    | Overwrites default values for Tiles (`setup.items[?].?`)
`gutter`                     | *Number*            | `0`          | Overwrites default value of `setup.gutter`
`duration`                   | *Number*            | `0.5`        | Duration of repack animation (in seconds).
`setup`                      | *Object*            |              | Tiles setup
`setup.gutter`               | *Number*            | `0`          | Gutter/cell-spacing size in px
`setup.direction`            | *String*            | `rightDown`  | How to align our package (horizontal layers `rightDown`, or vertiaval layers: `downRight`)
`setup.items`                | *Array*             | `[]`         | Tiles setup
`setup.items[?].priority`    | *Number* (0-1)      | `0`          | Importance of tile, used for sorting elements.
`setup.items[?].width`       | *Number*            | `1`          | Tile width (number of columns)
`setup.items[?].heigh`       | *Number*            | `1`          | Tile height (number of rows)
`setup.items[?].id`          | *String*            |              | Element/group id by default order in DOM will be used
`setup.items[?].content`     | *String*            |              | HTML content for (for virtual containers)
`setup.items[?].oversize`    | *Number*            | `0`          | Make container's box & background bleed for this amount of pixels out of packed box. So, render box bigger, but pack with its original size (for virtual containers)
`setup.items[?].items`       | *Array(Items)*      |              | Recursive setup (for virtual containers)
`setup.items[?].gutter`      | *Number*            | `0`          | Recursive setup (for virtual containers)
`setup.items[?].direction`   | *String*            |              | Recursive setup (for virtual containers)

## Properties

Name                 | Options        | Description
---                  | ---            | ---
`elements`           | *Array*        | Array of children which are going to be arranged.
`duration`           | *Number*       | `0.5`        | Duration of repack animation (in seconds).
`setup`              | *Object*       | Up to date tiles setup. Structure as in attributes.
`allItems`           | *Object*       | Map of setup nodes. Root container is available under `allItems['root']`.
`items[.].container` | *Object*       | Reference to container item. (non-enumerable property)

## Methods

Name               | Param name | Type               | Default | Description
---                | ---        | ---                | ---     | ---
`resizeItem`       |            |                    |         | Resize any item (real element or virtual container)
                   | item       | *Item*, *Number* or *String* |         | Item, item index or item name.
                   | width      | *Number*           | `0`     | new width
                   | height     | *Number*           | `0`     | new height
`reprioritizeItem` |            |                    |         | Change priority/weight of any item
                   | item       | *Item*, *Number* or *String* |         | Item, item index or item name.
                   | increase   | *Boolean*          | `false` | `true` - increases, `false` decreases priority
                   | end        | *Boolean*          | `false` | `true` to move to the end of list
`moveToContainer`  |            |                    |         | Move any item to given container, or wrap it with new one
                   | what       | *Item*, *Number* or *String* |         | Item, item index or item name.
                   | where      | *String* or *Item* |         | Reference to, or name of destination container.    If name given in *string* is not found in existing containers list, new one will be created and wrapped around given item.
                   | noPacking  | *Boolean*          | `false` | `true` to prevent  re-packing after setup change.
`createNewContainer`|           |                    |         | Create new empty virtual container.
                   | name       | *String*           |         | Name for the container
                   | where      | *String* or *Item* | `"root"`| Container name or item
                   | rectangle  | *Rectangle*        |         | Rectangle setup (width, height, priority)
                   | noPacking  | *Boolean*          | `false` | `true` to prevent  re-packing after setup change.
`deleteContainer`  |            |                    |         | Delete virtual container, move items (if any) to one above.
                   | what       | *Item* or *String* |         | Reference to, or name of the container to delete.
                   | noPacking  | *Boolean*          | `false` | `true` to prevent  re-packing after setup change.

## Events

Name                      | Data | Description
---                       | ---  | ---   
`juicy-tile-list-refresh` |  -   | Triggered once layout is refreshed

## Tile ids

Every tile gets its id, it's used in ShadowDom (so it won't collide with your markup) to match Light DOM content with positioned tile (and its setup).
In HTML ids get created automatically, from order in DOM, so in your setup JSON you simply need to match the index of child node.

### :construction: Custom ids (experimental feature)

If for some reason, consecutive numbers does not fit your needs, you can assign id manually, by setting `juicytile` attribute:
```html
<juicy-tile-list>
 <div juicytile="myFancyTileId">smth</div>
</juicy-tile-list>
```
```javascript
juicytilelist.setup = {
  items:[
    {
      id: "myFancyTileId",
      priority: 0.2
    }
  ]
}
```
### :construction: Scoped ids (experimental feature)

You can also add name-space to your id in declarative way.
```html
<juicy-tile-list>
  <juicy-tile-group name="fruits">
    <div>apple</div>
  </juicy-tile-group>
  <juicy-tile-group name="veggies">
    <div>carrot</div>
  </juicy-tile-group>
</juicy-tile-list>
```
```javascript
juicytilelist.setup = {
  items:[
    {
      id: "fruits/0",
      priority: 0.2
    },
    {
      id: "veggies/0",
      priority: 0.4
    }
  ]
}
```

## Related components

- [`<juicy-tile-editor>`](Juicy/juicy-tile-editor) - GUI for editing tiles JSON setup
- [`<juicy-tile-grid>`](Juicy/juicy-tile-grid) - Tiles rendered with CSS Grid Layout

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

For detailed changelog, check [Releases](https://github.com/Juicy/juicy-tile-list/releases).


## License

[MIT License](http://opensource.org/licenses/MIT)
