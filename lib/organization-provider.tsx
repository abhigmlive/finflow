"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Organization = {
  id: string
  name: string
  plan: "free" | "professional" | "business"
  createdAt: string
  ownerId: string
}

type OrganizationMember = {
  id: string
  organizationId: string
  userId: string
  role: "owner" | "admin" | "member" | "viewer"
  email: string
  name: string
  status: "active" | "invited"
}

type OrganizationContextType = {
  organizations: Organization[]
  currentOrganization: Organization | null
  members: OrganizationMember[]
  loading: boolean
  createOrganization: (name: string, plan: string) => Promise<void>
  switchOrganization: (id: string) => void
  inviteMember: (email: string, name: string, role: string) => Promise<void>
  removeMember: (id: string) => Promise<void>
  updateMemberRole: (id: string, role: string) => Promise<void>
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null)
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Load organizations from localStorage
    const storedOrgs = localStorage.getItem("finflow_organizations")
    const storedCurrentOrgId = localStorage.getItem("finflow_current_organization")
    const storedMembers = localStorage.getItem("finflow_organization_members")

    // Initialize with demo data if nothing exists
    if (!storedOrgs) {
      const demoOrg: Organization = {
        id: "1",
        name: "My Business",
        plan: "professional",
        createdAt: new Date().toISOString(),
        ownerId: "1", // Assuming user id 1
      }

      const demoMembers: OrganizationMember[] = [
        {
          id: "1",
          organizationId: "1",
          userId: "1",
          role: "owner",
          email: "user@example.com",
          name: "Current User",
          status: "active",
        },
      ]

      setOrganizations([demoOrg])
      setCurrentOrganization(demoOrg)
      setMembers(demoMembers)

      localStorage.setItem("finflow_organizations", JSON.stringify([demoOrg]))
      localStorage.setItem("finflow_current_organization", demoOrg.id)
      localStorage.setItem("finflow_organization_members", JSON.stringify(demoMembers))
    } else {
      const parsedOrgs = JSON.parse(storedOrgs)
      setOrganizations(parsedOrgs)

      if (storedCurrentOrgId) {
        const currentOrg = parsedOrgs.find((org: Organization) => org.id === storedCurrentOrgId)
        setCurrentOrganization(currentOrg || parsedOrgs[0])
      } else if (parsedOrgs.length > 0) {
        setCurrentOrganization(parsedOrgs[0])
        localStorage.setItem("finflow_current_organization", parsedOrgs[0].id)
      }

      if (storedMembers) {
        setMembers(JSON.parse(storedMembers))
      }
    }

    setLoading(false)
  }, [])

  const createOrganization = async (name: string, plan: string) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll create it locally
      const newOrg: Organization = {
        id: Date.now().toString(),
        name,
        plan: plan as "free" | "professional" | "business",
        createdAt: new Date().toISOString(),
        ownerId: "1", // Assuming user id 1
      }

      const newMember: OrganizationMember = {
        id: Date.now().toString(),
        organizationId: newOrg.id,
        userId: "1",
        role: "owner",
        email: "user@example.com", // This would come from the auth context
        name: "Current User", // This would come from the auth context
        status: "active",
      }

      const updatedOrgs = [...organizations, newOrg]
      const updatedMembers = [...members, newMember]

      setOrganizations(updatedOrgs)
      setCurrentOrganization(newOrg)
      setMembers(updatedMembers)

      localStorage.setItem("finflow_organizations", JSON.stringify(updatedOrgs))
      localStorage.setItem("finflow_current_organization", newOrg.id)
      localStorage.setItem("finflow_organization_members", JSON.stringify(updatedMembers))

      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to create organization:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const switchOrganization = (id: string) => {
    const org = organizations.find((org) => org.id === id)
    if (org) {
      setCurrentOrganization(org)
      localStorage.setItem("finflow_current_organization", org.id)
      router.push("/dashboard")
    }
  }

  const inviteMember = async (email: string, name: string, role: string) => {
    if (!currentOrganization) return

    setLoading(true)
    try {
      // In a real app, this would be an API call to send an invitation
      // For demo purposes, we'll create the member locally
      const newMember: OrganizationMember = {
        id: Date.now().toString(),
        organizationId: currentOrganization.id,
        userId: "", // This would be filled when the user accepts the invitation
        role: role as "owner" | "admin" | "member" | "viewer",
        email,
        name,
        status: "invited",
      }

      const updatedMembers = [...members, newMember]
      setMembers(updatedMembers)
      localStorage.setItem("finflow_organization_members", JSON.stringify(updatedMembers))
    } catch (error) {
      console.error("Failed to invite member:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeMember = async (id: string) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      const updatedMembers = members.filter((member) => member.id !== id)
      setMembers(updatedMembers)
      localStorage.setItem("finflow_organization_members", JSON.stringify(updatedMembers))
    } catch (error) {
      console.error("Failed to remove member:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateMemberRole = async (id: string, role: string) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      const updatedMembers = members.map((member) =>
        member.id === id ? { ...member, role: role as "owner" | "admin" | "member" | "viewer" } : member,
      )
      setMembers(updatedMembers)
      localStorage.setItem("finflow_organization_members", JSON.stringify(updatedMembers))
    } catch (error) {
      console.error("Failed to update member role:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        currentOrganization,
        members,
        loading,
        createOrganization,
        switchOrganization,
        inviteMember,
        removeMember,
        updateMemberRole,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export const useOrganization = () => {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error("useOrganization must be used within an OrganizationProvider")
  }
  return context
}

