/*
-------------------Grid----------------------------
[x] Given canvas, height, width and side
[x] Draws canvas with initial grid
[x] Redraws canvas, clearing canvas and drawing again
[x] can set height in width (redraw is seperate)
[x] has offset to make grid pretty
[x] has marks that correspond with colors
[x] can return grid location based of x, y input provided (such as square 4, 23)
[x] can return multi array of what is currently drawn
    will have to reset array on grid reset
[x] can parse multi array as input
[ ] allow passing of mark object in constructor (custom colors)
[ ] allow images 
-----------------Integration--------------------------
[x] Controls how the grid is being drawn upon (ie wall can't override start)
[x] Parses input from  user 
[x] Takes input from grid and passes to path and vice versa

-----------------Path--------------------------------
[x] Uses 2D array
[ ] Can set path finding algos
[ ] output current 
-----------------Future------------------------------
Would like to layer a map on the grid with some sort of random noise. Then can 
use different colors to represent distance to allow the use of distance algos

Short Term
Implement Greed-first
Implement A*

-----------------Bugs--------------------------------
*/

const canvas = document.querySelector('canvas');
const canvasDiv = document.querySelector('.canvas-div');
const calculateButton = document.querySelector('.calculate-button');
const radios = document.querySelectorAll('input[name="mark"]');
radios[0].checked = true;
const { offsetWidth, offsetHeight } = canvasDiv;
let lastStart = null;
const cg = new CanvasGrid(canvas, offsetWidth, offsetHeight, { side: 30, buffer: 1.5 })
let path = new Path();
let lastFinish = null;


window.addEventListener('resize', (event) => {
  cg.setSize(canvasDiv.offsetWidth, canvasDiv.offsetHeight)
  cg.reset();
});

window.addEventListener('mousedown', (event) => {
  if(event.target === canvas) {
    console.log(event.target)
    handleGridClick(event.clientX, event.clientY);
  }

  if(event.target.type === 'radio') {
    cg.changeMark(event.target.value)
  }

  if(event.target === calculateButton) {
    let currentGrid = JSON.parse(JSON.stringify(cg.getGridArray()));
    let i = 0;
    path.BFS(currentGrid, lastStart, (node) => {
      setTimeout(() => {
        if(node.type === "finish") {
          finishTimer(node)
        } else {
          cg.changeMark('tryPath')
          cg.placeMark2(node.x,node.y)
        }
      }, i * 2)
      i++;
    })
  }
});

function finishTimer(node) {
  if(node.previous !== null && node.previous.type !== "start") {
    let currentNode = node.previous;
    console.log(currentNode)
    cg.changeMark('realPath')
    cg.placeMark2(currentNode.x, currentNode.y)
    setTimeout(finishTimer, 25, node.previous);
  } 
}

window.addEventListener('mousemove', (event) => {
  if(event.target === canvas && event.buttons === 1) {
    handleGridClick(event.clientX, event.clientY)
  }
});


function handleGridClick(clientX, clientY) {
  const rect = canvasDiv.getBoundingClientRect();
  let x = clientX - rect.left;
  let y = clientY - rect.top;
  handlePlacement(x, y)
}

function handlePlacement(rawX, rawY) {
  const markName = cg.getCurrentMark().name;
  switch(markName) {
    case "erase":
      handleErase(rawX, rawY);
      break;
    case "start":
      handleStart(rawX, rawY);
      break;
    case "finish":
      handleFinish(rawX, rawY);
      break;
    case "wall":
      handleWall(rawX, rawY);
      break;
    default:
      console.log("Mark not handled");
    
  }
}

function handleErase(rawX, rawY) {
  let coords = cg.rawToGrid(rawX, rawY);
  if(isStart(coords.x, coords.y)) {
    lastStart = null;
  }
  if(isFinish(coords.x, coords.y)) {
    lastFinish = null;
  }
  cg.placeMark(rawX, rawY);
}

function handleStart(rawX, rawY) {
  const { x, y } = cg.rawToGrid(rawX, rawY); 
  if(lastStart !== null) {
    cg.removeFromGridArray(lastStart.x, lastStart.y);
    cg.clearMark({ x: lastStart.x, y: lastStart.y })
  }
  lastStart = { x, y };
  if((lastFinish !== null) && (lastFinish.x === lastStart.x && lastFinish.y === lastStart.y)) {
    lastFinish = null;
  }
  cg.placeMark(rawX, rawY);
}

function handleFinish(rawX, rawY) {
  const { x, y } = cg.rawToGrid(rawX, rawY); 
  if(lastFinish !== null) {
    cg.removeFromGridArray(lastFinish.x, lastFinish.y);
    cg.clearMark({ x: lastFinish.x, y: lastFinish.y })
  }
  lastFinish = { x, y };
  if((lastStart !== null) && (lastFinish.x === lastStart.x && lastFinish.y === lastStart.y)) {
    lastStart = null;
  }
  cg.placeMark(rawX, rawY);
}

function handleWall(rawX, rawY) {
  const { x, y } = cg.rawToGrid(rawX, rawY); 

  if(!(isStart(x, y)) && !(isFinish(x, y))) {
    cg.placeMark(rawX, rawY);
  }
}

function isStart(x, y) {
  return lastStart !== null && (lastStart.x === x && lastStart.y === y);
}

function isFinish(x, y) {
  return lastFinish !== null && (lastFinish.x === x && lastFinish.y === y)
}


