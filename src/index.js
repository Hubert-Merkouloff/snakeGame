import './style.css';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
}

let speed = 800;
let score = 0;


document.addEventListener('keydown', (event) => {
  const keyName = event.key;

  switch (keyName) {
    case 'ArrowUp': {
      direction = 'n';
      break;
    }
    case 'ArrowDown' : {
      direction = 's';
      break;
    };
    case 'ArrowLeft' : {
      direction = 'w';
      break;
    }
    case 'ArrowRight' : {
      direction = 'e';
      break;
    }


  }

})

let direction = 'e'
const gridElem = 40; //there is 20 position per axe 800/40
const snake = [[9, 9],[8, 9],[7, 9]]
let apple = [5,5]


const drawMap = () => {
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,800,800)
};

const drawSnake = () => {
  ctx.fillStyle = "green"
  for (let body of snake){
    ctx.fillRect(body[0]*gridElem, body[1]*gridElem, gridElem, gridElem)

  }
}

const drawApple = () => {
  ctx.fillStyle = 'red'
  ctx.fillRect(apple[0]*gridElem, apple[1]*gridElem, gridElem, gridElem)
}

const gameOver = () => {
  if ((snake[0][0] > 19)|| (snake[0][0]<0) || (snake[0][1] < 0 ) || (snake[0][1]>19)){ //if out of the window
    return true;
  } else {
    const [head, ...body] = snake;
    for (let bodyElement of body) {
      if (bodyElement[0]===head[0] && bodyElement[1]===head[1]){ //if It eats itself
        return true;
      }
    }

  }

}

const eatApple = () => {
  if (snake[0][0] == apple[0] && snake[0][1] == apple[1]) { return true
  }
}

const moveApple = () => {
  score++
  speed = speed + 10
  apple[0] = Math.round(Math.random()*19)
  apple[1] = Math.round(Math.random()*19)

  for (let body of snake) {
    if (body[0] === apple[0] && body[1] === apple[1]){
      return moveApple()
    }
  }

}

const drawScore = () => {
  ctx.fillStyle = "white"
  ctx.font = '40px sans-serif'
  ctx.textBaseline = 'bottom'
  ctx.fillText(score,gridElem, gridElem)
  console.log("ctx", ctx)
}

const drawSpeed = () => {
  ctx.fillStyle = "white"
  ctx.font = '40px sans-serif'
  ctx.textBaseline = 'bottom'
  ctx.fillText(`${speed} km/h`,gridElem, 3 * gridElem)
}

const endTheGame = () => {
  ctx.clearRect(0,0,800,800);
  drawMap()
  ctx.fillStyle = "red"
  ctx.font = '80px sans-serif'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ctx.fillText('game over', gridElem * 10, gridElem * 10)


  let step = 1;

  const animationGameOver = (timeStamp) => {
    ctx.save();
    if (step < 16) {
      ctx.translate(10,10);
      ctx.roundRect(20,20,100,100,50);
      ctx.fill();
    } else if (step == 16) {
      ctx.translate(-160,0)
    } else if (step < 32) {
      ctx.translate(10,-10)
      ctx.roundRect(20,20,100,100,50);
      ctx.fill();
    }

    step++
    console.log("step",step)
    if (step < 100) {
      //setTimeout(()=> requestAnimationFrame(animationGameOver), 500 )
      requestAnimationFrame(animationGameOver)
    }


  }

  requestAnimationFrame(animationGameOver)

}


const updateSnakePosition = () => {
  let head;
  switch(direction) {
    case 'e': {
      head = [snake[0][0] + 1, snake[0][1]] //We only move the head of the snake horizontally
      break;
    }
    case 'w': {
      head = [snake[0][0] -1, snake[0][1]]
      break;
    }
    case 's': {
      head = [snake[0][0], snake[0][1] + 1 ]
      break;
    }
    case 'n': {
      head = [snake[0][0], snake[0][1] - 1 ]
      break;
    }
  }

  //We only move the head of the snake horizontally
  snake.unshift(head); // add the head at the beginning of the array snake
  if (!eatApple()) {
    snake.pop();
  }
  if (eatApple()) {
    moveApple()
  }

  ; // remove the last element
  return gameOver();
}

const move = ()=> {

if (!updateSnakePosition()){
  drawMap();
  drawScore();
  drawSpeed();
  drawSnake();
  drawApple();
  setTimeout(()=> requestAnimationFrame(move), 1000-speed )

} else {

  endTheGame();
}


}



requestAnimationFrame(move);
