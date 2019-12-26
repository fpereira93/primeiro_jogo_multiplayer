function clearScreen(context){
    context.fillStyle = 'white'
    context.clearRect(0, 0, 10, 10)
}

function fillSquares(squares, context){
    squares.forEach((square) => {
        context.fillStyle = square.color
        context.fillRect(square.x, square.y, 1, 1)
    })
}

function toArray(objects){
    return Object.keys(objects).map(i => objects[i])
}

export default function renderScreen(game, context, requestAnimationFrame, currentPlayerId){
    clearScreen(context)

    fillSquares(toArray(game.state.players).concat(toArray(game.state.fruits)), context)

    const currentPlayer = game.state.players[currentPlayerId]

    if (currentPlayer){
        context.fillStyle = '#0000FF'
        context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
    }

    requestAnimationFrame(() => {
        renderScreen(game, context, requestAnimationFrame, currentPlayerId)
    })
}