import registerPromiseWorker from 'promise-worker/register'
import { Board } from '../logic'
import { findBestMove } from '../minimax'

let board = new Board()

const getBoardState = () => ({
  grid: board.grid,
  isWin: board.isWin,
  isDraw: board.isDraw,
  legalMoves: board.legalMoves()
})

const processMessage = message => {
  switch (message.type) {

    case 'resetBoardState':
      board = new Board()
      return getBoardState()

    case 'getBoardState':
      return getBoardState()

    case 'makeHumanMove':
      {
        board = board.makeMove(message.move)
        return {
          lastMove: message.move,
          ...getBoardState()
        }
      }

    case 'makeComputerMove':
      {
        const move = findBestMove(board, message.maxDepth)
        board = board.makeMove(move)
        return {
          lastMove: move,
          ...getBoardState()
        }
      }

    default:
      return `Unknown message.type, "${message.type}".`
  }
}

registerPromiseWorker(message => {
  console.log(`[web-worker] message: ${JSON.stringify(message)}`)
  const result = processMessage(message)
  console.log(`[web-worker] result: ${JSON.stringify(result)}`)
  return result
})
