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


const handleClick = () => {
    console.log('hello');
}



const main = () => {
    const cells = getCells();
    addEventListenerTo(cells, 'click', handleClick);
}

main();