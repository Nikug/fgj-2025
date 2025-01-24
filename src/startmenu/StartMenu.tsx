import { useState } from 'react';
import './startmenu.css';
import { PlayerListitem } from './PlayerListItem';
import { useMasterState } from '../states/MasterState';
import { id } from '../id';

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

type StartMenuProps = {
   changeScene: () => void;
};

export function StartMenu({ changeScene }: StartMenuProps) {
   const [colors] = useState(
      pastellivärit.sort(() => Math.random() - 0.5),
   );
   const [i, setI] = useState(0);
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
               color: colors[i],
               pos: { x: 0, y: 0 },
               id: id(),
               queueueueueuedActions: []
            },
         ]);
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

         <div>
            <p>Lisää pelaaja</p>
            <input
               autoFocus
               value={name}
               onChange={playerNameChanged}
               onKeyDown={e =>
                  e.key === 'Enter' ? addPlayer() : null
               }
            ></input>
         </div>
      </div>
   );
}
