var rows = 20;
var cols = 20;
var playing = false;
var grid = createArray(rows, cols);
var nextGrid = createArray(rows, cols);
var interval;

// Inicializace hry
window.onload = function () {
    createTable();
    setupControls();
};

// Vytvoření prázdné mřížky
function createArray(rows, cols) {
    let arr = new Array(rows);
    for (let i = 0; i < rows; i++) {
        arr[i] = new Array(cols).fill(0);
    }
    return arr;
}

// Vytvoření tabulky (UI)
function createTable() {
    let gridContainer = document.getElementById("gridContainer");
    let table = document.createElement("table");

    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.addEventListener("click", toggleCell);
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}

// Přepínání buněk kliknutím
function toggleCell() {
    let coords = this.id.split("_");
    let row = parseInt(coords[0]);
    let col = parseInt(coords[1]);

    if (grid[row][col] === 0) {
        this.setAttribute("class", "live");
        grid[row][col] = 1;
    } else {
        this.setAttribute("class", "dead");
        grid[row][col] = 0;
    }
}

// Nastavení ovládacích prvků
function setupControls() {
    document.getElementById("start").addEventListener("click", startStop);
    document.getElementById("clear").addEventListener("click", clearGrid);
    document.getElementById("random").addEventListener("click", randomizeGrid);
}

// Spuštění/zastavení hry
function startStop() {
    if (playing) {
        clearInterval(interval);
        playing = false;
        document.getElementById("start").innerText = "Start";
    } else {
        interval = setInterval(runGame, 300);
        playing = true;
        document.getElementById("start").innerText = "Stop";
    }
}

// Vymazání mřížky
function clearGrid() {
    clearInterval(interval);
    playing = false;
    document.getElementById("start").innerText = "Start";
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
            document.getElementById(i + "_" + j).setAttribute("class", "dead");
        }
    }
}

// Hlavní logika hry
function runGame() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let neighbors = countNeighbors(i, j);
            if (grid[i][j] === 1) {
                if (neighbors < 2 || neighbors > 3) {
                    nextGrid[i][j] = 0;
                } else {
                    nextGrid[i][j] = 1;
                }
            } else {
                if (neighbors === 3) {
                    nextGrid[i][j] = 1;
                }
            }
        }
    }
    updateGrid();
}

// Počítání sousedů
function countNeighbors(row, col) {
    let count = 0;
    let directions = [-1, 0, 1];

    for (let i of directions) {
        for (let j of directions) {
            if (i === 0 && j === 0) continue;

            let newRow = row + i;
            let newCol = col + j;

            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                count += grid[newRow][newCol];
            }
        }
    }
    return count;
}

// Aktualizace mřížky podle nového stavu
function updateGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            document.getElementById(i + "_" + j).setAttribute("class", grid[i][j] ? "live" : "dead");
        }
    }
}

// Náhodné rozmístění buněk
function randomizeGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let randomValue = Math.random() > 0.5 ? 1 : 0;
            grid[i][j] = randomValue;
            document.getElementById(i + "_" + j).setAttribute("class", randomValue ? "live" : "dead");
        }
    }
}
