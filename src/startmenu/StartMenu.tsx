import { useState } from 'react';
import './startmenu.css';
import { PlayerListitem } from './PlayerListItem';
import { useMasterState } from '../states/MasterState';
import { id } from '../id';
import { PlayerModelType } from '../types';

export const pastellivärit = [
   '250, 208, 196', // Vaaleanpunainen
   '168, 230, 207', // Mintunvihreä
   '193, 211, 254', // Vaaleansiniharmaa
   '230, 169, 236', // Laventeli
   '255, 179, 171', // Persikkainen
   '255, 241, 168', // Vaaleankeltainen
   '179, 229, 252', // Taivaan sininen
   '212, 225, 87', // Vaaleanvihreä
   '255, 204, 128', // Pehmeä oranssi
   '209, 196, 233', // Vaaleanlila
];

export const mapPlayerModeToEmoji = (mode: PlayerModelType) => {
   switch (mode) {
      case PlayerModelType.Monkey:
         return '🐵';
      case PlayerModelType.Ninja:
         return '🥷';
      case PlayerModelType.Robot:
         return '🤖';
      case PlayerModelType.Wizard:
         return '🧙';
   }
};

type StartMenuProps = {
   changeScene: () => void;
};

export function StartMenu({ changeScene }: StartMenuProps) {
   const [colors] = useState(
      pastellivärit.sort(() => Math.random() - 0.5),
   );
   const [i, setI] = useState(0);
   const playerModes = [
      PlayerModelType.Monkey,
      PlayerModelType.Ninja,
      PlayerModelType.Robot,
      PlayerModelType.Wizard,
   ];
   const getRandomPlayerMode = () =>
      playerModes[Math.floor(Math.random() * playerModes.length)];
   const [playerMode, setPlayerMode] = useState(
      getRandomPlayerMode(),
   );
   const [name, setName] = useState('');
   const setPlayers = useMasterState(state => state.setPlayers);
   const players = useMasterState(state => state.players);

   const playerNameChanged = (
      event: React.ChangeEvent<HTMLInputElement>,
   ) => {
      const name = event.target.value;
      setName(name);
   };

   const addPlayer = () => {
      const nameExists = players.find(
         player => player.name === name,
      );

      if (!nameExists) {
         setPlayers([
            ...players,
            {
               name,
               mode: playerMode,
               color: colors[i],
               pos: { x: 0, y: 0 },
               id: id(),
               queueueueueuedActions: [],
            },
         ]);
         setPlayerMode(getRandomPlayerMode());
         const newI = i + 1;

         if (newI >= colors.length) {
            setI(0);
         } else {
            setI(i + 1);
         }
         setName('');
      }
   };

   const removePlayer = (name: string) => {
      setPlayers(players.filter(player => player.name !== name));
   };

   return (
      <div className="start-menu">
         <div className="star-name__title">BUBBLE BLAST</div>
         <div className="start-menu__top-section">
            <div className="add-player">
               <div className="add-player__label">Add players</div>
               <input
                  className="player-name-input"
                  placeholder="Press Enter to add"
                  autoFocus
                  value={name}
                  onChange={playerNameChanged}
                  onKeyDown={e =>
                     e.key === 'Enter' ? addPlayer() : null
                  }
               ></input>
               <div className="player-modes">
                  {playerModes.map(mode => (
                     <button
                        className={
                           'player-mode-button ' +
                           (mode === playerMode ? 'selected' : '')
                        }
                        key={mode}
                        onClick={() => setPlayerMode(mode)}
                     >
                        {mapPlayerModeToEmoji(mode)}
                     </button>
                  ))}
               </div>
            </div>
            <button
               className="start-button"
               onClick={changeScene}
               disabled={players.length < 1}
            >
               Start blasting 👉🔥🔥🚒
            </button>
         </div>

         <div className="start-menu__player-list">
            {players
               .map(player => (
                  <PlayerListitem
                     key={player.name}
                     player={player}
                     removePlayer={removePlayer}
                  />
               ))
               .reverse()}
         </div>
      </div>
   );
}
