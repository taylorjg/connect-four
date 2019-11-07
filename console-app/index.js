const readline = require('readline')
const { Board } = require('../logic')
const { findBestMove } = require('../minimax')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const getHumanMove = async () => {
  for (; ;) {
    try {
      return await new Promise((resolve, reject) => {
        rl.question('Enter a column number 1-7: ', answer => {
          const n = parseInt(answer, 10)
          if (Number.isInteger(n) && n >= 1 && n <= 7) {
            resolve(n - 1)
          } else {
            reject()
          }
        })
      })
    } catch (_) {
      // ignore
    }
  }
}

const drawBoard = board => {
  console.log()
  board.draw()
  console.log()
}

const HUMAN_PLAYER = Symbol('HUMAN_PLAYER')
const COMPUTER_PLAYER = Symbol('HUMAN_PLAYER')

const gameOver = (board, player) => {

  if (board.isWin) {
    const playerName = player === HUMAN_PLAYER ? 'Human' : 'Computer'
    console.log(`${playerName} wins!`)
    return true
  }

  if (board.isDraw) {
    console.log('Draw!')
    return true
  }

  return false
}

const makeHumanMove = async board => {
  const humanMove = await getHumanMove()
  console.log(`humanMove: ${humanMove}`)
  const updatedBoard = board.makeMove(humanMove)
  drawBoard(updatedBoard)
  return updatedBoard
}

const makeComputerMove = board => {
  const computerMove = findBestMove(board, 3)
  console.log(`computerMove: ${computerMove}`)
  const updatedBoard = board.makeMove(computerMove)
  drawBoard(updatedBoard)
  return updatedBoard
}

const main = async () => {

  let board = new Board()
  drawBoard(board)

  try {
    for (; ;) {
      board = await makeHumanMove(board)
      if (gameOver(board, HUMAN_PLAYER)) break
      board = makeComputerMove(board)
      if (gameOver(board, COMPUTER_PLAYER)) break
    }
  } finally {
    rl.close()
  }
}

main()
