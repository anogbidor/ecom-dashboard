import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'
import { NotificationProvider } from './context/NotificationProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <App />
      <Toaster position='top-right' />
    </NotificationProvider>
  </StrictMode>
)
