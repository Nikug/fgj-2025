import React from 'react';
import { useMasterState } from './states/MasterState';
import { Action } from './types';

type ArrowKeyLayoutProps = {
   children: [
      React.ReactNode,
      React.ReactNode,
      React.ReactNode,
      React.ReactNode,
   ];
};

function ArrowKeyLayout({ children }: ArrowKeyLayoutProps) {
   return (
      // use grid layout to make the buttons align in a cross shape
      <div
         style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr 1fr',
            gap: '0.5rem',
         }}
      >
         <div />
         {children[0]}
         <div />
         {children[1]}
         {children[2]}
         {children[3]}
         <div />
      </div>
   );
}

type SelectMovesProps = {
   playerId: string;
};

export function SelectMoves({ playerId }: SelectMovesProps) {
   const queueueueAction = useMasterState(
      state => state.queueueueAction,
   );

   const handleMove = (move: Action) => {
      queueueueAction(playerId, [move]);
   };

   return (
      <div>
         <div>Select moves</div>
         <div>
            <ArrowKeyLayout>
               <button onClick={() => handleMove(Action.MoveUp)}>
                  Move Up
               </button>
               <button onClick={() => handleMove(Action.MoveLeft)}>
                  Move Left
               </button>
               <button onClick={() => handleMove(Action.MoveDown)}>
                  Move Down
               </button>
               <button onClick={() => handleMove(Action.MoveRight)}>
                  Move Right
               </button>
            </ArrowKeyLayout>
            <ArrowKeyLayout>
               <button onClick={() => handleMove(Action.AttackUp)}>
                  Attack up
               </button>
               <button onClick={() => handleMove(Action.AttackLeft)}>
                  Attack left
               </button>
               <button onClick={() => handleMove(Action.AttackDown)}>
                  Attack down
               </button>
               <button
                  onClick={() => handleMove(Action.AttackRight)}
               >
                  Attack right
               </button>
            </ArrowKeyLayout>
         </div>
      </div>
   );
}
