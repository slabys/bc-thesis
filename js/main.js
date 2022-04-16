/*****************************************************************************************************/

let databaseValues;
let maxRowCount = 0;
const rowCount = 1870; //1870
const columnCount = 18;

/**
 * Funkce, která za pomocí hodnoty value přiřadí prvky do proměnné a určí maximální počet řádků, které jsou obsaženy v objektu.
 * @param value
 */
function defineValues(value) {
  databaseValues = value;
  maxRowCount = Object.size(value.data);
}

//Počátek funkce Infinite scroll start
document.addEventListener('scroll', function () {
  let bottomScroll = window.scrollY + document.body.clientHeight - 21;

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

  const canvas = document.getElementById('canvas')
  const context = canvas.getContext('webgl2')
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
  document.getElementById('canvas').style.setProperty('display', 'block')

  let canvasAnchor = document.getElementById('canvas');
  let canvas = canvasAnchor.getContext('2d');

  canvasAnchor.width = (columnCount * 3.5 * 18) + (16.5 * columnCount) + columnCount * 2;
  canvasAnchor.height = ((rowCount) * 36) + 64;

  let inside = "<table>";
  inside += '<caption style="display: none">This table is created in canvas by SVG and JavaScript</caption>';
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
    //Dopočítávání rozměru výšky Canvasu, pro vykreslení celé tabulky
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
 *
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
 * WEBGL optimalizace pro vykreslování do canvasu
 * https://developer.mozilla.org/en-US/docs/web/api/createimagebitmap
 * https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap
 **/
function testingFunction() {
  document.getElementById('canvas').style.setProperty('display', 'block')

  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');

  canvas.width = (columnCount * 3.5 * 18) + (16.5 * columnCount) + columnCount * 2;
  canvas.height = ((rowCount) * 36) + 64;

  const table = document.createElement('table')
  // table.append('<caption style="display: none">This table is created in canvas by SVG and JavaScript</caption><thead><tr>')
  // table.insertAdjacentHTML('beforeend', '<caption>This table is created in canvas by SVG and JavaScript</caption><thead><tr>');
  let inside = `<caption style="display: none">This table is created in canvas by SVG and JavaScript</caption><thead><tr>`;

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
    //Dopočítávání rozměru výšky Canvasu, pro vykreslení celé tabulky
    canvas.height = canvas.height - 0.64;

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
  // inside += "</table>";
  table.insertAdjacentHTML('beforeend', inside)

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
    </svg>`;

  const dataToSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  dataToSVG.insertAdjacentHTML('beforeend', '<style>table, th, td {border: 1px solid black;border-collapse: collapse;}</style>')
  const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
  const helperDiv = document.createElementNS('http://www.w3.org/1999/xhtml', 'div')
  helperDiv.append(table)
  foreignObject.append(helperDiv)
  dataToSVG.appendChild(foreignObject);

  //https://web.archive.org/web/20160625111122/https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Drawing_DOM_objects_into_a_canvas

  // let img = new Image();
  let blob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});

  // img.onload = function () {
  //   createImageBitmap(blob).then(function (sprites) {
  //     ctx.drawImage(sprites, 0, 0);
  //   });
  // }


  canvas.toBlob(function () {
    let newImg = document.createElement('img'),
      url = URL.createObjectURL(blob);

    newImg.onload = function () {
      // no longer need to read the blob so it's revoked
      ctx.drawImage(newImg, 0, 0);
      URL.revokeObjectURL(url);
    };

    newImg.src = url;
  });

// Load the sprite sheet from an image file
  // Wait for the sprite sheet to load
  // console.log('draw')
  // createImageBitmap(svg).then(function (sprite) {
  //   ctx.drawImage(sprite, 0, 0);
  // })
}
