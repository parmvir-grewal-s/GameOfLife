import React, {useState} from 'react';

const numRows = 50;
const numCols = 50;


const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      // Pushes an array of 0s of size numCols to each row
      rows.push(Array.from(Array(numCols), () => 0));
    }
    
    return rows
  })

  return (
  <div style = {{
    display: "grid",
    gridTemplateColumns: `repeat(${numCols}, 20px)`
  }}>
    {grid.map((rows, i) => rows.map((col, j) => 
      <div
      key = {`${i}-${j}`}
      style= {{width: 20,
        height: 20,
        backgroundColor: grid[i][j] ? 'pink' : undefined,
        border: 'solid 1px black'
    }}
    />
  ))
  }
  </div>
  );
}

export default App;
