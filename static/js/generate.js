//--------------DRAG-AND-DROP------------------------------------------------

function getDragSourceCell() {
    const sourceID = document.body.dataset.dragSourceID;
    return document.getElementById(sourceID);
}

function insertDraggedCoin(cell) {
    const sourceCell = getDragSourceCell();
    cell.innerHTML = sourceCell.innerHTML;
    setCoinCoord(cell.firstChild);
    setUpCoin(cell.firstChild);
}

function handleValidDrop(cell) {
    // first: insert the dragged coin into the cell
    insertDraggedCoin(cell);
    cell.dataset.number = document.body.dataset.draggedNumber;
    const newCoin = cell.firstChild;

    // second: if the cell contains a coin with a matching number, increment the number value by 1
    //         in the dataset of the cell and in the coin itself
    if (cell.classList.contains('match')) {
        const newNumber = Number(cell.dataset.number) + 1;
        cell.dataset.number = newNumber.toString();
        newCoin.firstChild.textContent = newNumber.toString();
    }

    // third: empty the cell where the coin was dragged from
    const sourceCell = getDragSourceCell();
    sourceCell.innerHTML = '';
    sourceCell.dataset.number = '';
}

function setUpCells() {
    const cells = document.querySelectorAll('.cell');
    for (const cell of cells) {
        cell.addEventListener('dragenter', function () {
            if (this.classList.contains('match')) {
                this.innerHTML = '';
            }
        });
        cell.addEventListener('dragleave', function () {
            event.preventDefault();
            if (this.classList.contains('match')) {
                insertDraggedCoin(this);
            }
        });
        cell.addEventListener('dragover', function () {
            event.preventDefault();
        });
        cell.addEventListener('drop', function () {
            event.preventDefault();
            if (this.classList.contains('empty') || this.classList.contains('match')) {
                handleValidDrop(this);
            }
        })
    }
}

function setUpCoin(coin) {
    coin.addEventListener('dragstart', function () {
        const body = document.body;
        const cells = document.querySelectorAll('.cell');
        event.dataTransfer.setData('text/html', event.target.outerHTML);
        body.dataset.dragSourceID = coin.parentNode.id.toString();
        body.dataset.draggedNumber = coin.firstChild.textContent;
        for (const cell of cells) {
            if (cell !== this.parentNode && cell.dataset.number === this.firstChild.textContent) {
                cell.classList.add('match');
            } else if (!cell.firstChild) {
                cell.classList.add('empty');
            }
        }
    });
    coin.addEventListener('dragend', function () {
        const body = document.body;
        const cells = document.querySelectorAll('.cell');
        for (const cell of cells) {
            cell.classList.remove('match');
            cell.classList.remove('empty');
        }
        body.dataset.dragSourceID = '';
        body.dataset.draggedNumber = '';
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
        let newRow = parseInt(coin.dataset.row) - 1;
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
            cell.innerHTML = `<div class="coin" draggable="true" data-col="${col}" data-row="${row}"><div class="number">${number}</div></div>`;
            cell.dataset.number = number.toString();
            const newCoin = cell.firstChild;
            setUpCoin(newCoin);
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
        let timeHandler = setInterval(decreaseTime, 200);

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
    setUpCells();
    handleRows();
}

main();