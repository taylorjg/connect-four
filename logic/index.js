const { PieceBase, BoardBase } = require('../minimax')

const range = n => Array.from(Array(n).keys())

class Piece extends PieceBase {

  constructor(piece) {
    super()
    this.piece = piece
  }

  get opposite() {
    switch (this.piece) {
      case "R": return Y
      case "Y": return R
      case "-": return E
    }
    throw new Error(`Unknown piece, "${this.piece}".`)
  }
}

const R = new Piece("R")
const Y = new Piece("Y")
const E = new Piece("-")

const generateSegments = (numRows, numColumns, segmentLength) => {
  const segments = []
  // vertical segments
  for (const c of range(numColumns)) {
    for (const r of range(numRows - segmentLength + 1)) {
      const segment = []
      for (const t of range(segmentLength)) {
        segment.push([r + t, c])
      }
      segments.push(segment)
    }
  }
  // horizontal segments
  for (const c of range(numColumns - segmentLength + 1)) {
    for (const r of range(numRows)) {
      const segment = []
      for (const t of range(segmentLength)) {
        segment.push([r, c + t])
      }
      segments.push(segment)
    }
  }
  // diagonal segments /
  for (const c of range(numColumns - segmentLength + 1)) {
    for (const r of range(numRows - segmentLength + 1)) {
      const segment = []
      for (const t of range(segmentLength)) {
        segment.push([r + t, c + t])
      }
      segments.push(segment)
    }
  }
  // diagonal segments \
  for (const c of range(numColumns - segmentLength + 1)) {
    for (const r of range(numRows - segmentLength + 1)) {
      const segment = []
      for (const t of range(segmentLength)) {
        segment.push([r + segmentLength - 1 - t, c + t])
      }
      segments.push(segment)
    }
  }
  return segments
}

const NUM_ROWS = 6
const NUM_COLUMNS = 7
const SEGMENT_LENGTH = 4
const SEGMENTS = generateSegments(NUM_ROWS, NUM_COLUMNS, SEGMENT_LENGTH)

class Column {

  constructor(container) {
    this._container = container || []
  }

  get full() {
    return this._container.length === NUM_ROWS
  }

  itemAt(index) {
    if (index >= this._container.length) return E
    return this._container[index]
  }

  push(piece) {
    if (this.full) {
      throw new Error('Trying to push piece to full column.')
    }
    this._container.push(piece)
  }

  copy() {
    return new Column(this._container.slice())
  }
}

class Board extends BoardBase {

  constructor(position, turn) {
    super()
    this._position = position || range(NUM_COLUMNS).map(() => new Column())
    this._turn = turn || R
  }

  get turn() {
    return this._turn
  }

  get isWin() {
    for (const segment of SEGMENTS) {
      const { redCount, yellowCount } = this._countSegment(segment)
      if (redCount === SEGMENT_LENGTH || yellowCount === SEGMENT_LENGTH) {
        return true
      }
    }
    return false
  }

  legalMoves() {
    return range(NUM_COLUMNS).filter(c => !this._position[c].full)
  }

  makeMove(c) {
    const newPosition = this._position.map(p => p.copy())
    newPosition[c].push(this.turn)
    const newTurn = this.turn.opposite
    return new Board(newPosition, newTurn)
  }

  evaluate(player) {
    return SEGMENTS.reduce(
      (acc, segment) => acc + this._evaluateSegment(segment, player),
      0)
  }

  _countSegment(segment) {
    const countPieces = piece => segment
      .filter(([row, col]) => this._position[col].itemAt(row) === piece)
      .length
    const redCount = countPieces(R)
    const yellowCount = countPieces(Y)
    return { redCount, yellowCount }
  }

  _countToScore(count) {
    switch (count) {
      case 2: return 1
      case 3: return 100
      case 4: return 1000000
      default: return 0
    }
  }

  _evaluateSegment(segment, colour) {
    const { redCount, yellowCount } = this._countSegment(segment)
    if (redCount && yellowCount) return 0
    const bestScore = this._countToScore(Math.max(redCount, yellowCount))
    const bestColour = redCount > yellowCount ? R : Y
    return colour === bestColour ? bestScore : -bestScore
  }

  draw() {
    for (const r of range(NUM_ROWS).reverse()) {
      const chars = range(NUM_COLUMNS).map(c => this._position[c].itemAt(r).piece)
      const line = chars.join(' ')
      console.log(line)
    }
    const columnNumbers = range(NUM_COLUMNS).map(c => c + 1).join(' ')
    console.log(columnNumbers)
  }
}

module.exports = {
  Board
}
