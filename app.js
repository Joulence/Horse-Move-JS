const start = document.getElementById('start');

start.addEventListener('click', () => {
    document.querySelector('table').style.pointerEvents = 'initial';
    document.querySelector('table').style.background = 'green';
});

function init() {
    createTable();
    move();
}

function createTable() {
    const tbl = document.createElement("table");
    const tblBody = document.createElement("tbody");
    for (let y = 0; y < 10; y++) {
        const row = document.createElement("tr");
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement("td");
            const cellText = document.createTextNode((x + 10 * y) + 1);
            cell.appendChild(cellText);
            cell.setAttribute('id', `x${x + 1}y${y + 1}`);
            cell.classList.add('cell');
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
    }
    tbl.style.pointerEvents = 'none';
    tbl.style.background = 'grey';
    tbl.appendChild(tblBody);
    document.body.appendChild(tbl);
}

function move() {
    document.querySelector('table').addEventListener('click', (event) => {
        if (event.target.classList.contains('cell')) {
            let thisCell = event.target;
            let thisCellData = thisCell.id.slice(1).split('y');
            let thisCellX = parseInt(thisCellData[0]);
            let thisCellY = parseInt(thisCellData[1]);

            thisCell.classList.add('pressed', 'disabled');
            console.log(`x: ${thisCellX}, y: ${thisCellY}`);
            blockCell(thisCellX, thisCellY);
            isSurrounded(thisCellX, thisCellY);
        }
    });
}

function blockCell(cellX, cellY) {
    if (cellX + 1 != 11) {
        document.getElementById(`x${cellX + 1}y${cellY}`).classList.add('blocked', 'disabled');
    }
    if (cellX - 1 != 0) {
        document.getElementById(`x${cellX - 1}y${cellY}`).classList.add('blocked', 'disabled');
    }
    if (cellY + 1 != 11) {
        document.getElementById(`x${cellX}y${cellY + 1}`).classList.add('blocked', 'disabled');
    }
    if (cellY - 1 != 0) {
        document.getElementById(`x${cellX}y${cellY - 1}`).classList.add('blocked', 'disabled');
    }
}

function isSurrounded(cellX, cellY) {
    if (cellX - 1 < 1) {
        if (cellY - 1 < 1) {
            if (document.getElementById(`x${cellX + 1}y${cellY + 1}`).classList.contains('disabled')) {
                gameOver();
            }
        } else if (cellY + 1 > 10) {
            if (document.getElementById(`x${cellX + 1}y${cellY - 1}`).classList.contains('disabled')) {
                gameOver();
            }
        } else {
            if (document.getElementById(`x${cellX + 1}y${cellY - 1}`).classList.contains('disabled') && document.getElementById(`x${cellX + 1}y${cellY + 1}`).classList.contains('disabled')) {
                gameOver();
            }
        }
    }

    else if (cellX + 1 > 10) {
        if (cellY - 1 < 1) {
            if (document.getElementById(`x${cellX - 1}y${cellY + 1}`).classList.contains('disabled')) {
                gameOver();
            }
        } else if (cellY + 1 > 10) {
            if (document.getElementById(`x${cellX - 1}y${cellY - 1}`).classList.contains('disabled')) {
                gameOver();
            }
        } else {
            if (document.getElementById(`x${cellX - 1}y${cellY - 1}`).classList.contains('disabled') && document.getElementById(`x${cellX - 1}y${cellY + 1}`).classList.contains('disabled')) {
                gameOver();
            }
        }
    } else if (cellY - 1 < 1) {
        if (document.getElementById(`x${cellX - 1}y${cellY + 1}`).classList.contains('disabled') && document.getElementById(`x${cellX + 1}y${cellY + 1}`).classList.contains('disabled')) {
            gameOver();
        }
    } else if (cellY + 1 > 10) {
        if (document.getElementById(`x${cellX - 1}y${cellY - 1}`).classList.contains('disabled') && document.getElementById(`x${cellX + 1}y${cellY - 1}`).classList.contains('disabled')) {
            gameOver();
        }
    } else {
        if (document.getElementById(`x${cellX + 1}y${cellY + 1}`).classList.contains('disabled') && document.getElementById(`x${cellX + 1}y${cellY - 1}`).classList.contains('disabled') && document.getElementById(`x${cellX - 1}y${cellY + 1}`).classList.contains('disabled') && document.getElementById(`x${cellX - 1}y${cellY - 1}`).classList.contains('disabled')) {
            gameOver();
        }
    }
}

function gameOver() {
    alert('Game over');
    restart();
}

function restart() {
    if (window.confirm('Restart?')) {
        document.querySelector('table').remove();
        init();
    } else {
        document.querySelector('table').remove();
    }
}

init();