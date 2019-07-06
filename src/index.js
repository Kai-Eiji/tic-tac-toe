import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props){
    //console.log('this is the square function');
    //console.log(props.i);
      if(props.winLine && props.winLine.includes(props.i)){
        console.log(props.winLine);
        return (
            <button className="square winLine" onClick={props.onClick}> 
                {props.value}
            </button>
        );
      }
      else{
        return ( // don't have to use 'this.props' can simply use props because the function gets 'props as an argument'
            <button className="square" onClick={props.onClick}> {/*this calls the handleClick(i) */}
                {props.value}
            </button>
        );
      }
      
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      //console.log('this is the renderSquare function');
      return ( //this.props.squares is Array(9)  Ex: [null, null, "X", null, null, null, null, null, null]
      <Square 
        value={this.props.squares[i]}
        onClick={ ()=> this.props.onClick(i)}// passing down a function
        winLine={this.props.winLine} 
        i={i}
        />
      );
    }
  
    render() {
      //console.log('this is render in Board');
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            history: [{squares:Array(9).fill(null), row:null, col:null}], // history will have an array of squares and squares has an arry of 9 elements
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i){
        //console.log('this is handle click,', i)
        const history = this.state.history.slice(0,this.state.stepNumber +1);
        const current = history[history.length-1]; // the last 'squares' object in the 'history' array  Ex: {squares: Array(9)}
        const squares = current.squares.slice(); // making a copy of what's inside the {squares: Array(9)}  Ex: [null, null, "X", null, null, null, null, null, null]
        const row = getRow(i);
        const col = getCol(i);

        if(calculateWinner(squares) || squares[i]){ // this is to make sure if calculateWinner(squares) or squares[i] have a value(not returning 'null', which means the square is already clicked or the game is ended), it wont change the states
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' :'O';
        this.setState({
            history:history.concat([{squares:squares, row:row, col:col}]), // adding the current squares array in the history array
            stepNumber: history.length,
            xIsNext: ! this.state.xIsNext});
    }

    jumpTo(step){
        //console.log('this is jumpTo \n')

        this.setState({
            stepNumber : step,
            xIsNext: (step % 2) === 0
        })
    }


    render() {
        //console.log('this is render \n')

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        const winner = calculateWinner(squares);

       // The map() method creates a new array with the results of calling a 
       // provided function on every element in the calling array.

        const moves = history.map((steps,move) => { // move is the index number of the current element being processed in the array.
            
            const row = this.state.history[move].row;
            const col = this.state.history[move].col;

            const desc = move ? 'Go to move # '+ move + ' (row: '+row+' col: '+col+')'  : 'Go to game start';
            
            if(move === this.state.stepNumber){
                return( // it returns a value for every element in the 'history Array
                <li key={move}>
                    <button className='bold' onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
              );
            }
            else{
                return( // it returns a value for every element in the 'history Array
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
              );
            }
            
        });

        let status;
        let winLine;
        if(winner){
            status = 'winner: '+winner.side;
            winLine = winner.nums;
            console.log(winLine);
        }
        else{
            status = 'Next player:' + (this.state.xIsNext ? 'X':'O');
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares}  /* passing down the array Ex: [null, null, "X", null, null, null, null, null, null] */
                onClick={(i)=> this.handleClick(i)}
                winLine={winLine}/> {/*passin down the handle click function to 'Board  */}
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
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
        return ({ side:squares[a], nums:lines[i] });
      }
    }
    return null;
  }


  const getRow = ( i => { return ((i+3)%3)+1 ; });

  const getCol = (i => { return (Math.floor(i/3+1)); });
  