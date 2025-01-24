export function StartMenu({ changeScene }: any) {
   return (
      <div className="start-menu">
         <div className="star-name__title">BUBBLE BABBLE</div>

         <button onClick={changeScene}>toggle scene</button>
      </div>
   );
}
