import { Action, PlayerModelType, WeaponType } from './types';

export const playerTypeToWeaponType = (
   playerType: PlayerModelType,
) => {
   return {
      [PlayerModelType.Monkey]: WeaponType.Bansq,
      [PlayerModelType.Ninja]: WeaponType.Star,
      [PlayerModelType.Robot]: WeaponType.Sahuli,
      [PlayerModelType.Wizard]: WeaponType.Taikuloinen,
   }[playerType];
};

export const isAttack = (action: Action) => {
   return [
      Action.AttackUp,
      Action.AttackDown,
      Action.AttackLeft,
      Action.AttackRight,
   ].includes(action);
};
