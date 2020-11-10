import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
    <button className={props.isWinnerSquare()}  onClick={props.onClick}>
        {props.value}
    </button>
    );
}
  
class Board extends React.Component {
    renderSquares() {
        const squaresList = this.props.squares;

        let squares = [];
        let row = [];

        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < 3; i++) {
                row.push(
                    <Square 
                        key={3 * j + i}
                        value={squaresList[3 * j + i]}
                        onClick={() => this.props.onClick(3 * j + i)}
                        isWinnerSquare={() => {
                            if (this.props.winnerSquares != null) {
                                if ((this.props.winnerSquares[j] === 3 * j + i) || (this.props.winnerSquares[i] === 3 * j + i)) {
                                    return "square isWinnerSquare"
                                } 
                            }
                            return "square"
                        }}
                    />
                )
            }     
            squares.push(
                <div className="board-row" key={j}>
                    {row}
                </div>
            )  
            row = [];
        }

        return squares;
    }
    render() {
        return (
        <div>
            {this.renderSquares()}
        </div>
        );
    }
}

class Game extends React.Component {
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice(0);

        if (squares[i]) {
            this.setState({
                selectElem: i
            })    
        } else {
            this.setState({
                selectElem: null
            }) 
        }
        

        if ( calculateWinner(current.squares).winner || squares[i] ) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";

        
        this.setState({
            history: history.concat([{
                squares: squares,
                coords: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });

        
    }
    reverseMoves() {
        this.setState({
            historyIsReversed: !this.state.historyIsReversed,
        })
    }
    restart() {
        this.setState({
            history: [{
                squares: Array(9).fill(null),
            }],
            historyIsReversed: false,
            stepNumber: 0,
            selectElem: null,
            xIsNext: true,
        })
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            selectElem: null,
        })
    }
    constructor(props) {
        super(props);

        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            historyIsReversed: false,
            stepNumber: 0,
            selectElem: null,
            xIsNext: true,
        }
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares).winner;

        const moves = history.map((step, move) => {
            const x = step.coords % 3 + 1;
            const y = (step.coords - (step.coords % 3)) / 3 + 1;

            const desc = move ? 
                `Перейти к ходу #${move} (${x}, ${y})` :
                `К началу игры`;

            let isActive = step.coords === this.state.selectElem ? "isActive" : null;

            return (
                <li key={move} >
                    <button className={isActive} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        });

        if (this.state.historyIsReversed) {
            moves.reverse();
        }

        const status = winner ? `Выиграл: ${winner}` : current.squares.includes(null) ? (`Следующий ход: ${this.state.xIsNext ? "X" : "O"}`) : "Ничья";

        return (
        <div className="game">
            <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                winnerSquares={calculateWinner(current.squares).winnerSquares}
            />
            </div>
            <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            <div>
                <button onClick={() => this.reverseMoves()}>Сортировать</button>
                &nbsp;
                <button onClick={() => this.restart()}>Заново</button>
            </div>
            </div>
        </div>
        );
    }
}


// ========================================

ReactDOM.render(
<Game />,
document.getElementById('root')
);


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {

        return {
            winner: squares[a],
            winnerSquares: lines[i],
        };
    }
  }
  return {
    winner: null,
    winnerSquares: null,
};
}