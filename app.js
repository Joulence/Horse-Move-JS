const startBtn = document.getElementById("btn-start");
const startDiv = document.getElementById("div-start");
const userNameInput = document.getElementById("input-name");
const userList = document.getElementById("user-list");

let userName = "";

let timer = document.getElementById("timer");

let count = 0;
let allMoves = 0;

async function getResults() {
  const url =
    "https://horse-move-game-default-rtdb.firebaseio.com/results.json";

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((jsonData) => {
      // console.log(jsonData);
      let userCounter = 0;
      if (jsonData != null) {
        for (const key in jsonData) {
          if (jsonData.hasOwnProperty(key)) {
            const userObject = jsonData[key];
            const scores = userObject.scores;
            const user = userObject.user;

            const listItem = document.createElement("li");
            listItem.textContent = `User: ${user}, Scores: ${scores}`;

            userList.appendChild(listItem);

            /* userCounter++;
            if (userCounter === 10) {
              break;
            } */
          }
        }
      } else {
        const listItem = document.createElement("li");
        listItem.textContent = `User List is empty`;

        userList.appendChild(listItem);
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

getResults();
async function sendResults() {
  const url =
    "https://horse-move-game-default-rtdb.firebaseio.com/results.json";

  const data = {
    user: userName,
    scores: allMoves,
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
      // console.log(jsonResponse);
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

function availableMove(cellX, cellY) {
  try {
    const move1 = document.getElementById(`x${cellX + 1}y${cellY - 2}`);
    const move2 = document.getElementById(`x${cellX + 2}y${cellY - 1}`);
    const move3 = document.getElementById(`x${cellX + 2}y${cellY + 1}`);
    const move4 = document.getElementById(`x${cellX + 1}y${cellY + 2}`);
    const move5 = document.getElementById(`x${cellX - 1}y${cellY + 2}`);
    const move6 = document.getElementById(`x${cellX - 2}y${cellY + 1}`);
    const move7 = document.getElementById(`x${cellX - 2}y${cellY - 1}`);
    const move8 = document.getElementById(`x${cellX - 1}y${cellY - 2}`);

    if (move1 && !move1.classList.contains("disabled")) {
      move1.classList.add("available");
    }
    if (move2 && !move2.classList.contains("disabled")) {
      move2.classList.add("available");
    }
    if (move3 && !move3.classList.contains("disabled")) {
      move3.classList.add("available");
    }
    if (move4 && !move4.classList.contains("disabled")) {
      move4.classList.add("available");
    }
    if (move5 && !move5.classList.contains("disabled")) {
      move5.classList.add("available");
    }
    if (move6 && !move6.classList.contains("disabled")) {
      move6.classList.add("available");
    }
    if (move7 && !move7.classList.contains("disabled")) {
      move7.classList.add("available");
    }
    if (move8 && !move8.classList.contains("disabled")) {
      move8.classList.add("available");
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
  if (allMoves > 99) {
    sendResults();
    alert("You won!");
    location.reload();
  } else if (allAvailables < 1) {
    gameOver();
  }
}

function move() {
  document.querySelector("table").addEventListener("click", (event) => {
    // allMoves = document.querySelectorAll(".disabled").length;
    if (event.target.classList.contains("cell")) {
      let thisCell = event.target;
      let thisCellData = thisCell.id.slice(1).split("y");
      let thisCellX = parseInt(thisCellData[0]);
      let thisCellY = parseInt(thisCellData[1]);

      try {
        document.querySelectorAll(".current")[0].classList.remove("current");
      } catch (err) {}
      thisCell.classList.add("pressed", "disabled", "current");
      allMoves++;
      // console.log(`x: ${thisCellX}, y: ${thisCellY}`);
      removeAvailable();
      availableMove(thisCellX, thisCellY);
      checkAvailable();
    }
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
  if (userName.length < 1) {
    alert("Enter your name!");
  } else {
    startDiv.remove();
    init();
    setTimeout(incrementTimer, 1000);
  }
});
