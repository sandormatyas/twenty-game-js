import "./game";

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
            cell.innerHTML = `<div class="coin" data-col="${cell.dataset.col}" data-row="${cell.dataset.row}">${number}</div>`
        }
    }
}

function handleRows() {
    const timerBar = document.getElementById('timer-bar');
    const timesUp = new Event('timesUp');

    timerBar.addEventListener('timesUp', function (event) {
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
    handleRows();
}

main();