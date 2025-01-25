import { PlayerModelType } from './types';
import { getPlayerClassNames } from './Vilperi';
import './vilperi.css';

interface Props {
   model: PlayerModelType;
   name: string;
   color?: string;
   highlight?: boolean;
}

export const FloatingPlayerBubble = (props: Props) => {
   const { model, color, name } = props;

   const cssVars = {
      '--player-color': color,
   } as React.CSSProperties;

   return (
      <div className="floating-player-container">
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
