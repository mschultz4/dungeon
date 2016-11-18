"use strict";


//let cells = require('./cells.js');
let cells = {
	getTree: () => TREE,
	getPlayer: () => PLAYER,
	getEmpty: () => EMPTY,
	getRandom: getRandom
}


let Game = React.createClass({
	getInitialState: function () {
    	return {
        	board: this._generateBoard(25, 25, cells.getPlayer()),
        	player: cells.getPlayer(),
        	status: 'NEW_GAME'
    	};
	},
	componentWillMount: function () {
    	let self = this;
    	document.addEventListener('keydown', function (e) {
        	self._move(e.keyCode);
    	});
	},
	componentWillUnmount: function () {
    	document.removeEventListener('keydown');
	},
	componentDidUpdate: function () {
    	if (this.state.player.health < 1) {
        	this.replaceState(this.getInitialState());
    	}
	},
	render: function () {
    	return (
        	<div>
            	<div>
                	<button type='button' onClick={this._startGame}
                    	className={this.state.status === 'NEW_GAME' ? 'show' : 'hidden'}>start</button>
            	</div>
            	<div className={this.state.status === 'NEW_GAME' ? 'hidden' : 'show'}>
                	<Board board={this.state.board} playerPosition={this.state.player.currentPosition}/>
                	<Stats
                    	health={this.state.player.health}
                    	level={this.state.player.level}
                    	weapon={this.state.player.weapon.name}
                    	/>
            	</div>
        	</div>
    	);


	},
	_startGame: function () { this.setState({ status: 'IN_PROGRESS' }) },
	_move: function (keyCode) {
    	let player = Object.assign({}, this.state.player),
        	y = player.currentPosition.y,
        	x = player.currentPosition.x,
        	board = _.cloneDeep(this.state.board),
        	monsters = [];


    	// move the player and set last cell to empty
    	switch (keyCode) {
        	case 38:
            	if (!this.state.board[y - 1][x].block) {
                	board[y][x] = cells.getEmpty();
                	board[y - 1][x] = player;
                	y -= 1;
            	}
            	break;
        	case 40:
            	if (!this.state.board[y + 1][x].block) {
                	board[y][x] = cells.getEmpty();
                	board[y + 1][x] = player;
                	y += 1;
            	}
            	break;
        	case 39:
            	if (!this.state.board[y][x + 1].block) {
                	board[y][x] = cells.getEmpty();
                	board[y][x + 1] = player;
                	x += 1;
            	}
            	break;
        	case 37:
            	if (!this.state.board[y][x - 1].block) {
                	board[y][x] = cells.getEmpty();
                	board[y][x - 1] = player;
                	x -= 1;
            	}
            	break;


    	}


    	// set current position
    	player.currentPosition = { y: y, x: x };


    	// collect any items
    	player.collectItem(this.state.board[y][x]);


    	// find any monsters and fight them
    	getSurroundingPositions(player.currentPosition)
        	.filter(pos => {
            	return board[pos.y][pos.x].type === 'monster';
        	})
        	.forEach(pos => {
            	let monster = board[pos.y][pos.x];
            	board[pos.y][pos.x] = player.fight(monster) ? cells.getEmpty() : monster;
        	});


    	this.setState({
        	player: player,
        	board: board
    	});


	},
	_generateBoard: function (height, width, player) {


    	let board = [];


    	for (let i = 0; i < height; i++) {
        	let row = [];
        	for (let j = 0; j < width; j++) {
            	let cell;


            	if (i === 0 || j === 0 || i === (height - 1) || j === (width - 1)) {
                	cell = cells.getTree();
            	} else {
                	cell = cells.getRandom();
            	}


            	row.push(cell);
        	}
        	board.push(row);
    	}


    	board[player.currentPosition.y][player.currentPosition.x] = player;


    	return board;
	}
});


let Board = function (props) {
	let rows = [];
	props.board.forEach(function (row, rowIndex) {
    	let cells = [];
    	row.forEach(function (cell, colIndex) {
        	let xDiff = props.playerPosition.x - colIndex,
            	yDiff = props.playerPosition.y - rowIndex,
            	hide = Math.abs(xDiff) < 5 && Math.abs(yDiff) < 5 ? '' : 'hide',
            	update = Math.abs(xDiff) < 6 && Math.abs(yDiff) < 6 ? true : false;


        	cells.push(
            	<Cell
                	key={colIndex}
                	display={cell.display() }
                	hide={hide}
                	update={update}
                	/>);
    	});
    	rows.push(<tr key={rowIndex}>{cells}</tr>);
	});
	return (<table className="game-board"><tbody>{rows}</tbody></table>);
}


let Cell = React.createClass({
	/*   shouldComponentUpdate: function (nextProps, nextState) {
       	return nextProps.update;
   	},
   	*/
	render: function () {
    	return (<td className={`${this.props.display} ${this.props.hide}`}>{this.props.display}</td>);
	}
});




let Stats = function (props) {
	return (
    	<table>
        	<thead>
            	<tr>
                	<th>level</th>
                	<th>health</th>
                	<th>weapon</th>
            	</tr>
        	</thead>
        	<tbody>
            	<tr>
                	<td>{props.level}</td>
                	<td>{props.health}</td>
                	<td>{props.weapon}</td>
            	</tr>
        	</tbody>
    	</table>)
};


ReactDOM.render(<Game/>, document.getElementById('game'));


// utils




function getSurroundingPositions(pos) {
	let positions = [];


	positions.push({ x: pos.x, y: pos.y + 1 });
	positions.push({ x: pos.x, y: pos.y - 1 });
	positions.push({ x: pos.x + 1, y: pos.y });
	positions.push({ x: pos.x - 1, y: pos.y });


	return positions;
}
