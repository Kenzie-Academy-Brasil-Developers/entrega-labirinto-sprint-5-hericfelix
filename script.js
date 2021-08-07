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
openingDiv.classList.remove('opening-animation')

const mazeDiv = document.querySelector('.mazeDiv')

const msgDiv = document.querySelector('.msgs')
const msgsParagraph = document.getElementById('msgsText')

const startGame = document.querySelector('.menu__start')

const victoryScreen = document.querySelector('.victory')

const backToMenu = document.getElementById('backToMenu')

const audioPlayButton = document.querySelector('.audio > img')

const music = new Audio('assets/audio/intro-hyruleMainTheme.ogg');

const playSong = () => {
    if (songPlaying){
    music.pause()
    songPlaying = false
    audioPlayButton.src = 'assets/audio/play.png'
    } else {
        music.src = 'assets/audio/intro-hyruleMainTheme.ogg'
        music.play();
        songPlaying = true
        audioPlayButton.src = 'assets/audio/pause.png'
        setTimeout(() => {
            music.src = 'assets/audio/hyrule-theme.ogg';
            music.play()
            music.loop = true
        }, 7173)
    }
}
let songPlaying = false;
let hasTriforce = false;
let start = [0, 0];
let playerPosition = [];
let ganonPosition = [];
let gameLevel = 1;
let listener = false;

const maps = {
    1: [
        "BWBBLBBWBB",
        "S B      B",
        "B B BBBW B",
        "L B B    B",
        "B B B BBWB",
        "B W B    B",
        "B   BLLB F",
        "BBLBBBBBBW"
    ],
    2: [
        "BBBBWBBBBBBBWBB",
        "B             B",
        "LHBBBL LBBBBB B",
        "BBB         B B",
        "B WBBB BBBB B L",
        "B B       BBW B",
        "B BBBBWBB B   B",
        "B B     B B B B",
        "L B B B L B WHB",
        "B BHB B B B B B",
        "B   B B   B B B",
        "BBBBL B B B   B",
        "S  H  B BBLBB F",
        "B     B  H  W B",
        "BBBWBBBBBLBBBBB"
    ],
    3: [
        "BBWBBBLBBBBBWWBBBBBWB",
        "B   B     B     L B B",
        "L B BHBBW BBWBB WHB B",
        "B B B   W    HB B   B",
        "W BWBBLBB B LBB B B L",
        "B         B     B B B",
        "B BBL BBBBB BBBLB B B",
        "B B H B   W B  G  W B",
        "W BBBBB B B B BBB B P",
        "S     B B B B B B BLB",
        "WBBBB B B B W B L B B",
        "B     WTB B   B B B B",
        "B WBBBBBW BWBBB B B W",
        "B          H    B   W",
        "WLBBBWBBBBBLBBLBBWBBB"
    ]
};

const cellClasses =  {
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

const messages = {
    'intro': "Use the arrow keys to make your way through the maze and find princess Zelda!",
    'next': "You're one step closer to finding her!",
    'hole': "You fell into the hole. Try again!",
    'ganon': "You can't face Ganon with the power you have now."
}

const showSection = (section) => {
    section.classList.remove('none');
    setTimeout( () => {
        section.classList.remove('hidden')
    }, 100)
}

const hideSection = (section) => {
    section.classList.add('hidden')
    setTimeout( () => {
        section.classList.add('none')
    }, 800)
}

const toggleKeyboardListener = () => {
    if (listener === false) {
        document.addEventListener('keydown', moveCapture)
    }
    if (listener === true) {
        document.removeEventListener('keydown', moveCapture)
    }
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

    cellDiv.classList.add(cellClasses[cellContent], 'cell');

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
    maze.innerHTML = "";
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

    let triforceSound = new Audio('assets/audio/secret.ogg')
    
    triforceSound.play()
    if (songPlaying) {
        music.pause()
        setTimeout(() => {music.play()}, 1800)
    }
    
    triforce.remove();
    player.classList.add('link-triforce');
    player.style.backgroundImage = 'url(assets/sprites/movement/link-triforce.png)'

    document.removeEventListener('keydown', moveCapture)

    setTimeout(() => {
        player.classList.remove('link-triforce');
        player.style.backgroundImage = `url(assets/sprites/movement/link-${direction}.png)`

        document.addEventListener('keydown', moveCapture)

    }, 2500)
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
        , 45);
}


const movementAction = (level,lineToMoveTo, cellToMoveTo, movementDirection) => {
    const cellContent = maps[level][lineToMoveTo][cellToMoveTo]; 

    if (cellContent === ' ') {
        movePlayer(lineToMoveTo, cellToMoveTo)
        movementAnimation(movementDirection)
    }
    if (cellContent === 'F') {
        movePlayer(lineToMoveTo, cellToMoveTo)
        movementAnimation(movementDirection)
        nextLevel()
        showMsg('next')
    }
    if (cellContent === 'T') {
        movePlayer(lineToMoveTo, cellToMoveTo);
        movementAnimation(movementDirection)
        getTriforce(movementDirection)
    }
    if (cellContent === 'H') {
        showMsg('hole')

        playerInitialPosition()
    }
    if (cellContent === 'P') {
        victory()
    }
    if (cellContent === 'G' && !hasTriforce) {
        showMsg('ganon')
    }
    if (cellContent === 'G' && hasTriforce) {
        ganonDeath(gameLevel)
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

const nextLevel = () => {
    gameLevel++;
    hideSection(mazeDiv);
    toggleKeyboardListener();
    setTimeout(() => {
        generateMaze(gameLevel)
        showSection(mazeDiv);
        toggleKeyboardListener();
    }, 1210);
};

const showMsg = (msg) => {
    if (msg === 'intro') {
        showSection(msgDiv)
        msgsParagraph.innerText = messages[msg];
        setTimeout(() => {
            hideSection(msgDiv)
        }, 5000)
    } else {
        showSection(msgDiv)
        msgsParagraph.innerText = messages[msg];
        setTimeout(() => {
            hideSection(msgDiv)
        }, 2500)
    }
}

const victory = () => {
    hideSection(mazeDiv);
    showSection(victoryScreen)
}

startGame.addEventListener('click', () => {
    if (!songPlaying){
        playSong()
    }
    gameLevel = 1
    generateMaze(gameLevel)
    toggleKeyboardListener();
    hideSection(openingDiv);
    showSection(mazeDiv);
    showMsg('intro')
})

backToMenu.addEventListener('click', () => {
    hideSection(victoryScreen)
    showSection(openingDiv)
})

audioPlayButton.addEventListener('click', playSong)
