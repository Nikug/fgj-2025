import { StartMenu } from './startmenu/StartMenu';
import { useMasterState } from './states/MasterState';
import './App.css';
import { GamePhase, Scene } from './types';
import { Player } from './Player';
import { Avatar } from './Avatar';
import { Obstacle } from './Obstacle';
import { SelectMoves } from './SelectMoves';
import { AnyWeapon } from './AnyWeapon';
import { isAttack } from './superSecretFile';
import { PlayerTurnBackdrop } from './Vilperi2';
import { Player as PlayerType } from './types';
import { PowerUpModel } from './Vilperi';

export const rows = 10;
export const cols = 10;

function App() {
   const scene = useMasterState(state => state.scene);
   const setScene = useMasterState(state => state.setScene);
   const players = useMasterState(state => state.players);
   const deadPlayers = useMasterState(state => state.deadPlayers);
   const weapons = useMasterState(state => state.weapons);
   const powers = useMasterState(state => state.powers);
   const gamePhase = useMasterState(state => state.gamePhase);
   const playerTurn = useMasterState(state => state.getPlayerTurn);
   const playerTurnId = useMasterState(state => state.playerTurn);
   const hasObstacle = useMasterState(state => state.hasObstacle);
   const activePlayer = useMasterState(state => state.activePlayer);
   const addAttack = useMasterState(state => state.addExtraAttack);

   const setGamePhase = useMasterState(state => state.setGamePhase);
   const actionsPerTurn = useMasterState(
      state => state.actionsPerTurn,
   );
   const actionActionsPerTurn = useMasterState(
      state => state.actionActionsPerTurn,
   );
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
            const tilePowers = powers.filter(
               power => power.pos.x === col && power.pos.y === row,
            );
            grid.push(
               <div
                  className="game-tile"
                  key={`${row} ${col}`}
                  data-x={col}
                  data-y={row}
                  // style={{
                  //    fontSize: '2rem',
                  //    color: 'black',
                  //    backgroundColor: 'white',
                  // }}
               >
                  {/* {`x: ${col}, y: ${row}`} */}
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
                  {tilePowers.map(tilePower => (
                     <PowerUpModel
                        key={tilePower.id}
                        model={tilePower.type}
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

   let bigText: string | React.ReactNode = '';
   let titleText: string | React.ReactNode = '';
   let smallText: string | React.ReactNode = '';
   const gameOver = players.length <= 1;
   const isPlanning = gamePhase === GamePhase.Planning;

   if (players.length === 1) {
      bigText = 'Game over! ' + players[0].name + ' won!';
   } else if (players.length === 0) {
      bigText = 'Game over! No winners!';
   } else {
      switch (gamePhase) {
         case GamePhase.Planning:
            titleText = (
               <div className="player-turn-instructions">
                  <span className="name">
                     {playerTurn()?.name} has
                  </span>
                  <div className="actions-left">
                     <span>
                        {`${
                           actionsPerTurn -
                           (activePlayer()?.queueueueueuedActions
                              .length ?? 0)
                        }${' / '}${actionsPerTurn}${' moves left'}`}
                     </span>
                     <span>
                        {`${
                           countPlayerAttacksLeft(activePlayer()) ??
                           1 -
                              (activePlayer()?.queueueueueuedActions.filter(
                                 isAttack,
                              ).length ?? 0)
                        }${' / '}${
                           activePlayer()?.attacksPerTurn
                        }${' attacks left'}`}
                     </span>
                  </div>
               </div>
            );
            smallText =
               'ℹ️ Plan your moves. Use the buttons below or use arow keys to move your bubble and space + arrow keys to shoot. You have 5 moves in total and one of them can be an attack. All moves are executed when all players have planned their moves.';
            break;
         case GamePhase.Action:
            bigText = 'Watch the action!';
            break;
      }
   }

   return (
      <div className="container">
         <PlayerTurnBackdrop
            playerName={activePlayer()?.name ?? 'Unknown Player'}
            active={gamePhase === GamePhase.NextTurn}
            nextTurn={() => {
               setGamePhase(GamePhase.Planning);
            }}
         />
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

               <button
                  onClick={() => {
                     const player = activePlayer();

                     if (!player) {
                        return;
                     }
                     addAttack(player);
                  }}
               >
                  Give me an extra attack
               </button>
               <div className="phase-inner">
                  {bigText && (
                     <div className="phase-inner__big-text">
                        {bigText}
                     </div>
                  )}
                  {titleText && (
                     <div className="phase-inner__player-name">
                        {titleText}
                     </div>
                  )}
                  {smallText && (
                     <div className="phase-inner__instructions">
                        {smallText}
                     </div>
                  )}
                  {playerTurnId && isPlanning && !gameOver && (
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

export const countPlayerAttacks = (player: PlayerType | null) => {
   let attacksUsed = 0;
   if (!player) {
      return 0;
   }
   player.queueueueueuedActions.forEach(action => {
      if (isAttack(action)) {
         attacksUsed += 1;
      }
   });

   return attacksUsed;
};

export const countPlayerAttacksLeft = (
   player: PlayerType | null,
) => {
   let attacksUsed = 0;
   if (!player) {
      return 1;
   }
   player.queueueueueuedActions.forEach(action => {
      if (isAttack(action)) {
         attacksUsed += 1;
      }
   });

   return player.attacksPerTurn - attacksUsed;
};
