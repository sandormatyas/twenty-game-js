//---------------DRAGULA-----------------------------------------------------
function addDragulaToElements() {
    const cells = Array.from(document.querySelectorAll(".cell"));
    dragula(cells)
        .on('drop', function (el) {
            setCoinCoord(el);
        });

}

//---------------SHIFTING ROWS UP--------------------------------------------
function setCoinCoord(coin) {
    coin.dataset.row = coin.parentNode.dataset.row;
    coin.dataset.col = coin.parentNode.dataset.col;
}

function shiftCoinsUp() {
    const coins = document.querySelectorAll('.coin');
    for (let coin of coins) {
        let newRow = parseInt(coin.dataset.row) -1;
        let column = parseInt(coin.dataset.col);

        let fragment = document.createDocumentFragment();
        fragment.appendChild(coin);
        document.querySelector(`.cell[data-col="${column}"][data-row="${newRow}"]`).appendChild(fragment);

        setCoinCoord(coin);
    }

}

//-----------------TIMER + GENERATING BOTTOM ROW------------------------------
function Board() {
    this.height = 8;
    this.maxnumber = 5;
}

function generateRow() {
    const cells = document.querySelectorAll('.cell');
    const board = new Board();
    for (const cell of cells) {
        if (Number(cell.dataset.row) === board.height - 1) {
            const number = Math.floor(Math.random() * board.maxnumber) + 1;
            const col = cell.dataset.col;
            const row = cell.dataset.row;
            cell.innerHTML = `<div class="coin" data-col="${col}" data-row="${row}">${number}</div>`
        }
    }
}

function handleRows() {
    const timerBar = document.getElementById('timer-bar');
    const timesUp = new Event('timesUp');

    timerBar.addEventListener('timesUp', function (event) {
        shiftCoinsUp();
        generateRow();

        let width = 100;
        let timeHandler = setInterval(decreaseTime, 10);

        function decreaseTime() {
            if (width <= 0) {
                clearInterval(timeHandler);
                timerBar.style.width = '100%';
                event.target.dispatchEvent(timesUp);
            } else {
                width = width - 0.2;
                timerBar.style.width = width + '%';
            }
        }

    });
    timerBar.dispatchEvent(timesUp);
}


function main() {
    addDragulaToElements();
    handleRows();
}

main();