import { useEffect, useRef, useState } from 'react';
import './startmenu.css';
import { PlayerListitem } from './PlayerListItem';
import { useMasterState } from '../states/MasterState';
import { id } from '../id';
import { PlayerModelType } from '../types';
import menuSoundtrack from './../assets/whats_cooking_there.mp3';
import { playSound } from '../audio';
import { FloatingPlayerBubble } from '../Vilperi2';
import '../vilperi2.css';
import { Lore } from '../Lore';

const menuAudio = new Audio(menuSoundtrack);

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
   const userEventDetected = useRef(false);
   const nameInput = useRef<any>(null);
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

   const selectPlayerMode = (mode: PlayerModelType) => {
      setPlayerMode(mode);
      nameInput.current?.focus();
   };

   useEffect(() => {
      if (userEventDetected.current) return;

      const startMusic = () => {
         if (userEventDetected.current) return;

         userEventDetected.current = true;
         menuAudio.loop = true;
         menuAudio.play();
      };

      document.addEventListener('click', startMusic);
      document.addEventListener('keydown', startMusic);

      return () => {
         menuAudio.pause();
         menuAudio.currentTime = 0;
         document.removeEventListener('click', startMusic);
         document.removeEventListener('keydown', startMusic);
      };
   }, []);

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
               elementId: `player-element-${id()}`,
               isDead: false,
               attacksPerTurn: 1,
               hasLazor: false,
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

   const startGame = () => {
      playSound('wää', 0.3);
      changeScene();
   };

   const addAIPlayer = () => {
      setPlayers([
         ...players,
         {
            name: generateAIName(),
            mode: PlayerModelType.Ninja,
            color: colors[i + 1],
            pos: { x: 0, y: 0 },
            id: id(),
            queueueueueuedActions: [],
            elementId: `player-element-${id()}`,
            isDead: false,
            isAI: true,
            attacksPerTurn: 1,
            hasLazor: false,
         },
      ]);
   };

   return (
      <div className="start-menu__container">
         <div className="start-menu">
            {players.map((player, i) => (
               <FloatingPlayerBubble
                  key={player.id}
                  model={player.mode}
                  color={player.color}
                  name={player.name}
                  dir={i % 2 === 0 ? 'right' : 'left'}
                  index={i}
               />
            ))}
            <div className="star-name__title">BUBBLE BLAST</div>

            <div className="start-menu__top-section">
               <div className="add-player">
                  <div className="add-player__label">Start game</div>
                  <button
                     className="start-button"
                     onClick={startGame}
                     disabled={players.length < 1}
                  >
                     Start blasting 👉🔥🔥🚒
                  </button>
                  <div className="add-player__label">
                     Add AI player
                  </div>
                  <button
                     className="add-ai-button"
                     onClick={addAIPlayer}
                  >
                     Add AI player
                  </button>
               </div>
               <div className="add-player">
                  <div className="add-player__label">
                     Choose class
                  </div>
                  <div className="player-modes">
                     {playerModes.map(mode => (
                        <button
                           className={
                              'player-mode-button ' +
                              (mode === playerMode ? 'selected' : '')
                           }
                           key={mode}
                           onClick={() => selectPlayerMode(mode)}
                        >
                           {mapPlayerModeToEmoji(mode)}
                        </button>
                     ))}
                  </div>
                  <div className="add-player__label">Add player</div>
                  <input
                     ref={nameInput}
                     className="player-name-input"
                     placeholder="Press Enter to add"
                     autoFocus
                     value={name}
                     onChange={playerNameChanged}
                     onKeyDown={e =>
                        e.key === 'Enter' ? addPlayer() : null
                     }
                  ></input>
               </div>
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

         <Lore />
      </div>
   );
}

const generateAIName = () => {
   const adjectives = [
      'Swift',
      'Sneaky',
      'Fierce',
      'Shadow',
      'Mighty',
      'Cunning',
      'Silent',
      'Bold',
      'Rapid',
      'Witty',
   ];
   const gamerNames = [
      'Ninja',
      'Assassin',
      'Slayer',
      'Hunter',
      'Warrior',
      'Brawler',
      'Sniper',
      'Master',
      'Phantom',
      'Baiter',
   ];

   const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
   const randomGamerName =
      gamerNames[Math.floor(Math.random() * gamerNames.length)];

   return `${randomAdjective} ${randomGamerName}`;
};
