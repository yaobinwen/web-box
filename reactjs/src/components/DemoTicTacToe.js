import Grid from "@mui/material/Grid";
import { StrictMode } from "react";
import { useState } from "react";
import "./TicTacToe.css";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function determineWinner(squares) {
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
      return squares[a];
    }
  }
  return null;
}

function Board({ nextMark, squares, onPlay }) {
  let winner = null;

  function handleClick(i) {
    if (winner) {
      // If someone has won, we stop playing.
      return;
    }

    if (squares[i]) {
      // If the square has been marked, do not alternate its mark.
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = nextMark;

    onPlay(nextSquares);
  }

  winner = determineWinner(squares);
  let status;
  if (winner) {
    status = "Winner: Player " + winner;
  } else {
    status = "Next player: " + nextMark;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function Game() {
  const [nextMarkIndex, setNextMarkIndex] = useState(0);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  const MARKS = ["X", "O"];
  const PLAYER_X = 0;
  const PLAYER_O = 1;

  function handlePlay(nextSquares) {
    // NOTE(ywen): We just store `nextSquares` here. JavaScript uses references
    // instead of copies so if something elsewhere still has a reference to
    // `nextSquares`, it can change the contents of `nextSquares` which is
    // supposed to be unchanged during the game (because it's part of the
    // history). This is another advantage of implementing immutability in the
    // code: `Board`'s `handleClick` always makes a copy of the squares and
    // mutate the copy, that essentially means `handleClick` obtains a new
    // `nextSquares` and releases the reference to the previous `nextSquares`,
    // so it won't change the previous `nextSquares` by accident.
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setNextMarkIndex((nextMarkIndex + 1) % 2);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setNextMarkIndex(nextMove % MARKS.length === 0 ? PLAYER_X : PLAYER_O);
  }

  const moves = history.map((squares, moveNum) => {
    let description;
    if (moveNum > 0) {
      description = "Go to move #" + moveNum;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={moveNum}>
        <button className="move" onClick={() => jumpTo(moveNum)}>
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div>
        <Board
          nextMark={MARKS[nextMarkIndex]}
          squares={currentSquares}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function DemoTicTacToe() {
  return (
    <StrictMode>
      <h1>Tic-Tac-Toe Game</h1>
      <p>A learning of React.js programming.</p>
      <h3>
        Main reference:
        <a
          href="https://react.dev/learn/tutorial-tic-tac-toe"
          target="_blank"
          rel="noreferrer"
        >
          react.dev: Tutorial: Tic-Tac-Toe
        </a>
      </h3>
      <Grid container spacing={2} sx={{ paddingTop: 2.5, paddingBottom: 2.5 }}>
        <Grid item xs={12} sx={{ paddingBottom: 2.5 }}>
          <Game />
        </Grid>
      </Grid>
    </StrictMode>
  );
}

export default DemoTicTacToe;
