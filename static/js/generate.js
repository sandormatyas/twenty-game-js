// ---------------SET ATTRIBUTE OF SURROUNDED BLOCKS-----------------------------
function getCellCoordinates(cell) {
    const coordinates = [];
    const x = cell.dataset.col;
    const y = cell.dataset.row;
    coordinates.push(Number(x));
    coordinates.push(Number(y));
    return coordinates;
}


function getCellByCoordinates(coordinateX, coordinateY) {
    return document.querySelector(`.cell[data-col="${coordinateX}"][data-row="${coordinateY}"]`);
}


function getCoins() {
    const coins = document.querySelectorAll('.coin');
    return coins;
}


function coinBlocked(coin) {
    const adjacentCellValues = getContentOfAdjacentCellsFor(coin);
    if (adjacentCellValues.includes('')) {
        return false;
    }
    return true;
}


function setBlockedAttributeOf(coins) {
    for (const coin of coins) {
        if (coinBlocked(coin)) {
            setBlocked(coin);
        } else {
            setNotBlocked(coin);
        }
    }
}


function setBlocked(element) {
    element.dataset.blocked = 'true';
}


function setNotBlocked(element) {
    element.dataset.blocked = 'false';
}


function getContentOfAdjacentCellsFor(coin) {
    const adjacentCells = getAdjacentCellsFor(coin);
    const contentOfAdjacentCells = [];
    for (const adjacentCell of adjacentCells) {
        const adjacentCellContent = getCellByCoordinates(adjacentCell[0], adjacentCell[1]).textContent;
        contentOfAdjacentCells.push(adjacentCellContent);
    }
    return contentOfAdjacentCells;
}


function getAdjacentCellsFor(element) {
    const elementCoordinates = getCellCoordinates(element);
    const elementX = elementCoordinates[0];
    const elementY = elementCoordinates[1];
    const rowAbove = elementY - 1;
    const sameRow = elementY;
    const rowBelow = elementY + 1;
    const previousColumn = elementX - 1;
    const sameColumn = elementX;
    const nextColumn = elementX + 1;
    const adjacentCells = [
        [sameColumn, rowAbove],
        [previousColumn, sameRow],
        [nextColumn, sameRow],
        [sameColumn, rowBelow]
    ]
    const adjacentCellsPurged = purgeOutOfBound(adjacentCells);
    return adjacentCellsPurged;
}


function purgeOutOfBound(coordinate_pairs) {
    const purgedCoordinates = [];
    for (const coordinate_pair of coordinate_pairs) {
        if (
            (coordinate_pair[0] < 0 || coordinate_pair[0] > 6) ||
            (coordinate_pair[1] < 0 || coordinate_pair[1] > 7)
        ) {
            continue;
        } else {
            purgedCoordinates.push(coordinate_pair);
        }
    }
    return purgedCoordinates;
}


function setMutationObserver() {
    const targetNode = document.querySelector('#main-game-board');
    const config = {attributes: true, childList: false, subtree: true};
    const callback = function(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.attributeName === 'data-row' ||
                mutation.attributeName === 'data-col'
            ) {
                const coins = getCoins();
                setBlockedAttributeOf(coins);
                break;
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
};


// ---------------RESET GAME-----------------------------------------------------
function resetGame() {
    const cells = document.querySelectorAll(".cell");
    for (let cell of cells) {
        cell.innerHTML = "";
    }
    generateRow();
}

//---------------LOSE CHECK-----------------------------------------------------
function loseCheck() {
    const coins = document.querySelectorAll('.coin');
    for (let coin of coins) {
        let checkRow = parseInt(coin.dataset.row) - 1;
        if (checkRow === -1) {
            alert("You lost!");
            return true;
        }
    }
}

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
            cell.innerHTML = `<div class="coin" data-col="${col}" data-row="${row}"><div class="number">${number}</div></div>`
        }
    }
}

function handleRows() {
    const timerBar = document.getElementById('timer-bar');
    const timesUp = new Event('timesUp');
    timerBar.addEventListener('timesUp', function (event) {
        if (loseCheck()) {
            resetGame()
        }
        else {
            shiftCoinsUp();
            generateRow();
        }


        let width = 100;
        let timeHandler = setInterval(decreaseTime, 15);

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
    setMutationObserver();
}

main();