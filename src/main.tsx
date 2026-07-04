import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AppStateProvider } from './store/AppStateProvider'
import { Toaster } from './components/ui/sonner'
import { ThemeProvider } from './components/theme-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AppStateProvider>
          <App />
          <Toaster />
        </AppStateProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
