import { useState } from 'react'
import { StoreProvider } from './lib/store'
import { BottomNav, type Screen } from './components/BottomNav'
import { Home } from './screens/Home'
import { Recurring } from './screens/Recurring'
import { Transactions } from './screens/Transactions'
import { Budget } from './screens/Budget'

function App() {
  const [screen, setScreen] = useState<Screen>('home')

  return (
    <StoreProvider>
      <div className="mx-auto max-w-md">
        {screen === 'home' && <Home />}
        {screen === 'recurring' && <Recurring />}
        {screen === 'transactions' && <Transactions />}
        {screen === 'budget' && <Budget />}
      </div>
      <BottomNav screen={screen} onChange={setScreen} />
    </StoreProvider>
  )
}

export default App
