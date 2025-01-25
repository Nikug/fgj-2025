import { PlayerModelType } from './types';
import { getPlayerClassNames } from './Vilperi';
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
