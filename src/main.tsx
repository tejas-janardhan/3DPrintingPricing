import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AppStateProvider } from './store/AppStateProvider'
import { Toaster } from './components/ui/sonner'
import { ThemeProvider } from './components/theme-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <HashRouter>
        <AppStateProvider>
          <App />
          <Toaster />
        </AppStateProvider>
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
)
