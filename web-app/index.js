import { Board } from '../logic'
import { findBestMove } from '../minimax'

const NUM_ROWS = 6
const NUM_COLUMNS = 7
const HUMAN_PLAYER = Symbol('HUMAN_PLAYER')
const COMPUTER_PLAYER = Symbol('HUMAN_PLAYER')

const boardElement = document.getElementById('board')

const w = boardElement.scrollWidth
const h = boardElement.scrollHeight
const dx = w / (NUM_COLUMNS * 4 + NUM_COLUMNS + 1)
const dy = h / (NUM_ROWS * 4 + NUM_ROWS + 1)
const rx = 2 * dx
const ry = 2 * dy
const r = (rx + ry) / 2 + 1

let board = new Board()

export const createSvgElement = (elementName, additionalAttributes = {}) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', elementName)
  Object.entries(additionalAttributes).forEach(([name, value]) =>
    element.setAttribute(name, value))
  return element
}

const drawBackground = () => {
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
  const backgroundElement = createSvgElement('path', {
    class: 'board-background',
    d
  })
  boardElement.appendChild(backgroundElement)
}

const makeRowColKey = (row, col) => `${row}-${col}`

const drawBoard = () => {
  board.boardState.forEach((line, row) => {
    Array.from(line).forEach((ch, col) => {
      if (ch !== 'R' && ch !== 'Y') return
      const key = makeRowColKey(row, col)
      const pieceElement = boardElement.querySelector(`[data-row-col='${key}']`)
      if (!pieceElement) {
        const player = ch === 'R' ? HUMAN_PLAYER : COMPUTER_PLAYER
        drawPiece(row, col, player)
      }
    })
  })
}

const drawPiece = (row, col, player) => {
  const classNames = [
    'board-piece',
    player === HUMAN_PLAYER ? 'board-piece--human' : 'board-piece--computer'
  ].join(' ')
  const cx = (3 + 5 * col) * dx
  const cy = (3 + 5 * (NUM_ROWS - row - 1)) * dy
  const key = makeRowColKey(row, col)
  const pieceElement = createSvgElement('circle', {
    'class': classNames,
    'data-row-col': key,
    cx,
    cy,
    r
  })
  boardElement.insertBefore(pieceElement, boardElement.firstChild)
}

const xToCol = x => {
  const dxs = Math.floor(x / dx)
  const col = Math.floor(dxs / 5)
  return dxs % 5 ? col : -1
}

const onBoardClick = e => {
  if (board.isWin || board.isWin) return
  const x = e.offsetX
  const humanMove = xToCol(x)
  if (!board.legalMoves().includes(humanMove)) return
  board = board.makeMove(humanMove)
  drawBoard(Board)
  const computerMove = findBestMove(board, 3)
  board = board.makeMove(computerMove)
  drawBoard(Board)
}

const main = () => {
  boardElement.addEventListener('click', onBoardClick)
  drawBackground()
}

main()
