import { Player } from '../types';

type PlayerListItemProps = {
   player: Player;
   removePlayer: (name: string) => void;
};

export function PlayerListitem({
   player,
   removePlayer,
}: PlayerListItemProps) {
   return (
      <div key={player.name} className="player-list-item">
         <div>{player.name}</div>
         <div
            className="start-menu__player-color"
            style={{ backgroundColor: player.color }}
         ></div>
      </div>
   );
}
