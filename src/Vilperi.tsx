import {
   forwardRef,
   memo,
   PropsWithChildren,
   useRef,
   useState,
} from 'react';
import App from './App';
import {
   Player as PlayerType,
   PlayerModelType,
   PowerUp,
} from './types';
import { pastellivärit } from './startmenu/StartMenu';
import { Aleksi } from './aleksi/aleksi';
import { id } from './id';
import { playSound } from './audio';

interface Props {
   model: PlayerModelType;
   color?: string;
   id: string;
   highlight?: boolean;
}

export const PlayerModel = memo((props: Props) => {
   const { model, color, id, highlight } = props;

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
            borderRadius: '4px',
            outline:
               highlight ? '5px solid rgb(255, 0, 255)' : undefined,
         }}
         id={id}
      >
         {/* Bubble Model */}
         <div
            style={{
               position: 'relative', // Ensure relative positioning for hand placement
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               width: '100%',
               height: '100%',
               containerType: 'inline-size',
               borderRadius: '4px',
               outline:
                  highlight ?
                     '5px solid rgb(255, 0, 255)'
                  :  undefined,
            }}
            id={id}
         >
            {/* Bubble Model */}
            <div
               className={getPlayerClassNames(model)}
               style={cssVars}
            ></div>
         </div>

         {/* Player Hands */}
         <PlayerHands model={model} />
      </div>
   );
});

interface PowerUpModelProps {
   model: PowerUp;
}

export const PowerUpModel = forwardRef<
   HTMLDivElement | null,
   PowerUpModelProps
>((props, ref) => {
   const { model } = props;

   const content = {
      [PowerUp.PlusOne]: '+1',
      [PowerUp.Lazor]: '🔫',
   }[model];

   return (
      <div
         style={{
            position: 'relative', // Ensure relative positioning for hand placement
            display: 'flex',
            width: '100%',
            height: '100%',
            containerType: 'inline-size',
            justifyContent: 'center',
            alignItems: 'center',
         }}
      >
         <div
            ref={ref}
            className={getPowerUpClassNames(model)}
         ></div>
         <div className="power-up-icon bubble-idle-animation-1">
            <p className="power-up-icon-inner">{content}</p>
         </div>
      </div>
   );
});

interface PlayerHandsProps {
   model: PlayerModelType;
}

export const PlayerHands = (props: PlayerHandsProps) => {
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

export const getPlayerClassNames = (
   model: PlayerModelType,
   animation: string = 'idle',
   floating: boolean = false,
) => {
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

   let animationClassName;
   switch (animation) {
      case 'idle':
         const randomAnimation = Math.ceil(Math.random() * 4);
         animationClassName = `bubble-idle-animation-${randomAnimation}`;
         break;
      case 'pop':
         animationClassName = `bubble-pop-animation pop-1`;
         break;
   }

   return `player ${modelClassName} ${animationClassName} ${
      floating ? 'player-floating' : ''
   }`;
};

export const getPowerUpClassNames = (model: PowerUp) => {
   let modelClassName;
   switch (model) {
      case PowerUp.PlusOne:
         modelClassName = 'power-up-plus-one';
         break;
      case PowerUp.Lazor:
         modelClassName = 'power-up-laser';
         break;
   }

   return `power-up bubble-idle-animation-1 ${modelClassName}`;
};

export const Router = () => {
   if (location.toString().includes('#vilperi')) {
      return <Vilperi />;
   } else if (location.toString().includes('#aleksi')) {
      return <Aleksi />;
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
                  id={id()}
                  color={pastellivärit[0]}
                  model={PlayerModelType.Monkey}
               />
            </VilperiBox>
            <VilperiBox size="medium">
               <PlayerModel
                  id={id()}
                  color={pastellivärit[0]}
                  model={PlayerModelType.Monkey}
               />
            </VilperiBox>
            <VilperiBox size="large">
               <PlayerModel
                  id={id()}
                  color={pastellivärit[0]}
                  model={PlayerModelType.Monkey}
               />
            </VilperiBox>
         </VilperiRow>
         <VilperiRow>
            <VilperiBox size="small">
               <PlayerModel
                  id={id()}
                  color={pastellivärit[1]}
                  model={PlayerModelType.Ninja}
               />
            </VilperiBox>
            <VilperiBox size="medium">
               <PlayerModel
                  id={id()}
                  color={pastellivärit[1]}
                  model={PlayerModelType.Ninja}
               />
            </VilperiBox>
            <VilperiBox size="large">
               <PlayerModel
                  id={id()}
                  color={pastellivärit[1]}
                  model={PlayerModelType.Ninja}
               />
            </VilperiBox>
         </VilperiRow>
         <VilperiRow>
            <VilperiBox size="small">
               <PlayerModel
                  id={id()}
                  color={pastellivärit[2]}
                  model={PlayerModelType.Robot}
               />
            </VilperiBox>
            <VilperiBox size="medium">
               <PlayerModel
                  id={id()}
                  color={pastellivärit[2]}
                  model={PlayerModelType.Robot}
               />
            </VilperiBox>
            <VilperiBox size="large">
               <PlayerModel
                  id={id()}
                  color={pastellivärit[2]}
                  model={PlayerModelType.Robot}
               />
            </VilperiBox>
         </VilperiRow>
         <VilperiRow>
            <VilperiBox size="small">
               <PlayerModel
                  id={id()}
                  color={pastellivärit[3]}
                  model={PlayerModelType.Wizard}
               />
            </VilperiBox>
            <VilperiBox size="medium">
               <PlayerModel
                  id={id()}
                  color={pastellivärit[3]}
                  model={PlayerModelType.Wizard}
               />
            </VilperiBox>
            <VilperiBox size="large">
               <PlayerModel
                  id={id()}
                  color={pastellivärit[3]}
                  model={PlayerModelType.Wizard}
               />
            </VilperiBox>
         </VilperiRow>
         <VilperiRow>
            <VilperiBox size="small">
               <PowerUpModel model={PowerUp.PlusOne} />
            </VilperiBox>
            <VilperiBox size="medium">
               <PowerUpModel model={PowerUp.PlusOne} />
            </VilperiBox>
            <VilperiBox size="large">
               <PowerUpModel model={PowerUp.PlusOne} />
            </VilperiBox>
         </VilperiRow>
         <VilperiRow>
            <VilperiBox size="small">
               <PowerUpModel model={PowerUp.Lazor} />
            </VilperiBox>
            <VilperiBox size="medium">
               <PowerUpModel model={PowerUp.Lazor} />
            </VilperiBox>
            <VilperiBox size="large">
               <PowerUpModel model={PowerUp.Lazor} />
            </VilperiBox>
         </VilperiRow>
         <VilperiGrid />
      </div>
   );
};

export const moveFromElementToElement = (
   elementToMove: HTMLElement,
   fromElement: HTMLElement,
   toElement: HTMLElement,
   afterMoveFunc?: () => void,
   animationDuration = '0.5s',
   speedCurve = 'ease-in-out',
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
   elementToMove.style.transition = `transform ${animationDuration} ${speedCurve}`;
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
      afterMoveFunc && afterMoveFunc();
   };

   elementToMove.addEventListener(
      'transitionend',
      handleTransitionEnd,
   );
};

/**
 * Plays player pop animation and then returns to idle
 * Can be removed after animation with afterPopFunc
 * @param playerElement
 * @param afterPopFunc
 * @param animationDuration
 *
 */
export const popPlayer = (
   player: PlayerType,
   afterPopFunc?: () => void,
) => {
   const playerElement = document.getElementById(player.elementId);
   if (!playerElement) {
      console.error(
         'Could not play pop animation. Player element not found.',
      );
      return;
   }
   playerElement.className = getPlayerClassNames(player.mode, 'pop');
   playSound('perkele');

   // Clean up after the animation
   const handleTransitionEnd = () => {
      playerElement.className = getPlayerClassNames(
         player.mode,
         'idle',
      );

      // Remove lines
      Array.from(document.querySelectorAll('.pop-line')).forEach(
         child => {
            child.remove();
         },
      );

      playerElement.removeEventListener(
         'animationend',
         handleTransitionEnd,
      );
      afterPopFunc && afterPopFunc();
   };

   const handleTransitionPop = (event: AnimationEvent) => {
      // Add pop-lines after burst
      if (event.animationName !== 'bubblePop') {
         return;
      }

      playerElement.style.display = 'none';

      [...Array(8).keys()].map(i => {
         const popLine = document.createElement('div', {});
         popLine.className = `pop-line pop-line-${i}`;
         playerElement.parentElement?.appendChild(popLine);
         if (i === 0) {
            popLine.addEventListener(
               'animationend',
               handleTransitionEnd,
            );
         }
      });
   };

   playerElement.addEventListener(
      'animationend',
      handleTransitionPop,
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
               id={id()}
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

export const VilperiRow = (props: PropsWithChildren) => {
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

export const VilperiBox = (props: VilperiBoxProps) => {
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
