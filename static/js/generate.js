//---------------DRAGULA-----------------------------------------------------
function addDragulaToElements() {
    const cells = Array.from(document.querySelectorAll(".cell"));
    dragula(cells, {
        accepts: function (el, target) {
            return !target.innerHTML || el.firstChild.textContent === target.firstChild.textContent;
        }
    }).on('drop', function (el, target) {
        let number;
        if (target.classList.contains('ex-over')) {
            number = (Number(el.firstChild.textContent) + 1).toString();
            target.classList.remove('ex-over');
        } else {
            number = el.firstChild.textContent;
        }
        el.remove();
        target.innerHTML = `<div class="coin"><div class="number">${number}</div></div>`;
        setCoinCoord(target.querySelector('.coin'));
    }).on('over', function (el, container) {
        const targetCoin = container.querySelector('.coin');
        if (targetCoin && el !== targetCoin && el.firstChild.textContent === targetCoin.firstChild.textContent) {
            container.innerHTML = '';
            container.classList.add('ex-over');
        }
    }).on('out', function (el, container) {
        if (container.classList.contains('ex-over')) {
            container.innerHTML = `<div class="coin"><div class="number">${el.firstChild.textContent}</div></div>`;
            setCoinCoord(container.querySelector('.coin'));
            container.classList.remove('ex-over');
        }
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
            cell.innerHTML = `<div class="coin" data-col="${col}" data-row="${row}"><div class="number">${number}</div></div>`
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
        let timeHandler = setInterval(decreaseTime, 20);

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