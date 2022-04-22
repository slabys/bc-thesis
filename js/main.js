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
 * Infinite scroll posluchač, který zajištuje postupné načítání dat při scrollování uživatelem směrem ke koneci dokumentu
 */
document.addEventListener('scroll', function () {
  let bottomScroll = window.scrollY * 2 + document.body.clientHeight;
  if (bottomScroll >= document.body.scrollHeight) {
    console.log('Bottom!')
  }
});

/**
 * Funkce, která vyčistí tabulku a canvas od vykreslených hodnot.
 */
function clean() {
  document.getElementsByTagName('main')[0].innerText = ''
}

/*****************************************************************************************************/

/**
 * Vlastní metoda, která pomáhá třídě "Object" ve zjištění její délky, která je následně využívána
 * pro definování finálního čísla počtu řádků v načteném souboru
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
 * Způsob vybránní elementu 'table' za pomocí javascriptu ve kterém jsou následně
 * tvořeny elementy 'tbody', 'tr' a 'td', které tímto způsobem tvoří tělo tabulky.
 *
 * Do jednotlivých buněk definovaných sloupcem a řádkem jsou následně přidělovány hodnoty načítané
 * ze souboru typu JSON
 **/
function drawTable() {
  let table = document.createElement('table');

  let tbody = document.createElement('tbody');
  let thead = document.createElement('thead');

  let rowHead = document.createElement('tr');
  for (let x = 0; x < columnCount; x++) {
    let columnHead = document.createElement('th');
    columnHead.append('value' + x)
    rowHead.append(columnHead);
  }
  thead.append(rowHead)
  table.append(thead);

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
  table.appendChild(tbody);
  document.getElementsByTagName('main')[0].appendChild(table)
}

/*****************************************************************************************************/
/**
 * Canvas pro vykreslování přebraných dat ze souboru typu JSON, kde jsou následně hodnoty dosazovány
 * do elementu canvas, který obsahuje element podporující vektorovou grafiku 'svg'
 **/
function drawCanvas() {

  let canvas = document.createElement('canvas');
  canvas.style.cssText = 'display: block;'
  let ctx = canvas.getContext('2d');

  canvas.width = (columnCount * 3.5 * 18) + (16.5 * columnCount) + columnCount * 2;
  canvas.height = ((rowCount) * 36) + 64;

  let inside = '<table><thead><tr>';
  for (let x = 0; x < columnCount; x++) {
    inside += `<th style='text-align: center; min-width: 4em; max-width: 4em; min-height: 16px; max-height: 16px; padding: 8px;'>value ${x}</th>`
  }
  inside += '</tr></thead><tbody>';

  for (let i = 0; i < rowCount && i < maxRowCount; i++) {
    canvas.height = canvas.height - 0.64;

    inside += '<tr>';
    let columnValue = databaseValues.data[i];

    for (let j = 0; j < columnCount; j++) {
      inside += `<td style='text-align: center; min-width: 3.5em; max-width: 3.5em; min-height: 16px; max-height: 16px; padding: 8px;'><text>`
      try {
        inside += columnValue[j].v;
      } catch (e) {
        inside += 'empty';
      }
      inside += '</text></td>';
    }
    inside += '</tr>';
  }
  inside += '</tbody></table>';

  const data = `<svg xmlns="http://www.w3.org/2000/svg">
      <style>
        table, th, td {
          border: 1px solid black;
          border-collapse: collapse;
        }
      </style>
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${inside}
        </div>
      </foreignObject>
    </svg>`

  document.getElementsByTagName('main')[0].appendChild(canvas)

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

/*****************************************************************************************************/

/**
 * Vykreslování abulky za využitím CSS Grid systému
 */
function drawCSSGrid() {
  let cssGrid = document.createElement('div');
  cssGrid.style.cssText = 'display: grid; grid-template-columns: repeat(18, 1fr); gap: 1px;background-color: black;border: 1px solid black;'

  for (let x = 0; x < columnCount; x++) {
    let gridCell = document.createElement('div');
    gridCell.style.cssText = 'text-align: center;padding: 10px 0;background-color: white;';
    gridCell.append('value' + x)
    cssGrid.appendChild(gridCell)
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
      cssGrid.appendChild(gridCell)
    }
  }

  document.getElementsByTagName('main')[0].appendChild(cssGrid)
}

/*****************************************************************************************************/
/**
 * Optimalizace pro vykreslování více canvasů s menším počtem řádků
 **/

function multipleCanvases() {
  const oneCanvasRows = 500
  let currentIndex = 0

  for (let currentCanvas = 0; currentCanvas < rowCount / oneCanvasRows; currentCanvas++) {
    let canvas = document.createElement('canvas');
    canvas.style.cssText = 'display: block;'
    let ctx = canvas.getContext('2d');

    canvas.width = (columnCount * 3.5 * 18) + (16.5 * columnCount) + columnCount * 2;
    canvas.height = ((oneCanvasRows) * 36) + 16;

    let inside = '<table><thead><tr>';

    for (let x = 0; x < columnCount; x++) {
      inside += `<th style='text-align: center; min-width: 4em; max-width: 4em; min-height: 16px; max-height: 16px; padding: 8px;'>value ${x}</th>`
    }
    inside += '</tr></thead><tbody>';

    for (let i = 0; i < oneCanvasRows; i++) {
      if (currentIndex >= rowCount) break;
      inside += '<tr>';
      let columnValue = databaseValues.data[currentIndex];

      for (let j = 0; j < columnCount; j++) {
        inside += `<td style="text-align: center; min-width: 3.5em; max-width: 3.5em; min-height: 16px; max-height: 16px; padding: 8px;"><text>`
        try {
          inside += columnValue[j].v;
        } catch (e) {
          inside += 'empty';
        }
        inside += '</text></td>';
      }
      inside += '</tr>';
      currentIndex++
    }
    inside += "</tbody></table>";

    const data = `<svg xmlns="http://www.w3.org/2000/svg">
        <style>
          table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
          }
        </style>
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${inside}
          </div>
        </foreignObject>
      </svg>`

    document.getElementsByTagName('main')[0].appendChild(canvas)

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
