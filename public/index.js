
import createKeyboardListener from './keyboard-listener.js';
import createGame from './game.js';
import renderScreen from './render-screen.js';

const screen = document.getElementById('screen')
const context = screen.getContext('2d')

const game = createGame()
const keyBoardListener = createKeyboardListener(document);
const socket = io()

socket.on('connect', () => {
    const playerId = socket.id
    console.log(`Player connected on client with id: ${playerId}`)

    renderScreen(game, context, requestAnimationFrame, playerId)
})

socket.on('setup', (state) => {
    const playerId = socket.id
    game.setState(state)

    keyBoardListener.registerPlayerId(playerId)
    keyBoardListener.subscribe(game.movePlayer)
    keyBoardListener.subscribe((command) => {
        socket.emit(command.type, command)
    })
})

socket.on('add-player', (command) => {
    console.log(`Player add command type: ${command.type}`)
    game.addPlayer(command)
})

socket.on('remove-player', (command) => {
    console.log(`Player remove command type: ${command.type}`)
    game.removePlayer(command)
})

socket.on('move-player', (command) => {
    console.log(`Player move command type: ${command.type}`)
    
    const playerId =  socket.id

    if (playerId !== command.playerId){
        game.movePlayer(command)
    }
})

socket.on('add-fruit', (command) => {
    console.log(`Fruit add type: ${command.type}`)
    
    game.addFruit(command)
})

socket.on('remove-fruit', (command) => {
    console.log(`Remove fruit type: ${command.type}`)

    game.removeFruit(command)
})