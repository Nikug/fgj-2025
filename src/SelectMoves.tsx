import React from 'react';
import { useMasterState } from './states/MasterState';
import { Action } from './types';
import './selectmoves.css';

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
      <div className="arrow-key-layout">
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
      queueueueAction(playerId, [move], false);
   };

   return (
      <div className="select-moves">
         <div className="select-moves__buttons">
            <ArrowKeyLayout>
               <button onClick={() => handleMove(Action.MoveUp)}>
                  <span className="move-icon">⬆️</span> Move Up
               </button>
               <button onClick={() => handleMove(Action.MoveLeft)}>
                  <span className="move-icon">⬅️</span> Move Left
               </button>
               <button onClick={() => handleMove(Action.MoveDown)}>
                  <span className="move-icon">⬇️</span> Move Down
               </button>
               <button onClick={() => handleMove(Action.MoveRight)}>
                  <span className="move-icon">➡️</span> Move Right
               </button>
            </ArrowKeyLayout>
            <ArrowKeyLayout>
               <button onClick={() => handleMove(Action.AttackUp)}>
                  <span className="move-icon">✊</span> Attack Up
               </button>
               <button onClick={() => handleMove(Action.AttackLeft)}>
                  <span className="move-icon">🤛</span> Attack Left
               </button>
               <button onClick={() => handleMove(Action.AttackDown)}>
                  <span className="move-icon">👊</span> Attack Down
               </button>
               <button
                  onClick={() => handleMove(Action.AttackRight)}
               >
                  <span className="move-icon">🤜</span> Attack Right
               </button>
            </ArrowKeyLayout>
         </div>
      </div>
   );
}
