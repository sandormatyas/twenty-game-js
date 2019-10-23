function getCells() {
    const cells = document.querySelectorAll('.cell');
    return cells;
}


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


function getCoins() {
    const coins = document.querySelectorAll('.coin');
    return coins;
}


function coinBlocked(coin) {
    const adjacentCellValues = getContentOfAdjacentCellsFor(coin);
    if (adjacentCellValues.includes('')) {
        return false;
    }
    return true;
}


function setAttributeOfBlocked(coins) {
    for (const coin of coins) {
        if (coinBlocked(coin)) {
            setBlocked(coin);
        } else {
            setNotBlocked(coin);
        }
    }
}


function setBlocked(element) {
    element.dataset.blocked = 'true';
}


function setNotBlocked(element) {
    element.dataset.blocked = 'false';
}


function getContentOfAdjacentCellsFor(coin) {
    const adjacentCells = getAdjacentCellsFor(coin);
    const contentOfAdjacentCells = [];
    for (const adjacentCell of adjacentCells) {
        const adjacentCellContent = getCellByCoordinates(adjacentCell[0], adjacentCell[1]).textContent;
        contentOfAdjacentCells.push(adjacentCellContent);
    }
    return contentOfAdjacentCells;
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


function handleClick() {
    const coins = getCoins();
    setAttributeOfBlocked(coins);
}


function main() {
    const cells = getCells();
    addEventListenerTo(cells, 'click', handleClick);
}


main();