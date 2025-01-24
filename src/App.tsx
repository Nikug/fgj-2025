import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { StartMenu } from './startmenu/StartMenu';

export const enum Scene {
   StartMenu,
   Game,
}

function App() {
   const [count, setCount] = useState(0);
   const [scene, setScene] = useState<Scene>(Scene.StartMenu)

   const toggleScene = () => setScene(scene === Scene.StartMenu ? Scene.Game : Scene.StartMenu)

   if (scene === Scene.StartMenu) {
      return <StartMenu changeScene={toggleScene}/>
   }

   return (
      <>
         <div>
            <a href="https://vite.dev" target="_blank">
               <img
                  src={viteLogo}
                  className="logo"
                  alt="Vite logo"
               />
            </a>
            <a href="https://react.dev" target="_blank">
               <img
                  src={reactLogo}
                  className="logo react"
                  alt="React logo"
               />
            </a>
         </div>
         <h1>Vite + React</h1>
         <div className="card">
            <button onClick={() => setCount(count => count + 1)}>
               count is {Math.random() > 0.5 ? count : Math.round(Math.random() * 10)}
            </button>
            <p>Tsumonjää</p>
            <button onClick={toggleScene}>
               toggle scene
            </button>
         </div>
         <p className="read-the-docs">Hähähähä</p>
      </>
   );
}

export default App;
