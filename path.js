class Path {
  constructor(options = { start: "start", finish: "finish", wall: "wall"}) {
    this.algo = "BFS";
    this.identifiers = options;
  }

  BFS(grid, start, cb) {
    const maxWidth = grid.length - 1;
    const maxHeight = grid[0].length - 1;
    let { x, y } = start;

    grid[x][y] = { type: "start", visited: true, x: x, y: y, previous: null }
    const q = [];
    q.push(grid[x][y]);
    while(q.length > 0) {
      const node = q.shift();
      //check up, right, down, left
      if(this.isInGrid(node.x, node.y - 1, maxWidth, maxHeight) && grid[node.x][node.y - 1] !== "wall" 
        && (typeof grid[node.x][node.y - 1] === 'string')) {
        let newNode = {
          x: node.x,
          y: node.y - 1,
          previous: node,
          type: grid[node.x][node.y - 1], 
        }
        grid[node.x][node.y - 1] = newNode;
        if(newNode.type === "finish") {
          cb(newNode);
          return;
        }
        cb(newNode)
        q.push(newNode);
      }
      if(this.isInGrid(node.x, node.y + 1, maxWidth, maxHeight) && grid[node.x][node.y + 1] !== "wall" 
        && (typeof grid[node.x][node.y + 1] === 'string')) {
        let newNode = {
          x: node.x,
          y: node.y + 1,
          previous: node,
          type: grid[node.x][node.y + 1], 
        }
        grid[node.x][node.y + 1] = newNode;
        if(newNode.type === "finish") {
          cb(newNode);
          return;
        }
        cb(newNode)
        q.push(newNode);
      }
      if(this.isInGrid(node.x - 1, node.y, maxWidth, maxHeight) && grid[node.x - 1][node.y] !== "wall" 
        && (typeof grid[node.x - 1][node.y] === 'string')) {
        let newNode = {
          x: node.x - 1,
          y: node.y,
          previous: node,
          type: grid[node.x - 1][node.y], 
        }
        grid[node.x - 1][node.y] = newNode;
        if(newNode.type === "finish") {
          cb(newNode);
          return;
        }
        cb(newNode)
        q.push(newNode);
      }
      if(this.isInGrid(node.x + 1, node.y, maxWidth, maxHeight) && grid[node.x + 1][node.y] !== "wall" 
        && (typeof grid[node.x + 1][node.y] === 'string')) {
        let newNode = {
          x: node.x + 1,
          y: node.y,
          previous: node,
          type: grid[node.x + 1][node.y], 
        }
        grid[node.x + 1][node.y] = newNode;
        if(newNode.type === "finish") {
          cb(newNode);
          return;
        }
        cb(newNode)
        q.push(newNode);
      }
      //change grid at location to object

      //push object onto q
    }

    //cb is always a node
    //change array to { type, x,  y, previous}
  }

  isInGrid(x, y, maxWidth, maxHeight) {
    return x <= maxWidth && x >= 0 && y <= maxHeight && y >= 0;
  }

}

