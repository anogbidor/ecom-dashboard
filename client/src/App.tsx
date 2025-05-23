import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Sales from './pages/Sales'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Inventory from './pages/Inventory'
import Analytics from './pages/Analytics'
import Login from './pages/Login'
import PrivateRoute from './routes/PrivateRoute'

const App = () => {
  const token = localStorage.getItem('token')

  return (
    <Router>
      <Routes>
        {/* Public login route */}
        <Route path='/login' element={<Login />} />

        {/* Redirect root to dashboard or login */}
        <Route
          path='/'
          element={<Navigate to={token ? '/dashboard' : '/login'} replace />}
        />

        {/* Private routes */}
        <Route
          path='/dashboard'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path='/sales'
          element={
            <PrivateRoute>
              <Sales />
            </PrivateRoute>
          }
        />
        <Route
          path='/customers'
          element={
            <PrivateRoute>
              <Customers />
            </PrivateRoute>
          }
        />
        <Route
          path='/inventory'
          element={
            <PrivateRoute>
              <Inventory />
            </PrivateRoute>
          }
        />
        <Route
          path='/analytics'
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
