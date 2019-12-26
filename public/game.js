export default function createGame(){
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    }

    const observers = []

    function start(){
        const frequency = 2000

        setInterval(addFruit, frequency)
    }

    function subscribe(observerFunction){
        observers.push(observerFunction)
    }

    function notifyAll(command){
        observers.forEach((observerFunction) => {
            observerFunction(command)
        })
    }

    function setState(newState){
        Object.assign(state, newState)
    }

    const keyPressAction = {
        'ArrowUp': (player) => {
            if (player.y > 0){
                player.y -= 1;
            }
        },
        'ArrowDown': (player) => {
            if (player.y < state.screen.height - 1){
                player.y += 1;
            }
        },
        'ArrowRight': (player) => {
            if (player.x < state.screen.width - 1){
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
        const playerId = command.playerId
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = {
            x: playerX,
            y: playerY,
            color: 'black'
        }

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY: playerY,
        })
    }

    function removePlayer(command){
        const playerId = command.playerId

        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            playerId: playerId,
        })
    }

    function addFruit(command){
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 1000000)
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY,
            color: 'green'
        }

        notifyAll({
            type: 'add-fruit',
            fruitId: fruitId,
            fruitX: fruitX,
            fruitY: fruitY,
        })
    }

    function removeFruit(command){
        const fruitId = command.fruitId

        delete state.fruits[fruitId]

        notifyAll({
            type: 'remove-fruit',
            fruitId: fruitId
        })
    }

    function checkCollisionFruits(player){
        for (const fruitId in state.fruits){
            const fruit = state.fruits[fruitId];

            if (player.x === fruit.x && player.y === fruit.y){
                removeFruit({ fruitId: fruitId })
            }
        }
    }

    function movePlayer(command){
        notifyAll(command)

        const action = keyPressAction[command.keyPressed]
        const player = state.players[command.playerId]

        if (action && player){
            action(state.players[command.playerId]);
            checkCollisionFruits(player);
        }
    }

    return {
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer,
        state,
        setState,
        subscribe,
        start
    }
}