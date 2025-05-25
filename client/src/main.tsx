import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Toaster } from 'react-hot-toast'
import { NotificationProvider } from './context/NotificationProvider'
import { UserProvider } from './context/UserProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <NotificationProvider>
        <App />
        <Toaster position='top-right' />
      </NotificationProvider>
    </UserProvider>
  </StrictMode>
)
