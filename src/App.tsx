import { useState } from 'react';
import { StartMenu } from './startmenu/StartMenu';
import { useMasterState } from './states/MasterState'
import './App.css';
import { V2 } from './types';
import { Player } from './Player';

export const rows = 10;
export const cols = 10;

export const enum Scene {
   StartMenu,
   Game,
}

function App() {
   const [scene, setScene] = useState<Scene>(Scene.StartMenu);
   const [playerPosition, setPlayerPosition] = useState<V2>({
      x: 5,
      y: 5,
   });

   const generateDivs = () => {
      const grid: React.ReactNode[] = [];
      for (let row = 0; row < rows; row++) {
         for (let col = 0; col < cols; col++) {
            const count = useMasterState((state) => state.count)
            const drawPlayer =
               row === playerPosition.y && col === playerPosition.x;
            grid.push(
               <div className="game-tile" onClick={useMasterState((state) => state.increase)} key={`${row} ${col}`}>
                  {count}
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

   const toggleScene = () =>
      setScene(
         scene === Scene.StartMenu ? Scene.Game : Scene.StartMenu,
      );

   if (scene === Scene.StartMenu) {
      return <StartMenu changeScene={toggleScene} />;
   }

   return (
      <div className="container">
         <button onClick={toggleScene}>toggle scene</button>
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
