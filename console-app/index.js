const readline = require('readline')
const { Board } = require('../logic')
const { findBestMove } = require('../minimax')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const getHumanMove = async board => {
  for (; ;) {
    try {
      return await new Promise((resolve, reject) => {
        rl.question('Enter a column number 1-7: ', answer => {
          const n = parseInt(answer, 10)
          if (Number.isInteger(n) && n >= 1 && n <= 7) {
            const col = n - 1
            if (board.legalMoves().includes(col)) {
              resolve(col)
              return
            }
          }
          reject()
        })
      })
    } catch (_) {
      // ignore
    }
  }
}

const ESC = '\x1b'
const RED = `${ESC}[31m`
const YELLOW = `${ESC}[33m`
const RED_REVERSE = `${ESC}[31;7m`
const YELLOW_REVERSE = `${ESC}[33;7m`
const RESET = `${ESC}[0m`

// TODO: add --no-colour command line arg to turn off colours
const colourise = (board, row, col, ch) => {
  const isPartOfWinningLine = () => {
    for (const pos of board.isWin || []) {
      if (row === pos[0] && col === pos[1]) {
        return true
      }
    }
    return false
  }
  const colouriseChar = colour => `${colour}O${RESET}`
  switch (ch) {
    case 'R': return colouriseChar(isPartOfWinningLine() ? RED_REVERSE : RED)
    case 'Y': return colouriseChar(isPartOfWinningLine() ? YELLOW_REVERSE : YELLOW)
    default: return ch
  }
}

const drawBoard = board => {
  console.log()
  const lines = board.boardState.map((line, row) =>
    Array.from(line).map((ch, col) => colourise(board, row, col, ch)).join(' '))
  lines.reverse().forEach(line => console.log(line))
  const columnNumbers = Array.from(board.boardState[0]).map((_, index) => index + 1).join(' ')
  console.log(columnNumbers)
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
  const humanMove = await getHumanMove(board)
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
  try {
    let board = new Board()
    drawBoard(board)
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
