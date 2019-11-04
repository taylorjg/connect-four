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
      process.stdout.write('Enter a column number 0-6: ')
      return await new Promise((resolve, reject) => {
        const onLine = line => {
          rl.off('line', onLine)
          const col = parseInt(line, 10)
          if (Number.isInteger(col) && col >= 0 && col <= 6) {
            resolve(col)
          } else {
            reject()
          }
        }
        rl.on('line', onLine)
      })
    } catch (_) {
      process.stdout.write('Please try again\n')
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
      const computerMove = findBestMove(board, 3)
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
