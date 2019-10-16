import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props){
    //console.log('this is the square function');
    //console.log(props.i);
    
      if(props.winLine && props.winLine.includes(props.i)){
        console.log(props.winLine);
        return (
            <button className="square winLine" onClick={() => props.onClick}> 
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
        xIsNext={this.props.turn}
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
            emptyBoxes: [0,1,2,3,4,5,6,7,8],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i){
        //console.log('this is handle click,', i)

        const getRow = ( i => { return ((i+3)%3)+1 ; });

        const getCol = (i => { return (Math.floor(i/3+1)); });

        const history = this.state.history
        const current = history[history.length-1]; // the last 'squares' object in the 'history' array  Ex: {squares: Array(9)}
        const squares = current.squares.slice(); // making a copy of what's inside the {squares: Array(9)}  Ex: [null, null, "X", null, null, null, null, null, null]
        const row = getRow(i);
        const col = getCol(i);

        if(calculateWinner(squares) || squares[i]){ // this is to make sure if calculateWinner(squares) or squares[i] have a value(not returning 'null', which means the square is already clicked or the game is ended), it wont change the states
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' :'O'; 


        
          this.setState
          ({
            history:history.concat([{squares:squares, row:row, col:col}]), // adding the current squares array in the history array
            stepNumber: history.length,
            xIsNext: ! this.state.xIsNext
          })

        
    }

    jumpTo(step){
        //console.log('this is jumpTo \n')

        this.setState({
            stepNumber : step,
            xIsNext: (step % 2) === 0,
            history: this.state.history.slice(0,step+1)
        })

    }

    bestSpot()
    {
      const history = this.state.history
      const current = history[history.length-1]; // the last 'squares' object in the 'history' array  Ex: {squares: Array(9)}
      const squares = current.squares.slice(); 

      let ans = this.minimax(squares,'O');

      return ans.index;
    }

    availableSpots()
    {
      const history = this.state.history
      const current = history[history.length-1]; // the last 'squares' object in the 'history' array  Ex: {squares: Array(9)}
      const squares = current.squares.slice();

      let arr = [];

      for(let i = 0; i< squares.length; i++)
      {
        if(squares[i] == null)
        {
          arr.push(i)
        }
      }
      return arr;
    }

    minimax(squares, player)
    {
      let arr = [];

      for(let i = 0; i< squares.length; i++)
      {
        if(squares[i] == null)
        {
          arr.push(i)
        }
      }

      let aveSpots = arr;

      console.log("aveSpots : ", aveSpots);

      if(calculateWinner(squares) && calculateWinner(squares).side === 'X')
      {
        console.log("winnner X");
        return {score: -10};
      }
      else if(calculateWinner(squares) && calculateWinner(squares).side === 'O')
      {
        console.log("winnner O");
        return {score: 10};
      }
      else if(aveSpots.length===0)
      {
        console.log("Tie Game");
        return {score: 0};
      }

      let moves = [];

      for(let i = 0; i < aveSpots.length; i++)
      {
        let move = {};
        move.index = aveSpots[i];
        squares[aveSpots[i]] = player;

        if (player === 'O') {
          let result = this.minimax(squares,'X');
          move.score = result.score;
        } else {
          let result = this.minimax(squares, 'O');
          move.score = result.score;
        }
    
        squares[aveSpots[i]] = null;
        moves.push(move);
      }

    let bestMove;
    if(player === 'O') 
    {
      let bestScore = -10000;

      for(let i = 0; i < moves.length; i++) 
      {
        if (moves[i].score > bestScore) 
        {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } 
    else 
    {
      let bestScore = 10000;
      for(let i = 0; i < moves.length; i++) 
      {
        if (moves[i].score < bestScore) 
        {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
      return moves[bestMove];
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice(); //just copying
        const winner = calculateWinner(squares);

       // The map() method creates a new array with the results of calling a 
       // provided function on every element in the calling array.

        const moves = history.map((steps,move) => { // move is the index number of the current element being processed in the array.
            
            const row = this.state.history[move].row;
            const col = this.state.history[move].col;
            let desc;
            

            // if(move % 2 === 1)
            // {
              const moveHistory = 'Go to move # '+ (move) + ' (row: '+row+' col: '+col+')';
              desc = move ? moveHistory  : 'Go to game start';
            //}
            
            
            if(move === this.state.stepNumber){
                return( // it returns a value for every element in the 'history Array
                <div className="list">
                  <li key={move}>
                      <button className='bold' onClick={() => this.jumpTo(move)}>{desc}</button>
                  </li>
                </div>
              );
            }
            else {
                return( // it returns a value for every element in the 'history Array
                <div className="list">
                  <li key={move}>
                      <button clasName="list" onClick={() => this.jumpTo(move)}>{desc}</button>
                  </li>
                </div>
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

        

        if(!this.state.xIsNext)
        {
          let compSpot = this.bestSpot();
          this.handleClick(compSpot);
        }
        
      return (
        <div className="container">
          <div className="game">
            <div className="game-board">
              <Board 
                  squares={current.squares}  /* passing down the array Ex: [null, null, "X", null, null, null, null, null, null] */
                  onClick={(i)=> this.handleClick(i)}
                  turn={this.state.xIsNext}
                  winLine={winLine}/> {/*passin down the handle click function to 'Board  */}
            </div>
            <div className="game-info">
              <div>{status}</div>
              <ol>{moves}</ol>
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
        return ({ side:squares[a], nums:lines[i] });
      }
    }
    return null;
  }
