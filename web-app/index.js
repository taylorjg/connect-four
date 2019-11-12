import PromiseWorker from 'promise-worker'
import { gsap } from 'gsap'

const webWorker = new Worker('./web-worker.js', { type: 'module' })
const webWorkerP = new PromiseWorker(webWorker)

const DEFAULT_MAX_DEPTH = 5
const MIN_MAX_DEPTH = 2
const MAX_MAX_DEPTH = 7
const NUM_ROWS = 6
const NUM_COLUMNS = 7
const HUMAN_PLAYER = Symbol('HUMAN_PLAYER')
const COMPUTER_PLAYER = Symbol('HUMAN_PLAYER')

const clamp = (min, max, value) => Math.max(min, Math.min(max, value))

const url = new URL(window.location)
const autoplay = url.searchParams.has('autoplay')
const maxDepthParamString = url.searchParams.get('maxDepth') || undefined
const maxDepthParamNumber = Number(maxDepthParamString)
const maxDepth = Number.isInteger(maxDepthParamNumber)
  ? clamp(MIN_MAX_DEPTH, MAX_MAX_DEPTH, maxDepthParamNumber)
  : DEFAULT_MAX_DEPTH
console.log(`maxDepth: ${maxDepth}`)

const svgElement = document.querySelector('svg')
const startButton = document.getElementById('start-btn')
const spinnerElement = document.getElementById('spinner')

const w = svgElement.scrollWidth
const h = svgElement.scrollHeight
const dx = w / (NUM_COLUMNS * 4 + NUM_COLUMNS + 1)
const dy = h / (NUM_ROWS * 4 + NUM_ROWS + 1)
const rx = 2 * dx
const ry = 2 * dy
const r = (rx + ry) / 2 + 1

let firstMove = true
let gameOverFlag = false

const showSpinner = () => {
  spinnerElement.style.display = 'block'
}

const hideSpinner = () => {
  spinnerElement.style.display = 'none'
}

const makeWebWorkerCall = async (type, args) => {
  try {
    showSpinner()
    const message = { type, ...args }
    const result = await webWorkerP.postMessage(message)
    console.log(`[makeWebWorkerCall] result: ${JSON.stringify(result)}`)
    return result
  } finally {
    hideSpinner()
  }
}

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

const drawPieces = async boardState => {
  boardState.grid.forEach((line, row) => {
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
  const posKey = makePosKey(row, col)
  const cx = (3 + 5 * col) * dx
  const cyStart = r
  const cyEnd = (3 + 5 * (NUM_ROWS - row - 1)) * dy
  const attributes = { 'data-pos': posKey, cx, cy: cyStart, r }
  const pieceElement = createSvgElement('circle', classNames, attributes)
  svgElement.insertBefore(pieceElement, svgElement.firstChild)
  gsap.to(pieceElement, {
    cy: cyEnd,
    duration: .5,
    ease: 'bounce',
    onComplete: tween => {
      console.dir(tween)
    }
  })
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

const onBoardClick = async e => {

  // TODO: protect against re-entrancy
  // i.e. a click occurring whilst a previous click is still being processed

  let boardState = await makeWebWorkerCall('getBoardState')

  if (await gameOver(boardState)) return

  const col = xToCol(e.offsetX)

  if (autoplay) {
    if (firstMove) {
      if (!boardState.legalMoves.includes(col)) return
      boardState = await makeWebWorkerCall('makeHumanMove', { move: col })
    } else {
      boardState = await makeWebWorkerCall('makeComputerMove', { maxDepth })
    }
  } else {
    if (!boardState.legalMoves.includes(col)) return
    boardState = await makeWebWorkerCall('makeHumanMove', { move: col })
  }
  await drawPieces(boardState)
  firstMove = false // eslint-disable-line require-atomic-updates
  if (await gameOver(boardState)) return

  boardState = await makeWebWorkerCall('makeComputerMove', { maxDepth })
  await drawPieces(boardState)
  if (await gameOver(boardState)) return
}

const gameOver = async boardState => {
  if (gameOverFlag) return true
  if (boardState.isWin || boardState.isDraw) {
    boardState.isWin && highlightWinningLine(boardState.isWin)
    showStartButton()
    gameOverFlag = true // eslint-disable-line require-atomic-updates
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

const reset = async () => {
  await makeWebWorkerCall('resetBoardState')
  clearGrid()
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
