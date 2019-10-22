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
            cell.textContent = number.toString();
        }
    }
}

function handleNewRow() {
    const button = document.querySelector('#button-container button');
    button.addEventListener('click', generateRow);
}

handleNewRow();