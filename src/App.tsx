import { StartMenu } from './startmenu/StartMenu';
import { useMasterState } from './states/MasterState';
import './App.css';
import { GamePhase, Scene } from './types';
import { Player } from './Player';
import { Avatar } from './Avatar';
import { Obstacle } from './Obstacle';
import { Sahuli } from './aleksi/aleksi';
import { popPlayer } from './Vilperi';

export const rows = 10;
export const cols = 10;

function App() {
   const scene = useMasterState(state => state.scene);
   const setScene = useMasterState(state => state.setScene);
   const players = useMasterState(state => state.players);
   const weapons = useMasterState(state => state.weapons);
   const gamePhase = useMasterState(state => state.gamePhase);
   const playerTurn = useMasterState(state => state.getPlayerTurn);
   const playerTurnId = useMasterState(state => state.playerTurn);
   const hasObstacle = useMasterState(state => state.hasObstacle);
   const activePlayer = useMasterState(state => state.activePlayer);
   const actionsPerTurn = useMasterState(
      state => state.actionsPerTurn,
   );
   const killPlayer = useMasterState(state => state.killPlayer);

   const generateDivs = () => {
      const grid: React.ReactNode[] = [];
      for (let row = 0; row < rows; row++) {
         for (let col = 0; col < cols; col++) {
            const hasPlayer = players.find(
               player =>
                  player.pos.x === col && player.pos.y === row,
            );
            const obstacle = hasObstacle({ x: col, y: row });
            const hasWeapon = weapons.find(
               weapon =>
                  weapon.pos.x === col && weapon.pos.y === row,
            );
            grid.push(
               <div
                  className="game-tile"
                  key={`${row} ${col}`}
                  data-x={col}
                  data-y={row}
               >
                  {obstacle && <Obstacle />}
                  {hasPlayer && !obstacle && (
                     <Player player={hasPlayer} />
                  )}
                  {hasWeapon && !obstacle && (
                     <Sahuli direction={hasWeapon.direction} />
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

   let instructionText = '';

   switch (gamePhase) {
      case GamePhase.Planning:
         instructionText =
            'Plan your moves. Use arow keys to move your bubble and <add instructions for attaaak here>';
         break;
      case GamePhase.Action:
         instructionText = 'Watch the action!';
         break;
   }

   console.log(playerTurn);

   return (
      <div className="container">
         <div className="sidebar">
            <div className="phase">
               <div className="players">
                  {players.map(player => (
                     <Avatar
                        key={player.id}
                        player={player}
                        active={player.id === playerTurnId}
                     />
                  ))}
               </div>
               <div className="phase-inner">
                  <div className="phase-inner__player-name">
                     {playerTurn()?.name}
                  </div>
                  <div className="phase-inner__instructions">
                     {instructionText}
                  </div>
                  <div className="phase-inner__moves-used">
                     <span>{'Moves used: '}</span>
                     <span>
                        {`
                           ${
                              activePlayer()?.queueueueueuedActions
                                 .length
                           }${' / '}${actionsPerTurn}`}
                     </span>
                  </div>
               </div>
            </div>

            {players.map((player, i) => (
               <button
                  key={player.id}
                  onClick={() =>
                     popPlayer(player, () => {
                        killPlayer(player.id);
                     })
                  }
               >
                  Kill player {i + 1}
               </button>
            ))}

            <button
               className="back-to-menu-button"
               onClick={toggleScene}
            >
               Back to menu
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
