
const screen = document.getElementById('screen')

const context = screen.getContext('2d')

const state = {
    players: [
        { x: 1, y: 1, color: 'black'},
        { x: 9, y: 9, color: 'black'},
    ],
    fruits: [
        { x: 3, y: 1, color: 'green'},
    ]
}

function createGame(){
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

    function movePlayer(command){
        const action = keyPressAction[command.keyPressed]

        if (action){
            action(state.players[command.playerIndex]);
            console.log(`Moving player index ${command.playerIndex} width ${command.keyPressed}`);
        }
    }

    return {
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
        console.log(`Notifying ${state.observers.length} observers`)

        state.observers.forEach((observerFunction) => {
            observerFunction(command)
        })
    }

    document.addEventListener('keydown', (event) => {
        const keyPressed = event.key;

        const command = {
            playerIndex: 0,
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

function renderScreen(){
    clearScreen()
    fillSquares(game.state.players.concat(game.state.fruits))
    requestAnimationFrame(renderScreen)
}
renderScreen();
