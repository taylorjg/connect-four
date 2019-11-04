const readline = require('readline')
const { Board } = require('.')
const { findBestMove } = require('../minimax')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const getHumanMove = async () => {
  for (; ;) {
    try {
      return await new Promise((resolve, reject) => {
        rl.question('Enter a column number 0-6: ', answer => {
          const n = parseInt(answer, 10)
          if (Number.isInteger(n) && n >= 0 && n <= 6) {
            resolve(n)
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

const main = async () => {

  let board = new Board()
  board.draw()

  try {
    for (; ;) {
      const humanMove = await getHumanMove()
      console.log(`humanMove: ${humanMove}`)
      board = board.makeMove(humanMove)
      board.draw()
      if (board.isWin) {
        console.log('Human wins!')
        break
      }
      if (board.isDraw) {
        console.log('Draw!')
        break
      }
      const computerMove = findBestMove(board, 5)
      console.log(`computerMove: ${computerMove}`)
      board = board.makeMove(computerMove)
      board.draw()
      if (board.isWin) {
        console.log('Computer wins!')
        break
      }
      if (board.isDraw) {
        console.log('Draw!')
        break
      }
    }
  } finally {
    rl.close()
  }
}

main()
