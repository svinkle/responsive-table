/**
 * responsive-table.js
 *
 * Responsive Table is a tasty JavaScript library which helps format data tables on small
 screens! It does so by reordering items in the DOM while keeping HTML markup
 valid and assistive technology friendly!
 *
 * Repository URL: https://github.com/svinkle/responsive-table
 *
 * @author: Scott Vinkle <scott.vinkle@shopify.com>
 * @version: 0.4.1
 */
var ResponsiveTable = (function(window, document, undefined) {
  'use strict';

  // Unique table identifier.
  var tableId = 0;

  // Lookup table of selectors, either id or element, no classes.
  var selectors = {
    tableList: 'table-list',
    selected: 'selected-list-item',
    tableRows: 'tbody tr',
    tableCells: 'tbody td',
    tableHeading: 'table-heading',
    windowLink: 'window-link',
    columnHeaders: 'thead th[scope="col"]',
    rowHeaders: 'tbody th[scope="row"]',
    caption: 'caption',
    h2: 'h2',
    links: 'a',
    span: 'span',
    styleSheets: 'link[rel="stylesheet"]',
    tableRowFocusElement: 'tableRowFocusElement'
  };

  // Lookup table of classes, to apply styles only.
  var classes = {
    table: 'responsive-table',
    caption: 'responsive-table__caption',
    tableList: 'responsive-table__list',
    tableListItem: 'responsive-table__list-item',
    tableListLink: 'responsive-table__list-link',
    windowLink: 'responsive-table__window-link',
    windowLinkActive: 'responsive-table__window-link--active',
    windowLinkIcon: 'responsive-table__window-link-icon',
    windowBody: 'responsive-table__window-body',
    tableRowActive: 'responsive-table__row--active',
    tableSmallScreen: 'responsive-table--small-screen',
    headerContent: 'responsive-table__header-content',
    cellContent: 'responsive-table__cell-content',
    hidden: 'hidden',
    visuallyHidden: 'visuallyhidden'
  };

  // Lookup table of common, unique strings.
  var strings = {
    tableMissing: 'Table selector missing from object.',
    tableNotFound: 'Table not found: ',
    tableTypeMissing:
      'No type defined. Must be "list", "stack", or "window" for table: ',
    windowLinkStart: 'Open ',
    windowLinkEnd: ' table in a new window',
    windowIcon:
      '<svg class="' +
      classes.windowLinkIcon +
      '" width="32" height="32" viewBox="0 0 32 32"><g transform="scale(0.03125 0.03125)"><path d="M192 64v768h768v-768h-768zM896 768h-640v-640h640v640zM128 896v-672l-64-64v800h800l-64-64h-672z"></path><path d="M352 256l160 160-192 192 96 96 192-192 160 160v-416z"></path></g></svg>',
    checkDom: 'Check document structure requirements: ',
    cellCount: 'Column/row cell count mismatch: ',
    selected: ', selected',
    headerContent: 'header-content-',
    cellContent: 'cell-content-',
    auto: 'auto',
    column: 'column',
    row: 'row',
    show: 'show',
    hide: 'hide',
    large: 'large',
    small: 'small',
    list: 'list',
    stack: 'stack',
    window: 'window',
    dataListLink: 'data-list-link',
    pageSettings: {
      lang: 'en',
      charset: '<meta charset="UTF-8">',
      httpEquiv:
        '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">',
      viewport:
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    }
  };

  // Class constructor.
  var ResponsiveTable = function(table, type, breakPoint) {
    var thisTable = null,
      thisTableId = null,
      tableList = null,
      mediaQuery = null;

    // Check to see if the `table` param is present.
    // Then check to see if it exists in the DOM.
    // If all good, assign the element to `thisTable`.
    if (!table) {
      console.error(strings.tableMissing);
      return;
    } else if (!document.querySelector(table)) {
      console.error(strings.tableNotFound + table);
      return;
    } else {
      thisTable = document.querySelector(table);
    }

    // Check to see if the `type` param is present.
    // If all good, assign the value to `tableType`.
    if (!type) {
      console.error(strings.tableTypeMissing + table);
      return;
    }

    /**
     * Gets the current `table` element.
     *
     * @return thisTable {Object} the `table` element.
     */
    this.getTable = function() {
      return thisTable;
    };

    /**
     * Sets a unique identifier for the current `table`.
     */
    this.setTableId = function() {
      thisTableId = tableId;
    };

    /**
     * Gets the unique identifier value of the current table.
     *
     * @return thisTableId {number} index of the current `table`.
     */
    this.getTableId = function() {
      return thisTableId;
    };

    /**
     * Gets the current table media query object to test against.
     *
     * @return mediaQuery {Object} `matchMedia` window object.
     */
    this.getMediaQuery = function() {
      return mediaQuery;
    };

    /**
     * For `list` type tables, sets the current list `ul` element.
     */
    this.setTableList = function(list) {
      tableList = list;
    };

    /**
     * Gets the current list `ul` element.
     *
     * @return tableList {Object} the `ul` element.
     */
    this.getTableList = function() {
      return tableList;
    };

    /**
     * Gets the current table type.
     *
     * @return type {String} the value of the desired table type.
     */
    this.getTableType = function() {
      return type;
    };

    /**
     * Gets the current `table` selector.
     *
     * @return table {String} the `id` attribute from the current `table`.
     */
    this.getTableSelector = function() {
      return table;
    };

    // Add classes to the table, etc, for styling puposes only.
    thisTable.classList.add(classes.table);
    thisTable.classList.add(classes.table + '--' + type);
    thisTable.querySelector(selectors.caption).classList.add(classes.caption);

    // Set the unique identifier for the current table, then increment for
    // the next `table`.
    this.setTableId();
    tableId++;

    // Call `checkStructure()` method to make sure everything's in the DOM
    // before continuing on.
    if (this.checkStructure()) {

      // Create the `matchMedia` object to test the desired `breakpoint`
      // value against.
      mediaQuery = window.matchMedia(
        '(min-width: ' +
          (!breakPoint
            ? window.getComputedStyle(thisTable, null).width
            : breakPoint) +
          ')'
      );

      // Add the event listener to the `matchMedia` object, listen
      // for any window resizing or device orientation changes.
      mediaQuery.addListener(
        ResponsiveTable.prototype.testMediaQuery.bind(this)
      );

      // Test the media query on page load to adjust the `table` if
      // required.
      this.testMediaQuery();
    }
  };

  /**
   * Checks the `table` elements and structure to make sure everything
   * is in place. If something is missing, an error message is displayed
   * in the `console` window.
   *
   * @method checkStructure
   * @return {Boolean} simply return `true` or `false`.
   */
  ResponsiveTable.prototype.checkStructure = function() {
    var thisTable = this.getTable(),
      thisTableType = this.getTableType(),
      columnHeaders = thisTable.querySelectorAll(selectors.columnHeaders),
      columnHeadersLength = columnHeaders.length,
      tableRows = thisTable.querySelectorAll(selectors.tableRows),
      tableRowsLength = tableRows.length,
      structureError = false,
      errorMessage = '',
      i = 0;

    // The `list` style requires `scope="col"` and `scope="row"` headers.
    // The `stack` or `window` styles only require `scope="col"` headers.
    // A `caption` is also required to generate the heading.
    if (thisTableType === strings.list) {
      if (
        !thisTable.querySelector(selectors.columnHeaders) ||
        !thisTable.querySelector(selectors.rowHeaders) ||
        !thisTable.querySelector(selectors.caption)
      ) {
        structureError = true;
        errorMessage = strings.checkDom;
      } else {

        // Check to make sure each row cell count matches the total
        // column count. Otherwise, `list` tables will output
        // mismatched data.
        for (; i < tableRowsLength; i++) {
          if (tableRows[i].children.length !== columnHeadersLength) {
            structureError = true;
            errorMessage =
              strings.cellCount +
              '"' +
              tableRows[i].children[0].textContent +
              '": ';
          }
        }
      }
    } else if (
      thisTableType === strings.stack ||
      thisTableType === strings.window
    ) {
      if (
        !thisTable.querySelector(selectors.columnHeaders) ||
        !thisTable.querySelector(selectors.caption)
      ) {
        structureError = true;
        errorMessage = strings.checkDom;
      }
    }

    // If anything is missing, send an error message to the `console` window
    // and stop anything else from happening.
    if (structureError) {
      console.error(errorMessage + this.getTableSelector());
      return false;
    } else {
      return true;
    }
  };

  /**
   * Check and see if the desired breakpoint has been matched, and setup
   * the `table` accordingly for the desired style.
   *
   * @method testMediaQuery
   */
  ResponsiveTable.prototype.testMediaQuery = function() {
    if (this.getMediaQuery().matches) {
      this.setupScreen(strings.large);
    } else {
      this.setupScreen(strings.small);
    }
  };

  /**
   * Call the appropriate methods to re-arrage the `table` based on the
   * current screen "size" and selected `table` theme.
   *
   * @method setupScreen
   * @param size {String} the "size" of the current screen.
   */
  ResponsiveTable.prototype.setupScreen = function(size) {
    var thisTable = this.getTable(),
      thisTableType = this.getTableType(),
      tableContainer = thisTable.parentNode,
      caption = thisTable.querySelector(selectors.caption);

    // The `list` style needs to show/hide each row, and display an
    // "active" row. After, the link list is generated to click betweeen
    // `table` rows.
    if (thisTableType === strings.list) {
      if (size === strings.small) {
        this.toggleActiveRow(strings.hide);
        this.generateList();
      } else {
        this.toggleActiveRow(strings.show);
        this.removeList();
      }
    }

    // The `list` and `stack` styles need to show/hide the header elements
    // as well as move content around to meet their theme requirements.
    // The `tableSmallScreen` CSS class is added for styling purposes.
    if (thisTableType === strings.list || thisTableType === strings.stack) {
      if (size === strings.small) {
        thisTable.classList.add(classes.tableSmallScreen);
        this.toggleHeaders(strings.hide);
        this.moveContent();
      } else {
        thisTable.classList.remove(classes.tableSmallScreen);
        this.toggleHeaders(strings.show);
        this.resetContent();
      }
    }

    // The `window` types need to show/hide the link which opens the `table`
    // in its own window.
    if (thisTableType === strings.window) {

      // Need to add a heading before table so open link has context
      if (!tableContainer.querySelector('h2')) {
        var tableHeading = document.createElement('h2');
        tableHeading.id = selectors.tableHeading + '-' + tableId;
        tableHeading.textContent = caption.textContent;
        tableContainer.insertBefore(tableHeading, tableContainer.firstChild);
        caption.classList.add(classes.visuallyHidden);
      }

      this.displayWindowLink(size === 'small' ? true : false);
    }
  };

  /**
   * Called to show/hide `table` rows for `list` style tables.
   *
   * @method toggleActiveRow
   * @param toggle {String} determines the display of all or one row
   */
  ResponsiveTable.prototype.toggleActiveRow = function(toggle) {
    var tableRows = this.getTable().querySelectorAll(selectors.tableRows),
      tableRowsLength = tableRows.length,
      i = 0;

    // Hide or show all rows, depending on the `toggle` value.
    for (; i < tableRowsLength; i++) {
      if (toggle === strings.hide) {
        tableRows[i].classList.add(classes.hidden);
      } else {
        tableRows[i].classList.remove(classes.hidden);
      }
    }

    // On initial load, when hiding rows, only show the first row and mark
    // it as `active`. Otherwise, show all rows.
    if (toggle === strings.hide) {
      tableRows[0].classList.remove(classes.hidden);
      tableRows[0].classList.add(classes.tableRowActive);
    } else {
      tableRows[0].classList.remove(classes.tableRowActive);
    }
  };

  /**
   * Generate the link list for `list` themed tables. Links are used to
   * show the associated row's content.
   *
   * @method generateList
   */
  ResponsiveTable.prototype.generateList = function() {
    var thisTable = this.getTable(),
      tableList = this.getTableList(),
      rowHeaders = thisTable.querySelectorAll(selectors.rowHeaders),
      rowHeadersLength = rowHeaders.length,
      newSpanWrapper = null,
      rowHeader = null,
      list = null,
      listItem = null,
      listLink = null,
      i = 0,
      j = 0;

    // If the link list already exists in the DOM, show it. Otherwise,
    // create a new link list.
    if (tableList) {
      tableList.classList.remove(classes.hidden);
    } else {

      // Create the link list element and set attributes
      list = document.createElement('ul');

      list.id = selectors.tableList;
      list.classList.add(classes.tableList);

      // Create links using the `scope="row"` header text, then add the
      // link and list item to the `ul` list element.
      for (; i < rowHeadersLength; i++) {
        listItem = document.createElement('li');
        listLink = document.createElement('a');
        rowHeader = rowHeaders[i];
        j = 0;

        listItem.classList.add(classes.tableListItem);

        listLink.href = '#' + selectors.tableRowFocusElement + i;
        listLink.textContent = rowHeader.textContent;
        listLink.classList.add(classes.tableListLink);
        listLink.setAttribute(strings.dataListLink, i);
        listLink.addEventListener(
          'click',
          ResponsiveTable.prototype.listLinkClick.bind(this),
          false
        );

        listItem.appendChild(listLink);
        list.appendChild(listItem);

        // wrap header elements in a new span element that we can later give focus to.
        // create new span element
        newSpanWrapper = document.createElement('span');
        newSpanWrapper.id = selectors.tableRowFocusElement + i;

        // Move all header nodes into the new span
        for (; j < rowHeader.childNodes.length; j++) {
          newSpanWrapper.appendChild(rowHeader.childNodes[0]);
        }

        // Add span back into header
        rowHeader.insertBefore(newSpanWrapper, rowHeader.firstChild);
      }

      // Add the `ul` element to the DOM, directly before the `table`.
      thisTable.parentNode.insertBefore(list, thisTable);

      // Set this list element as the link list for the current `table`.
      this.setTableList(list);
    }
  };

  /**
   * Hide the link list element for `list` themed tables from the DOM.
   *
   * @method removeList
   */
  ResponsiveTable.prototype.removeList = function() {
    var tableList = this.getTableList();

    // If the link list doesn't exist in the DOM, don't continue.
    if (!tableList) {
      return;
    }

    // Hide the link list.
    tableList.classList.add(classes.hidden);
  };

  /**
   * Show or hide `table` headers per the desired theme.
   *
   * @method toggleHeaders
   * @param toggle {String} determines the display of `table` headers.
   */
  ResponsiveTable.prototype.toggleHeaders = function(toggle) {
    var columnHeaders = this.getTable().querySelectorAll(
        selectors.columnHeaders
      ),
      columnHeadersLength = columnHeaders.length,
      thisHeader = null,
      headerRow = null,
      i = 0;

    // Show/hide each `scope="col"` header and its parent `tr` element.
    for (; i < columnHeadersLength; i++) {
      thisHeader = columnHeaders[i];
      headerRow = thisHeader.parentNode;

      if (toggle === strings.hide) {
        thisHeader.classList.add(classes.hidden);
        headerRow.classList.add(classes.hidden);
      } else {
        thisHeader.classList.remove(classes.hidden);
        headerRow.classList.remove(classes.hidden);
      }
    }
  };

  /**
   * Move content around the DOM for "small" screens in order to meet the
   * theme requirements.
   *
   * @method moveContent
   */
  ResponsiveTable.prototype.moveContent = function() {
    var thisTable = this.getTable(),
      tableId = this.getTableId(),
      tableContainer = thisTable.parentNode,
      tableCells = thisTable.querySelectorAll(selectors.tableCells),
      tableCellsLength = tableCells.length,
      colunmHeaders = thisTable.querySelectorAll(selectors.columnHeaders),
      colunmHeadersLength = colunmHeaders.length - 1,
      hasRowHeaders = thisTable.querySelectorAll(selectors.rowHeaders).length,
      caption = thisTable.querySelector(selectors.caption),
      tableHeading = null,
      tableHeadingContent = null,
      cellContent = null,
      thisCell = null,
      i = 0,
      j = hasRowHeaders ? 1 : 0;

    for (; i < tableCellsLength; i++) {
      thisCell = tableCells[i];

      // Get the current `scope="col"` element text to be used within the
      // cell content template, taking in to consideration that some
      // headers may be empty cells.
      if (colunmHeaders[j] !== undefined) {
        tableHeadingContent = colunmHeaders[j].textContent;
      }

      // Make a backup copy of the current cell content.
      cellContent = thisCell.innerHTML;

      // Clear the cell content and insert the header text along side the
      // current cell content, per theme requirements.
      thisCell.innerHTML = '';
      thisCell.innerHTML =
        '<span id="' +
        strings.headerContent +
        i +
        '" class="' +
        classes.headerContent +
        '">' +
        tableHeadingContent +
        '</span>: <span id="' +
        strings.cellContent +
        i +
        '" class="' +
        classes.cellContent +
        '">' +
        cellContent +
        '</span>';

      // Increment the counter to grab the current cell's `scope="col"`
      // element content. Reset the counter when we've reached the
      // end of the row to grab the first column content and start again.
      j = j >= colunmHeadersLength ? (j = hasRowHeaders ? 1 : 0) : j + 1;
    }

    // If the `table` heading element exists, show it. Otherwise, create
    // a new heading element and insert it before the `table`. Use the
    // `caption` element text as the heading text.
    // (The purpose for the heading is mostly used to get around a
    // VoiceOver bug, where VO doesn't move in to a `table` when focused.)
    if (
      tableContainer.querySelector('#' + selectors.tableHeading + '-' + tableId)
    ) {
      tableContainer
        .querySelector('#' + selectors.tableHeading + '-' + tableId)
        .classList.remove(classes.hidden);
    } else {
      tableHeading = document.createElement('h2');

      tableHeading.id = selectors.tableHeading + '-' + tableId;
      tableHeading.textContent = caption.textContent;

      tableContainer.insertBefore(tableHeading, tableContainer.firstChild);
    }

    // Hide the caption since the heading exists now.
    caption.classList.add(classes.visuallyHidden);
  };

  /**
   * Reset the content back to its original, full-width `table` formatting.
   *
   * @method resetContent
   */
  ResponsiveTable.prototype.resetContent = function() {
    var thisTable = this.getTable(),
      tableId = this.getTableId(),
      caption = thisTable.querySelector(selectors.caption),
      tableContainer = thisTable.parentNode,
      tableCells = thisTable.querySelectorAll(selectors.tableCells),
      tableCellsLength = tableCells.length,
      thisCell = null,
      thisCellContent = '',
      i = 0;

    for (; i < tableCellsLength; i++) {
      thisCell = tableCells[i];

      // Make sure the content we're looking to place back actually exists.
      if (thisCell.querySelector('#' + strings.headerContent + i) !== null) {

        // Make a backup copy of the current cell content, minus the
        // header content.
        thisCellContent = thisCell.querySelector('#' + strings.cellContent + i)
          .innerHTML;

        // Remove the header and cell content elements.
        thisCell.querySelector('#' + strings.headerContent + i).remove();
        thisCell.querySelector('#' + strings.cellContent + i).remove();

        // Place the cell content back in to the cell.
        thisCell.innerHTML = thisCellContent;
      }
    }

    // If it exists in the DOM, hide the `table` heading.
    if (
      tableContainer.querySelector('#' + selectors.tableHeading + '-' + tableId)
    ) {
      tableContainer
        .querySelector('#' + selectors.tableHeading + '-' + tableId)
        .classList.add(classes.hidden);
    }

    // Show the caption.
    caption.classList.remove(classes.visuallyHidden);
  };

  /**
   * Click event for each `list` themed list link item.
   *
   * @method listLinkClick
   * @param event {Object} click event information object.
   */
  ResponsiveTable.prototype.listLinkClick = function(event) {
    event.preventDefault();

    var thisTable = this.getTable(),
      thisTableList = this.getTableList(),
      thisLink = event.target,
      listLinks = thisTableList.querySelectorAll(selectors.links),
      listLinksLength = listLinks.length,
      tableRows = thisTable.querySelectorAll(selectors.tableRows),
      tableRowsLength = tableRows.length,
      thisTableRow = parseInt(
        event.target.getAttribute(strings.dataListLink),
        10
      ),
      selectedText =
        '<span class="' +
        classes.visuallyHidden +
        '">' +
        strings.selected +
        '</span>',
      i = 0,
      j = 0;

    // Remove the `active` class and hide each row.
    // Show the `table` row which index matches the clicked link's
    // `data-list-link` value.
    for (; i < tableRowsLength; i++) {
      tableRows[i].classList.remove(classes.tableRowActive);
      tableRows[i].classList.add(classes.hidden);

      if (i === thisTableRow) {
        tableRows[i].classList.remove(classes.hidden);
        tableRows[i].classList.add(classes.tableRowActive);
      }
    }

    // Remove the "selected" hidden text from each link.
    for (; j < listLinksLength; j++) {
      if (listLinks[j].querySelector(selectors.span)) {
        listLinks[j].querySelector(selectors.span).remove();
      }
    }

    // Apply the text to the clicked link element.
    thisLink.innerHTML = thisLink.textContent + selectedText;

    // Get link href #value to know where to set focus
    var visibleRowHeaderTarget = thisTable.querySelector(
      '#' + thisLink.hash.substr(1)
    );

    // Set the `table` heading to be focusable, then set focus.
    visibleRowHeaderTarget.setAttribute('tabindex', -1);
    visibleRowHeaderTarget.focus();
  };

  /**
   * Click event for the `window` themed "open window" link.
   *
   * @method windowLinkClick
   * @param event {Object} click event information object.
   */
  ResponsiveTable.prototype.windowLinkClick = function(event) {
    event.preventDefault();

    var thisTable = this.getTable(),
      tableWindow = window.open(),
      tableWindowDocument = tableWindow.document,
      tableContent = thisTable.outerHTML,
      styleSheets = document.head.querySelectorAll(selectors.styleSheets),
      styleSheetsLength = styleSheets.length,
      tableWindowStyleSheets = null,
      i = 0;

    // Set the language of the new window document.
    tableWindowDocument.documentElement.lang = strings.lang;

    // Set the character set, httpEquiv value, and viewport meta tags of the
    // new window document.
    tableWindowDocument.head.innerHTML =
      strings.pageSettings.charset +
      strings.pageSettings.httpEquiv +
      strings.pageSettings.viewport;

    // Set the `title` element of the new window document to that of the
    // current `caption` value.
    tableWindowDocument.title = thisTable.querySelector(
      selectors.caption
    ).textContent;

    // Dynamically create `link` elements in order to embed the current
    // page's stylesheets, and append to the `head` element of the new
    // window document.
    for (; i < styleSheetsLength; i++) {
      tableWindowStyleSheets = tableWindowDocument.createElement('link');

      tableWindowStyleSheets.rel = 'stylesheet';
      tableWindowStyleSheets.href = styleSheets[i].href;

      tableWindowDocument.head.appendChild(tableWindowStyleSheets);
    }

    // Set the entire `body` element content of the new window document to
    // that of the current `table` element content.
    tableWindowDocument.body.innerHTML = tableContent;
    tableWindowDocument.body.classList.add(classes.windowBody);

    // Remove visuallyhidden class on table caption
    var newWindowCaption = tableWindowDocument.querySelector(selectors.caption);
    newWindowCaption.classList.remove(classes.visuallyHidden);
  };

  /**
   * Show/hide the `window` theme "open window" link.
   *
   * @method displayWindowLink
   * @param display {Boolean} determines display mode of the "open window" link
   */
  ResponsiveTable.prototype.displayWindowLink = function(display) {
    var thisTable = this.getTable(),
      tableHeader = thisTable.parentNode.querySelector(selectors.h2),
      windowLink = document.querySelector('#' + selectors.windowLink);

    // On display, create the link and set its parameters and event
    // listener, the insert before the `table`. Otherwise, remove the link
    // from the DOM.
    if (display) {
      windowLink = document.createElement('a');

      windowLink.id = selectors.windowLink;
      windowLink.href = '#';
      windowLink.classList.add(classes.windowLink);
      windowLink.innerHTML =
        '<span class="' +
        classes.visuallyHidden +
        '">' +
        strings.windowLinkStart +
        tableHeader.textContent +
        strings.windowLinkEnd +
        '</span>' +
        strings.windowIcon;
      windowLink.addEventListener(
        'click',
        ResponsiveTable.prototype.windowLinkClick.bind(this),
        false
      );

      thisTable.parentNode.insertBefore(windowLink, tableHeader.nextSibling);
    } else {
      if (windowLink) {
        windowLink.remove();
      }
    }
  };

  return ResponsiveTable;
})(window, document);
