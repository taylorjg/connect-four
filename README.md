# Description

Implementation of the game, Connect 4, inspired by chapter 8 (_Adversarial search_) of [Classic Computer Science Problems in Python](https://www.manning.com/books/classic-computer-science-problems-in-python)
using the [minimax](https://en.wikipedia.org/wiki/Minimax) algorithm.
However, this implementation is written in JavaScript:

* a Node.js console app
* a web app using [Scalable Vector Graphics (SVG)](https://developer.mozilla.org/en-US/docs/Web/SVG)

# TODO

* Improve the graphics
* Add sound effects
* Responsive UI
* ~~Implement [alpha–beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning)~~

# Autoplay

If the `autoplay` query param is present, then the computer plays against itself on each
click. The first move is placed in the column clicked. Subsequent moves are calculated automatically
and the actual column clicked is ignored.

* https://taylorjg.github.io/connect-four?autoplay

# Links

* amazon.co.uk
  * [Hasbro Gaming Connect 4 Game](https://www.amazon.co.uk/Hasbro-Gaming-Connect-4-Game/dp/B0745QFHP3)
* manning.com
  * [Classic Computer Science Problems in Python](https://www.manning.com/books/classic-computer-science-problems-in-python)
* Wikipedia
  * [Minimax](https://en.wikipedia.org/wiki/Minimax)
  * [Alpha–beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning)
