

function addDragulaToElements() {
    const cells = Array.from(document.querySelectorAll(".row"));
    dragula(cells);
}


function main() {
    addDragulaToElements();
}


main();