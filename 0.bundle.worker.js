/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./web-app/web-worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./logic/index.js":
/*!************************!*\
  !*** ./logic/index.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const { PieceBase, BoardBase } = __webpack_require__(/*! ../minimax */ "./minimax/index.js")

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

  rowAt(index) {
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

  constructor(columns, turn) {
    super()
    this._columns = columns || range(NUM_COLUMNS).map(() => new Column())
    this._turn = turn || R
  }

  get turn() {
    return this._turn
  }

  get isWin() {
    for (const segment of SEGMENTS) {
      const { redCount, yellowCount } = this._countSegment(segment)
      if (redCount === SEGMENT_LENGTH || yellowCount === SEGMENT_LENGTH) {
        return segment
      }
    }
    return false
  }

  legalMoves() {
    return range(NUM_COLUMNS).filter(c => !this._columns[c].full)
  }

  makeMove(c) {
    const newColumns = this._columns.map(p => p.copy())
    newColumns[c].push(this.turn)
    const newTurn = this.turn.opposite
    return new Board(newColumns, newTurn)
  }

  evaluate(player) {
    return SEGMENTS.reduce(
      (acc, segment) => acc + this._evaluateSegment(segment, player),
      0)
  }

  _countSegment(segment) {
    const countPieces = piece => segment
      .filter(([row, col]) => this._columns[col].rowAt(row) === piece)
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

  get grid() {
    return range(NUM_ROWS).map(row =>
      range(NUM_COLUMNS).map(col => this._columns[col].rowAt(row).piece).join(''))
  }
}

module.exports = {
  Board
}


/***/ }),

/***/ "./minimax/index.js":
/*!**************************!*\
  !*** ./minimax/index.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

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

// const minimax = (board, maximising, originalPlayer, maxDepth) => {
//   if (board.isWin || board.isDraw || maxDepth === 0) {
//     return board.evaluate(originalPlayer)
//   }
//   if (maximising) {
//     const op = (acc, move) => {
//       const score = minimax(board.makeMove(move), false, originalPlayer, maxDepth - 1)
//       return Math.max(acc, score)
//     }
//     return board.legalMoves().reduce(op, Number.MIN_SAFE_INTEGER)
//   } else {
//     const op = (acc, move) => {
//       const score = minimax(board.makeMove(move), true, originalPlayer, maxDepth - 1)
//       return Math.min(acc, score)
//     }
//     return board.legalMoves().reduce(op, Number.MAX_SAFE_INTEGER)
//   }
// }

const alphabeta = (
  board,
  maximising,
  originalPlayer,
  maxDepth,
  alpha = Number.MIN_SAFE_INTEGER,
  beta = Number.MAX_SAFE_INTEGER) => {
  if (board.isWin || board.isDraw || maxDepth === 0) {
    return board.evaluate(originalPlayer)
  }
  if (maximising) {
    for (const move of board.legalMoves()) {
      const score = alphabeta(board.makeMove(move), false, originalPlayer, maxDepth - 1, alpha, beta)
      alpha = Math.max(score, alpha)
      if (beta <= alpha) break
    }
    return alpha
  } else {
    for (const move of board.legalMoves()) {
      const score = alphabeta(board.makeMove(move), true, originalPlayer, maxDepth - 1, alpha, beta)
      beta = Math.min(score, beta)
      if (beta <= alpha) break
    }
    return beta
  }
}

const findBestMove = (board, maxDepth) => {
  const seed = { score: Number.MIN_SAFE_INTEGER }
  const op = (acc, move) => {
    const score = alphabeta(board.makeMove(move), false, board.turn, maxDepth)
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


/***/ }),

/***/ "./node_modules/promise-worker/register.js":
/*!*************************************************!*\
  !*** ./node_modules/promise-worker/register.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function isPromise (obj) {
  // via https://unpkg.com/is-promise@2.1.0/index.js
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

function registerPromiseWorker (callback) {
  function postOutgoingMessage (e, messageId, error, result) {
    function postMessage (msg) {
      /* istanbul ignore if */
      if (typeof self.postMessage !== 'function') { // service worker
        e.ports[0].postMessage(msg)
      } else { // web worker
        self.postMessage(msg)
      }
    }
    if (error) {
      /* istanbul ignore else */
      if (typeof console !== 'undefined' && 'error' in console) {
        // This is to make errors easier to debug. I think it's important
        // enough to just leave here without giving the user an option
        // to silence it.
        console.error('Worker caught an error:', error)
      }
      postMessage([messageId, {
        message: error.message
      }])
    } else {
      postMessage([messageId, null, result])
    }
  }

  function tryCatchFunc (callback, message) {
    try {
      return { res: callback(message) }
    } catch (e) {
      return { err: e }
    }
  }

  function handleIncomingMessage (e, callback, messageId, message) {
    var result = tryCatchFunc(callback, message)

    if (result.err) {
      postOutgoingMessage(e, messageId, result.err)
    } else if (!isPromise(result.res)) {
      postOutgoingMessage(e, messageId, null, result.res)
    } else {
      result.res.then(function (finalResult) {
        postOutgoingMessage(e, messageId, null, finalResult)
      }, function (finalError) {
        postOutgoingMessage(e, messageId, finalError)
      })
    }
  }

  function onIncomingMessage (e) {
    var payload = e.data
    if (!Array.isArray(payload) || payload.length !== 2) {
      // message doens't match communication format; ignore
      return
    }
    var messageId = payload[0]
    var message = payload[1]

    if (typeof callback !== 'function') {
      postOutgoingMessage(e, messageId, new Error(
        'Please pass a function into register().'))
    } else {
      handleIncomingMessage(e, callback, messageId, message)
    }
  }

  self.addEventListener('message', onIncomingMessage)
}

module.exports = registerPromiseWorker


/***/ }),

/***/ "./web-app/web-worker.js":
/*!*******************************!*\
  !*** ./web-app/web-worker.js ***!
  \*******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var promise_worker_register__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! promise-worker/register */ "./node_modules/promise-worker/register.js");
/* harmony import */ var promise_worker_register__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(promise_worker_register__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _logic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../logic */ "./logic/index.js");
/* harmony import */ var _logic__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_logic__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _minimax__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../minimax */ "./minimax/index.js");
/* harmony import */ var _minimax__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_minimax__WEBPACK_IMPORTED_MODULE_2__);




let board = new _logic__WEBPACK_IMPORTED_MODULE_1__["Board"]()

const getBoardState = () => ({
  grid: board.grid,
  isWin: board.isWin,
  isDraw: board.isDraw,
  legalMoves: board.legalMoves()
})

const processMessage = message => {
  switch (message.type) {

    case 'resetBoardState':
      board = new _logic__WEBPACK_IMPORTED_MODULE_1__["Board"]()
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
        const move = Object(_minimax__WEBPACK_IMPORTED_MODULE_2__["findBestMove"])(board, message.maxDepth)
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

promise_worker_register__WEBPACK_IMPORTED_MODULE_0___default()(message => {
  console.log(`[web-worker] message: ${JSON.stringify(message)}`)
  const result = processMessage(message)
  console.log(`[web-worker] result: ${JSON.stringify(result)}`)
  return result
})


/***/ })

/******/ });
//# sourceMappingURL=0.bundle.worker.js.map