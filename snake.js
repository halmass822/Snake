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
            console.log(digitize(j + 1) + digitize(inputHeight - i));
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
var headPosition;
var bodySegmentsPositions = [];
var foodPosition;
var gridDimensions;

//main functions

    //input key, returns vector
    function pickDirection(inputKey) {
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
        return proposedVector;
    }

    //checks if position is out of bounds or filled
    function checkPosition(inputCoordinate) {
        if( filledTiles.includes(inputCoordinate) || getXCoord(inputCoordinate) < 1 || getXCoord(inputCoordinate) > gridDimensions[1] || getYCoord(inputCoordinate) < 1 || getYCoord(inputCoordinate) > gridDimensions[1] ) {
            return null;
        } else {
            return inputCoordinate;
        }
    }


    //moves the head
    function moveSnake(inputVector) {
        let currentXCoord = getXCoord(headPosition);
        let currentYCoord = getYCoord(headPosition);
        let proposedHeadPosition = digitize(currentXCoord + inputVector[0]) + digitize(currentYCoord + inputVector[1]);
        if (bodySegmentsPositions.includes(proposedHeadPosition)) {
            proposedHeadPosition = digitize(currentXCoord + currentVector[0]) + digitize(currentYCoord + currentVector[1]);
        }
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
        let newFoodPosition;
        do {
            newFoodPosition = digitize(Math.floor(Math.random() * (gridDimensions[0] + 0.999))) + digitize(Math.floor(Math.random() * (gridDimensions[1] + 0.999)))            
        } while (filledTiles.includes(newFoodPosition));
        foodPosition = newFoodPosition;
        document.getElementById(foodPosition).style.backgroundColor = "blue";
    }

    //function to start/stop the movement of the snake
    //uses a global variable to store the state
    var movingSnake;
    function setSnakeMovement(inputBool) {
        if(inputBool) {
            movingSnake = setInterval(moveSnake, 500);
        } else {
            clearInterval(movingSnake);
        }
    }
    
    //stops the snake's movement, displays the appropriate overlay
    function gameOver() {
        setSnakeMovement(false);
        document.getElementById("GameOverOverlay").hidden = "false";
    }

    function victory() {
        setSnakeMovement(false);
        document.getElementById("winnerOverlay").hidden="false";
    }

    function startGame() {
        document.getElementById(startGameOverlay).hidden = "true";
        document.getElementById(winnerOverlay).hidden = "true";
        document.getElementById(GameOverOverlay).hidden = "true";
        bodySegmentsPositions = [];
        filledTiles = [];
        gridTiles.forEach((x) => emptyTile(x));
        currentVector = [1,0];
        headPosition = `03` + digitize(Math.floor(gridDimensions[1]/2));
        getNewFoodPosition();
        setSnakeMovement(true);
    }

//generating grid

generatedGrid = createGrid(10,10);
document.getElementById("gridContainer").appendChild(generatedGrid[0]);
generatedTiles = generatedGrid[1];

//event listeners
document.getElementById("startGameButton").addEventListener('click', startGame());
document.getElementById("RestartGame").addEventListener('click', startGame());
document.getElementById("winRestartGame").addEventListener('click', startGame());