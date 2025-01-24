import { useState } from 'react';
import { StartMenu } from './startmenu/StartMenu';
import { useMasterState } from './states/MasterState';
import './App.css';
import { Scene } from './types';
import { Player } from './Player';

export const rows = 10;
export const cols = 10;

function App() {
   const [scene, setScene] = useState<Scene>(Scene.StartMenu);
   const increaseCount = useMasterState(state => state.increase);
   const players = useMasterState(state => state.players);
   const movePlayer = useMasterState(state => state.movePlayer);

   const generateDivs = () => {
      const grid: React.ReactNode[] = [];
      for (let row = 0; row < rows; row++) {
         for (let col = 0; col < cols; col++) {
            for (const player of players) {
               const drawPlayer =
                  row === player.pos.y && col === player.pos.x;
               grid.push(
                  <div
                     className="game-tile"
                     onClick={increaseCount}
                     key={`${row} ${col}`}
                  >
                     {drawPlayer && (
                        <Player
                           player={player}
                           setPosition={pos =>
                              movePlayer(player.id, pos)
                           }
                        />
                     )}
                  </div>,
               );
            }
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
         <div style={{ padding: '1rem' }}>
            <button onClick={toggleScene}>toggle scene</button>
         </div>
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
