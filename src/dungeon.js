let React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash');

"use strict";

let Game = React.createClass({
    getInitialState: function () {
        let startingPosition = { x: 2, y: 2 }
        return {
            board: generateBoard(startingPosition),
            player: {
                currentPosition: startingPosition,
                health: 100,
                weapon: {name: 'sword', strength: '1'},
                level: 1
            }
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
                    health={this.state.player.health}
                    level={this.state.player.level}
                    weapon={this.state.player.weapon.name}
                    />
            </div>
        );

    },
    _move: function (keyCode) {
        let player = Object.assign({}, this.state.player),
            y      = player.currentPosition.y,
            x      = player.currentPosition.x,
            board  = _.clone(this.state.board);

        switch (keyCode) {
            case 38:
                if (this.state.board[y - 1][x].open) {
                    board[y][x].fill = '';
                    board[y - 1][x].fill = 'player';
                    y -= 1;
                }
                break;
            case 40:
                if (this.state.board[y + 1][x].open) {
                    board[y][x].fill = '';
                    board[y + 1][x].fill = 'player';
                    y += 1;
                }
                break;
            case 39:
                if (this.state.board[y][x + 1].open) {
                    board[y][x].fill = '';
                    board[y][x + 1].fill = 'player';
                    x += 1;
                }
                break;
            case 37:
                if (this.state.board[y][x - 1].open) {
                    board[y][x].fill = '';
                    board[y][x - 1].fill = 'player';
                    x -= 1;
                }
                break;

        }

        player.currentPosition = {y: y, x: x};

        this.setState({
            player: player,
            board: board
        });

    }
});

let Board = function (props) {
    let rows = [];
    props.board.forEach(function (row, index) {
        let cells = [];
        row.forEach(function (cell, index) {
            cells.push(<Cell key={index} open={cell.open} fill={cell.fill}/>);
        });
        rows.push(<tr key={index}>{cells}</tr>);
    });
    return (<table className="game-board"><tbody>{rows}</tbody></table>);
}

let Cell = function (props) {
    let fill = '';
    switch(props.fill){
       case 'player':
            fill = 'P';
            break; 
    }
    return (<td className={props.open ? "open" : "closed"}>{fill}</td>);
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
        { open: false, fill: '' },
        { open: false, fill: '' },
        { open: false, fill: '' },
        { open: false, fill: '' },
        { open: false, fill: '' }
    ], [
            { open: false, fill: '' },
            { open: true, fill: '' },
            { open: true, fill: '' },
            { open: true, fill: '' },
            { open: false, fill: '' }
        ], [
            { open: false, fill: '' },
            { open: true, fill: '' },
            { open: true, fill: '' },
            { open: true, fill: '' },
            { open: false, fill: '' }
        ], [
            { open: false, fill: '' },
            { open: true, fill: '' },
            { open: true, fill: '' },
            { open: true, fill: '' },
            { open: false, fill: '' }
        ], [
            { open: false, fill: '' },
            { open: false, fill: '' },
            { oen: false, fill: '' },
            { open: false, fill: '' },
            { open: false, fill: '' }
        ]];

    board[pos.y][pos.x].fill = 'player';

    return board;
}
