import { memo } from 'react';
import {
   Bansq,
   Laaaseri,
   Sahuli,
   Star,
   Taikuloinen,
} from './aleksi/aleksi';
import { Weapon, WeaponType } from './types';

interface Props {
   weapon: Weapon;
}

export const AnyWeapon = memo(
   ({ weapon }: Props) => {
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
                  <Sahuli
                     id={weapon.id}
                     direction={weapon.direction}
                  />
               );
            case WeaponType.Bansq:
               return (
                  <Bansq
                     id={weapon.id}
                     direction={weapon.direction}
                  />
               );
            case WeaponType.Star:
               return <Star id={weapon.id} />;
            case WeaponType.Lazor:
               return (
                  <Laaaseri
                     id={weapon.id}
                     direction={weapon.direction}
                  />
               );
            default:
               window.alert('how');
         }
      };

      return getWeapon();
   },
   (p, n) => p.weapon.id === n.weapon.id,
);
