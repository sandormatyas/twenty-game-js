function mergeCells(dragulaElements) {
    let drake = dragulaElements;
    drake.on("drop",  function (el, target, source, sibling) {
        console.log(target);
        target.innerText = Number(target.innerText) + Number(source.innerText);
    })
}


function addDragulaToElements() {
    const cells = Array.from(document.querySelectorAll(".cell"));
    dragula(cells);
    let dragulaElements = dragula(cells);

    return dragulaElements;


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


function setBlockedAttributeOf(coins) {
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


function main() {
    dragulaElemenets = addDragulaToElements();
    mergeCells(dragulaElemenets);
    const coins = getCoins();
    const targetNode = document.querySelector('#main-game-board');
    const config = {attributes: true, childList: false, subtree: true};
    const callback = function(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.attributeName === 'data-row') {
                setBlockedAttributeOf(coins);
                break;
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}


main();