# &lt;pj-sortable-tiles&gt; ![Bower Version](https://badge.fury.io/bo/pj-sortable-tiles.svg)

`<pj-sortable-tiles>` is a Custom Element with sortable tiles that packs efficiently without changing HTML structure (changes CSS only).

## Demo

[Check it live!](http://polyjuice.github.io/pj-sortable-tiles)

## Usage

1. Install the component using [Bower](http://bower.io/):

    ```sh
    $ bower install pj-sortable-tiles --save
    ```

2. Import Web Components' polyfill:

    ```html
    <script src="http://cdnjs.cloudflare.com/ajax/libs/polymer/0.2.2/platform.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/polymer/0.2.2/polymer.js"></script>
    ```

3. Import Custom Element:

    ```html
    <link rel="import" href="bower_components/pj-sortable-tiles/dist/pj-sortable-tiles.html">
    ```

4. Start using it!

    ```html
    <pj-sortable-tiles></pj-sortable-tiles>
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
`setup.items[?].items`       | *Array(Items)*      |              | Recursive setup (for virtual contianers)
`setup.items[?].gap`         | *Number*            | `0`          | Recursive setup (for virtual contianers)
`setup.items[?].name`        | *String*            |              | Recursive setup (for virtual contianers)
`layersOrientation`          | *String*            | `horizontal` | How to align our package (`horizontal` or `vertical`)

## Properties

Name                 | Options        | Description
---                  | ---            | ---
`filteredChildren`   | *Array*        | Array of children which are going to be arranged.
`items`              | *Array*        | Tiles setup. Array of following elements, sorted by priority.
`items[.].element`   | *Element*      | DOM element 
`items[.].setup`     | *Rectangle*    | Rectanlge that represents `element` position in Package
`package`            | *Package*      | Package abstract object

## Methods

Name               | Param name | Type               | Default | Description
---                | ---        | ---                | ---     | ---
`resizeItem`       |            |                    |         | Resize (real or virtual container) element
                   | item       | *Number* or *Item* |         | Item or item index.
                   | width      | *Number*           | `0`     | new width
                   | height     | *Number*           | `0`     | new height
`reprioritizeItem` |            |                    |         | Change priority/weight of item (real or virtual container)
                   | itemIndex  | *Number*           |         | Item or item index. Please note, that items array is sorted by priority.
                   | increase   | *Boolean*          | `false` | `true` - increases, `false` decreases priority
                   | end        | *Boolean*          | `false` | `true` to move to the end of list
`moveToContainer`  |            |                    |         | Move any item to given container, wrap it with new one


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

#### v0.0.1



## License

[MIT License](http://opensource.org/licenses/MIT)