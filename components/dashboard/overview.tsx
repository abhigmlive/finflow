"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    revenue: 4000,
    expenses: 2400,
  },
  {
    name: "Feb",
    revenue: 3000,
    expenses: 1398,
  },
  {
    name: "Mar",
    revenue: 9800,
    expenses: 2000,
  },
  {
    name: "Apr",
    revenue: 3908,
    expenses: 2780,
  },
  {
    name: "May",
    revenue: 4800,
    expenses: 1890,
  },
  {
    name: "Jun",
    revenue: 3800,
    expenses: 2390,
  },
  {
    name: "Jul",
    revenue: 4300,
    expenses: 3490,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Bar dataKey="revenue" fill="#0077C5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" fill="#FF5A5F" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

