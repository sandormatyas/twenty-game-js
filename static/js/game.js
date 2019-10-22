function addDragulaToElements() {
    const cells = Array.from(document.querySelectorAll(".cell"));
    dragula(cells);
}


function setCoinCoord(coin) {
    coin.dataset.row = coin.parent.dataset.row;
    coin.dataset.col = coin.parent.dataset.col;
}


function shiftCoinsUp() {
    let coins = document.querySelectorAll('.coin');
    for (let coin of coins) {
        let newXCoord = coin.dataset.row -1;
        let YCoord = coin.dataset.col;

        let fragment = document.createDocumentFragment();
        fragment.appendChild(coin);
        document.querySelector(`.cell[data-row="${newXCoord}"][data-col="${YCoord}"]`).appendChild(fragment);

        setCoinCoord(coin);
    }

}

function test() {
    const button = document.getElementById('button');
    button.addEventListener('click', shiftCoinsUp);
}

function main() {
    addDragulaToElements();
    test();
}


main();