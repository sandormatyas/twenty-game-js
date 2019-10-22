

function addDragulaToElements() {
    const cells = Array.from(document.querySelectorAll(".cell"));
    dragula(cells);
}


function main() {
    addDragulaToElements();
}


main();