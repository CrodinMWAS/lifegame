const rows = 10
const columns = 30
const playerNumber = 20
// const maxPlayerNumber = rows*columns * 0.5
const maxPlayerNumber = 5
const holeNumber = 20
const maxHoleNumber = rows*columns * 0.1
const gameSpace = document.getElementById("gameSpace")

gameSpace.style.gridTemplateColumns = `repeat(${columns}, 45px)`
gameSpace.style.gridTemplateRows = `repeat(${rows}, 75px)`

playerCounter = 0
holeCounter = 0

playerPositions = []
holePositions = []
tileCounter = 0
for (let i = 0; i != rows; i++) {
    for (let j = 0; j != columns; j++) {
        let tile = document.createElement("div")
        tile.classList.add("tile");
        tile.id = `${i}:${j}`

        chance = Math.random()

        if (chance < 0.20) {
            if (playerCounter <= maxPlayerNumber) {
                let player = document.createElement("div")
                player.classList.add("player")
                player.innerHTML = ++playerCounter;
                tile.appendChild(player);
                tile.classList.add("occupied")
                playerPositions.push([i,j])
            }
        }else if(chance < 0.35){
            if (holeCounter <= maxHoleNumber) {
                let hole = document.createElement("div")
                hole.classList.add("hole");
                holeCounter++
                tile.appendChild(hole);
                tile.classList.add("occupied")
                tile.classList.add("leaky")
                holePositions.push([i,j])
            }
        }

        tile.innerHTML += ++tileCounter;
        gameSpace.appendChild(tile);
    }
}

document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        movePlayers()
    }
})

function movePlayers() {
    for (let i = 0; i != playerPositions.length; i++) {
        console.log(`ALL: ${playerPositions}`)
        console.log(`Selected: ${i}`)
        console.log(`Player: ${playerPositions[i]}`)
        console.log(`All length: ${playerPositions.length}`)
        playerRow = playerPositions[i][0]
        playerColumn = playerPositions[i][1]

        chance = Math.random()

        // Decides whether to add, takeaway from the Column/row
        if (chance < 0.25) {
            // This adds to the column coord.
            newCoord = playerColumn + 1
            // This checks if the newCoord is eligible (it can't move outside the gameSpace)
            if (newCoord <= columns - 1) {
                // This checks if the tile is available. If its true its available. Otherwise not.
                if (checkAvailability([playerRow, newCoord])) {
                    //This checks if the player needs to be removed from the playerPositions. If true, it needs to be removed, 
                    //if not, it updates the position in the array.
                    if (moveIndividualPlayer(playerRow,playerColumn,playerRow,newCoord)) {
                        playerPositions = playerPositions.filter(item => item !== playerPositions[i])
                        i = -1;
                    }else{
                        playerPositions[i][1] = newCoord

                    }
                }
            }
        }else if(chance < 0.50){
            // This takes away from the column coord.
            newCoord = playerColumn - 1
            // This checks if the newCoord is eligible (it can't move outside the gameSpace)
            if (newCoord >= 0) {
                // This checks if the tile is available. If its true its available. Otherwise not.
                if (checkAvailability([playerRow, newCoord])) {
                    //This checks if the player needs to be removed from the playerPositions. If true, it needs to be removed, 
                    //if not, it updates the position in the array.
                    if (moveIndividualPlayer(playerRow,playerColumn,playerRow,newCoord)) {
                        playerPositions = playerPositions.filter(item => item !== playerPositions[i])
                        i = -1;
                    }else{
                        playerPositions[i][1] = newCoord

                    }
                }
            }
        }else if(chance < 0.75){
            // This adds to the row coord.
            newCoord = playerRow + 1
            // This checks if the newCoord is eligible (it can't move outside the gameSpace)
            if (newCoord <= rows - 1) {
                // This checks if the tile is available. If its true its available. Otherwise not.
                if (checkAvailability([newCoord, playerColumn])) {
                    //This checks if the player needs to be removed from the playerPositions. If true, it needs to be removed, 
                    //if not, it updates the position in the array.
                    if (moveIndividualPlayer(playerRow,playerColumn,newCoord,playerColumn)) {
                        playerPositions = playerPositions.filter(item => item !== playerPositions[i])
                        i = -1;
                    }else{
                        playerPositions[i][0] = newCoord

                    }
                }
            }
        }else{
            // This takes away from the row coord.
            newCoord = playerRow - 1
            // This checks if the newCoord is eligible (it can't move outside the gameSpace)
            if (newCoord >= 0) {
                // This checks if the tile is available. If its true its available. Otherwise not.
                if (checkAvailability([newCoord, playerColumn])) {
                    //This checks if the player needs to be removed from the playerPositions. If true, it needs to be removed, 
                    //if not, it updates the position in the array.
                    if (moveIndividualPlayer(playerRow,playerColumn,newCoord,playerColumn)) {
                        playerPositions = playerPositions.filter(item => item !== playerPositions[i])
                        i = -1;
                    }else{
                        playerPositions[i][0] = newCoord

                    }
                }
            }
        }
    }
}


// This function checks the availability of the neighbouring tiles. If its Leaky(has a hole) or its unoccupied it can move there, otherwise not
function checkAvailability(coord) {
    tileToBeLookedAt = document.getElementById(`${coord[0]}:${coord[1]}`)
    if (tileToBeLookedAt.classList.contains("leaky") || !tileToBeLookedAt.classList.contains("occupied")) {
        return true;
    }else{
        return false;
    }
}

// This function moves the player itself. It checks the tile where the player IS located, removes it from there,
// and moves it to the next tile if its not leaky. If its leaky, it simply swallows the player.
function moveIndividualPlayer(initialRow, initialColumn, newRow, newColumn) {
    tileToBeMovedFrom = document.getElementById(`${initialRow}:${initialColumn}`)
    tileToBeMovedFrom.classList.remove("occupied")
    
    playerToBeMoved = tileToBeMovedFrom.children[0]

    tileToBeMovedFrom.children[0].remove()

    tileToBeMovedTo = document.getElementById(`${newRow}:${newColumn}`)
    if (!tileToBeMovedTo.classList.contains("leaky")) {
        tileToBeMovedTo.classList.add("occupied")
        tileToBeMovedTo.appendChild(playerToBeMoved)
        return false;
    }else{
        console.log(`The player ${initialRow}:${initialColumn} has been swallowed by the hole on ${newRow}:${newColumn}`)
        return true;
    }

}

console.log(playerPositions)
console.log(holePositions)
