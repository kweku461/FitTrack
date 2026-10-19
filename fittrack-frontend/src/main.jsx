import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variables.css'
import './styles/global.css'
import './styles/Sidebar.css'
import './styles/Dashboard.css'
import './styles/auth.css';
import './styles/log-entry.css';
import './styles/goals.css';
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeProvider.jsx'
import './styles/mobile-nav.css';
import './styles/profile.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)