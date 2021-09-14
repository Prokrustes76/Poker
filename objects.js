class Button {
  constructor(i) {
    this.id       = i
    this.text     = ['RAISE', 'CALL', 'FOLD', 'BET', 'CHECK', 'Speed+', 'Speed-', ''][i]
    this.active   = [false, false, false, false, false, true, true, false][i]
    this.x        = [330, 330, 330, 330, 330, 680, 680, 490][i]
    this.y        = [430, 480, 530, 430, 480, 430, 480, 480][i]
    this.w        = [140, 140, 140, 140, 140, 100, 100, 160][i]
    this.h        = 40
    this.textPos  = this.id != 7 ? this.x + this.w / 2 : this.x + 150
    this.col      = this.id < 5 ? 'goldenrod' : this.id < 7 ? 'green' : 'black'
    this.textCol  = this.id != 7 ? 'black' : 'gold'
    this.align    = this.id <  7 ? 'centre' : 'right'
    this.size     = this.id < 5 ? 35 : 25
  }

  action() {
    if (!this.active) 
      return
    this.show()
    this.clicked()
  }

  show() {
    box(this.x, this.y, this.w, this.h, this.col)
    if (this.id == 7) {
      box(this.x + 152, this.y + 9 , 2, 24, timer % 60 < 30 ? '#888' : 'black')
      this.text = input.value || ''
    }
    write(this.text, this.textPos, this.y + 23, this.textCol, this.size, this.align)
  }

  amIHovered() {
    return mouseX > this.x && mouseX < this.x + this.w &&
           mouseY > this.y && mouseY < this.y + this.h
  }

  amIClicked() {
    return this.amIHovered() && clicked
  }

  clicked() {  
    if (!this.amIClicked()) 
      return
    if (this.id < 5) {
      if      (this.text == 'CALL')  you.call()
      else if (this.text == 'CHECK') you.check()
      else if (this.text == 'BET')   input.active = true
      else if (this.text == 'RAISE') input.active = true
      else if (this.text == 'FOLD')  you.fold()
    }
    else if (this.id < 7) {
      let tempo = [90, 60, 30, 20, 10]
      let pos   = tempo.indexOf(speed)
      if (this.text == 'Speed+' && pos < 4)
        speed = tempo[pos + 1]
      if (this.text == 'Speed-' && pos > 0)
        speed = tempo[pos - 1]
    }
  }
}

class Input {
  constructor() {
    this.active   = false
    this.x        = 480
    this.y        = 430
    this.w        = 180
    this.h        = 100
    this.value    = ''
    this.button   = buttons[7]
  }1

  action() {
    if (!this.active) return
    box(this.x, this.y, this.w, this.h, '#333')
    box(this.x, this.y, this.w, this.h, '#222', 5)
    write('Bet Size:', this.x + 10, this.y + 24, 'goldenrod', 25, 'left')
    this.button.active = true
  }

  done() {
    this.active = false
    this.value  = ''
  }
  
}

