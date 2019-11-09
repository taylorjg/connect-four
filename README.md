# Description

Implementation of the game, Connect 4, inspired by chapter 8 of [Classic Computer Science Problems in Python](https://www.manning.com/books/classic-computer-science-problems-in-python). However, this implementation is in JavaScript:

* a Node.js console app
* a web app deployed to Heroku

The computer moves are calcuated using [Minimax](https://en.wikipedia.org/wiki/Minimax).

# TODO

* Improve the graphics
* Add sound effects
* Responsive UI
* Implement [alpha–beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning)

# Autoplay

If the `autoplay` query param is present, then the computer plays against itself on each
click. The first move is placed in the column clicked. Subsequent moves are calculated automatically
and the actual column clicked is ignored.

* connect-four-jt.herokuapp.com?autoplay

# Links

* amazon.co.uk
  * [Hasbro Gaming Connect 4 Game](https://www.amazon.co.uk/Hasbro-Gaming-Connect-4-Game/dp/B0745QFHP3)
* manning.com
  * [Classic Computer Science Problems in Python](https://www.manning.com/books/classic-computer-science-problems-in-python)
* Wikipedia
  * [Minimax](https://en.wikipedia.org/wiki/Minimax)
  * [Alpha–beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning)
