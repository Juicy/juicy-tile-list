# &lt;juicy-tiles&gt; ![Bower Version](https://badge.fury.io/bo/juicy-tiles.svg)

`<juicy-tiles>` is a Polymer Element with sortable tiles that packs efficiently without changing HTML structure (changes CSS only).

## Demo

[Check it live!](http://juicy.github.io/juicy-tiles)

## Usage

1. Install the component using [Bower](http://bower.io/):

    ```sh
    $ bower install juicy-tiles --save
    ```

2. Import Web Components' polyfill:

    ```html
    <script src="http://cdnjs.cloudflare.com/ajax/libs/polymer/0.2.2/platform.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/polymer/0.2.2/polymer.js"></script>
    ```

3. Import Custom Element:

    ```html
    <link rel="import" href="bower_components/juicy-tiles/dist/juicy-tiles.html">
    ```

4. Start using it!

    ```html
    <juicy-tiles></juicy-tiles>
    ```

## Options

Attribute                    | Options             | Default      | Description
---                          | ---                 | ---          | ---
`setup`                      | *Object*            |              | Tiles setup
`setup.gap`                  | *Number*            | `0`          | Gap/cellspacing size in px
`setup.items`                | *Array*             | `[]`         | Tiles setup
`setup.items[?].priority`    | *Number* (0-1)      | `0`          | Importance of tile, used for sorting elements.
`setup.items[?].width`       | *Number*            | `1`          | Tile width (number of colums)
`setup.items[?].heigh`       | *Number*            | `1`          | Tile height (number of rows)
`setup.items[?].index`       | *Number*            |              | DOM ChildElement index (not needed for virtual containers)
`setup.items[?].items`       | *Array(Items)*      |              | Recursive setup (for virtual containers)
`setup.items[?].gap`         | *Number*            | `0`          | Recursive setup (for virtual containers)
`setup.items[?].name`        | *String*            |              | Recursive setup (for virtual containers)
`layersOrientation`          | *String*            | `horizontal` | How to align our package (`horizontal` or `vertical`)

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


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

#### v0.0.2
 - Virtaul grouping,
 - advenced editor features,
 - gaps

#### v0.0.1



## License

[MIT License](http://opensource.org/licenses/MIT)
