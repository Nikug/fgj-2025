import { useState } from 'react';
import './startmenu.css';
import { PlayerListitem } from './PlayerListItem';
import { useMasterState } from '../states/MasterState';
import { id } from '../id';
import { PlayerModelType } from '../types';

const pastellivärit = [
   '#FAD0C4', // Vaaleanpunainen
   '#A8E6CF', // Mintunvihreä
   '#C1D3FE', // Vaaleansiniharmaa
   '#E6A9EC', // Laventeli
   '#FFB3AB', // Persikkainen
   '#FFF1A8', // Vaaleankeltainen
   '#B3E5FC', // Taivaan sininen
   '#D4E157', // Vaaleanvihreä
   '#FFCC80', // Pehmeä oranssi
   '#D1C4E9', // Vaaleanlila
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
         <div className="star-name__title">BUBBLE BABBLE</div>
         <button onClick={changeScene}>toggle scene</button>

         <div className="start-menu__player-list">
            {players.map(player => (
               <PlayerListitem
                  key={player.name}
                  player={player}
                  removePlayer={removePlayer}
               />
            ))}
         </div>

         <div className="add-player">
            <p>Lisää pelaaja</p>
            <input
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
      </div>
   );
}
