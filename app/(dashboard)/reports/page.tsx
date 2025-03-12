"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOrganization } from "@/lib/organization-provider"
import { BarChart3, Download, FileText, LineChart, PieChart } from "lucide-react"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export default function ReportsPage() {
  const { currentOrganization } = useOrganization()
  const [period, setPeriod] = useState("year")

  // Sample data for reports
  const profitLossData = [
    { month: "Jan", revenue: 12500, expenses: 8200, profit: 4300 },
    { month: "Feb", revenue: 14200, expenses: 8700, profit: 5500 },
    { month: "Mar", revenue: 15800, expenses: 9100, profit: 6700 },
    { month: "Apr", revenue: 16900, expenses: 9500, profit: 7400 },
    { month: "May", revenue: 18200, expenses: 10200, profit: 8000 },
    { month: "Jun", revenue: 17500, expenses: 9800, profit: 7700 },
    { month: "Jul", revenue: 19200, expenses: 10500, profit: 8700 },
    { month: "Aug", revenue: 20100, expenses: 11200, profit: 8900 },
    { month: "Sep", revenue: 21500, expenses: 12000, profit: 9500 },
    { month: "Oct", revenue: 22800, expenses: 12500, profit: 10300 },
    { month: "Nov", revenue: 24000, expenses: 13200, profit: 10800 },
    { month: "Dec", revenue: 25500, expenses: 14000, profit: 11500 },
  ]

  const cashFlowData = [
    { month: "Jan", inflow: 15200, outflow: 12800, netFlow: 2400 },
    { month: "Feb", inflow: 16500, outflow: 13200, netFlow: 3300 },
    { month: "Mar", inflow: 18200, outflow: 14500, netFlow: 3700 },
    { month: "Apr", inflow: 19500, outflow: 15200, netFlow: 4300 },
    { month: "May", inflow: 21000, outflow: 16500, netFlow: 4500 },
    { month: "Jun", inflow: 20200, outflow: 16000, netFlow: 4200 },
    { month: "Jul", inflow: 22500, outflow: 17200, netFlow: 5300 },
    { month: "Aug", inflow: 23800, outflow: 18500, netFlow: 5300 },
    { month: "Sep", inflow: 25200, outflow: 19800, netFlow: 5400 },
    { month: "Oct", inflow: 26500, outflow: 20500, netFlow: 6000 },
    { month: "Nov", inflow: 28000, outflow: 21800, netFlow: 6200 },
    { month: "Dec", inflow: 29500, outflow: 22500, netFlow: 7000 },
  ]

  const expenseCategoryData = [
    { name: "Rent", value: 24000 },
    { name: "Salaries", value: 85000 },
    { name: "Marketing", value: 18500 },
    { name: "Software", value: 12000 },
    { name: "Travel", value: 8500 },
    { name: "Office Supplies", value: 5000 },
    { name: "Utilities", value: 7500 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B"]

  if (!currentOrganization) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <Card>
          <CardContent className="py-10 text-center">
            <p>Please select or create an organization to view reports.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profit-loss" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="tax">Tax Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="profit-loss" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Profit & Loss</CardTitle>
                <CardDescription>Revenue, expenses, and profit over time.</CardDescription>
              </div>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={profitLossData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#0077C5" />
                    <Bar dataKey="expenses" name="Expenses" fill="#FF5A5F" />
                    <Bar dataKey="profit" name="Profit" fill="#00C49F" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ${profitLossData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold">
                    ${profitLossData.reduce((sum, item) => sum + item.expenses, 0).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                  <p className="text-2xl font-bold">
                    ${profitLossData.reduce((sum, item) => sum + item.profit, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-flow" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Cash Flow</CardTitle>
                <CardDescription>Cash inflows and outflows over time.</CardDescription>
              </div>
              <LineChart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={cashFlowData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                    <Line type="monotone" dataKey="inflow" name="Cash In" stroke="#0077C5" strokeWidth={2} />
                    <Line type="monotone" dataKey="outflow" name="Cash Out" stroke="#FF5A5F" strokeWidth={2} />
                    <Line type="monotone" dataKey="netFlow" name="Net Flow" stroke="#00C49F" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Cash In</p>
                  <p className="text-2xl font-bold">
                    ${cashFlowData.reduce((sum, item) => sum + item.inflow, 0).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Cash Out</p>
                  <p className="text-2xl font-bold">
                    ${cashFlowData.reduce((sum, item) => sum + item.outflow, 0).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm font-medium text-muted-foreground">Net Cash Flow</p>
                  <p className="text-2xl font-bold">
                    ${cashFlowData.reduce((sum, item) => sum + item.netFlow, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Expenses by category.</CardDescription>
              </div>
              <PieChart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="h-[400px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={expenseCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value}`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-medium mb-4">Expense Categories</h3>
                  <div className="space-y-4">
                    {expenseCategoryData.map((category, index) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span>{category.name}</span>
                        </div>
                        <span className="font-medium">${category.value.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between font-bold">
                        <span>Total Expenses</span>
                        <span>${expenseCategoryData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tax Summary</CardTitle>
                <CardDescription>Summary of tax-related information.</CardDescription>
              </div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted p-6 text-center">
                <h3 className="text-lg font-medium mb-2">Tax Reports</h3>
                <p className="text-muted-foreground mb-4">Generate tax reports for your business.</p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Sales Tax</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">$4,250.00</p>
                      <p className="text-xs text-muted-foreground">Year to date</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Income Tax</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">$18,750.00</p>
                      <p className="text-xs text-muted-foreground">Estimated</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Tax Deductions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">$12,350.00</p>
                      <p className="text-xs text-muted-foreground">Potential</p>
                    </CardContent>
                  </Card>
                </div>
                <Button className="mt-6">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Tax Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

