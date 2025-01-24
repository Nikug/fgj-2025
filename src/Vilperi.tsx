import { PropsWithChildren } from 'react';
import App from './App';
import { PlayerModelType } from './types';

interface Props {
   model: PlayerModelType;
}

export const PlayerModel = (props: Props) => {
   const { model } = props;

   return <div className={getPlayerClassNames(model)} />;
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

   return `player ${modelClassName}`;
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
               <PlayerModel model={PlayerModelType.Monkey} />
            </VilperiBox>
            <VilperiBox size="medium">
               <PlayerModel model={PlayerModelType.Monkey} />
            </VilperiBox>
            <VilperiBox size="large">
               <PlayerModel model={PlayerModelType.Monkey} />
            </VilperiBox>
         </VilperiRow>
         <VilperiRow>
            <VilperiBox size="small">
               <PlayerModel model={PlayerModelType.Ninja} />
            </VilperiBox>
            <VilperiBox size="medium">
               <PlayerModel model={PlayerModelType.Ninja} />
            </VilperiBox>
            <VilperiBox size="large">
               <PlayerModel model={PlayerModelType.Ninja} />
            </VilperiBox>
         </VilperiRow>
         <VilperiRow>
            <VilperiBox size="small">
               <PlayerModel model={PlayerModelType.Robot} />
            </VilperiBox>
            <VilperiBox size="medium">
               <PlayerModel model={PlayerModelType.Robot} />
            </VilperiBox>
            <VilperiBox size="large">
               <PlayerModel model={PlayerModelType.Robot} />
            </VilperiBox>
         </VilperiRow>
         <VilperiRow>
            <VilperiBox size="small">
               <PlayerModel model={PlayerModelType.Wizard} />
            </VilperiBox>
            <VilperiBox size="medium">
               <PlayerModel model={PlayerModelType.Wizard} />
            </VilperiBox>
            <VilperiBox size="large">
               <PlayerModel model={PlayerModelType.Wizard} />
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
