import { createRoot } from 'react-dom/client';
import './index.css';
import './vilperi.css';
import './aleksi/aleksi.css';
import { Router } from './Vilperi.tsx';

createRoot(document.getElementById('root')!).render(<Router />);
