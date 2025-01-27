import React, { memo } from 'react';
import { Direction, Obstacle, Player, V2, Weapon } from '../types';
import {
   getGridElementMoveFrom,
   getGridElementMoveTo,
} from '../states/resolver';
import {
   moveFromElementToElement,
   VilperiBox,
   VilperiRow,
} from '../Vilperi';
interface LaaaseriProps {
   id: string;
   direction: Direction;
}

const getLaaaseriCss = (direction: Direction) => {
   switch (direction) {
      case 'rtl':
         return {
            '--laaaseri-width': '130%',
            '--laaaseri-height': '3px',
            '--laaaseri-left': '-30%',
            '--laaaseri-top': '50%',
         };
      case 'ltr':
         return {
            '--laaaseri-width': '130%',
            '--laaaseri-height': '3px',
            '--laaaseri-left': '0',
            '--laaaseri-top': '50%',
         };
      case 'ttb':
         return {
            '--laaaseri-width': '3px',
            '--laaaseri-height': '130%',
            '--laaaseri-top': '0',
            '--laaaseri-left': '50%',
         };
      case 'btt':
         return {
            '--laaaseri-width': '3px',
            '--laaaseri-height': '130%',
            '--laaaseri-top': '-30%',
            '--laaaseri-left': '50%',
         };
   }
};
export const Laaaseri = memo((props: LaaaseriProps) => {
   const styles = getLaaaseriCss(props.direction);
   return (
      <div id={props.id} className="proj-container">
         <div
            style={styles as React.CSSProperties}
            className="laaaseri"
         ></div>
      </div>
   );
});

interface StarProps {
   id: string;
}
export const Star = memo(
   (props: StarProps) => {
      return (
         <div id={props.id} className="proj-container">
            <div className="star">★</div>
         </div>
      );
   },
   (p, n) => p.id === n.id,
);
interface BansqProps {
   id: string;
   direction: Direction;
}
interface TaikuloinenProps {
   direction: Direction;
   id: string;
}

export const getFromPos = (
   w: Weapon,
   obstacles: Obstacle[],
   players: Player[],
   weapons: Weapon[],
) => {
   return {
      player: players.find(
         e => e.pos.y == w.pos.y && e.pos.x == w.pos.x,
      ),
      obs: obstacles.find(
         e => e.pos.y == w.pos.y && e.pos.x == w.pos.x,
      ),
      weapon: weapons.find(
         e =>
            e.pos.y == w.pos.y &&
            e.pos.x == w.pos.x &&
            e.id !== w.id,
      ),
   };
};

export const getNextPos = (pos: V2, direction: Direction) => {
   switch (direction) {
      case 'ltr':
         return { x: pos.x + 1, y: pos.y };
      case 'rtl':
         return { x: pos.x - 1, y: pos.y };
      case 'ttb':
         return { x: pos.x, y: pos.y + 1 };
      case 'btt':
         return { x: pos.x, y: pos.y - 1 };
   }
};

export const animeWeaponMove = (weapon: Weapon, newPos: V2) => {
   const elementToMove = document.getElementById(weapon.id);
   const fromElement = getGridElementMoveFrom(
      weapon.pos.x,
      weapon.pos.y,
   );

   const toElement = getGridElementMoveTo(newPos.x, newPos.y);

   if (elementToMove && fromElement && toElement) {
      moveFromElementToElement(
         elementToMove,
         fromElement,
         toElement,
         undefined,
         '0.3s',
         'linear',
      );
   } else {
      console.error(
         'Could not animate movement. One of the elements was null.',
      );
      console.log('element to move', elementToMove);
      console.log('element to move from', fromElement);
      console.log('element to move to', toElement);
   }
};

const getBansqTranslate = (direction: Direction) => {
   switch (direction) {
      case 'rtl':
         return {
            '--tikka-translate-mid': 'translate(0,10%)',
            '--tikka-translate': 'translate(0, -10%)',
         };
      case 'ltr':
         return {
            '--tikka-translate-mid': 'translate(0,-10%)',
            '--tikka-translate': 'translate(0, 10%)',
         };
      case 'ttb':
         return {
            '--tikka-translate-mid': 'translate(10%, 0)',
            '--tikka-translate': 'translate(-10%, 0)',
         };
      case 'btt':
         return {
            '--tikka-translate-mid': 'translate(-10%, 0)',
            '--tikka-translate': 'translate(10%, 0)',
         };
   }
};

export const Bansq = memo((props: BansqProps) => {
   const deg = getDeg(props.direction, 0);
   const styles = {
      '--tikka-deg': deg,
      ...getBansqTranslate(props.direction),
   } as React.CSSProperties;
   return (
      <div id={props.id} className="proj-container">
         <div className="bansq" style={styles}>
            ↢
         </div>
      </div>
   );
});

export const Taikuloinen = memo((props: TaikuloinenProps) => {
   const deg = getDeg(props.direction, 90);
   const styles = {
      '--tikka-deg': deg,
      ...getBansqTranslate(props.direction),
   } as React.CSSProperties;
   return (
      <div id={props.id} className="proj-container">
         <div className="taikuloinen" style={styles}>
            🔥
         </div>
      </div>
   );
});
interface SahuliProps {
   direction: Direction;
   id: string;
}
const getDeg = (dir: Direction, adjustment: number) => {
   switch (dir) {
      case 'rtl':
         return `${adjustment}deg`;
      case 'ltr':
         return `${180 + adjustment}deg`;
      case 'ttb':
         return `${-90 + adjustment}deg`;
      case 'btt':
         return `${90 + adjustment}deg`;
   }
};
export const Sahuli = (props: SahuliProps) => {
   const deg = getDeg(props.direction, -45);
   const styles = {
      '--sahuli-deg': deg,
   } as React.CSSProperties;
   const contStyles = {
      transform: props.direction == 'ltr' ? 'scaleY(-1)' : 'none',
   } as React.CSSProperties;
   return (
      <div
         id={props.id}
         className="proj-container"
         style={contStyles}
      >
         <div className="sahuli" style={styles}>
            🪚
         </div>
      </div>
   );
};
export const Aleksi = () => {
   return (
      <div
         style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '100px',
         }}
      >
         <VilperiRow>
            <VilperiBox size="medium">
               <Laaaseri id="aa" direction="ltr" />
            </VilperiBox>
            <VilperiBox size="medium">
               <Laaaseri id="aa" direction="rtl" />
            </VilperiBox>
            <VilperiBox size="medium">
               <Laaaseri id="aa" direction="ttb" />
            </VilperiBox>
            <VilperiBox size="medium">
               <Laaaseri id="aa" direction="btt" />
            </VilperiBox>
         </VilperiRow>
      </div>
   );
};
