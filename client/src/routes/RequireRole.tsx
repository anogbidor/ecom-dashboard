import { Navigate } from 'react-router-dom'
import type { JSX } from 'react'

const RequireRole = ({
  roles,
  children,
}: {
  roles: string[]
  children: JSX.Element
}) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return roles.includes(user.role) ? (
    children
  ) : (
    <Navigate to='/unauthorized' replace />
  )
}

export default RequireRole
