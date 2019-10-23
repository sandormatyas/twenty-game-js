

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

}


function main() {
    dragulaElemenets = addDragulaToElements();
    mergeCells(dragulaElemenets);
}


main();