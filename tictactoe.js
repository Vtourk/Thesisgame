//Package import

//elements
const canvas = document.getElementById('tictactoe');
const ctx = canvas.getContext('2d');
const msg = document.getElementById('message');
const restartButton = document.getElementById("restart");

const empty =  0, X = 1, O = -1;
const humanPlayer = X;
const computer = O;
const cellSize = 170;
const winPatterns = [
    0b111000000, 0b000111000, 0b000000111, // Rows είναι όπως η μάσκες των δικτύων
    0b100100100, 0b010010010, 0b001001001, // Columns
    0b100010001, 0b001010100, // Diagonals
];

let endGame = false;
var mapBoard = [0,0,0,
                0,0,0,
                0,0,0];

let mouse = {
    x: -1,
    y: -1,};

canvas.width = canvas.height= 3 * cellSize;

draw();
//EventListeners
canvas.addEventListener('mouseout', function () {
    mouse.x = mouse.y = -1;
});

canvas.addEventListener('mousemove', function (e) {
    let x = e.pageX - canvas.offsetLeft,
        y = e.pageY - canvas.offsetTop;

    mouse.x = x;
    mouse.y = y;
});

canvas.addEventListener('click', function (e) {
    play(getCellByCoords(mouse.x, mouse.y));
});

restartButton.addEventListener("click", () =>{
    mapBoard = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
    ],
    endGame = false;
    msg.textContent = "New game, Hunan's Turn";
});

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); //tha to valei panw deksia, thelei translate logika
    drawBoard();
    xando();
    requestAnimationFrame(draw);
}

function drawBoard(){
    ctx.strokeStyle = 'brown';
    ctx.lineWidth= 10;

    ctx.beginPath();
    ctx.moveTo(cellSize, 0);
    ctx.lineTo(cellSize, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cellSize * 2, 0);
    ctx.lineTo(cellSize * 2, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, cellSize);
    ctx.lineTo(canvas.width, cellSize);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, cellSize * 2);
    ctx.lineTo(canvas.width, cellSize * 2);
    ctx.stroke();
}

function xando(){
    ctx.lineWidth= 8;
    
    for (let i = 0; i < mapBoard.length; i++) {
        let coords = getCellCoords(i);
        ctx.save();
        ctx.translate(coords.x + cellSize / 2, coords.y + cellSize / 2);
        if (mapBoard[i] == X) {
            ctx.strokeStyle = 'white';
            drawX();
        } else if (mapBoard[i] == O) {
            ctx.strokeStyle = 'black';
            drawO();
        }

        ctx.restore();
    }
}

function drawX () {
    ctx.beginPath();
    ctx.moveTo(-cellSize / 3, -cellSize / 3);
    ctx.lineTo(cellSize / 3, cellSize / 3);
    ctx.moveTo(cellSize / 3, -cellSize / 3);
    ctx.lineTo(-cellSize / 3, cellSize / 3);
    ctx.stroke();
}
    
function drawO () {
    ctx.beginPath();
    ctx.arc(0, 0, cellSize / 3, 0, Math.PI * 2);
    ctx.stroke();
}

function getCellCoords (cell) {
    return {
        'x': (cell % 3) * cellSize,
        'y': Math.floor(cell / 3) * cellSize,
    };
}

 function getCellByCoords (x, y) {
    return (Math.floor(x / cellSize) % 3) + Math.floor(y / cellSize) * 3;
}

function play (cell) {
    if (endGame) return;

    if (mapBoard[cell] != empty){
        popUpMsg();
        return;
    }

    mapBoard[cell] = humanPlayer;
    msg.textContent = "Human's player turn";//TODO: fix that

    console.log("Human Player");
    winConditions(checkWin(humanPlayer), humanPlayer);
    if (endGame == true) return;

    let currentMapBoard=[];
    for (let index = 0; index < mapBoard.length; index++) {
        if (mapBoard[index] == empty)
            currentMapBoard.push(index);
    }
    
    let randomO = currentMapBoard[Math.floor(Math.random() * currentMapBoard.length)];
    //setTimeout(mapBoard[randomO]=computer, 10000)
    mapBoard[randomO]=computer;

    console.log("Computer Player");
    winConditions(checkWin(computer), computer);
    if (endGame == true) return;
}

function checkWin (player) {
    let playerMapBitMask = 0;
    console.log("playerMapBitMask: " + playerMapBitMask);
    for (let i = 0; i < mapBoard.length; i++) {
        playerMapBitMask <<= 1;
        console.log("playerMapBitMask: " + playerMapBitMask);
        if (mapBoard[i] == player){
            playerMapBitMask += 1;
            console.log("playerMapBitMask: " + playerMapBitMask);
        }
    }

    for (let i = 0; i < winPatterns.length; i++) {
        if ((playerMapBitMask & winPatterns[i]) == winPatterns[i]) {
            console.log("win Patterns: " + winPatterns[i]);
            return winPatterns[i];
        }
    }

    return 0;
}

function winConditions(winCheck,currentPlayer) {

    if (winCheck != empty) {
        endGame = true;
        msg.textContent = ((currentPlayer == X)? ' X': ' O') + '  Won';
    } else if (mapBoard.indexOf(empty) == O) {
        endGame = true;
        msg.textContent = 'Tie';
    }

    return;
}

function popUpMsg() {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Try another box!',
      })
}
//example commentc