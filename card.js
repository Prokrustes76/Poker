class Card {
  constructor(i, revealed = true) {
    this.id       = i
    this.value    = Card.cardValue(i)
    this.suit     = Card.cardSuit(i)
    this.col      = ['black', 'red'][Math.floor(i / 26)]
    this.pos      = {x: -500, y: -500}
    this.revealed = revealed
  }

  show(x = this.pos.x, y = this.pos.y, inactive) {
    if (!this.revealed)
      box(x, y, 18, 30, 'red')
    else {
    box(x, y, 18, 30, 'white')
    write(this.suit,  x + 9, y + 8, this.col, 20)
    write(this.value, x + 9, y + 23, this.col, 14)
    }
    if (inactive)
      box(x, y, 18, 30, 'rgba(0, 0, 0, .6')
  }

  static cardValue(i) {
    return ['A', 'K', 'Q', 'J', 'T', 9, 8, 7, 6, 5, 4, 3, 2][i % 13]
  }

  static cardSuit(i) {
    return ['♣', '♠', '♥', '♦'][Math.floor(i / 13)]
  }

  static dealCard() {
    return currRound.deck.splice(Math.floor(Math.random() * currRound.deck.length), 1)[0]
  }
}

class Evaluator {
  constructor() {
    this.value = []
  }

  determineWinner() {
    for (let p of game.players)
      p.finalValue = this.determineFinalValue(p.hand)
    let copy = JSON.parse(JSON.stringify(game.players.filter(pl => pl.active)))
    let winner = copy.sort((a, b) => b.finalValue - a.finalValue)[0]
    winner = game.players.find(p => p.id == winner.id)
    return game.players.indexOf(winner)
  }

  determineFinalValue(hand) {
    this.value = 0
    let cards = [...currRound.board, ...hand]
    cards.sort((a, b) => a.id % 13 - b.id % 13)

    if (this.flush(cards))    this.value += 7000
    if (this.straight(cards)) this.value += 6000

    console.log(cards)
    return this.value
  }

  flush(cards) {
    for (let i = 0; i < 4; i++)
      if (cards.filter(c => Math.floor(c.id / 13) == i).length > 4)
        return true
    return false
  }

  straight(cards) {
    let counter = 0
    for (let i = 0; i < 10; i++) {
      if (cards.some(c => c.id % 13 == i)) {
        counter++
      }
      else counter = 0
    }
  }

}
