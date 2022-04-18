//helper functions
    //changes single digit strings or numbers to 2 digit strings, i.e '9' to '09'
    function digitize(input) {
        if(typeof input !== "number" && typeof input !== "string") {
            throw `error at digitize() - invalid format`
        }
        input = input.toString()
        if(input.length == 1) {
            return `0${input}`;
        } else if(input.length == 2) {
            return input;
        } else {
            throw `error at digitize() - too many digits`
        }
    }

    function fillTile(targetId) {
        targetElement = document.getElementById(targetId);
        if(!filledTiles.includes(targetId)){
            filledTiles.push(targetId);
        }
        targetElement.style.backgroundColor = '#A9A9A9';
    }

    function emptyTile(targetId) {
        targetElement = document.getElementById(targetId);
        targetElement.style.backgroundColor = 'white';
        let targetIndex = filledTiles.findIndex((x) => x === targetId);
        if(targetIndex >= 0){
            filledTiles.splice(targetIndex,1);
        }
    }

    function changeToGrey(target) {
        target = document.getElementById(target)
        target.style.backgroundColor = "#A9A9A9";
    }

    function changeToWhite(target) {
        target = document.getElementById(target)
        target.style.backgroundColor = "white";
    }

    function getXCoord(inputCoordinate) {
        return Number(inputCoordinate.slice(0,2));
    }

    function getYCoord(inputCoordinate) {
        return Number(inputCoordinate.slice(2,4));
    }

//create a grid with a representative element IDs for each coordinate, maximum is 99 x 99
//returns an array with the grid as an HTML collection and an array of all generated tile IDs
function createGrid(inputWidth,inputHeight) {
    let generatedTiles = [];
    let outputGrid = document.createElement('div');
    outputGrid.className = 'grid';
    for(i = 0 ; i < inputHeight ; i++) {
        outputRow = document.createElement('div');
        outputRow.className = 'gridRow';
        for(j = 0 ; j < inputWidth ; j++) {
            let outputTile = document.createElement('p');
            let tileCoordinate = digitize(j + 1) + digitize(inputHeight - i)
            outputTile.className = 'gridTile';
            outputTile.id = tileCoordinate;
            outputRow.appendChild(outputTile);
            generatedTiles.push(tileCoordinate);
        }
        outputGrid.appendChild(outputRow);
    }
    return [outputGrid,generatedTiles];
}

//global variables
var gridTiles = [];
var filledTiles = [];
var currentVector = [];
var headPosition = '0505';
var bodySegmentsPositions = [];
var foodPosition = '0505';
var gridDimensions = [];
var movementAllowed = false;

//main functions

    //input key, returns vector
    function changeDirection(inputKey) {
        if(movementAllowed) {
            let proposedVector;
            switch(inputKey){
                case 'a':
                    proposedVector = [-1,0];
                break;
                case 's':
                    proposedVector = [0,-1];
                break;
                case 'd':
                    proposedVector = [1,0];
                break;
                case 'w':
                    proposedVector = [0,1];
                break;
                default:
                    console.log(`input ${inputKey} ignored`);
                    proposedVector = null;
                break;
            }
            let currentXCoord = getXCoord(headPosition);
            let currentYCoord = getYCoord(headPosition);
            proposedHeadPosition = digitize(currentXCoord + proposedVector[0]) + digitize(currentYCoord + proposedVector[1]);
            console.log(proposedHeadPosition);
            console.log(bodySegmentsPositions[bodySegmentsPositions.length - 1]);
            if(proposedHeadPosition === bodySegmentsPositions[bodySegmentsPositions.length - 1]) {
                console.log(`attempting to turn around, input movement ignored`);
            } else {
                currentVector = proposedVector;
                moveSnake();
                setSnakeMovement(false);
                setSnakeMovement(true);
            }
        } else {
            console.log(`movement disallowed, input ignored`)
        }

    }

    //checks if position is out of bounds or filled
    function checkPosition(inputCoordinate) {
        if( filledTiles.includes(inputCoordinate) || getXCoord(inputCoordinate) < 1 || getXCoord(inputCoordinate) > gridDimensions[1] || getYCoord(inputCoordinate) < 1 || getYCoord(inputCoordinate) > gridDimensions[1] ) {
            return null;
        } else {
            return inputCoordinate;
        }
    }

    //moves the head based on the current vector
    function moveSnake() {
        let currentXCoord = getXCoord(headPosition);
        let currentYCoord = getYCoord(headPosition);
        proposedHeadPosition = digitize(currentXCoord + currentVector[0]) + digitize(currentYCoord + currentVector[1]);
        if(checkPosition(proposedHeadPosition)) {
            fillTile(proposedHeadPosition);
            headPosition = proposedHeadPosition;
            bodySegmentsPositions.push(headPosition);
            if(headPosition === foodPosition) {
                getNewFoodPosition();
            } else {
                emptyTile(bodySegmentsPositions[0]);
                bodySegmentsPositions.shift();
            }
            if(bodySegmentsPositions.length === (gridDimensions[0] * gridDimensions[1])) {
                victory();
            }
        } else {
            gameOver();
        }
    }

    //moves the fruit
    function getNewFoodPosition() {
        console.log(`getNewFoodPosition() triggered`)
        let newFoodPosition;
        console.log(gridDimensions);
        do {
            newFoodPosition = digitize(Math.floor(Math.random()*gridDimensions[0]) + 1) + digitize(Math.floor(Math.random()*(gridDimensions[1]) + 1))
            console.log(newFoodPosition);
        } while (filledTiles.includes(newFoodPosition));
        foodPosition = newFoodPosition;
        document.getElementById(foodPosition).style.backgroundColor = "blue";
    }

    //function to start/stop the movement of the snake
    //uses a global variable to store the state
    var movingSnake;
    function setSnakeMovement(inputBool) {
        if(inputBool) {
            movingSnake = setInterval(moveSnake, 300);
        } else {
            clearInterval(movingSnake);
        }
    }
    
    //stops the snake's movement, displays the appropriate overlay
    function gameOver() {
        movementAllowed = false;
        console.log(`gameOver() triggered`);
        setSnakeMovement(false);
        document.getElementById("GameOverOverlay").style.display = "block";
    }

    function victory() {
        movementAllowed = false
        console.log(`victory() triggered`);
        setSnakeMovement(false);
        document.getElementById("winnerOverlay").style.display = "block";
    }

    function startGame() {
        console.log(`startGame() triggered`);
        document.getElementById("startGameOverlay").style.display = "none";
        document.getElementById("winnerOverlay").style.display = "none";
        document.getElementById("GameOverOverlay").style.display = "none";
        gridTiles.forEach((x) => emptyTile(x));
        currentVector = [1,0];
        headPosition = `03` + digitize(Math.floor(gridDimensions[1]/2));
        bodySegmentsPositions = [headPosition];
        filledTiles = [headPosition];
        changeToGrey(headPosition);
        getNewFoodPosition();
        setSnakeMovement(true);
        movementAllowed = true
    }

//generating grid

generatedGrid = createGrid(10,10);
document.getElementById("gridContainer").appendChild(generatedGrid[0]);
gridTiles = generatedGrid[1];
gridDimensions = [10,10];

//event listeners

document.getElementById("startGameButton").addEventListener('click', startGame);
document.getElementById("RestartGame").addEventListener('click', startGame);
document.getElementById("winRestartGame").addEventListener('click', startGame);
document.body.addEventListener('keypress', (event) => changeDirection(event.key));