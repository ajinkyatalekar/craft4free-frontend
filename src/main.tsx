import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import Auth from '@/pages/Auth/Auth.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Auth />
    </AuthProvider>
  </StrictMode>,
)
