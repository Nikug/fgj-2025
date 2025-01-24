import { useState } from 'react';
import './startmenu.css';
import { Player } from '../types';
import { PlayerListitem } from './PlayerListItem';
import { useMasterState } from '../states/MasterState';

type StartMenuProps = {
   changeScene: () => void;
};

export function StartMenu({ changeScene }: StartMenuProps) {
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
               color: '#94edcf',
               pos: { x: 0, y: 0 },
               id: players.length,
            },
         ]);
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
