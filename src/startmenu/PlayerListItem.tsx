import { Player } from '../types';
import { mapPlayerModeToEmoji } from './StartMenu';

type PlayerListItemProps = {
   player: Player;
   removePlayer: (name: string) => void;
};

export function PlayerListitem({
   player,
   removePlayer,
}: PlayerListItemProps) {
   return (
      <div
         key={player.name}
         className="player-list-item"
         style={{ backgroundColor: `rgb(${player.color})` }}
      >
         <div
            style={{
               display: 'flex',
               flexDirection: 'row',
            }}
         >
            <div>{mapPlayerModeToEmoji(player.mode)}</div>
            <div>{player.name}</div>
            <button
               onClick={() => removePlayer(player.name)}
               className="player-list-item__remove"
            >
               ❌
            </button>
         </div>
         <div>
            <p className="player-list-label">Is AI</p>
         </div>
      </div>
   );
}
