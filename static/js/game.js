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


const getCellContent = () => {
    const cells = getCells();
    const cellContent = [];

    for (const cell of cells) {
        cellContent.push(cell.textContent);
    };

    return cellContent;
}


const fieldIsTaken = () => {
    if (event.target.textContent) {
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
    /*getAdjacentCellsFor(event.target);*/
    const adjacentCells = getAdjacentCellsFor(event.target);
    for (const adjacentCell of adjacentCells) {
        console.log((getCellByCoordinates(adjacentCell[0], adjacentCell[1])).textContent);
    };
}


const getCellCoordinates = (cell) => {
    const coordinates = []
    const x = cell.dataset.coordinateX;
    const y = cell.dataset.coordinateY;
    coordinates.push(Number(x));
    coordinates.push(Number(y));
    return coordinates;
}


const getCellByCoordinates = (coordinateX, coordinateY) => {
    return document.querySelector(`.cell[data-coordinate-x="${coordinateX}"][data-coordinate-y="${coordinateY}"]`);
}


const cellMovable ()

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


const getAdjacentCellsFor = (cell) => {
    const elementCoordinates = getCellCoordinates(cell);
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
}

main();