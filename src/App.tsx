import './App.css';

const rows = 10;
const cols = 10;

const generateDivs = (rows: number, cols: number) => {
   const grid: React.ReactNode[] = [];
   for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
         grid.push(
            <div className="game-tile" key={`${row} ${col}`}></div>,
         );
      }
   }

   return grid;
};

const divs = generateDivs(rows, cols);

function App() {
   return (
      <div className="container">
         <div className="game-container">
            <div
               className="game-grid"
               style={{
                  gridTemplateRows: `repeat(${rows}, 1fr)`,
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
               }}
            >
               {divs}
            </div>
         </div>
      </div>
   );
}

export default App;
