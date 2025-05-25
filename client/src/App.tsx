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
import AddProduct from './pages/AddProduct'
import AddSale from './pages/AddSale'
import ResetPassword from './pages/ResetPassword'
import ForgotPassword from './pages/ForgotPassword'
import AccountSettings from './pages/AccountSettings'

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path='/login' element={<Login />} />

        {/* Redirect root to dashboard (guarded inside PrivateRoute) */}
        <Route path='/' element={<Navigate to='/dashboard' replace />} />

        {/* Private Routes */}
        <Route
          path='/dashboard'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path='/account-settings'
          element={
            <PrivateRoute>
              <AccountSettings />
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
        <Route
          path='/add-product'
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />

        <Route
          path='/add-sale'
          element={
            <PrivateRoute>
              <AddSale />
            </PrivateRoute>
          }
        />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </Router>
  )
}

export default App
