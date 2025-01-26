import {
   Action,
   Player,
   PlayerModelType,
   WeaponType,
} from './types';

export const playerTypeToWeaponType = (player: Player) => {
   return WeaponType.Lazor;
   return player.hasLazor ?
         WeaponType.Lazor
      :  {
            [PlayerModelType.Monkey]: WeaponType.Bansq,
            [PlayerModelType.Ninja]: WeaponType.Star,
            [PlayerModelType.Robot]: WeaponType.Sahuli,
            [PlayerModelType.Wizard]: WeaponType.Taikuloinen,
         }[player.mode];
};

export const isAttack = (action: Action) => {
   return [
      Action.AttackUp,
      Action.AttackDown,
      Action.AttackLeft,
      Action.AttackRight,
   ].includes(action);
};
