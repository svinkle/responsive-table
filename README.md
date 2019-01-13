# 🍱 Responsive Table

**Responsive Table** is a tasty JavaScript library which helps format data tables on small
screens! It does so by reordering items in the DOM while keeping HTML markup
valid and assistive technology friendly!

## Features

- Any existing `table` can be responsive!
- Set a custom breakpoint for each `table`, or leave as is to use its natural `width`!
- Choose a "responsive theme" for your `table` which determines the look and feel!

## Usage

1. Include the `responsive-table.js` library in your code base:

```html
<script src="javascripts/responsive-table.js"></script>
```

2. Create a new `ResponsiveTable()` object and set the parameters:

```html
<script>
  var myTable = new ResponsiveTable('#my-table', 'list', '600px');
</script>
```

The **first parameter** is the unique `id` of the `table`. This `id` needs to be applied to the root `<table>` tag.

The **second parameter** determines the "flavour":

- List: Generates a link list above the `table` using the row headers as the link text. Only the associated `table` row is visible while the others remain hidden!
- Stack: Displays each row of content atop one another, like a stack of pancakes!
- Window: The `table` remains as-is with a horizontal scroll available. A link to open the `table` in a new, full-width window appears at the desired breakpoint.

The **third parameter** is the desired break point for when the `table` should change from the full width layout to the small screen layout. This parameter is optional. If left out, the break point will be set to the natural width of the table, and change when appropriate.

## Required Table Structure

Each `table` needs to conform to at least the following markup structure when applying either a "stack" or "window" theme:

```html
<table id="unique-table-id">
  <caption>Table Caption</caption>
  <thead>
    <tr>
      <th scope="col">Heading 1</th>
      <th scope="col">Heading 2</th>
      <th scope="col">Heading 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cell 1</td>
      <td>Cell 2</td>
      <td>Cell 3</td>
    </tr>
  </tbody>
</table>
```

When using the "list" theme, row headers are also required:

```html
<tr>
  <th scope="row">Cell 1</th>
  <td>Cell 2</td>
  <td>Cell 3</td>
</tr>
```

## `no-js` Fallback

It is recommended to wrap the `table` within a `<div class="responsive-table__wrapper"/>"` element. This way, if the JavaScript fails to load, the table will have a horizontal scroll available for smaller screens.

## Demo

Try it out here! https://svinkle.github.io/responsive-table/

## License

This project and its source code is licensed under the [MIT](LICENSE.txt) license.
