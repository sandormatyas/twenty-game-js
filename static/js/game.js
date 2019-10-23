function isIterable(obj) {
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}


function addEventListenerTo(object, event, callback) {
    if (isIterable(object)) {
        for (const element of object) {
            element.addEventListener(event, callback);
        }
    } else {
        object.addEventListener(event, callback);
    }
}


function getCells() {
    const cells = document.querySelectorAll('.cell');
    return cells;
}


function getAllCoins() {
    const coins = document.querySelectorAll('.coin');
    return coins;
}


function setBlocked(element) {
    element.setAttribute('draggable', 'true');
}


function setNotBlocked(element) {
    element.setAttribute('draggable', 'false');
}


function elementIsDraggable(element) {
    const attribute = element.getAttribute('draggable');
    if (attribute === 'true') {
        return true;
    } else {
        return false;
    }
}


function handleClick() {
    const coins = getAllCoins();
    const coin = coins[0];
    console.log(getAdjacentCellValuesFor(coin));
    const coinContent = coin.firstChild.textContent;
    console.log(coinContent);
}

/*function handleClick() {
    if (elementIsDraggable(event.target)) {
        setNotDraggable(event.target);
    } else {
        setDraggable(event.target);
    }
    console.log(cellMovable(event.target));
}*/


function getCellCoordinates(cell) {
    const coordinates = [];
    const x = cell.dataset.col;
    const y = cell.dataset.row;
    coordinates.push(Number(x));
    coordinates.push(Number(y));
    return coordinates;
}


function getCellByCoordinates(coordinateX, coordinateY) {
    return document.querySelector(`.cell[data-col="${coordinateX}"][data-row="${coordinateY}"]`);
}


function getAdjacentCellValuesFor(cell) {
    const adjacentCells = getAdjacentCellsFor(cell);
    const adjacentCellValues = [];
    for (const adjacentCell of adjacentCells) {
        const adjacentCellValue = getCellByCoordinates(adjacentCell[0], adjacentCell[1]).textContent;
        console.log(adjacentCellValue);
        adjacentCellValues.push(adjacentCellValue);
    }
    return adjacentCellValues;
}


function cellMovable(cell) {
   const clickedCellValue = cell.textContent;
   const adjacentCellValues = getAdjacentCellValuesFor(cell);
   if (
       adjacentCellValues.includes('') ||
       adjacentCellValues.includes(clickedCellValue)
      ) {
       return true;
   }
   return false;
}


function purgeOutOfBound(coordinate_pairs) {
    const purgedCoordinates = [];
    for (const coordinate_pair of coordinate_pairs) {
        if (
            (coordinate_pair[0] < 0 || coordinate_pair[0] > 6) ||
            (coordinate_pair[1] < 0 || coordinate_pair[1] > 7)
        ) {
            continue;
        } else {
            purgedCoordinates.push(coordinate_pair);
        }
    }
    return purgedCoordinates;
}


function getAdjacentCellsFor(element) {
    const elementCoordinates = getCellCoordinates(element);
    const elementX = elementCoordinates[0];
    const elementY = elementCoordinates[1];
    const rowAbove = elementY - 1;
    const sameRow = elementY;
    const rowBelow = elementY + 1;
    const previousColumn = elementX - 1;
    const sameColumn = elementX;
    const nextColumn = elementX + 1;
    const adjacentCells = [
        [sameColumn, rowAbove],
        [previousColumn, sameRow],
        [nextColumn, sameRow],
        [sameColumn, rowBelow]
    ]
    const adjacentCellsPurged = purgeOutOfBound(adjacentCells);
    return adjacentCellsPurged;
}


function main() {
    const cells = getCells();
    addEventListenerTo(cells, 'click', handleClick);
}


main();