import React, { useState } from 'react';

const SudokuSolver = () => {
  const [board, setBoard] = useState(
    Array(9).fill().map(() => Array(9).fill(''))
  );
  const [isLoading, setSolving] = useState(false);

  // Check if a number is valid at position
  const isValid = (board, row, col, num) => {
    // Check row
    for (let j = 0; j < 9; j++) {
      if (board[row][j] === num) return false;
    }
    
    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (board[i][j] === num) return false;
      }
    }
    
    return true;
  };

  // Find empty cell
  const findEmptyCell = (board) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === 0) {
          return [i, j];
        }
      }
    }
    return null;
  };

  // Solve sudoku using backtracking
  const solveSudoku = (board) => {
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) return true; // Solved
    
    const [row, col] = emptyCell;
    
    for (let num = 1; num <= 9; num++) {
      if (isValid(board, row, col, num)) {
        board[row][col] = num;
        
        if (solveSudoku(board)) {
          return true;
        }
        
        board[row][col] = 0; // Backtrack
      }
    }
    
    return false;
  };

  // Handle cell input
  const handleCellChange = (row, col, value) => {
    const newBoard = [...board];
    
    // Only allow numbers 1-9 or empty
    if (value === '' || (value >= '1' && value <= '9')) {
      newBoard[row][col] = value;
      setBoard(newBoard);
    }
  };

  // Solve the puzzle
  const handleSolve = () => {
    setSolving(true);
    
    // Convert string board to number board for solver
    const numberBoard = board.map(row => 
      row.map(cell => cell === '' ? 0 : parseInt(cell))
    );
    
    // Solve with animation delay
    setTimeout(() => {
      if (solveSudoku(numberBoard)) {
        // Convert back to strings for display
        const solvedBoard = numberBoard.map(row => 
          row.map(cell => cell.toString())
        );
        setBoard(solvedBoard);
      } else {
        alert('No solution exists for this puzzle!');
      }
      setSolving(false);
    }, 500);
  };

  // Clear the board
  const handleClear = () => {
    setBoard(Array(9).fill().map(() => Array(9).fill('')));
  };

  // Load example puzzle
  const loadExample = () => {
    const example = [
      ['5', '3', '', '', '7', '', '', '', ''],
      ['6', '', '', '1', '9', '5', '', '', ''],
      ['', '9', '8', '', '', '', '', '6', ''],
      ['8', '', '', '', '6', '', '', '', '3'],
      ['4', '', '', '8', '', '3', '', '', '1'],
      ['7', '', '', '', '2', '', '', '', '6'],
      ['', '6', '', '', '', '', '2', '8', ''],
      ['', '', '', '4', '1', '9', '', '', '5'],
      ['', '', '', '', '8', '', '', '7', '9']
    ];
    setBoard(example);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Sudoku Solver
          </h1>
          <p className="text-gray-600">
            Enter the given numbers and click solve to get the complete solution
          </p>
        </div>

        {/* Sudoku Board */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
          <div className="grid grid-cols-9 gap-0 border-4 border-gray-800 mx-auto w-fit">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  maxLength="1"
                  value={cell}
                  onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                  className={`
                    w-12 h-12 text-center text-xl font-bold
                    border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${cell ? 'bg-blue-50 text-blue-800' : 'bg-white'}
                    ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-b-gray-800' : ''}
                    ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-r-gray-800' : ''}
                    hover:bg-gray-50 transition-colors
                  `}
                  disabled={isLoading}
                />
              ))
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={handleSolve}
            disabled={isLoading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Solving...
              </span>
            ) : (
              'Solve Puzzle'
            )}
          </button>
          
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50"
          >
            Clear Board
          </button>
          
          <button
            onClick={loadExample}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50"
          >
            Load Example
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">How to use:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Click on any empty cell to enter a number (1-9)</li>
            <li>Enter all the given numbers from your Sudoku puzzle</li>
            <li>Click "Solve Puzzle" to get the complete solution</li>
            <li>Use "Load Example" to try with a sample puzzle</li>
            <li>Click "Clear Board" to start over</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SudokuSolver;