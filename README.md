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
`priorities`                 | *Array*             | `[]`         | Tiles setup
`priorities[?].priority`     | *Number* (0-1)      | `0`          | Importance of tile, used for sorting elements.
`priorities[?].width`        | *Number*            | `1`          | Tile width (number of colums)
`priorities[?].heigh`        | *Number*            | `1`          | Tile height (number of rows)
`cellWidth`                  | *Number*            | `100`        | Width of every column (in px)
`cellHeight`                 | *Number*            | `50`         | Height of every row (in px)
`layersOrientation`          | *String*            | `horizontal` | How to align our package (`horizontal` or `vertical`)


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