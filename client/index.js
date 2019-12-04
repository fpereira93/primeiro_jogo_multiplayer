
const screen = document.getElementById('screen')

const context = screen.getContext('2d')

function createGame(){
    const state = {
        players: {},
        fruits: {}
    }

    const keyPressAction = {
        'ArrowUp': (player) => {
            if (player.y > 0){
                player.y -= 1;
            }
        },
        'ArrowDown': (player) => {
            if (player.y < screen.height - 1){
                player.y += 1;
            }
        },
        'ArrowRight': (player) => {
            if (player.x < screen.width - 1){
                player.x += 1;
            }
        },
        'ArrowLeft': (player) => {
            if (player.x > 0){
                player.x -= 1;
            }
        },
    }

    function addPlayer(command){
        state.players[command.playerId] = {
            x: command.playerX,
            y: command.playerY,
            color: 'black'
        }
    }

    function removePlayer(command){
        delete state.players[command.playerId]
    }

    function addFruit(command){
        state.fruits[command.fruitId] = {
            x: command.fruitX,
            y: command.fruitY,
            color: 'green'
        }
    }

    function removeFruit(command){
        delete state.fruits[command.fruitId]
    }

    function checkCollisionFruits(){
        console.log(`Check collision player fruits `);

        for (const playerId in state.players){
            const player = state.players[playerId];

            for (const fruitId in state.fruits){
                const fruit = state.fruits[fruitId];

                console.log(`Check Player ${playerId} with Fruit ${fruitId}`);

                if (player.x === fruit.x && player.y === fruit.y){
                    removeFruit({ fruitId: fruitId })
                }
            }
        }
    }

    function movePlayer(command){
        const action = keyPressAction[command.keyPressed]
        const player = state.players[command.playerId]

        if (action && player){
            action(state.players[command.playerId]);
            checkCollisionFruits();
        }
    }

    return {
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer,
        state
    }
}

const createKeyboardListener = function(){
    const state = {
        observers: []
    }

    function subscribe(observerFunction){
        state.observers.push(observerFunction)
    }

    function notifyAll(command){
        state.observers.forEach((observerFunction) => {
            observerFunction(command)
        })
    }

    document.addEventListener('keydown', (event) => {
        const keyPressed = event.key;

        const command = {
            playerId: 'player1',
            keyPressed,
        }

        notifyAll(command)
    })

    return {
        subscribe
    }
}

const game = createGame()
const keyBoardListener = createKeyboardListener();

keyBoardListener.subscribe(game.movePlayer)

function clearScreen(){
    context.fillStyle = 'white'
    context.clearRect(0, 0, 10, 10)
}

function fillSquares(squares){
    squares.forEach((square) => {
        context.fillStyle = square.color
        context.fillRect(square.x, square.y, 1, 1)
    })
}

function toArray(objects){
    return Object.keys(objects).map(i => objects[i])
}

function renderScreen(){
    clearScreen()
    fillSquares(toArray(game.state.players).concat(toArray(game.state.fruits)))
    requestAnimationFrame(renderScreen)
}
renderScreen();
