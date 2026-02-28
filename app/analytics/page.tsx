'use client'

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const chargebackData = [
  { industry: 'Travel', count: 45 },
  { industry: 'Digital Goods', count: 38 },
  { industry: 'Luxury Retail', count: 32 },
  { industry: 'Software', count: 28 },
  { industry: 'Others', count: 48 },
]

const trendData = [
  { week: 'W1', disputes: 125, chargebacks: 45, refunds: 82 },
  { week: 'W2', disputes: 142, chargebacks: 52, refunds: 91 },
  { week: 'W3', disputes: 156, chargebacks: 58, refunds: 105 },
  { week: 'W4', disputes: 168, chargebacks: 65, refunds: 118 },
]

const riskDistribution = [
  { name: 'Low Risk', value: 35 },
  { name: 'Medium Risk', value: 45 },
  { name: 'High Risk', value: 20 },
]

const COLORS = ['#90EE90', '#FFA07A', '#FF6B6B']

export default function AnalyticsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-1">Analytics</h1>
        <p className="text-muted-foreground">Comprehensive insights into merchant risk patterns and trends.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Dispute Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Dispute Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="disputes" stroke="#3B82F6" />
                <Line type="monotone" dataKey="chargebacks" stroke="#FF6B6B" />
                <Line type="monotone" dataKey="refunds" stroke="#FFA07A" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Merchant Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Industry Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Chargebacks by Industry</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chargebackData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="industry" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="count" fill="#FF8C42" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
