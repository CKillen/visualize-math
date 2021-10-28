class CanvasGrid {
  constructor(canvas, width, height, {
    side = 25,
    validMarks,
    buffer = 2.5
  }) {
    this.width = parseInt(width);
    this.height = parseInt(height);
    this.side = side;
    this.lineWidth = 1;
    this.offset = (side / 2) - 1;
    this.buffer = buffer;
    this.grid = [];

    this.validMarks = [
      {
        name: 'start',
        color: '#4DFA90',
      },
      {
        name: 'finish',
        color: '#FF5468',
      },
      {
        name: 'wall',
        color: '#525252',
      },
      {
        name: 'tryPath',
        color: '#B29CDB',
      },
      {
        name: 'realPath',
        color: '#FCB249',
      },
      {
        name: 'erase',
        color: 'none',
      }
    ]
    this.currentMark = this.validMarks[0];
    //canvas
    this.ctx = canvas.getContext('2d');
    this.ctx.canvas.width = parseInt(width);
    this.ctx.canvas.height = parseInt(height);

    this.initializeGridArray();
    this.drawGrid();
  }

  initializeGridArray = () => {
    const { width, height } = this.getGridDimensions();
    this.grid = [...Array(width)].map(() =>  new Array(height).fill(""));
  }

  getCurrentMark = () => {
    return this.currentMark;
  }

  changeMark = (name) => {
    this.currentMark = this.validMarks.filter((ele) => ele.name === name)[0];
  }

  placeMark = (x, y) => {
    const coords = this.rawToGrid(x, y);
    this.grid[coords.x][coords.y] = this.currentMark.name;
    if(this.currentMark.name === 'erase') {
      this.clearMark(coords);
    } else {
      this.fillMark(this.currentMark.color, coords)
    }
  }

  placeMark2 = (x, y) => {
    const coords = { x, y };
    this.grid[x][y] = this.currentMark.name;
    if(this.currentMark.name === 'erase') {
      this.clearMark(coords);
    } else {
      this.fillMark(this.currentMark.color, coords)
    }
  }
  
  removeFromGridArray = (x, y) => {
    this.grid[x][y] = "";
  }

  fillMark = (color, coords) => {
    const trueSide = this.side + this.lineWidth;
    const x = coords.x * trueSide - this.offset + this.buffer;
    const y = coords.y * trueSide - this.offset + this.buffer;
    //const sideWithBuffer = this.side - (this.buffer * 2);
    this.ctx.fillStyle = color;
    const newSide = this.side - (this.buffer * 2) + this.lineWidth;
    this.ctx.fillRect(
      x,
      y,
      newSide,
      newSide,
    )
  }

  clearMark(coords) {
    const trueSide = this.side + this.lineWidth;
    const x = coords.x * trueSide - this.offset + this.buffer - .25;
    const y = coords.y * trueSide - this.offset + this.buffer - .25;
    const newSide = this.side - (this.buffer * 2) + this.lineWidth + .25;
    this.ctx.clearRect(
      x, 
      y, 
      newSide, 
      newSide, 
    );
  }

  rawToGrid = (x, y) => {
    const trueSide = this.side + this.lineWidth;
    const coordX = Math.ceil((x - this.offset) / trueSide);
    const coordY = Math.ceil((y - this.offset) / trueSide);
    return { x: coordX, y: coordY};
  }

  setSize = (width, height) => {
    this.height = parseInt(height);
    this.ctx.canvas.height = this.height;
    this.width = parseInt(width);
    this.ctx.canvas.width = this.width;
  }

  getGridDimensions = () => {
    const trueSide = this.side + this.lineWidth;
    const offsetCompensation = this.offset / this.side;
    const width = Math.ceil((this.width / trueSide) + offsetCompensation);
    const height = Math.ceil((this.height / trueSide) + offsetCompensation);
    return { width, height };
  }

  getGridArray = () => {
    return this.grid;
  }

  drawGrid = () => {
    const startHeight = 0 - this.offset;
    const startWidth = 0 - this.offset;
    for(let currentHeight = startHeight; currentHeight <= this.height + this.side; currentHeight++) {
      this.drawLine(0, currentHeight, this.width, currentHeight)
      currentHeight += this.side;
    }

    for(let currentWidth = startWidth; currentWidth <= this.width + this.side; currentWidth++) {
      this.drawLine(currentWidth, 0, currentWidth, this.height)
      currentWidth += this.side;
    }
  }

  clearGrid = () => {
    const { ctx } = this;
    ctx.clearRect(
      -25, 
      -25, 
      this.width + 25, 
      this.height + 25, 
    );
  }

  drawLine = (startWidth, startHeight, endWidth, endHeight) => {
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(startWidth, startHeight);
    this.ctx.lineTo(endWidth, endHeight);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  drawInputArray = (grid) => {
    this.reset();
    this.grid = grid;
    const { width, height } = this.getGridDimensions();
    for(let x = 0; x < grid.length; x++) {
      for(let y = 0; y < grid[x].length; y++) {
        if(grid[x][y] !== "" && grid[x][y] !== "erase") {
          const { color } = this.validMarks.filter((ele) => ele.name === grid[x][y])[0]
          this.fillMark(color, { x, y })
        }
      }
    }

  }

  reset = () => {
    this.clearGrid();
    this.initializeGridArray();
    this.drawGrid();
  }

}