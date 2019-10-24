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
    ];
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
}


//---------------RESET GAME-----------------------------------------------------
function clearCells() {
    const cells = getCells();
    for (let cell of cells) {
        cell.innerHTML = '';
        cell.dataset.number = '';
    }
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

//--------------DRAG-AND-DROP------------------------------------------------

function getCells() {
    return document.querySelectorAll('.cell');
}

function getCoins() {
    return document.querySelectorAll('.coin');
}

function getGameBoard() {
    return document.querySelector('.game-board');
}

function getCellByCoordinates2(row, col) {
    return document.querySelector(`.cell[data-col="${col}"][data-row="${row}"]`);
}

function getCoinNumber(coin) {
    return coin.firstChild.textContent;
}

function getCoinNumberInCell(cell) {
    return cell.firstChild ? getCoinNumber(cell.firstChild) : '';
}

function setDragData(draggedCoin) {
    const gameBoard = getGameBoard();
    const dragSourceCell = draggedCoin.parentNode;
    const dragSource = dragSourceCell.id;
    const dragNumber = dragSourceCell.dataset.number;
    gameBoard.dataset.dragSource = dragSource;
    gameBoard.dataset.dragNumber = dragNumber;
}

function clearDragData() {
    const gameBoard = getGameBoard();
    gameBoard.dataset.dragSource = '';
    gameBoard.dataset.dragNumber = '';
}

function getDragSource() {
    const gameBoard = getGameBoard();
    return gameBoard.dataset.dragSource;
}

function getDragSourceCell() {
    const dragSource = getDragSource();
    return document.getElementById(dragSource);
}

function getDragNumber() {
    const gameBoard = getGameBoard();
    return gameBoard.dataset.dragNumber;
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
    cell.dataset.number = getDragNumber();
    const newCoin = cell.firstChild;

    // second: if the cell contains a coin with a matching number, increment the number value by 1
    //         in the dataset of the cell and in the coin itself
    if (cell.classList.contains('match')) {
        const newNumber = Number(cell.dataset.number) + 1;
        cell.dataset.number = newNumber.toString();
        newCoin.firstChild.textContent = newNumber.toString();
        newCoin.dataset.color = newNumber.toString();
    }

    // third: empty the cell where the coin was dragged from
    const sourceCell = getDragSourceCell();
    sourceCell.innerHTML = '';
    sourceCell.dataset.number = '';
    checkWin(newCoin);
}

function setUpCells() {
    const cells = getCells();
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
                const coins = getCoins();
                const coinsLength = coins.length;
                for (let i = coinsLength - 1; i >= 0; i--) {
                    dropCoin(coins[i]);
                }
            }
        })
    }
}

function setUpCoin(coin) {
    coin.addEventListener('dragstart', function () {
        const cells = getCells();
        event.dataTransfer.setData('text/html', event.target.outerHTML);
        setDragData(event.target);
        for (const cell of cells) {
            if (cell !== this.parentNode && cell.dataset.number === this.firstChild.textContent) {
                cell.classList.add('match');
            } else if (!cell.firstChild) {
                cell.classList.add('empty');
            }
        }
    });
    coin.addEventListener('dragend', function () {
        const cells = getCells();
        for (const cell of cells) {
            cell.classList.remove('match');
            cell.classList.remove('empty');
        }
        clearDragData();
    });
}

//---------------WIN---------------------------------------------------------
function checkWin(coin) {
    const num = parseInt(coin.textContent);
    if (num === 10) {
        alert("You've won!");
        clearCells();
    }
}

//---------------SHIFTING ROWS AND COINS------------------------------------------
function dropCoin(coin) {
    while (thereIsSpaceBelow(coin)) {
        const newRow = parseInt(coin.dataset.row) + 1;
        const column = parseInt(coin.dataset.col);

        const fragment = document.createDocumentFragment();
        fragment.appendChild(coin);

        const newCell = getCellByCoordinates2(newRow, column);
        newCell.appendChild(fragment);

        setCoinCoord(coin);
        updateDataAttrOfCells();
    }
}

function thereIsSpaceBelow(coin) {
    const currentRow = parseInt(coin.dataset.row);
    if (currentRow === 7) {
        return false
    }
    const rowBelow = currentRow + 1;
    const colBelow = coin.dataset.col;
    const cellBelow = getCellByCoordinates2(rowBelow, colBelow);
    if (!cellBelow.hasChildNodes()) {
        return true
    }
}


function setCoinCoord(coin) {
    coin.dataset.row = coin.parentNode.dataset.row;
    coin.dataset.col = coin.parentNode.dataset.col;
}

function updateDataAttrOfCells() {
    const cells = getCells();
    for (const cell of cells) {
        cell.dataset.number = getCoinNumberInCell(cell);
    }
}

function shiftCoinsUp() {
    const coins = getCoins();
    for (let coin of coins) {
        const newRow = parseInt(coin.dataset.row) - 1;
        const column = parseInt(coin.dataset.col);

        const fragment = document.createDocumentFragment();
        fragment.appendChild(coin);

        const newCell = getCellByCoordinates2(newRow, column);
        newCell.appendChild(fragment);

        setCoinCoord(coin);
    }
    updateDataAttrOfCells();
}

//-----------------TIMER + GENERATING BOTTOM ROW------------------------------
function Board() {
    this.height = 8;
    this.maxnumber = 5;
}

function generateCoin(cell, maxNumber) {
    const number = Math.floor(Math.random() * maxNumber) + 1;
    const coin = document.createElement('DIV');
    coin.classList.add('coin');
    coin.setAttribute('draggable', 'true');
    coin.dataset.row = cell.dataset.row;
    coin.dataset.col = cell.dataset.col;
    coin.dataset.color = number.toString();
    coin.innerHTML = `<div class="number">${number}</div>`;
    return coin;
}

function generateRow() {
    const board = new Board();
    const cells = document.querySelectorAll('.cell');
    for (const cell of cells) {
        if (Number(cell.dataset.row) === board.height - 1) {
            const newCoin = generateCoin(cell, board.maxnumber);
            cell.appendChild(newCoin);
            cell.dataset.number = getCoinNumber(newCoin);
            setUpCoin(cell.firstChild);
        } else if (!cell.firstChild) {
            cell.dataset.number = '';
        }
    }
    const coins = getCoins();
    for (const coin of coins) {
        coin.dataset.blocked = coinBlocked(coin) ? 'true' : 'false';
    }
}

function updateDragSourceAfterShift() {
    let dragSource = getDragSource();
    const row = dragSource.substr(1, 1);
    const col = dragSource.substr(3, 1);
    dragSource = `r${Number(row) - 1}c${col}`;
    const gameBoard = getGameBoard();
    gameBoard.dataset.dragSource = dragSource;
}

function handleRowGeneration() {
    const timerBar = document.getElementById('timer-bar');
    const timesUp = new Event('timesUp');

    timerBar.addEventListener('timesUp', function (event) {
        if (loseCheck()) {
            clearCells();
        } else {
            shiftCoinsUp();
        }

        generateRow();

        if (getDragNumber()) {
            console.log('set source');
            updateDragSourceAfterShift();
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
    setUpCells();
    handleRowGeneration();
    setMutationObserver();
}

main();