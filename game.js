class Game {
  constructor() {
    this.timer        = 0
    this.running      = true
    this.pause        = false
    this.numOfPlayers = 10
    this.players      = []
    this.rounds       = []
    this.evaluator    = new Evaluator()
    for (let i = 0; i < this.numOfPlayers; i++)
      this.players.push(new Player(i))
    you = this.players[0]
  }


  update() {
    timer++
    if (needToWait()) 
      return
    if (!this.running || this.pause)
      return
    if (this.rounds.length == 0)
      this.startNextRound()
    else if (this.checkIfNewRound()) 
      currRound.finish()
    this.rounds[this.rounds.length -1].action()
  }

  show() {
    this.showTable()
    input.action()
    for (let p of this.players)
      p.show()
    for (let b of buttons)
      b.action()
  }

  close() {
    somethingNew = false
    clicked = false
  }

  showTable() {
    ctx.drawImage(table, 0, 0)
    box(0, 400, 800, 400, 'black')
    write(`Round: ${currRound.nr}`, 20, 450, 'gold', 35, 'left')
    write(currPhase.name, 20, 500, 'goldenrod', 35, 'left')

    for (let card of currRound.board)
      card.show(344 + currRound.board.indexOf(card) * 24, 200)
    write(`Pot: ${currRound.pot}`, 400, 250, 'gold', 25)
  }

  checkIfNewRound() {
    return currPhase.nr == 3 && !game.players.some(p => !p.done && p.active)
  }

  startNextRound() {
    this.rounds.push(new Round())
  }
}

class Round {
  constructor() {
    this.nr       = game.rounds.length + 1
    this.phases   = []
    this.minBet   = [20, 40, 60, 100, 200, 300, 400, 800, 160]
                    [Math.floor((this.nr - 1) / 10)]
    this.winner   = undefined
    this.pot      = 0
    this.board    = []
    this.dealer   = this.dealer ? (this.dealer + 1) % game.players.length :
                    game.players[Math.floor(Math.random() * game.players.length)].id 
    this.smallB   = (this.dealer + 1) % game.players.length
    this.bigB     = (this.dealer + 2) % game.players.length
    currRound     = this
    this.init()
  }

  init() {
    this.deck     = []
    for (let i = 0; i < 52; i++)
      this.deck.push(new Card(i))

    for (let p of game.players) {
      if (p.chips <= 0) p.leave()
      if (!p.alive) continue
      p.finalValue = 0
      p.active = true
      p.hand = []
      for (let i = 0; i < 2; i++) {
        p.hand.push(Card.dealCard(i))
        // if (p.id != 0) 
        //   p.hand[i].revealed = false
  
      }  
    }
  }

  action() {
    if (this.checkIfNewPhase())
      this.phases.push(new Phase(this.phases.length))
    currPhase = this.phases[this.phases.length -1]
    currPhase.action()
  }

  checkIfNewPhase() {
    return this.phases.length == 0 || 
            !game.players.some(p => p.active && !p.done)
  }

  finish() {
    this.winnerID = game.evaluator.determineWinner()
    game.players[this.winnerID].receive(currRound.pot)
    game.rounds.push(new Round())
  }
}

class Phase {
  constructor(i) {
    this.nr          = i
    this.name        = ['Pre Flop', 'Flop', 'Turn', 'River'][i]
    this.currPlayer  = i == 0 ? (currRound.dealer + 3) % game.players.length : 
                                 currRound.smallB % game.players.length
    this.initPhase()
                          
  }

  initPhase() {
    for (let p of game.players) {
      p.bet       = 0
      p.done      = false
      p.text      = undefined
    }

    this.highestBet = this.nr == 0 ? currRound.minBet : 0
    this.addBoardCard()
  }

  action() {
    if (!game.players.some(p => !p.done))
      return
    game.players[this.currPlayer].decision()
  }

  addBoardCard() { 
    for (let i = 0; i < [0, 3, 1, 1][this.nr]; i++)
      currRound.board.push(Card.dealCard())
  }


}