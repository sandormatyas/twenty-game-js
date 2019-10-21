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


const getCellContent = () => {
    const cells = getCells();
    const cellContent = [];

    for (const cell of cells) {
        cellContent.push(cell.innerText);
    };

    return cellContent;
}


const fieldIsTaken = () => {
    if (event.target.innerText) {
        return true;
    } else {
        return false;
    }
}


const handleClick = () => {
    console.log(fieldIsTaken());
}



const main = () => {
    const cells = getCells();
    addEventListenerTo(cells, 'click', handleClick);
}

main();