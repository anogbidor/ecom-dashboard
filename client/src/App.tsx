import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sales from './pages/Sales'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Inventory from './pages/Inventory'
import Analytics from './pages/Analytics'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/sales' element={<Sales />} />
        <Route path='/customers' element={<Customers />} />
        <Route path='/inventory' element={<Inventory />} />
        <Route path='/analytics' element={<Analytics />} />
      </Routes>
    </Router>
  )
}

export default App
