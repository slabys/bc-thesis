/*****************************************************************************************************/

let databaseValues;
let maxRowCount = 0;
const rowCount = 11500; //1870
const columnCount = 18;

/**
 * Funkce, která za pomocí hodnoty value přiřadí prvky do proměnné a určí maximální počet řádků, které jsou obsaženy v objektu.
 * @param value
 */
function defineValues(value) {
  databaseValues = value;
  maxRowCount = Object.size(value.data);
}
/**
 * Pořátek infinite scroll funkce
 */
document.addEventListener('scroll', function () {
  let bottomScroll = window.scrollY + document.body.clientHeight + 100;
  if (bottomScroll >= document.body.scrollHeight) {
    console.log('Bottom!')
  }
});

/**
 * Funkce, která vyčistí tabulku a canvas od vykreslených hodnot.
 */
function clean() {
  document.getElementById("table").innerHTML = '';
  document.getElementById("css-grid").innerHTML = '';
  document.querySelectorAll(".multipleCanvas").forEach(canvas => canvas.remove())

  const canvas = document.getElementById('canvas')
  const context = canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 0;
  canvas.height = 0;
}


/*****************************************************************************************************/

/**
 * Vlastní metoda, která pomáhá třídě "Object" ve zjištění její délky, která je následně využívána
 * pro dosazování jednotlivých buněk do tabulky
 *
 * Momentálně není využívaná, byla využívaná v předchozí implementaci, či pro zjištění nepevného počtu
 * sloupců v řádku (Ztrácí význam kvůli pevnému počtu)
 * @param obj
 * @returns {number}
 */
Object.size = function (obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

/*****************************************************************************************************/
/**
 * Canvas pro vykreslování přebraných dat ze souboru typu JSON, kde jsou následně hodnoty dosazovány
 * do elementu canvas, který obsahuje element podporující vektorovou grafiku 'svg'
 **/
function drawCanvas() {

  let canvasAnchor = document.getElementById('canvas');
  canvasAnchor.style.setProperty('display', 'block')
  let canvas = canvasAnchor.getContext('2d');

  canvasAnchor.width = (columnCount * 3.5 * 18) + (16.5 * columnCount) + columnCount * 2;
  canvasAnchor.height = ((rowCount) * 36) + 64;

  let inside = "<table>";
  inside += '<thead><tr>';

  for (let x = 0; x < columnCount; x++) {
    inside += "<th style='" +
      "text-align: center;" +
      "min-width: 4em;" +
      "max-width: 4em;" +
      "min-height: 16px;" +
      "max-height: 16px;" +
      "padding: 8px;'" +
      ">";
    inside += "value " + x;
    inside += '</th>'
  }

  inside += '</tr></thead>';

  for (let i = 0; i < rowCount && i < maxRowCount; i++) {
    canvasAnchor.height = canvasAnchor.height - 0.64;

    inside += "<tr>";
    let columnValue = databaseValues.data[i];

    for (let j = 0; j < columnCount; j++) {
      inside += "" +
        "<td style='" +
        "text-align: center;" +
        "min-width: 3.5em;" +
        "max-width: 3.5em;" +
        "min-height: 16px;" +
        "max-height: 16px;" +
        "padding: 8px;'" +
        ">";
      inside += "<text>";
      try {
        inside += columnValue[j].v;
      } catch (e) {
        inside += 'empty';
      }
      inside += "</text>";
      inside += "</td>"
    }
    inside += "</tr>";
  }
  inside += "</table>";

  const data = '<svg xmlns="http://www.w3.org/2000/svg">' +
    '<style>' +
    'table, th, td {' +
    'border: 1px solid black;' +
    'border-collapse: collapse;' +
    '}' +
    '</style>' +
    '<foreignObject width="100%" height="100%">' +
    '<div xmlns="http://www.w3.org/1999/xhtml">' +
    inside +
    '</div>' +
    '</foreignObject>' +
    '</svg>';

  let DOMURL = window.URL || window.webkitURL || window;
  let img = new Image();
  let svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
  let url = DOMURL.createObjectURL(svg);
  img.onload = function () {
    canvas.drawImage(img, 0, 0);
    DOMURL.revokeObjectURL(url);
  }
  img.src = url;
}

/*****************************************************************************************************/
/**
 * Způsob vybránní elementu 'table' za pomocí javascriptu ve kterém jsou následně
 * tvořeny elementy 'tbody', 'tr' a 'td', které tímto způsobem tvoří tělo tabulky.
 *
 * Do jednotlivých buněk definovaných sloupcem a řádkem jsou následně přidělovány hodnoty načítané
 * ze souboru typu JSON
 **/
function drawTable() {
  let tableAnchor = document.getElementById('table');
  let tbl = document.createElement('table');

  let tbody = document.createElement('tbody');
  let thead = document.createElement('thead');

  let rowHead = document.createElement('tr');
  for (let x = 0; x < columnCount; x++) {
    let columnHead = document.createElement('th');
    columnHead.append('value' + x)
    rowHead.append(columnHead);
  }
  thead.append(rowHead)
  tbl.append(thead);

  for (let i = 0; i < rowCount; i++) {
    let row = document.createElement('tr');
    let columnValue = databaseValues.data[i];

    for (let j = 0; j < columnCount; j++) {
      let column = document.createElement('td');
      try {
        column.append(columnValue[j].v);
      } catch (e) {
        column.append('empty');
      }
      row.appendChild(column);
    }
    tbody.appendChild(row);
  }
  tbl.appendChild(tbody);
  tableAnchor.appendChild(tbl);
}

/*****************************************************************************************************/

/**
 * Vykreslování abulky za využitím CSS Grid systému
 */
function drawCSSGrid() {
  let gridAnchor = document.getElementById('css-grid');
  gridAnchor.style.cssText = 'display: grid; grid-template-columns: repeat(18, 1fr); gap: 1px;background-color: black;border: 1px solid black;'

  for (let x = 0; x < columnCount; x++) {
    let gridCell = document.createElement('div');
    gridCell.style.cssText = 'text-align: center;padding: 10px 0;background-color: white;';
    gridCell.append('value' + x)
    gridAnchor.appendChild(gridCell)
  }

  for (let i = 0; i < rowCount; i++) {
    let row = databaseValues.data[i];
    for (let j = 0; j < columnCount; j++) {
      let gridCell = document.createElement('div');
      gridCell.style.cssText = 'text-align: center;padding: 10px 0;background-color: white;';
      try {
        gridCell.append(row[j].v)
      } catch (e) {
        gridCell.append('empty')
      }
      gridAnchor.appendChild(gridCell)
    }
  }
}

/*****************************************************************************************************/
/**
 * Optimalizace pro vykreslování více canvasů s menším počtem řádků
 **/

function multipleCanvases() {
  const oneCanvasRows = 100
  let currentIndex = 0

  for (let i = 0; i < rowCount / oneCanvasRows; i++) {
    let canvas = document.createElement('canvas');
    canvas.style.cssText = 'display: block;'
    canvas.className = 'multipleCanvas'
    let ctx = canvas.getContext('2d');

    canvas.width = (columnCount * 3.5 * 18) + (16.5 * columnCount) + columnCount * 2;
    canvas.height = ((oneCanvasRows) * 36) + 16;

    let inside = "<table>";
    inside += '<thead><tr>';

    for (let x = 0; x < columnCount; x++) {
      inside += "<th style='" +
        "text-align: center;" +
        "min-width: 4em;" +
        "max-width: 4em;" +
        "min-height: 16px;" +
        "max-height: 16px;" +
        "padding: 8px;'" +
        ">";
      inside += "value " + x;
      inside += '</th>'
    }

    inside += '</tr></thead><tbody>';

    for (let i = 0; i < oneCanvasRows; i++) {
      inside += "<tr>";
      let columnValue = databaseValues.data[currentIndex];

      for (let j = 0; j < columnCount; j++) {
        inside += "" +
          "<td style='" +
          "text-align: center;" +
          "min-width: 3.5em;" +
          "max-width: 3.5em;" +
          "min-height: 16px;" +
          "max-height: 16px;" +
          "padding: 8px;'" +
          ">";
        inside += "<text>";
        try {
          inside += columnValue[j].v;
        } catch (e) {
          inside += 'empty';
        }
        inside += "</text>";
        inside += "</td>"
      }
      inside += "</tr>";
      currentIndex++
    }
    inside += "</tbody></table>";

    const data = '<svg xmlns="http://www.w3.org/2000/svg">' +
      '<style>' +
      'table, th, td {' +
      'border: 1px solid black;' +
      'border-collapse: collapse;' +
      '}' +
      '</style>' +
      '<foreignObject width="100%" height="100%">' +
      '<div xmlns="http://www.w3.org/1999/xhtml">' +
      inside +
      '</div>' +
      '</foreignObject>' +
      '</svg>';

    document.body.appendChild(canvas)

    let DOMURL = window.URL || window.webkitURL || window;
    let img = new Image();
    let svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    let url = DOMURL.createObjectURL(svg);
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);
    }
    img.src = url;
  }
}
