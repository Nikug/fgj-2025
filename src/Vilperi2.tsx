import { PlayerModelType } from './types';
import { getPlayerClassNames } from './Vilperi';
import './vilperi2.css';
import './vilperi.css';

interface Props {
   model: PlayerModelType;
   name: string;
   index: number;
   dir?: 'right' | 'left';
   color?: string;
   highlight?: boolean;
}

export const FloatingPlayerBubble = (props: Props) => {
   const { model, color, name, dir, index } = props;

   const cssVars = {
      '--player-color': color,
      '--direction': dir === 'right' ? 'reverse' : 'normal',
      '--top': `${index * 20 + 10}px`,
   } as React.CSSProperties;

   return (
      <div className="floating-player-container" style={cssVars}>
         <div
            style={{
               position: 'absolute',
               width: '4em',
               height: '4em',

               containerType: 'inline-size',
            }}
         >
            {/* Bubble Model */}
            <div
               className={getPlayerClassNames(model, 'idle', true)}
               style={cssVars}
            ></div>
         </div>
         <p className="name-tag" style={cssVars}>
            {name}
         </p>
      </div>
   );
};

import React, { useEffect } from 'react';
import Marquee from 'react-fast-marquee';

interface TurnMarqueeProps {
   active: boolean;
   playerName: string;
   nextTurn: () => void;
}
export const PlayerTurnBackdrop = (props: TurnMarqueeProps) => {
   const { active, playerName, nextTurn } = props;

   // Disable all keyboard events when the backdrop is active
   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         if (active) {
            event.preventDefault();
         }
      };

      if (active) {
         window.addEventListener('keydown', handleKeyDown);
      } else {
         window.removeEventListener('keydown', handleKeyDown);
      }

      return () => {
         window.removeEventListener('keydown', handleKeyDown);
      };
   }, [active]);

   // End marquee after 1 second
   useEffect(() => {
      if (active) {
         const timeout = setTimeout(() => {
            nextTurn(); // Trigger the next turn after marquee finishes
         }, 2000); // 2 second duration

         return () => clearTimeout(timeout);
      }
   }, [active, nextTurn]);

   if (!active) return null;

   return (
      <div className="backdrop">
         <div className="marquee-container">
            {active && (
               <Marquee
                  gradient={false}
                  speed={200}
                  className="marquee"
                  autoFill
               >
                  {`${playerName}'s turn!`}
                  <div style={{ width: '8em' }} />
               </Marquee>
            )}
         </div>
      </div>
   );
};
