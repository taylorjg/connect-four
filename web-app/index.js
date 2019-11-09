import { Board } from '../logic'
import { findBestMove } from '../minimax'

const url = new URL(window.location)
const auto = url.searchParams.has('auto')

const MAX_DEPTH = 3
const NUM_ROWS = 6
const NUM_COLUMNS = 7
const HUMAN_PLAYER = Symbol('HUMAN_PLAYER')
const COMPUTER_PLAYER = Symbol('HUMAN_PLAYER')

const svgElement = document.querySelector('svg')
const startButton = document.getElementById('start-btn')

const w = svgElement.scrollWidth
const h = svgElement.scrollHeight
const dx = w / (NUM_COLUMNS * 4 + NUM_COLUMNS + 1)
const dy = h / (NUM_ROWS * 4 + NUM_ROWS + 1)
const rx = 2 * dx
const ry = 2 * dy
const r = (rx + ry) / 2 + 1

let board = new Board()
let firstMove = true
let gameOverFlag = false

const createSvgElement = (elementName, cssClass, attributes = {}) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', elementName)
  element.setAttribute('class', cssClass)
  Object.entries(attributes).forEach(([name, value]) =>
    element.setAttribute(name, value))
  return element
}

const drawGrid = () => {
  const rect = `M0,0 h${w} v${h} h${-w}`
  const cutouts = []
  for (let row = 0; row < 6; row++) {
    const y = (3 + 5 * row) * dy
    for (let col = 0; col < 7; col++) {
      const x = (1 + 5 * col) * dx
      cutouts.push(`M${x},${y} a ${rx} ${ry} 0 1 1 ${2 * rx} 0`)
      cutouts.push(`M${x},${y} a ${rx} ${ry} 0 1 0 ${2 * rx} 0`)
    }
  }
  const d = [rect, ...cutouts].join(' ')
  const gridElement = createSvgElement('path', 'grid', { d })
  svgElement.appendChild(gridElement)
}

const makePosKey = (row, col) => `${row}-${col}`

const drawPieces = () => {
  board.boardState.forEach((line, row) => {
    Array.from(line).forEach((ch, col) => {
      if (ch !== 'R' && ch !== 'Y') return
      const posKey = makePosKey(row, col)
      const pieceElement = svgElement.querySelector(`[data-pos='${posKey}']`)
      if (!pieceElement) {
        const player = ch === 'R' ? HUMAN_PLAYER : COMPUTER_PLAYER
        drawPiece(row, col, player)
      }
    })
  })
}

const drawPiece = (row, col, player) => {
  const piecePlayer = player === HUMAN_PLAYER ? 'piece-human' : 'piece-computer'
  const classNames = ['piece', piecePlayer].join(' ')
  const cx = (3 + 5 * col) * dx
  const cy = (3 + 5 * (NUM_ROWS - row - 1)) * dy
  const posKey = makePosKey(row, col)
  const attributes = { 'data-pos': posKey, cx, cy, r }
  const pieceElement = createSvgElement('circle', classNames, attributes)
  svgElement.insertBefore(pieceElement, svgElement.firstChild)
}

const highlightWinningLine = winningSegment => {
  for (const [row, col] of winningSegment) {
    drawHighlight(row, col)
  }
}

const drawHighlight = (row, col) => {
  const cx = (3 + 5 * col) * dx
  const cy = (3 + 5 * (NUM_ROWS - row - 1)) * dy
  const attributes = { cx, cy, r }
  const highlightElement = createSvgElement('circle', 'piece-highlight', attributes)
  svgElement.appendChild(highlightElement)
}

const clearGrid = () => {
  const elements = svgElement.querySelectorAll('.piece, .piece-highlight')
  for (const element of elements) {
    svgElement.removeChild(element)
  }
}

const xToCol = x => {
  const dxs = Math.floor(x / dx)
  const col = Math.floor(dxs / 5)
  return dxs % 5 ? col : -1
}

const onBoardClick = e => {
  if (gameOver()) return
  const x = e.offsetX
  const col = xToCol(x)
  if (auto) {
    if (firstMove) {
      if (!board.legalMoves().includes(col)) return
      board = board.makeMove(col)
    } else {
      board = board.makeMove(findBestMove(board, MAX_DEPTH))
    }
  } else {
    if (!board.legalMoves().includes(col)) return
    board = board.makeMove(col)
  }
  drawPieces(Board)
  firstMove = false
  if (gameOver()) return
  board = board.makeMove(findBestMove(board, MAX_DEPTH))
  drawPieces(Board)
  if (gameOver()) return
}

const gameOver = () => {
  if (gameOverFlag) return true
  if (board.isWin || board.isDraw) {
    board.isWin && highlightWinningLine(board.isWin)
    showStartButton()
    gameOverFlag = true
    return true
  }
  return false
}

const showStartButton = () => {
  startButton.style.display = 'block'
}

const hideStartButton = () => {
  startButton.style.display = 'none'
}

const reset = () => {
  clearGrid()
  board = new Board()
  firstMove = true
  gameOverFlag = false
  hideStartButton()
}

const onStart = () => {
  reset()
}

const main = () => {
  svgElement.addEventListener('click', onBoardClick)
  startButton.addEventListener('click', onStart)
  drawGrid()
}

main()
