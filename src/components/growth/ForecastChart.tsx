'use client';

import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

const forecastData = [
  { name: 'Jan', Projected: 28000, Actual: 26000 },
  { name: 'Feb', Projected: 31000, Actual: 33000 },
  { name: 'Mar', Projected: 34000, Actual: 31000 },
  { name: 'Apr', Projected: 38000, Actual: 40000 },
  { name: 'May', Projected: 41000, Actual: 38000 },
  { name: 'Jun', Projected: 45000, Actual: 43000 },
];

export default function ForecastChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={forecastData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
          tickFormatter={(value) => `$${value / 1000}k`}
        />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
        />
        <Legend 
          verticalAlign="top" 
          align="right" 
          iconType="circle"
          wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 600, color: '#64748b' }}
        />
        <Line 
          type="monotone" 
          dataKey="Projected" 
          stroke="#6366f1" 
          strokeWidth={3} 
          dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
        <Line 
          type="monotone" 
          dataKey="Actual" 
          stroke="#94a3b8" 
          strokeWidth={3} 
          dot={{ r: 4, fill: '#94a3b8', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
