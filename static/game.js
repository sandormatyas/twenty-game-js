const isIterable = (obj) => {
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}


const addEventListenerTo = (object, event, callback) => {
    for (const element of object) {
        element.addEventListener(event, callback);
    }
}


const getCells = () => {
    const cells = document.querySelectorAll('.cell');
    console.log(cells)
    return cells;
}


const getCellContent = () => {
    const cells = getCells();
    const cellContent = [];

    for (cell of cells) {
        cellContent.push(cell.innerText);
    };

    return cellContent;
};


const fieldIsTaken = () => {
    if (event.target.innerText) {
        return true;
    } else {
        return false;
    };
};


const handleClick = () => {
    console.log('hello');
}



const main = () => {
    const cells = getCells();
    addEventListenerTo(cells, 'click', handleClick);
}

main();