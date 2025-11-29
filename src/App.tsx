import React from 'react'
import { DarkModeProvider } from './contexts/DarkModeContext'
import { DashboardContainer } from './components/DashboardContainer'

function App() {
  return (
    <DarkModeProvider>
      <DashboardContainer userId="demo-user" />
    </DarkModeProvider>
  )
}

export default App
