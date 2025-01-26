import { useEffect, useState } from 'react';
import { Player as PlayerType, Action, GamePhase } from './types';
import { PlayerModel } from './Vilperi';
import { useMasterState } from './states/MasterState';
import { makeAIMoves } from './maija/maija';

interface Props {
   player: PlayerType;
}

export const Player = (props: Props) => {
   const { player } = props;
   const [triggeredForThisTurn, setTriggeredForThisTurn] =
      useState(false);
   const gamePhase = useMasterState(state => state.gamePhase);
   const playerTurn = useMasterState(state => state.playerTurn);
   const qAction = useMasterState(state => state.queueueueAction);
   const waitingAction = useMasterState(
      state => state.waitingAction,
   );
   const setWaitingAction = useMasterState(
      state => state.setWaitingAction,
   );
   const allowKeyboard =
      useMasterState(state => state.gamePhase) ===
      GamePhase.Planning;

   const isOwnTurn = player.id === playerTurn;

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (playerTurn !== player.id) return;
         if (!allowKeyboard) return;

         const { pos } = player;
         const newPos = { ...pos };
         const newQueueueueueueueueueudActions: Action[] = [];
         let newWaitingAction = waitingAction;
         if (e.key === 'ArrowUp') {
            if (waitingAction) {
               newQueueueueueueueueueudActions.push(Action.AttackUp);
               newWaitingAction = false;
            } else {
               newPos.y -= 1;
               newQueueueueueueueueueudActions.push(Action.MoveUp);
            }
         }
         if (e.key === 'ArrowDown') {
            if (waitingAction) {
               newQueueueueueueueueueudActions.push(
                  Action.AttackDown,
               );
               newWaitingAction = false;
            } else {
               newPos.y += 1;
               newQueueueueueueueueueudActions.push(Action.MoveDown);
            }
         }
         if (e.key === 'ArrowLeft') {
            if (waitingAction) {
               newQueueueueueueueueueudActions.push(
                  Action.AttackLeft,
               );
               newWaitingAction = false;
            } else {
               newPos.x -= 1;
               newQueueueueueueueueueudActions.push(Action.MoveLeft);
            }
         }
         if (e.key === 'ArrowRight') {
            if (waitingAction) {
               newQueueueueueueueueueudActions.push(
                  Action.AttackRight,
               );
               newWaitingAction = false;
            } else {
               newPos.x += 1;
               newQueueueueueueueueueudActions.push(
                  Action.MoveRight,
               );
            }
         }
         if (e.key === ' ' || e.key === 'b' || e.key == 'B') {
            e.preventDefault();
            e.stopPropagation();
            setWaitingAction(true);
         } else {
            qAction(
               player.id,
               newQueueueueueueueueueudActions,
               newWaitingAction,
            );
         }
      };

      addEventListener('keydown', handleKeyDown);

      // Trigger AI action if it's the AI player's turn
      if (
         player.isAI &&
         playerTurn === player.id &&
         gamePhase === GamePhase.Planning &&
         allowKeyboard &&
         !triggeredForThisTurn
      ) {
         console.log(
            'AI should move now! Player name is',
            player.name,
         );
         setTriggeredForThisTurn(true);
         makeAIMoves(5);
      }

      return () => removeEventListener('keydown', handleKeyDown);
   }, [
      player,
      player.isAI,
      player.pos,
      playerTurn,
      waitingAction,
      allowKeyboard,
      gamePhase,
   ]);

   useEffect(() => {
      setTriggeredForThisTurn(false);
   }, [gamePhase]);

   return (
      <PlayerModel
         id={player.elementId}
         model={player.mode}
         color={player.color}
         highlight={isOwnTurn}
         powerUps={player.powerUps}
      />
   );
};
