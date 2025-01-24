import App from './App';
import './vilperi.css';

export const PlayerModel = () => {
   return <div className="player" />;
};

export const Router = () => {
   console.log(location.pathname);

   if (location.pathname === '/vilperi') {
      return (
         <div
            style={{
               width: '100%',
               display: 'flex',
               flexDirection: 'row',
               gap: '100px',
            }}
         >
            <div style={{ height: '50px', width: '50px' }}>
               <PlayerModel />
            </div>
            <div style={{ height: '200px', width: '200px' }}>
               <PlayerModel />
            </div>
            <div style={{ height: '800px', width: '800px' }}>
               <PlayerModel />
            </div>
         </div>
      );
   } else {
      return <App />;
   }
};
