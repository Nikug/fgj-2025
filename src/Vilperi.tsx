import {
   forwardRef,
   PropsWithChildren,
   useRef,
   useState,
} from 'react';
import App from './App';
import { PlayerModelType } from './types';
import { pastellivärit } from './startmenu/StartMenu';

interface Props {
   model: PlayerModelType;
   color?: string;
}

export const PlayerModel = forwardRef<HTMLDivElement | null, Props>(
   (props: Props, ref) => {
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
            ref={ref}
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
   },
);

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
         <VilperiGrid />
      </div>
   );
};

export const moveFromElementToElement = async (
   elementToMove: HTMLElement,
   fromElement: HTMLElement,
   toElement: HTMLElement,
   setCurrentElement: () => void,
   animationDuration = '1s',
) => {
   const fromPos = fromElement.getBoundingClientRect();
   const toPos = toElement.getBoundingClientRect();

   const deltaX = toPos.left - fromPos.left;
   const deltaY = toPos.top - fromPos.top;

   // Set the starting position of the element to the "fromElement" position
   elementToMove.style.position = 'absolute';
   elementToMove.style.height = `${fromPos.height}px`;
   elementToMove.style.width = `${fromPos.width}px`;
   elementToMove.style.top = `${fromPos.top}px`;
   elementToMove.style.left = `${fromPos.left}px`;

   // Apply the transformation with a smooth animation
   elementToMove.style.transition = `transform ${animationDuration} ease-in-out`;
   elementToMove.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

   // Clean up after the animation
   const handleTransitionEnd = () => {
      elementToMove.style.transition = ''; // Remove the transition
      elementToMove.style.transform = ''; // Reset the transform
      elementToMove.style.top = `${toPos.top}px`; // Finalize position
      elementToMove.style.left = `${toPos.left}px`;
      elementToMove.removeEventListener(
         'transitionend',
         handleTransitionEnd,
      );
      setCurrentElement();
   };

   elementToMove.addEventListener(
      'transitionend',
      handleTransitionEnd,
   );
};

const VilperiGrid = () => {
   const currentElement = useRef<HTMLDivElement | null>(null);
   const playerElement = useRef<HTMLDivElement | null>(null);

   const move = (to: HTMLDivElement | null) => {
      if (!playerElement.current || !currentElement.current) {
         return;
      }

      if (!to) {
         return;
      }

      moveFromElementToElement(
         playerElement.current,
         currentElement.current,
         to,
         () => (currentElement.current = to),
      );
   };

   return (
      <div
         style={{
            display: 'grid',
            gridTemplateRows: '1fr 1fr 1fr',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '30px',
            width: '900px',
            height: '900px',
            padding: '10px',
            boxSizing: 'border-box',
         }}
      >
         <div
            style={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               border: `2px dashed rgb(${pastellivärit[0]})`,
               borderRadius: '8px',
               cursor: 'pointer',
            }}
            id="vilperi-cell-1"
            ref={currentElement}
            onClick={() =>
               move(
                  document.getElementById(
                     'vilperi-cell-1',
                  ) as HTMLDivElement | null,
               )
            }
         >
            <div style={{ position: 'absolute' }}>Cell 1</div>
            <PlayerModel
               ref={playerElement}
               model={PlayerModelType.Wizard}
               color={pastellivärit[1]}
            />
         </div>

         <div
            style={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               border: `2px dashed rgb(${pastellivärit[1]})`,
               borderRadius: '8px',
               cursor: 'pointer',
            }}
            id="vilperi-cell-2"
            onClick={() =>
               move(
                  document.getElementById(
                     'vilperi-cell-2',
                  ) as HTMLDivElement | null,
               )
            }
         >
            <div style={{ position: 'absolute' }}>Cell 2</div>
         </div>

         <div
            style={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               border: `2px dashed rgb(${pastellivärit[2]})`,
               borderRadius: '8px',
               cursor: 'pointer',
            }}
            id="vilperi-cell-3"
            onClick={() =>
               move(
                  document.getElementById(
                     'vilperi-cell-3',
                  ) as HTMLDivElement | null,
               )
            }
         >
            <div style={{ position: 'absolute' }}>Cell 3</div>
         </div>

         <div
            style={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               border: `2px dashed rgb(${pastellivärit[3]})`,
               borderRadius: '8px',
               cursor: 'pointer',
            }}
            id="vilperi-cell-4"
            onClick={() =>
               move(
                  document.getElementById(
                     'vilperi-cell-4',
                  ) as HTMLDivElement | null,
               )
            }
         >
            <div style={{ position: 'absolute' }}>Cell 4</div>
         </div>

         <div
            style={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               border: `2px dashed rgb(${pastellivärit[4]})`,
               borderRadius: '8px',
               cursor: 'pointer',
            }}
            id="vilperi-cell-5"
            onClick={() =>
               move(
                  document.getElementById(
                     'vilperi-cell-5',
                  ) as HTMLDivElement | null,
               )
            }
         >
            <div style={{ position: 'absolute' }}>Cell 5</div>
         </div>

         <div
            style={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               border: `2px dashed rgb(${pastellivärit[5]})`,
               borderRadius: '8px',
               cursor: 'pointer',
            }}
            id="vilperi-cell-6"
            onClick={() =>
               move(
                  document.getElementById(
                     'vilperi-cell-6',
                  ) as HTMLDivElement | null,
               )
            }
         >
            <div style={{ position: 'absolute' }}>Cell 6</div>
         </div>
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
