import { useState, useCallback, useEffect } from 'react'
import { NotificationContext } from './NotificationContext'
import type { Notification } from '../types/Notification'

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) return // ✅ Prevent fetch if not logged in

    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()

      // ✅ Check if response is valid array before using .map
      if (!res.ok || !Array.isArray(data)) {
        console.warn(
          '⚠️ Notifications fetch returned unexpected response:',
          data
        )
        return
      }

      setNotifications(
        data.map((n: Notification) => ({ ...n, is_read: Boolean(n.is_read) }))
      )
    } catch (err) {
      console.error('❌ Failed to fetch notifications:', err)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, fetchNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
