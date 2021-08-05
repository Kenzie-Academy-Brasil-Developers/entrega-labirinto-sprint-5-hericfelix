const maze = document.querySelector('.maze');
const player = document.createElement('div');
player.classList.add('player')
const map = [
    "WWWWWWWWWWWWWWWWWWWWW",
    "W   W     W     W W W",
    "W W W WWW WWWWW W W W",
    "W W W   W     W W   W",
    "W WWWWWWW W WWW W W W",
    "W         W     W W W",
    "W WWW WWWWW WWWWW W W",
    "W W   W   W W     W W",
    "W WWWWW W W W WWW W F",
    "S     W W W W W W WWW",
    "WWWWW W W W W W W W W",
    "W     W W W   W W W W",
    "W WWWWWWW WWWWW W W W",
    "W       W       W   W",
    "WWWWWWWWWWWWWWWWWWWWW",
];


const classes =  {
    'W': 'wall',
    ' ': 'road',
    'S': 'start',
    'F': 'finish',
    'G': 'gannon',
    'H': 'hole'
}

let start = [0, 0];
let finish = [0, 0];
let playerPosition = [];

const positionPlayer = () => {
    let startingLine = maze.childNodes[start[1]];
    let startingCell = startingLine.childNodes[start[0]];    

    startingCell.appendChild(player);

    playerPosition = start;
}

const generateMaze = () => {
    for (let line = 0; line < map.length; line++){
        let lineDiv = document.createElement('div');

        lineDiv.classList.add('line')
        
        for (let cell = 0; cell < map[line].length; cell++) {
            let cellDiv = document.createElement('div');
            let cellContent = map[line][cell];

            cellDiv.classList.add(classes[cellContent], 'cell');
            lineDiv.appendChild(cellDiv);

            if (cellContent === 'S') {
                start = [cell, line]
            }
            if (cellContent === 'F') {
                finish = [cell, line]
            }
        };

        maze.appendChild(lineDiv)
    };
    positionPlayer()
};



const movePlayer = (line, column) => {
    const divToMoveTo = maze.childNodes[line].childNodes[column];

    divToMoveTo.appendChild(player)
    playerPosition = [column, line]
}
const winningCondition = () => {
    if (playerPosition.join(',') === finish.join(',')) {
        console.log('youWon')
    }
}
const moves = {
    ArrowDown: () => {
        const lineToMoveTo = playerPosition[1] + 1;
        const cellToMoveTo = playerPosition[0];
        const cellContent = map[lineToMoveTo][cellToMoveTo]; 

        if (cellContent === ' ' || cellContent === 'F'){
            movePlayer(lineToMoveTo,cellToMoveTo)
 
        }
    },
    ArrowUp: () => {
        const lineToMoveTo = playerPosition[1] - 1;
        const cellToMoveTo = playerPosition[0];
        const cellContent = map[lineToMoveTo][cellToMoveTo]; 

        if (cellContent === ' ' || cellContent === 'F'){
            movePlayer(lineToMoveTo,cellToMoveTo)
 
        }
    },
    ArrowRight: () => {
        const lineToMoveTo = playerPosition[1];
        const cellToMoveTo = playerPosition[0] + 1;
        const cellContent = map[lineToMoveTo][cellToMoveTo]; 

        if (cellContent === ' ' || cellContent === 'F'){
            movePlayer(lineToMoveTo,cellToMoveTo)
 
        }
    },
    ArrowLeft: () => {
        const lineToMoveTo = playerPosition[1];
        const cellToMoveTo = playerPosition[0] - 1;
        const cellContent = map[lineToMoveTo][cellToMoveTo]; 

        if (cellContent === ' ' || cellContent === 'F'){
            movePlayer(lineToMoveTo,cellToMoveTo)
 
        }
    }
        
}
document.addEventListener('keydown', moveCapture = (evt) => {
    const keyPressed =  evt.key;
    moves[keyPressed]();
    winningCondition();
})