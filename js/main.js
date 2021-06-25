/*****************************************************************************************************/

let databaseValues;
let maxRowCount = 0;
let columnCount = 0;

const rowCount = 500;

function defineValues(value){
  databaseValues = value;
  maxRowCount = Object.size(value.data);

  // drawCanvas(currentRowValues)
  drawTable()
}

document.addEventListener('scroll', function (){
  let bottomScroll = window.scrollY + document.body.clientHeight-21;
  document.getElementById("tracking").innerHTML =
    "WindowY: " + window.scrollY + "px"+
    "<br>BottomY: " + bottomScroll + "px"+
    "<br>Height " + document.body.scrollHeight + "px";

  if(bottomScroll >= document.body.scrollHeight){
    console.log('Maybe do something???')
  }
});

/*****************************************************************************************************/
/**
 * Canvas pro vykreslování přebraných dat ze souboru typu JSON, kde jsou následně hodnoty dosazovány
 * do elementu canvas, který obsahuje element podporující vektorovou grafiku 'svg'
 **/
async function drawCanvas(currentRowValue) {


  console.log('Working???')

  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');

  // TODO tady bych podle poctu radku a sloupcu vypocital sirku a vysku a nastavil
  canvas.width = 1500;
  canvas.height = ((currentRowValue+rowCount) * 36) + 64;

  let inside = "<table>";
  inside += '<caption style="display: none">This table is created in canvas by SVG and JavaScript</caption>';
  inside += '<thead><tr>';

  for (let x = 1; x < Object.size(databaseValues.data[0]) - 1; x++) {
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
  //TODO *rowCount* nahradit hodnotu "100" hodnotou počtu řádků 'rowCount'
  for (let i = currentRowValue; i < currentRowValue+rowCount && i < maxRowCount; i++) {
    //Dopočítávání rozměrů Canvasu, pro vykreslení celé tabulky
    canvas.height = canvas.height - 0.64;

    inside += "<tr>";
    let columnValue = databaseValues.data[i];

    for (let j = 2; j < Object.size(databaseValues.data[i]); j++) {
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
      inside += columnValue[j].e;
      inside += "</text>";
      inside += "</td>"
    }
    inside += "</tr>";
  }
  inside += "</table>";
  inside += '<p style="width: 3.5em; height: 16px; padding: 8px; margin: 0"> The End </p>'

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


  // document.getElementById('canvas').style.border = '0.5rem solid purple';

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
 * Vlastní metoda, která pomáhá třídě "Object" ve zjištění její délky, která je následně
 * využívána pro dosazování jednotlivých buněk do tabulky
 **/
Object.size = function (obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

/*****************************************************************************************************/
function drawTable() {
  /**
   * Způsob vybránní elementu 'table' za pomocí javascriptu ve kterém jsou následně
   * tvořeny elementy 'tbody', 'tr' a 'td', které tímto způsobem tvoří tělo tabulky.
   *
   * Do jednotlivých buněk definovaných sloupcem a řádkem jsou následně přidělovány hodnoty načítané
   * ze souboru typu JSON
   **/

  let main = document.getElementById('middle');
  let tbl = document.createElement('table');
  tbl.style.width = '100%';
  tbl.setAttribute('border', '1');

  let tbody = document.createElement('tbody');
  let thead = document.createElement('thead');

  let rowHead = document.createElement('tr');
  for (let x = 1; x < Object.size(databaseValues.data[0]) - 1; x++) {
    let columnHead = document.createElement('th');
    columnHead.append('value' + x)
    rowHead.append(columnHead);
  }
  thead.append(rowHead)
  tbl.append(thead);

  for (let i = 0; i < rowCount; i++) { //TODO změnit hodnotu 10 řádků na celý počet řádků 'rowCount'
    let row = document.createElement('tr');
    let columnValue = databaseValues.data[i];

    for (let j = 2; j < Object.size(databaseValues.data[i]); j++) {
      let column = document.createElement('td');
      if(j === 2)
        column.append(i+1 + '.) ');
      column.append(columnValue[j].e);
      row.appendChild(column);
    }
    tbody.appendChild(row);
  }
  tbl.appendChild(tbody);
  main.appendChild(tbl);
}

/*****************************************************************************************************/
