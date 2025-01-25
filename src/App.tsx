import { StartMenu } from './startmenu/StartMenu';
import { useMasterState } from './states/MasterState';
import './App.css';
import { GamePhase, Scene } from './types';
import { Player } from './Player';
import { Avatar } from './Avatar';
import { Obstacle } from './Obstacle';
import { popPlayer } from './Vilperi';
import { SelectMoves } from './SelectMoves';
import { AnyWeapon } from './AnyWeapon';
import { isAttack } from './superSecretFile';

export const rows = 10;
export const cols = 10;

function App() {
   const scene = useMasterState(state => state.scene);
   const setScene = useMasterState(state => state.setScene);
   const players = useMasterState(state => state.players);
   const deadPlayers = useMasterState(state => state.deadPlayers);
   const weapons = useMasterState(state => state.weapons);
   const gamePhase = useMasterState(state => state.gamePhase);
   const playerTurn = useMasterState(state => state.getPlayerTurn);
   const playerTurnId = useMasterState(state => state.playerTurn);
   const hasObstacle = useMasterState(state => state.hasObstacle);
   const activePlayer = useMasterState(state => state.activePlayer);
   const actionsPerTurn = useMasterState(
      state => state.actionsPerTurn,
   );
   const actionActionsPerTurn = useMasterState(
      state => state.actionActionsPerTurn,
   );
   const killPlayer = useMasterState(state => state.killPlayer);

   const generateDivs = () => {
      const grid: React.ReactNode[] = [];
      for (let row = 0; row < rows; row++) {
         for (let col = 0; col < cols; col++) {
            const tilePlayers = players.filter(
               player =>
                  player.pos.x === col && player.pos.y === row,
            );
            const obstacle = hasObstacle({ x: col, y: row });
            const tileWeapons = weapons.filter(
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
                  {tilePlayers.map(tilePlayer => (
                     <Player
                        key={tilePlayer.id}
                        player={tilePlayer}
                     />
                  ))}
                  {tileWeapons.map(tileWeapon => (
                     <AnyWeapon
                        key={tileWeapon.id}
                        weapon={tileWeapon}
                     />
                  ))}
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

   const gameOver = players.length <= 1;
   let instructionText = '';

   if (players.length === 1) {
      instructionText = 'Game over! ' + players[0].name + ' won!';
   } else if (players.length === 0) {
      instructionText = 'Game over! No winners!';
   } else {
      switch (gamePhase) {
         case GamePhase.Planning:
            instructionText =
               'Plan your moves. Use the buttons below or use arow keys to move your bubble and space + arrow keys to shoot.';
            break;
         case GamePhase.Action:
            instructionText = 'Watch the action!';
            break;
      }
   }

   return (
      <div className="container">
         <div className="sidebar">
            <div className="phase">
               <div className="players">
                  {players.concat(deadPlayers ?? []).map(player => (
                     <Avatar
                        key={player.id}
                        player={player}
                        active={player.id === playerTurnId}
                     />
                  ))}
               </div>
               <div className="phase-inner">
                  {gamePhase === GamePhase.Planning && !gameOver && (
                     <div className="phase-inner__player-name">
                        <span>{playerTurn()?.name} has</span>
                        <p>
                           {`${
                              actionsPerTurn -
                              (activePlayer()?.queueueueueuedActions
                                 .length ?? 0)
                           }${' / '}${actionsPerTurn}${' moves left'}`}
                        </p>
                        <p>
                           {`${
                              actionActionsPerTurn -
                              (activePlayer()?.queueueueueuedActions.filter(
                                 isAttack,
                              ).length ?? 0)
                           }${' / '}${actionActionsPerTurn}${' attacks left'}`}
                        </p>
                     </div>
                  )}
                  <div className="phase-inner__instructions">
                     {instructionText}
                  </div>
                  {playerTurnId &&
                     gamePhase === GamePhase.Planning &&
                     !gameOver && (
                        <SelectMoves playerId={playerTurnId} />
                     )}
               </div>
            </div>
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
