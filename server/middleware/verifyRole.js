export default function verifyRole(requiredRole) {
  return (req, res, next) => {
    const userRole = req.user?.role

    if (!userRole) {
      return res.status(401).json({ error: 'Unauthorized: No role found' })
    }

    if (userRole !== requiredRole) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role' })
    }

    next()
  }
}
