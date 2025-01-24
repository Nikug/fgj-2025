import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './vilperi.css';
import { Router } from './Vilperi.tsx';

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <Router />
   </StrictMode>,
);
