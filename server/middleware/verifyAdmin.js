// middleware/verifyAdmin.js
export default function verifyAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' })
  }
  next()
}
