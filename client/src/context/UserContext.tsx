// src/context/UserContext.ts
import { createContext } from 'react'

export type User = { name: string; email?: string } | null

export interface UserContextType {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
}

export const UserContext = createContext<UserContextType | null>(null)
