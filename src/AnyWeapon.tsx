import { Bansq, Sahuli, Star, Taikuloinen } from './aleksi/aleksi';
import { Weapon, WeaponType } from './types';

interface Props {
   weapon: Weapon;
}

export const AnyWeapon = ({ weapon }: Props) => {
   const getWeapon = () => {
      switch (weapon.type) {
         case WeaponType.Taikuloinen:
            return <Taikuloinen direction={weapon.direction} />;
         case WeaponType.Sahuli:
            return <Sahuli direction={weapon.direction} />;
         case WeaponType.Bansq:
            return <Bansq direction={weapon.direction} />;
         case WeaponType.Star:
            return <Star />;
         default:
            window.alert('how');
      }
   };

   return getWeapon();
};
