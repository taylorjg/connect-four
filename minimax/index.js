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
    let bestEval = Number.MIN_SAFE_INTEGER
    // TODO: board.legalMoves().reduce ?
    for (const move of board.legalMoves()) {
      const result = minimax(board.makeMove(move), false, originalPlayer, maxDepth - 1)
      bestEval = Math.max(result, bestEval)
    }
    return bestEval
  } else {
    let worstEval = Number.MAX_SAFE_INTEGER
    // TODO: board.legalMoves().reduce ?
    for (const move of board.legalMoves()) {
      const result = minimax(board.makeMove(move), true, originalPlayer, maxDepth - 1)
      worstEval = Math.min(result, worstEval)
    }
    return worstEval
  }
}

const findBestMove = (board, maxDepth) => {
  let bestEval = Number.MIN_SAFE_INTEGER
  let bestMove = undefined
  // TODO: board.legalMoves().reduce ?
  for (const move of board.legalMoves()) {
    const result = minimax(board.makeMove(move), true, board.turn, maxDepth)
    if (result > bestEval) {
      bestEval = result
      bestMove = move
    }
  }
  return bestMove
}

module.exports = {
  PieceBase,
  BoardBase,
  findBestMove
}
