import { useState } from 'react';
import './App.css';
import { V2 } from './types';
import { Player } from './Player';

export const rows = 10;
export const cols = 10;

function App() {
   const [playerPosition, setPlayerPosition] = useState<V2>({
      x: 5,
      y: 5,
   });

   const generateDivs = () => {
      const grid: React.ReactNode[] = [];
      for (let row = 0; row < rows; row++) {
         for (let col = 0; col < cols; col++) {
            const drawPlayer =
               row === playerPosition.y && col === playerPosition.x;
            grid.push(
               <div className="game-tile" key={`${row} ${col}`}>
                  {drawPlayer && (
                     <Player
                        position={playerPosition}
                        setPosition={setPlayerPosition}
                     />
                  )}
               </div>,
            );
         }
      }

      return grid;
   };

   const divs = generateDivs();

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
