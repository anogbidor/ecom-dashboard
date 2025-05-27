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
import RequireRole from './routes/RequireRole'
import Unauthorized from './pages/Unauthorized'

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path='/' element={<Navigate to='/dashboard' replace />} />

        {/* Private Routes */}
        <Route
          path='/dashboard'
          element={
            <PrivateRoute>
              <RequireRole roles={['admin', 'staff']}>
                <Dashboard />
              </RequireRole>
            </PrivateRoute>
          }
        />

        <Route
          path='/add-product'
          element={
            <PrivateRoute>
              <RequireRole roles={['admin', 'staff']}>
                <AddProduct />
              </RequireRole>
            </PrivateRoute>
          }
        />

        <Route
          path='/add-sale'
          element={
            <PrivateRoute>
              <RequireRole roles={['admin', 'staff']}>
                <AddSale />
              </RequireRole>
            </PrivateRoute>
          }
        />

        <Route
          path='/account-settings'
          element={
            <PrivateRoute>
              <RequireRole roles={['admin', 'staff']}>
                <AccountSettings />
              </RequireRole>
            </PrivateRoute>
          }
        />

        <Route
          path='/sales'
          element={
            <PrivateRoute>
              <RequireRole roles={['admin']}>
                <Sales />
              </RequireRole>
            </PrivateRoute>
          }
        />

        <Route
          path='/customers'
          element={
            <PrivateRoute>
              <RequireRole roles={['admin']}>
                <Customers />
              </RequireRole>
            </PrivateRoute>
          }
        />

        <Route
          path='/inventory'
          element={
            <PrivateRoute>
              <RequireRole roles={['admin', 'staff']}>
                <Inventory />
              </RequireRole>
            </PrivateRoute>
          }
        />

        <Route
          path='/analytics'
          element={
            <PrivateRoute>
              <RequireRole roles={['admin']}>
                <Analytics />
              </RequireRole>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
