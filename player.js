class Player {

  constructor(i) {
    this.id         = i
    this.name       = ['You', 'Tom', 'Lucy', 'Jeff', 'Lynn',
                  'Dave', 'Anne', 'Pete', 'Jim', 'Amy'][i]
    this.alive      = true
    this.active     = true
    this.finalValue = 0
    this.bet        = 0
    this.done       = false
    this.chips      = 1500
    this.hand       = []
    this.text  
    this.pos        = {
      x: [379, 240, 110, 110, 240, 379, 530, 645, 645, 530][i],
      y: [327, 327, 275, 165, 100, 100, 100, 160, 280 ,327][i]
    }
  }


  show() {
    this.showHand()
    this.showButton()
    this.showText()
    this.showDecision()
  }

  showHand(x = this.pos.x, y = this.pos.y) {
      for (let i = 0; i < 2; i++)
        this.hand[i].show(x + 25 * i, y, !this.active)
  }

  showButton(x = this.pos.x, y = this.pos.y) {
    let buttonOffset = this.id == 2 || this.id == 3 ? -14 : 58
    let input
    if (currRound.dealer == this.id) input = ['white', 'D', 'black', 14]
    if (currRound.smallB == this.id) input = ['blue', 'SB', 'white', 10]
    if (currRound.bigB   == this.id) input = ['yellow', 'BB', 'black', 10]
    if (!input) return
    circle(x + buttonOffset, y + 14, 8, input[0])
    write(input[1], x + buttonOffset, y + 15, input[2], input[3])
  }

  showText(x = this.pos.x + 22, y = this.pos.y) {
    y += ([0, 9, 1].includes(this.id)) ? 48 : -17
    write(`${this.name}:  ${this.chips}`, x, y, 'goldenrod', 15)
  }

  nextPlayer() {
    currPhase.currPlayer = (currPhase.currPlayer + 1) % game.players.length
  }

  showDecision() {
    if (!this.text) return
    let x = (2.4 * this.pos.x + 460) / 3.4 
    let y = (1.8 * this.pos.y + 260) / 2.8 
    write(this.text, x, y, 'lightgreen', 18) 
  }

  decision() {
    if (!this.active) {
      this.nextPlayer()
      return
    }

    if (this == you) {
      this.yourOptions()
      return
    }
    
    if (currPhase.highestBet > this.bet) 
      this.call()
    else 
      this.check()
  }

  decisionDone() {
    wait()
    this.done = true
    this.nextPlayer()
    for (let button of buttons.filter(b => b.id < 5))
    button.active = false
    input.button.active = false
  }

  raise(amount ) {
    this.text = 'RAISE ' + amount
    you.pay(amount - this.bet)
    currPhase.highestBet = amount
    for (let p of game.players)
      p.done = false
    input.done()
    this.decisionDone()
  }

  betPossible(amount) {
    if (amount > this.chips) return false
    if (amount < currRound.minBet * 2) return false
    if (amount < currPhase.highestBet * 2) return false
    return true
  }

  call() {
    this.bet  = currPhase.highestBet - this.bet
    this.pay (this.bet)
    this.text = 'CALL'
    this.decisionDone()
  }

  check() {
    this.text = 'CHECK'
    this.decisionDone()
  }

  fold() {
    this.text = 'FOLD'
    this.active = false
    this.decisionDone()
  }

  pay(amount) {
    this.chips -= amount
    currRound.pot += amount
  }

  receive(amount) {
    this.chips += amount
  }

  leave() {
    game.players.splice(game.players.indexOf(this), 1)
  }

  yourOptions() {
    if (this.bet < currPhase.highestBet)
      for (let button of buttons.filter(b => b.id < 3))
        button.active = true
    else
      for (let button of buttons.filter(b => [2,3,4].includes(b.id)))
        button.active = true
    this.isThinking = true
  }
}
