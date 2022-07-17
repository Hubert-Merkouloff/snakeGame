import './style.css';
import img from './assets/images/580b57fcd9996e24bc43c516.png'

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

// variable declaration;

let direction = 'e'
let gridElem //the grid element depends on the size of the window
let c = 800
let score = 0
let level = 0
let running = false
let apple;
let snake;
let appleImage;


const restoreInitialValues = () => {
  score = 0;
  level = 0
  c = 800;
  running = false
  direction = 'e'
  snake =[[9, 9],[8, 9],[7, 9]]
  apple = [5,5]
}


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

window.addEventListener("click", () => {
  if (!running) {
    restoreInitialValues()
    requestAnimationFrame(move);
  }
});


const drawMap = () => {
  ctx.fillStyle = 'white'
  ctx.fillRect(0,0,canvas.width, canvas.height)
  ctx.fillStyle = '#ecf0f1';
  let numberOfElementsByRow = canvas.width / gridElem
  let numberOfElements = numberOfElementsByRow**2;
  let rowIndex = 0
  let columnIndex = 0

  for (let index = 0; index < numberOfElements; index++) {
    if ( index >0 && index % numberOfElementsByRow === 0) {
      rowIndex++;
      columnIndex = 0;
    }
    ctx.fillRect( columnIndex * gridElem + 1, rowIndex * gridElem + 1, gridElem -2, gridElem -2 )
    columnIndex++

  }

};



const drawSnake = () => {
  ctx.fillStyle = "#2ecc71"
  for (let body of snake){
    ctx.fillRect(body[0]*gridElem, body[1]*gridElem, gridElem, gridElem)

  }
}

const getTheApple = async () => {

  try {
    const result = await new Promise((resolve) => {
      const image = new Image();
      image.src = img;
      image.onload = () => {
        resolve(image)
      }
    })
    return result;
  } catch(e) {
    console.log("error : ", e)
  }





}

const drawApple = () => {
  ctx.drawImage(appleImage, apple[0]*gridElem, apple[0]*gridElem, gridElem, gridElem )
}

const gameOver = () => {
  if ((snake[0][0] > canvas.width / gridElem - 1)|| (snake[0][0]<0) || (snake[0][1] < 0 ) || (snake[0][1]> canvas.height / gridElem - 1)){ //if out of the window
    return true;
  } else if ((snake[0][0] < 2)&&(snake[0][1] < 2)) {
    return true;
  }
  else {
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
  if (score!=0 && score%10 === 0) {
    level++;
    c = c + 5;
  }

  apple[0] = Math.round(Math.random()*19)
  apple[1] = Math.round(Math.random()*19)

  for (let body of snake) {
    if (body[0] === apple[0] && body[1] === apple[1]){
      return moveApple()
    }
  }

}

const drawScore = () => {

  ctx.fillStyle = '#d35400'
  ctx.fillRect(0, 0,5*gridElem,3*gridElem)
  ctx.fillStyle = "white"
  ctx.font = '40px sans-serif'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillText(`Score: ${score}`,gridElem, gridElem)
  ctx.fillText(`Level: ${level}`,gridElem, 2*gridElem)
  console.log("ctx", ctx)
}




const endTheGame = () => {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "red"
  ctx.font = '80px sans-serif'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ctx.fillText('Game over', canvas.width/2, canvas.height/2)


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
  drawSnake();
  drawApple();
  setTimeout(()=> requestAnimationFrame(move), 1000-c )

} else {
  endTheGame();

}


}

const start = (image) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  appleImage = image;
  ctx.font = "40px sans-serif";
  ctx.fillStyle = "black";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(
    "Click to start the game",
    canvas.width / 2,
    canvas.height / 2
  );
  ctx.drawImage(appleImage, canvas.width/2 - 150/2, canvas.height/2 + 20, 150, 150 )


};


window.addEventListener("resize", () => {
  resizeGame();
});

const resizeGame = () => {
  if (window.innerWidth < 576) {
    gridElem = 20;
  } else if (window.innerWidth < 768) {
    gridElem = 25;
  } else if (window.innerWidth < 992) {
    gridElem = 30;
  } else if (window.innerWidth < 992) {
    gridElem = 35;
  } else if (window.innerWidth < 1200) {
    gridElem = 40;
  } else if (window.innerWidth >= 1200) {
    gridElem = 45;
  }
  canvas.width = Math.floor((window.innerWidth - 2) / gridElem) * gridElem;
  canvas.height = Math.floor((window.innerHeight - 2) / gridElem) * gridElem;

  getTheApple().then((image) => start(image))
};

resizeGame();
