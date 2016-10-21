let React    = require('react'),
    ReactDOM = require('react-dom'),
    _        = require('lodash');

let Game = React.createClass({
    getInitialState: function () {
        let startingPosition = { x: 2, y: 2 }
        return {
            board: generateBoard(startingPosition),
            currentPosition: startingPosition,
            health: 100,
            weapon: 'sword',
            level: 1
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
    render: function () {
        return (
            <div>
                <Board board={this.state.board}/>
                <Stats
                    health={this.state.health}
                    level={this.state.level}
                    weapon={this.state.weapon}
                    />
            </div>
        );

    },
    _move: function (keyCode) {
        let y = this.state.currentPosition.y,
            x = this.state.currentPosition.x,
            board = _.clone(this.state.board);

        switch (keyCode) {
            case 38:
                if (this.state.board[y - 1][x].open) {
                    board[y][x].player = false;
                    board[y - 1][x].player = true;
                    y -= 1;
                }
                break;
            case 40:
                if (this.state.board[y + 1][x].open) {
                    board[y][x].player = false;
                    board[y + 1][x].player = true;
                    y += 1;
                }
                break;
            case 39:
                if (this.state.board[y][x + 1].open) {
                    board[y][x].player = false;
                    board[y][x + 1].player = true;
                    x += 1;
                }
                break;
            case 37:
                if (this.state.board[y][x - 1].open) {
                    board[y][x].player = false;
                    board[y][x - 1].player = true;
                    x -= 1;
                }
                break;

        }

        this.setState({
            currentPosition: { y: y, x: x },
            board: board
        });

    }
});

let Board = function (props) {
    let rows = [];
    props.board.forEach(function (row, index) {
        let cells = [];
        row.forEach(function (cell, index) {
            cells.push(<Cell key={index} open={cell.open} player={cell.player}/>);
        });
        rows.push(<tr key={index}>{cells}</tr>);
    });
    return (<table className="game-board"><tbody>{rows}</tbody></table>);
}

let Cell = function (props) {
    return (<td className={`${props.open ? "open" : "closed"} ${props.player ? "player" : ""}`}></td>);
};

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

function generateBoard(pos) {
    let board = [[
        { open: false, player: false },
        { open: false, player: false },
        { open: false, player: false },
        { open: false, player: false },
        { open: false, player: false }
    ], [
            { open: false, player: false },
            { open: true, player: false },
            { open: true, player: false },
            { open: true, player: false },
            { open: false, player: false }
        ], [
            { open: false, player: false },
            { open: true, player: false },
            { open: true, player: false },
            { open: true, player: false },
            { open: false, player: false }
        ], [
            { open: false, player: false },
            { open: true, player: false },
            { open: true, player: false },
            { open: true, player: false },
            { open: false, player: false }
        ], [
            { open: false, player: false },
            { open: false, player: false },
            { open: false, player: false },
            { open: false, player: false },
            { open: false, player: false }
        ]];

    board[pos.y][pos.x].player = true;

    return board;
}