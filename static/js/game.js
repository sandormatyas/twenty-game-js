const isIterable = (obj) => {
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}


const addEventListenerTo = (object, event, callback) => {
    if (isIterable(object)) {
        for (const element of object) {
            element.addEventListener(event, callback);
        }
    } else {
        object.addEventListener(event, callback);
    }
}


const getCells = () => {
    const cells = document.querySelectorAll('.cell');
    return cells;
}


const setDraggable = (element) => {
    element.setAttribute('draggable', 'true');
}


const setNotDraggable = (element) => {
    element.setAttribute('draggable', 'false');
}


const elementIsDraggable = (element) => {
    const attribute = element.getAttribute('draggable');
    if (attribute === 'true') {
        return true;
    } else {
        return false;
    }
}


const handleClick = () => {
    if (elementIsDraggable(event.target)) {
        setNotDraggable(event.target);
    } else {
        setDraggable(event.target);
    }
    console.log(cellMovable(event.target));
}


const getCellCoordinates = (cell) => {
    const coordinates = [];
    const x = cell.dataset.coordinateX;
    const y = cell.dataset.coordinateY;
    coordinates.push(Number(x));
    coordinates.push(Number(y));
    return coordinates;
}


const getCellByCoordinates = (coordinateX, coordinateY) => {
    return document.querySelector(`.cell[data-coordinate-x="${coordinateX}"][data-coordinate-y="${coordinateY}"]`);
}


const getAdjacentCellValues = (cell) => {
    const adjacentCells = getAdjacentCellsFor(cell);
    const adjacentCellValues = [];
    for (const adjacentCell of adjacentCells) {
        const adjacentCellValue = getCellByCoordinates(adjacentCell[0], adjacentCell[1]).textContent;
        adjacentCellValues.push(adjacentCellValue);
    }
    return adjacentCellValues;
}


const cellMovable = (cell) => {
   const clickedCellValue = cell.textContent;
   const adjacentCellValues = getAdjacentCellValues(cell);
   if (
       adjacentCellValues.includes('') ||
       adjacentCellValues.includes(clickedCellValue)
      ) {
       return true;
   }
   return false;
}


const purgeOutOfBound = (coordinate_pairs) => {
    const purgedCoordinates = [];
    for (const coordinate_pair of coordinate_pairs) {
        if (
            (coordinate_pair[0] < 0 || coordinate_pair[0] > 6) ||
            (coordinate_pair[1] < 0 || coordinate_pair[1] > 6)
        ) {
            continue;
        } else {
            purgedCoordinates.push(coordinate_pair);
        }
    }
    return purgedCoordinates;
}


const getAdjacentCellsFor = (element) => {
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


const main = () => {
    const cells = getCells();
    addEventListenerTo(cells, 'click', handleClick);
    addDragulaToElements();
}


function addDragulaToElements() {
    const cells = Array.from(document.querySelectorAll(".cell"));
    dragula(cells);
}



main();