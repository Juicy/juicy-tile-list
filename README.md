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
    <script src="http://cdnjs.cloudflare.com/ajax/libs/polymer/0.3.4/platform.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/polymer/0.3.4/polymer.js"></script>
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
`setup`                      | *Object*            |              | Tiles setup
`setup.gutter`                  | *Number*            | `0`       | Gutter/cell-spacing size in px
`setup.direction`            | *String*            | `rightDown`  | How to align our package (horizontal layers `rightDown`, or vertiaval layers: `downRight`)
`setup.items`                | *Array*             | `[]`         | Tiles setup
`setup.items[?].priority`    | *Number* (0-1)      | `0`          | Importance of tile, used for sorting elements.
`setup.items[?].width`       | *Number*            | `1`          | Tile width (number of columns)
`setup.items[?].heigh`       | *Number*            | `1`          | Tile height (number of rows)
`setup.items[?].index`       | *Number*            |              | DOM ChildElement index (not needed for virtual containers)
`setup.items[?].name`        | *String*            |              | Group name (for virtual containers)
`setup.items[?].innerHTML`   | *String*            |              | Inner HTML for (for virtual containers)
`setup.items[?].oversize`    | *Number*            | `0`          | Make container's box & background bleed for this amount of pixels out of packed box. So, render box bigger, but pack with its original size (for virtual containers)
`setup.items[?].items`       | *Array(Items)*      |              | Recursive setup (for virtual containers)
`setup.items[?].gutter`      | *Number*            | `0`          | Recursive setup (for virtual containers)
`setup.items[?].direction`   | *String*            |              | Recursive setup (for virtual containers)

## Properties

Name                 | Options        | Description
---                  | ---            | ---
`elements`   | *Array*        | Array of children which are going to be arranged.
`setup`              | *Object*       | Up to date tiles setup. Structure as in attributes.
`items`              | *Object*       | Map of setup nodes. Ones reflecting real DOM elements are indexed with `0-n` as in HTML, virtual containers are mapped with names. Root container is available under `items['root']`.
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

#### v0.0.7
 - gap renamed to gutter
 - removed localStorage features (use [`<juicy-tiles-setup-sync>`](https://github.com/Juicy/juicy-tiles-setup-sync) if needed)
 - auto height fixes

#### v0.0.6
 - minifying task - dist folder for production use.

#### v0.0.5
 - critical fix

#### v0.0.4
 - `defaultTileSetup` attribute
 - many bug fixes
 - update Polymer to 0.3.4

#### v0.0.3
 - better separation of DOM vs packing,
 - oversizing containers,
 - innerHTML property for virtual containers,
 - better `heightAuto`, `widthAuto` behavior,
 - auto same to storage removed,
 - update to Polymer 0.3.0,
 - containers stretching behavior in case of  overflow,
 - rename to `juicy-tile-list`,
 - [`juicy-tile-editor`](https://github.com/Juicy/juicy-tile-editor), and [`juicy-highlight`](https://github.com/Juicy/juicy-highlight) separated to its own repos,
 - tons of fixes, tests, and minor changes.

#### v0.0.2
 - Virtual grouping,
 - advanced editor features,
 - gaps

#### v0.0.1



## License

[MIT License](http://opensource.org/licenses/MIT)
