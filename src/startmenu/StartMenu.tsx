import { useState } from 'react';
import './startmenu.css';

type StartMenuProps = {
   changeScene: () => void;
};

export function StartMenu({ changeScene }: StartMenuProps) {
   const [players, setPlayers] = useState<string[]>([]);
   return (
      <div className="start-menu">
         <div className="star-name__title">BUBBLE BABBLE</div>
         <button onClick={changeScene}>toggle scene</button>

         <div className="start-menu__player-list"></div>
      </div>
   );
}
