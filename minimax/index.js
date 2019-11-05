class PieceBase {
  get opposite() {
    throw new Error('[PieceBase#opposite] abstract property!')
  }
}

class BoardBase {

  get turn() {
    throw new Error('[BoardBase#turn] abstract property!')
  }

  get isWin() {
    throw new Error('[BoardBase#isWin] abstract property!')
  }

  get isDraw() {
    return !this.isWin && !this.legalMoves().length
  }

  legalMoves() {
    throw new Error('[BoardBase#legalMoves] abstract method!')
  }

  makeMove() {
    throw new Error('[BoardBase#makeMove] abstract method!')
  }

  evaluate() {
    throw new Error('[BoardBase#evaluate] abstract method!')
  }
}

const minimax = (board, maximising, originalPlayer, maxDepth) => {
  if (board.isWin || board.isDraw || maxDepth === 0) {
    return board.evaluate(originalPlayer)
  }
  if (maximising) {
    const op = (acc, move) => {
      const score = minimax(board.makeMove(move), false, originalPlayer, maxDepth - 1)
      return Math.max(acc, score)
    }
    return board.legalMoves().reduce(op, Number.MIN_SAFE_INTEGER)
  } else {
    const op = (acc, move) => {
      const score = minimax(board.makeMove(move), true, originalPlayer, maxDepth - 1)
      return Math.min(acc, score)
    }
    return board.legalMoves().reduce(op, Number.MAX_SAFE_INTEGER)
  }
}

const findBestMove = (board, maxDepth) => {
  const seed = { score: Number.MIN_SAFE_INTEGER }
  const op = (acc, move) => {
    const score = minimax(board.makeMove(move), true, board.turn, maxDepth)
    return score > acc.score
      ? { score, move }
      : acc
  }
  const { move } = board.legalMoves().reduce(op, seed)
  return move
}

module.exports = {
  PieceBase,
  BoardBase,
  findBestMove
}
