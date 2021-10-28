function width() {
  let grid = [];
  for(let i = 0; i < 40; i++) {
    grid.push(height());
  }
  return grid;
}

function height() {
  let arr = [];
  for(let i = 0; i < 8; i++) {
    let y = Math.floor(Math.random() * (5 - 0));
    if(y === 0) {
      arr.push("")
    }
    if(y === 1) {
      arr.push("start")
    }
    if(y === 2) {
      arr.push("finish")
    }
    if(y === 3) {
      arr.push("wall")
    }
    if(y === 4) {
      arr.push("realPath")
    }
    if(y === 4) {
      arr.push("tryPath")
    }
  }
  return arr
}

console.log(width());