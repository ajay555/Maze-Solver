var rows, cols;
var w = 20;
var grid = [];
var current;
var generatorStack = [];
var startCell, endCell;

var mazeGenerated = false;
var mazeSolverStarted = false;

function preload() {

}

function setup() {
	var canvas = createCanvas(401, 401);
	canvas.position(10, 10);

	rows = floor(height / w);
	cols = floor(width / w);

	for(var row = 0; row < rows; row++) {
		grid[row] = [];
		for(var col = 0; col < cols; col++) 
			grid[row].push(new Cell(row, col));
	}

	startCell = grid[0][0];
	endCell = grid[rows-1][cols-1];

	current = startCell;
}

function draw() {
	if(!mazeGenerated) {
		background(255);

		for(var row = 0; row < rows; row++) 
			for(var col = 0; col < cols; col++) 
				grid[row][col].show();

		generateMaze();
	}

	if(mazeGenerated && !mazeSolverStarted) {
		mazeSolverStarted = true;

		resetVisited();

		solveMaze(startCell, grid);

		for(var row = 0; row < rows; row++)
			for(var col = 0; col < cols; col++)
				grid[row][col].show();
	}
}

function solveMaze(current, curGrid) {
	if(current.row == endCell.row && current.col == endCell.col) {
		mazeSolved = true;
		return true;
	}
	else {
		var options = [];

		for(var i=0; i<4; i++) {
			var opt = getCell(curGrid, current, i);
			if(opt)
				options.push(opt);
		}

		for(var i = 0; i < options.length; i++) {
			var next = options[i];
			if(next && !next.visited) {
				next.visited = true;
				next.inPath = true;
				if(solveMaze(next, curGrid))
					return true;
				next.inPath = false;
			}
		}
	}
}

function resetVisited() {
	for(var row = 0; row < rows; row++)
		for(var col = 0; col < cols; col++) {
			grid[row][col].inPath = false;
			grid[row][col].visited = false;
		}
}

function getCell(curGrid, curCell, direction) {
	if(direction === 0) {
		if(curCell.row == 0 || curCell.walls[0])
			return undefined;
		else
			return curGrid[curCell.row - 1][curCell.col];
	}
	else if(direction === 1) {
		if(curCell.col == curGrid[curCell.row].length-1 || curCell.walls[1])
			return undefined;
		else
			return curGrid[curCell.row][curCell.col + 1];
	}
	else if(direction === 2) {
		if(curCell.row == curGrid.length-1 || curCell.walls[2])
			return undefined;
		else
			return curGrid[curCell.row + 1][curCell.col];
	}
	else if(direction === 3) {
		if(curCell.col == 0 || curCell.walls[3])
			return undefined;
		else
			return curGrid[curCell.row][curCell.col - 1];
	}
}

function generateMaze() {
	current.visited = true;
	var next = current.checkNeighbors();
	if(next) {
		next.visited = true;
		
		generatorStack.push(current);

		removeWall(current, next);

		current = next;
	}
	else if(generatorStack.length > 0)
		current = generatorStack.pop();
	else {
		current = undefined;
		mazeGenerated = true;
	}
}

function removeWall(current, next) {
	var x = current.col - next.col;
	if(x === 1) {
		//current: right, next: left
		current.walls[3] = false;
		next.walls[1] = false;
	}
	else if(x === -1) {
		//current: left, next: right
		current.walls[1] = false;
		next.walls[3] = false;
	}

	var y = current.row - next.row;
	if(y === 1) {
		// current: down, next: up
		current.walls[0] = false;
		next.walls[2] = false;
	}
	else if(y === -1) {
		// current: up, next: down
		current.walls[2] = false;
		next.walls[0] = false;
	}
}