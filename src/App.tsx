import React, {useCallback, useRef, useState} from 'react';
import produce from 'immer';

const numRows = 50;
const numCols = 50;
var mouseDown = 0;
const neighbours = [
  [0, 1],
  [1, 0],
  [1, 1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1]
]


const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      // Pushes an array of 0s of size numCols to each row
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows
  });


window.onmousedown = () => {
  mouseDown = 1;
}
window.onmouseup = () => {
  mouseDown = 0;
}

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running)
  runningRef.current = running;
  // As this function does not update and running does,
  // we need to use a reference of running to keep track

  const runSimulation = useCallback(() => {
    if(!runningRef.current) {
      return;
    }
    setGrid(g => {
      return produce(g, gridCopy => {
        for(let i = 0; i < numRows; i++) {
          for(let j = 0; j < numCols; j++) {
            let liveNeighbours = 0;
            neighbours.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              // checking to ensure we are still inside the grid
              if(newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                liveNeighbours += g[newI][newJ];
              }
            })
            if(liveNeighbours < 2 || liveNeighbours > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && liveNeighbours === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      })
    })

    // simulate
    setTimeout(runSimulation, 100);
  }, []);

  // Time to randomise the grid
  const randomiseGrid = () => {
    setGrid(g => {
      return produce(g, gridCopy => {
        for(let i = 0; i < numRows; i++) {
          for(let j = 0; j < numCols; j++) {
            let randNum = Math.random();
            // 10 % chance for a given cell to be alive
            if(randNum < 0.10){
              gridCopy[i][j] = 1;
            }
          }
        }
      })
    })
  }

  const clearGrid = () => {
    setGrid(g => {
      return produce(g, gridCopy => {
        for(let i = 0; i < numCols; i++) {
          for(let j = 0; j < numRows; j++) {
            gridCopy[i][j] = 0;
          }
        }
      })
    })
  }
  return (
    <>
    <button
      onClick={() => {
        setRunning(!running);
        if(!running) {
          runningRef.current = true;
          runSimulation();
        }
      }}
      >{running ? 'Stop' : 'Start'}</button>
    <button
      onClick={() => {
        randomiseGrid();
      }}
      >
    Randomise</button>
    <button
    onClick={() => {
      clearGrid();
    }}
      >
    Clear</button>
  <div style = {{
    display: "grid",
    gridTemplateColumns: `repeat(${numCols}, 20px)`
  }}>
    {grid.map((rows, i) => rows.map((col, j) => 
      <div
      key = {`${i}-${j}`}
      onMouseOver = {() => {
        const newGrid = produce(grid, gridCopy => {
          if(mouseDown)
            gridCopy[i][j] = grid[i][j] ? 0 : 1;
        })
        setGrid(newGrid);
      }}
      style = {{width: 20,
        height: 20,
        backgroundColor: grid[i][j] ? 'black' : undefined,
        border: 'solid 1px black'
    }}
    />
  ))
  }
  </div>
  </>
  );
  
}

export default App;
