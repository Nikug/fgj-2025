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
         <div>{mapPlayerModeToEmoji(player.mode)}</div>
         <div>{player.name}</div>
         {player.isAI && <p className="player-list-label">AI</p>}
         <button
            onClick={() => removePlayer(player.name)}
            className="player-list-item__remove"
         >
            ❌
         </button>
      </div>
   );
}
