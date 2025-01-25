import React, { PropsWithChildren } from 'react';
import { Direction } from '../types';

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

export const Bansq = (props: BansqProps) => {
   return (
      <div className="proj-container">
         <div className="bansq">🍌</div>
      </div>
   );
};

export const Taikuloinen = () => {
   return (
      <div className="proj-container">
         <div className="bansq">🍌</div>
      </div>
   );
};
interface SahuliProps {
   direction: Direction;
}
const getDeg = (dir: Direction) => {
   switch (dir) {
      case 'rtl':
         return '220deg';
      case 'ltr':
         return '40deg';
      case 'ttb':
         return '-50deg';
      case 'btt':
         return '130deg';
   }
};
export const Sahuli = (props: SahuliProps) => {
   const deg = getDeg(props.direction);
   const styles = {
      '--sahuli-deg': deg,
   } as React.CSSProperties;
   const contStyles = {
      transform: props.direction == 'rtl' ? 'scaleY(-1)' : 'none',
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

         <AleksiRow>
            <AleksiBox size="small">
               <Bansq />
            </AleksiBox>
            <AleksiBox size="medium">
               <Bansq />
            </AleksiBox>
            <AleksiBox size="large">
               <Bansq />
            </AleksiBox>
         </AleksiRow>
      </div>
   );
};
