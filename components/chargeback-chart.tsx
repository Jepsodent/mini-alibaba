'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface ChartData {
  month: string
  historical: number
  forecast: number
}

interface ChargebackChartProps {
  data: ChartData[]
}

export default function ChargebackChart({ data }: ChargebackChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF8C42" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#FF8C42" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="month" 
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          formatter={(value) => [`${value}%`, '']}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
          iconType="circle"
        />
        <Area 
          type="monotone" 
          dataKey="historical" 
          stroke="#FF8C42" 
          fill="url(#colorHistorical)"
          name="Historical"
          dot={{ fill: '#FF8C42', r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line 
          type="monotone" 
          dataKey="forecast" 
          stroke="#FF8C42" 
          strokeWidth={2}
          strokeDasharray="5 5"
          name="Forecast (AI)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
