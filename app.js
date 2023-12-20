const startBtn = document.getElementById("btn-start");
const startDiv = document.getElementById("div-start");
const userNameInput = document.getElementById("input-name");

let userName = "";

let timer = document.getElementById("timer");

let count = 0;
let startGame = false;
let allMoves = 0;

async function sendResults() {
  const url =
    "https://horse-move-game-default-rtdb.firebaseio.com/results.json";

  const data = {
    user: userName,
    scors: allMoves,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((jsonResponse) => {
      console.log(jsonResponse);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function createTable() {
  const tbl = document.createElement("table");
  const tblBody = document.createElement("tbody");
  for (let y = 0; y < 10; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement("td");
      const cellText = document.createTextNode(y * 10 + x + 1);
      cell.appendChild(cellText);
      cell.setAttribute("id", `x${x + 1}y${y + 1}`);
      cell.classList.add("cell");
      row.appendChild(cell);
    }
    tblBody.appendChild(row);
  }
  tbl.appendChild(tblBody);
  document.body.appendChild(tbl);
  document.getElementById("x1y1").classList.add("start");
}

function blockedCell(cellX, cellY) {
  if (cellX + 1 != 11) {
    document
      .getElementById(`x${cellX + 1}y${cellY}`)
      .classList.add("blocked", "disabled");
  }
  if (cellX - 1 != 0) {
    document
      .getElementById(`x${cellX - 1}y${cellY}`)
      .classList.add("blocked", "disabled");
  }
  if (cellY + 1 != 11) {
    document
      .getElementById(`x${cellX}y${cellY + 1}`)
      .classList.add("blocked", "disabled");
  }
  if (cellY - 1 != 0) {
    document
      .getElementById(`x${cellX}y${cellY - 1}`)
      .classList.add("blocked", "disabled");
  }
}

function availableMove(cellX, cellY) {
  try {
    const topRightElement = document.getElementById(
      `x${cellX - 1}y${cellY + 1}`
    );
    const bottomRightElement = document.getElementById(
      `x${cellX + 1}y${cellY + 1}`
    );
    const bottomLeftElement = document.getElementById(
      `x${cellX + 1}y${cellY - 1}`
    );
    const topLeftElement = document.getElementById(
      `x${cellX - 1}y${cellY - 1}`
    );

    if (topRightElement && !topRightElement.classList.contains("disabled")) {
      topRightElement.classList.add("available");
    }
    if (
      bottomRightElement &&
      !bottomRightElement.classList.contains("disabled")
    ) {
      bottomRightElement.classList.add("available");
    }
    if (
      bottomLeftElement &&
      !bottomLeftElement.classList.contains("disabled")
    ) {
      bottomLeftElement.classList.add("available");
    }
    if (topLeftElement && !topLeftElement.classList.contains("disabled")) {
      topLeftElement.classList.add("available");
    }
  } catch (err) {
    // console.error(err);
  }
}

function removeAvailable() {
  let availables = document.querySelectorAll(".available");
  for (let i = 0; i < availables.length; i++) {
    availables[i].classList.remove("available");
  }
}

function gameOver() {
  sendResults();
  alert(`Game Over! You have got ${allMoves} scores!`);
  location.reload();
}

function checkAvailable() {
  let allAvailables = document.querySelectorAll(".available").length;
  if (allAvailables < 1 && allMoves > 99) {
    sendResults();
    alert("You won!");
    location.reload();
  } else if (allAvailables < 1) {
    gameOver();
  }
}

function move() {
  document.querySelector("table").addEventListener("click", (event) => {
    if (event.target.classList.contains("cell")) {
      let thisCell = event.target;
      let thisCellData = thisCell.id.slice(1).split("y");
      let thisCellX = parseInt(thisCellData[0]);
      let thisCellY = parseInt(thisCellData[1]);

      thisCell.classList.add("pressed", "disabled");
      // console.log(`x: ${thisCellX}, y: ${thisCellY}`);
      blockedCell(thisCellX, thisCellY);
      removeAvailable();
      availableMove(thisCellX, thisCellY);
      checkAvailable();
    }
    allMoves = document.querySelectorAll(".disabled").length;
    // console.log(allMoves);
  });
}

function init() {
  createTable();
  move();
}

function incrementTimer() {
  count += 1;
  timer.textContent = count;
  setTimeout(incrementTimer, 1000);
}

startBtn.addEventListener("click", () => {
  userName = userNameInput.value;
  startDiv.remove();
  init();
  setTimeout(incrementTimer, 1000);
});
