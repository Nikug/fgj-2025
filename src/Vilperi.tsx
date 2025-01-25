import { PropsWithChildren } from 'react';
import App from './App';
import { PlayerModelType } from './types';
import { pastellivärit } from './startmenu/StartMenu';

interface Props {
   model: PlayerModelType;
   color?: string;
}

export const PlayerModel = (props: Props) => {
   const { model, color } = props;

   const cssVars = {
      '--player-color': color,
   } as React.CSSProperties;

   return (
      <div
         style={{
            position: 'relative', // Ensure relative positioning for hand placement
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            containerType: 'inline-size',
         }}
      >
         {/* Bubble Model */}
         <div
            className={getPlayerClassNames(model)}
            style={cssVars}
         ></div>

         {/* Player Hands */}
         <PlayerHands model={model} />
      </div>
   );
};
interface PlayerHandsProps {
   model: PlayerModelType;
}

const PlayerHands = (props: PlayerHandsProps) => {
   const { model } = props;
   const randomAnimation = Math.ceil(Math.random() * 4);
   let animation = `hand-idle-animation-${randomAnimation}`;
   switch (model) {
      case PlayerModelType.Monkey:
         return <div className={`player-hand ${animation}`}>🍌</div>;
      case PlayerModelType.Ninja:
         return <div className={`player-hand ${animation}`}>🌟</div>;
      case PlayerModelType.Robot:
         return <div className={`player-hand ${animation}`}>🪚</div>;
      case PlayerModelType.Wizard:
         return <div className={`player-hand ${animation}`}>🔮</div>;
   }
};

const getPlayerClassNames = (model: PlayerModelType) => {
   let modelClassName;
   switch (model) {
      case PlayerModelType.Monkey:
         modelClassName = 'player-monkey';
         break;
      case PlayerModelType.Ninja:
         modelClassName = 'player-ninja';
         break;
      case PlayerModelType.Robot:
         modelClassName = 'player-robot';
         break;
      case PlayerModelType.Wizard:
         modelClassName = 'player-wizard';
         break;
   }

   const randomAnimation = Math.ceil(Math.random() * 4);
   let animation = `bubble-idle-animation-${randomAnimation}`;

   return `player ${modelClassName} ${animation}`;
};

export const Router = () => {
   console.log(location.pathname);

   if (location.pathname === '/vilperi') {
      return <Vilperi />;
   } else {
      return <App />;
   }
};

export const Vilperi = () => {
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
            <VilperiBox size="small">
               <PlayerModel
                  color={pastellivärit[0]}
                  model={PlayerModelType.Monkey}
               />
            </VilperiBox>
            <VilperiBox size="medium">
               <PlayerModel
                  color={pastellivärit[0]}
                  model={PlayerModelType.Monkey}
               />
            </VilperiBox>
            <VilperiBox size="large">
               <PlayerModel
                  color={pastellivärit[0]}
                  model={PlayerModelType.Monkey}
               />
            </VilperiBox>
         </VilperiRow>
         <VilperiRow>
            <VilperiBox size="small">
               <PlayerModel
                  color={pastellivärit[1]}
                  model={PlayerModelType.Ninja}
               />
            </VilperiBox>
            <VilperiBox size="medium">
               <PlayerModel
                  color={pastellivärit[1]}
                  model={PlayerModelType.Ninja}
               />
            </VilperiBox>
            <VilperiBox size="large">
               <PlayerModel
                  color={pastellivärit[1]}
                  model={PlayerModelType.Ninja}
               />
            </VilperiBox>
         </VilperiRow>
         <VilperiRow>
            <VilperiBox size="small">
               <PlayerModel
                  color={pastellivärit[2]}
                  model={PlayerModelType.Robot}
               />
            </VilperiBox>
            <VilperiBox size="medium">
               <PlayerModel
                  color={pastellivärit[2]}
                  model={PlayerModelType.Robot}
               />
            </VilperiBox>
            <VilperiBox size="large">
               <PlayerModel
                  color={pastellivärit[2]}
                  model={PlayerModelType.Robot}
               />
            </VilperiBox>
         </VilperiRow>
         <VilperiRow>
            <VilperiBox size="small">
               <PlayerModel
                  color={pastellivärit[3]}
                  model={PlayerModelType.Wizard}
               />
            </VilperiBox>
            <VilperiBox size="medium">
               <PlayerModel
                  color={pastellivärit[3]}
                  model={PlayerModelType.Wizard}
               />
            </VilperiBox>
            <VilperiBox size="large">
               <PlayerModel
                  color={pastellivärit[3]}
                  model={PlayerModelType.Wizard}
               />
            </VilperiBox>
         </VilperiRow>
      </div>
   );
};

const VilperiRow = (props: PropsWithChildren) => {
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

interface VilperiBoxProps extends PropsWithChildren {
   size: 'small' | 'medium' | 'large';
}

const VilperiBox = (props: VilperiBoxProps) => {
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
