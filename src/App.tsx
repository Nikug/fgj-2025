import { StartMenu } from './startmenu/StartMenu';
import { useMasterState } from './states/MasterState';
import './App.css';
import { GamePhase, Scene } from './types';
import { Player } from './Player';
import { Avatar } from './Avatar';
import { Sahuli } from './aleksi/aleksi';

export const rows = 10;
export const cols = 10;

function App() {
   const scene = useMasterState(state => state.scene);
   const setScene = useMasterState(state => state.setScene);
   const players = useMasterState(state => state.players);
   const weapons = useMasterState(state => state.weapons)
   const gamePhase = useMasterState(state => state.gamePhase);
   const playerTurn = useMasterState(state => state.getPlayerTurn);

   const generateDivs = () => {
      const grid: React.ReactNode[] = [];
      for (let row = 0; row < rows; row++) {
         for (let col = 0; col < cols; col++) {
            const hasPlayer = players.find(
               player =>
                  player.pos.x === col && player.pos.y === row,
            );
            const hasWeapon = weapons.find(
               weapon =>
                  weapon.pos.x === col && weapon.pos.y === row,
            )
            grid.push(
               <div className="game-tile" key={`${row} ${col}`}>
                  {hasPlayer && <Player player={hasPlayer} />}
                  {hasWeapon && <Sahuli direction={hasWeapon.direction}/>}
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
         <div className="sidebar">
            {gamePhase === GamePhase.Planning && (
               <div className="phase">
                  <div className="players">
                     {players.map(player => (
                        <Avatar key={player.id} player={player} />
                     ))}
                  </div>
                  <div className="phase-inner">
                     <p>It is planning my dudes</p>
                     <p>Turn: {playerTurn()?.name}</p>
                  </div>
                  <div className="placeholder">placeholder</div>
               </div>
            )}

            <button onClick={toggleScene}>
               Back to start screen
            </button>
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
