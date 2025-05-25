// src/context/NotificationProvider.tsx
import { useState, useCallback } from 'react'
import { NotificationContext } from './NotificationContext'
import type { Notification } from '../types/Notification'

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setNotifications(data)
    } catch (err) {
      console.error('❌ Failed to fetch notifications', err)
    }
  }, [])

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, fetchNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
