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
    console.log('clicked');
    if (elementIsDraggable(event.target)) {
        setNotDraggable(event.target);
    } else {
        setDraggable(event.target);
}



const main = () => {
    const cells = getCells();
    addEventListenerTo(cells, 'click', handleClick);
}

main();