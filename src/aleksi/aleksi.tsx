import React, { PropsWithChildren } from 'react';
import { Direction, Obstacle, Player, V2, Weapon } from '../types';

export const Star = () => {
   return (
      <div className="proj-container">
         <div className="star">★</div>
      </div>
   );
};
interface BansqProps {
   direction: Direction;
}
interface TaikuloinenProps {
   direction: Direction;
}

const filter = (
   f: (e: Player | Obstacle) => boolean,
   players: Player[],
   obstacles: Obstacle[],
) => {
   return [...players.filter(f), ...obstacles.filter(f)];
};

export const getFromPos = (
   pos: V2,
   obstacles: Obstacle[],
   players: Player[],
   weapons: Weapon[],
) => {
   return {
      player: players.find(
         e => e.pos.y == pos.y && e.pos.x == pos.x,
      ),
      obs: obstacles.find(e => e.pos.y == pos.y && e.pos.x == pos.x),
      weapon: weapons.find(
         e => e.pos.y == pos.y && e.pos.x == pos.x,
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

export const Bansq = (props: BansqProps) => {
   const deg = getDeg(props.direction, 0);
   const styles = {
      '--tikka-deg': deg,
      ...getBansqTranslate(props.direction),
   } as React.CSSProperties;
   return (
      <div className="proj-container">
         <div className="bansq" style={styles}>
            ↢
         </div>
      </div>
   );
};

export const Taikuloinen = (props: TaikuloinenProps) => {
   const deg = getDeg(props.direction, 90);
   const styles = {
      '--tikka-deg': deg,
      ...getBansqTranslate(props.direction),
   } as React.CSSProperties;
   return (
      <div className="proj-container">
         <div className="taikuloinen" style={styles}>
            🔥
         </div>
      </div>
   );
};
interface SahuliProps {
   direction: Direction;
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
      <div className="proj-container" style={contStyles}>
         <div className="sahuli" style={styles}>
            🪚
         </div>
      </div>
   );
};

const AleksiRow = (props: PropsWithChildren) => {
   return (
      <div
         style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '100px',
            padding: '10px',
            border: '1px solid grey',
         }}
      >
         {props.children}
      </div>
   );
};

interface AleksiBoxProps extends PropsWithChildren {
   size: 'small' | 'medium' | 'large';
}

const AleksiBox = (props: AleksiBoxProps) => {
   const { size, children } = props;

   const modelSize = {
      small: '50px',
      medium: '100px',
      large: '200px',
   }[size];

   return (
      <div
         style={{
            border: '1px solid white',
            height: modelSize,
            width: modelSize,
         }}
      >
         {children}
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
         <AleksiRow>
            <AleksiBox size="medium">
               <Taikuloinen direction="rtl" />
            </AleksiBox>
            <AleksiBox size="medium">
               <Taikuloinen direction="ltr" />
            </AleksiBox>
            <AleksiBox size="medium">
               <Taikuloinen direction="ttb" />
            </AleksiBox>
            <AleksiBox size="medium">
               <Taikuloinen direction="btt" />
            </AleksiBox>
         </AleksiRow>
         <AleksiRow>
            <AleksiBox size="medium">
               <Bansq direction="rtl" />
            </AleksiBox>
            <AleksiBox size="medium">
               <Bansq direction="ltr" />
            </AleksiBox>
            <AleksiBox size="medium">
               <Bansq direction="ttb" />
            </AleksiBox>
            <AleksiBox size="medium">
               <Bansq direction="btt" />
            </AleksiBox>
         </AleksiRow>

         <AleksiRow>
            <AleksiBox size="medium">
               <Sahuli direction="rtl" />
            </AleksiBox>
            <AleksiBox size="medium">
               <Sahuli direction="ltr" />
            </AleksiBox>
            <AleksiBox size="medium">
               <Sahuli direction="ttb" />
            </AleksiBox>
            <AleksiBox size="medium">
               <Sahuli direction="btt" />
            </AleksiBox>
         </AleksiRow>
         <AleksiRow>
            <AleksiBox size="small">
               <Star />
            </AleksiBox>
            <AleksiBox size="medium">
               <Star />
            </AleksiBox>
            <AleksiBox size="large">
               <Star />
            </AleksiBox>
         </AleksiRow>
      </div>
   );
};
