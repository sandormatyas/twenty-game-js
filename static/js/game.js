

function addDragulaToElements() {
    const cells = Array.from(document.querySelectorAll(".cell"));
    dragula(cells);
}


function startDragula() {
    addDragulaToElements();
}


startDragula();