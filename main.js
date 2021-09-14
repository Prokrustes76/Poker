let ctx = document.getElementById('C').getContext('2d')
ctx.textBaseline = 'middle'

let game, mouseX, mouseY, clicked
let currRound, currPhase, you
let somethingNew = true
let timer = 0, until = -5000
let speed = 10
let buttons = []
for (let i = 0; i < 8; i++)
  buttons.push(new Button(i))
let input   = new Input()

let table = new Image()
table.src = 'table.png'

function needToWait() {
  return timer < until
}

function wait(amount = speed) {
  until = timer + amount
}

function write(text, x, y, col, size, pos = 'center') {
  ctx.font = `${size}px Arial`
  ctx.fillStyle = col
  ctx.textAlign = pos
  ctx.fillText(text, x, y)
}

function box(x, y, w, h, col, border) {
  if (!border) {
    ctx.fillStyle = col
    ctx.fillRect(x, y, w, h)
  } else {
    ctx.strokeStyle = col
    ctx.lineWidth = border
    ctx.strokeRect(x, y, w, h)
  }
}

function circle(x, y, rad, col, border) {
  ctx.beginPath()
  ctx.arc(x, y, rad, 0, 2 * Math.PI)
  if (!border) {
    ctx.fillStyle = col
    ctx.fill()
  } else {
    ctx.strokeStyle = col
    ctx.lineWidth = border
    ctx.stroke()
  }
}

document.addEventListener('mousemove', mouseMoved)
document.addEventListener('mouseup', mouseUp)
document.addEventListener('keyup', keyUp)

function mouseMoved (event) {
  mouseX = event.clientX
  mouseY = event.clientY
}

function mouseUp (event) {
  clicked = true
}

function keyUp (event) { 
  if (!input.button.active) 
    return
  if (event.keyCode > 47 && event.keyCode < 58) {
    if (Number(input.value + (event.keyCode - 48)) <= you.chips)
      input.value = input.value + `${event.keyCode - 48}` 
  }
  else if (event.keyCode == 8)
    input.value = input.value.substring(0, input.value.length -1)
  else if (event.keyCode == 13 && you.betPossible(Number(input.value)))
    you.raise(Number(input.value))
}

function isClicked () {
  if (clicked) {
    clicked = false
    return true
  }
  return false
}

function init() {
  game = new Game()
  loop()
}

function loop() {
  game.update()
  game.show()
  game.close()

  requestAnimationFrame(loop)
}

setTimeout(init, 200)


