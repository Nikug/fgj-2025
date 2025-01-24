import { useState } from 'react';
import './App.css';
import { StartMenu } from './startmenu/StartMenu';

export const enum Scene {
   StartMenu,
   Game,
}

function App() {
   const [count, setCount] = useState(0);
   const [scene, setScene] = useState<Scene>(Scene.StartMenu);

   const toggleScene = () =>
      setScene(
         scene === Scene.StartMenu ? Scene.Game : Scene.StartMenu,
      );

   if (scene === Scene.StartMenu) {
      return <StartMenu changeScene={toggleScene} />;
   }

   const rows = 10;
   const cols = 10;

   const generateDivs = (rows: number, cols: number) => {
      const grid: React.ReactNode[] = [];
      for (let row = 0; row < rows; row++) {
         for (let col = 0; col < cols; col++) {
            grid.push(
               <div
                  className="game-tile"
                  key={`${row} ${col}`}
               ></div>,
            );
         }
      }

      return grid;
   };

   const divs = generateDivs(rows, cols);

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
         <h1>Vite + React</h1>
         <div className="card">
            <button onClick={() => setCount(count => count + 1)}>
               count is{' '}
               {Math.random() > 0.5
                  ? count
                  : Math.round(Math.random() * 10)}
            </button>
            <p>Tsumonjää</p>
            <button onClick={toggleScene}>toggle scene</button>
         </div>
         <p className="read-the-docs">Hähähähä</p>
      </div>
   );
}

export default App;
