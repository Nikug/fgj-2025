import { PlayerModelType, WeaponType } from './types';

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
