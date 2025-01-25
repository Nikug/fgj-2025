import { Bansq, Sahuli, Star, Taikuloinen } from './aleksi/aleksi';
import { Weapon, WeaponType } from './types';

interface Props {
   weapon: Weapon;
}

export const AnyWeapon = ({ weapon }: Props) => {
   const getWeapon = () => {
      switch (weapon.type) {
         case WeaponType.Taikuloinen:
            return (
               <Taikuloinen
                  id={weapon.id}
                  direction={weapon.direction}
               />
            );
         case WeaponType.Sahuli:
            return (
               <Sahuli id={weapon.id} direction={weapon.direction} />
            );
         case WeaponType.Bansq:
            return (
               <Bansq id={weapon.id} direction={weapon.direction} />
            );
         case WeaponType.Star:
            return <Star id={weapon.id} />;
         default:
            window.alert('how');
      }
   };

   return getWeapon();
};
