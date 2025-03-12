"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  email: string
  name: string
  role: "admin" | "accountant" | "viewer"
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, role: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("finflow_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login
      if (email && password) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock user data
        const userData: User = {
          id: "1",
          email,
          name: email.split("@")[0],
          role: "admin",
        }

        setUser(userData)
        localStorage.setItem("finflow_user", JSON.stringify(userData))
        router.push("/dashboard")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string, role: string) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful signup
      if (name && email && password) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock user data
        const userData: User = {
          id: "1",
          email,
          name,
          role: role as "admin" | "accountant" | "viewer",
        }

        setUser(userData)
        localStorage.setItem("finflow_user", JSON.stringify(userData))
        router.push("/dashboard")
      } else {
        throw new Error("Invalid signup data")
      }
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("finflow_user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

