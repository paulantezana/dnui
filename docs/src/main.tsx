import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App as DnApp } from '@dnui/react'
import { BrowserRouter } from 'react-router'
import './styles.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DnApp component={false}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DnApp>
  </StrictMode>
)
