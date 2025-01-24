import { useState } from 'react';
import './startmenu.css';
import { Player } from '../types';

type StartMenuProps = {
   changeScene: () => void;
};

export function StartMenu({ changeScene }: StartMenuProps) {
   const [name, setName] = useState('');
   const [players, setPlayers] = useState<Player[]>([]);

   const playerNameChanged = (
      event: React.ChangeEvent<HTMLInputElement>,
   ) => {
      const name = event.target.value;
      setName(name);
   };

   const addPlayer = () => {
      setPlayers([
         ...players,
         {
            name,
            color: 'red',
         },
      ]);
      setName('');
   };

   return (
      <div className="start-menu">
         <div className="star-name__title">BUBBLE BABBLE</div>
         <button onClick={changeScene}>toggle scene</button>

         <div className="start-menu__player-list">
            {players.map(player => (
               <div key={player.name} className="start-menu__player">
                  <div
                     className="start-menu__player-color"
                     style={{ backgroundColor: player.color }}
                  ></div>
                  <div>{player.name}</div>
               </div>
            ))}
         </div>

         <div>
            <p>Lisää pelaaja</p>
            <input
               value={name}
               onChange={playerNameChanged}
               onSubmit={addPlayer}
            ></input>
         </div>
      </div>
   );
}
