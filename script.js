const maze = document.querySelector('.maze');

const player = document.createElement('div');
player.classList.add('player');

const ganon = document.createElement('div');
ganon.classList.add('ganon');

const princess = document.createElement('div');
princess.classList.add('princess')

const triforce = document.createElement('div')
triforce.classList.add('triforce')

const openingDiv = document.querySelector('.opening')
const mazeDiv = document.querySelector('.mazeDiv')

const startGame = document.querySelector('.menu__start')

let hasTriforce = false;
let start = [0, 0];
let playerPosition = [];
let ganonPosition = [];
let gameLevel = 1;

const maps = {
    1: [
    "BBBBBBBBBB",
    "S B      B",
    "B B BBBB B",
    "B B B    B",
    "B B B BBBB",
    "B B B    F",
    "B   BBBB B",
    "BBBBBBBBBB",
    ],
    2: [

    ],
    3: [
        "BBWBBBLBBBBBWWBBBBBWB",
        "B   B     B     L B B",
        "L B B BBW BBWBB W B B",
        "B B B  TW     B B   B",
        "W BWBBLBB B LBB B B L",
        "B         B     B B B",
        "B BBL BBBBB BBBLB B B",
        "B B   B   W B     W B",
        "W BBBBB B B B BBB B P",
        "S  G  B B B B B B BLB",
        "WBBBB B B B W B L B B",
        "B     W B B   B B B B",
        "B WBBBBBW BWBBB B B W",
        "B       W       B   W",
        "WLBBBWBBBBBLBBLBBWBBB",
    ]
};



const showSection = (section) => {
    section.classList.remove('none');
    setTimeout( () => {
        section.classList.remove('hidden')
    }, 100)
}

const hideSection = (section) => {
    section.classList.add('hidden')
    setTimeout( () => {
        section.classList.remove('none')
    }, 400)
}

const classes =  {
    'W': 'wall',
    ' ': 'road',
    'S': 'road',
    'F': 'road',
    'G': 'road',
    'H': 'hole',
    'B': 'bush',
    'L': 'log',
    'P': 'road',
    'T': 'road'
}

const playerInitialPosition = () => {
    let startingLine = maze.childNodes[start[1]];
    let startingCell = startingLine.childNodes[start[0]];    

    startingCell.appendChild(player);

    playerPosition = start;
}

const cellGenerator = (line, cell, level) => {
    let cellDiv = document.createElement('div');
    let cellContent = maps[level][line][cell];

    cellDiv.classList.add(classes[cellContent], 'cell');

    if (cellContent === 'G') {
        cellDiv.appendChild(ganon)
        ganonPosition = [cell, line]
    }
    if (cellContent === 'S') {
        start = [cell, line]
    }
    if (cellContent === 'P') {
        cellDiv.appendChild(princess)
    }
    if (cellContent === 'T') {
        cellDiv.appendChild(triforce)
    }
    return cellDiv
};

const generateMaze = (level) => {
    for (let line = 0; line < maps[level].length; line++){
        let lineDiv = document.createElement('div');

        lineDiv.classList.add('line')
        
        for (let cell = 0; cell < maps[level][line].length; cell++) {
            
            lineDiv.appendChild(cellGenerator(line, cell, level));
        };

        maze.appendChild(lineDiv)
    };
    playerInitialPosition()
}

const movePlayer = (line, column) => {
    const divToMoveTo = maze.childNodes[line].childNodes[column];

    divToMoveTo.appendChild(player);
    playerPosition = [column, line];
};

const getTriforce = (direction) => {
    hasTriforce = true

    triforce.remove();
    player.classList.add('link-triforce');
    player.style.backgroundImage = 'url(assets/sprites/movement/link-triforce.png)'

    document.removeEventListener('keydown', moveCapture)

    setTimeout(() => {
        player.classList.remove('link-triforce');
        player.style.backgroundImage = `url(assets/sprites/movement/link-${direction}.png)`

        document.addEventListener('keydown', moveCapture)

    }, 1500)
}

const ganonDeath = (level) => {
    ganon.style.backgroundImage = 'url(assets/sprites/ganon-damaged.png)'
    ganon.classList.add('ganon-death', 'death')
    setTimeout( () => {
        ganon.remove()
        maps[level][ganonPosition[1]] = maps[level][ganonPosition[1]].replace('G', ' ')
    }, 1250)
}

const movementAnimation = (direction) => {
    player.style.backgroundImage = `url(assets/sprites/movement/link-${direction}.png)`
    player.classList.add(`slide${direction}`);
    setTimeout(() => {
        player.classList.remove(`slide${direction}`)}
        , 40);
}


const movementAction = (level,lineToMoveTo, cellToMoveTo, movementDirection) => {
    const cellContent = maps[level][lineToMoveTo][cellToMoveTo]; 

    if (cellContent === ' ') {
        movePlayer(lineToMoveTo, cellToMoveTo)
        movementAnimation(movementDirection)
    }
    if (cellContent === 'F') {
        console.log('Next Level!')
    }
    if (cellContent === 'T') {
        movePlayer(lineToMoveTo, cellToMoveTo);
        movementAnimation(movementDirection)
        getTriforce(movementDirection)
    }
    if (cellContent === 'H') {
        console.log('You died!')
    }
    if (cellContent === 'P') {
        console.log('You saved the princess!')
    }
    if (cellContent === 'G' && !hasTriforce) {
        console.log("You can't defeat Ganon without the triforce!!")
    }
    if (cellContent === 'G' && hasTriforce) {
        ganonDeath()
    }
}

class Moves {
    ArrowDown()  {
        const lineToMoveTo = playerPosition[1] + 1;
        const cellToMoveTo = playerPosition[0]; 

        movementAction(gameLevel,lineToMoveTo, cellToMoveTo, 'Down')
    }
    ArrowUp(){
        const lineToMoveTo = playerPosition[1] - 1;
        const cellToMoveTo = playerPosition[0];

        movementAction(gameLevel,lineToMoveTo, cellToMoveTo, 'Up')
    }
    ArrowRight(){
        const lineToMoveTo = playerPosition[1];
        const cellToMoveTo = playerPosition[0] + 1;
        
        movementAction(gameLevel,lineToMoveTo, cellToMoveTo, 'Right')
    }
    ArrowLeft(){
        const lineToMoveTo = playerPosition[1];
        const cellToMoveTo = playerPosition[0] - 1; 

        movementAction(gameLevel,lineToMoveTo, cellToMoveTo, 'Left')
    }    
}

const moveCapture = (evt) => {
    const keyPressed =  evt.key;
    const movement = new Moves;
    setTimeout(movement[keyPressed](),150);
}

document.addEventListener('keydown', moveCapture)