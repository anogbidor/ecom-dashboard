// src/context/NotificationContext.tsx
import { createContext } from 'react'
import type { Notification } from '../types/Notification'

export type NotificationContextType = {
  notifications: Notification[]
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
  fetchNotifications: () => Promise<void>
}

export const NotificationContext =
  createContext<NotificationContextType | null>(null)
