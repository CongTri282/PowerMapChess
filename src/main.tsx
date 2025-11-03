import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './MainLayout.css'
import { MainLayout } from './MainLayout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainLayout />
  </StrictMode>,
)
