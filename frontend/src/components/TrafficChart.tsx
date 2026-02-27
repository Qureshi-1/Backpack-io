"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { time: "00:00", requests: 1200 },
  { time: "02:00", requests: 900 },
  { time: "04:00", requests: 600 },
  { time: "06:00", requests: 1500 },
  { time: "08:00", requests: 3000 },
  { time: "10:00", requests: 4500 },
  { time: "12:00", requests: 5200 },
  { time: "14:00", requests: 4800 },
  { time: "16:00", requests: 4100 },
  { time: "18:00", requests: 3800 },
  { time: "20:00", requests: 2900 },
  { time: "22:00", requests: 2100 },
  { time: "24:00", requests: 1500 },
];

export default function TrafficChart() {
  return (
    <div className="h-[300px] w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="time" 
            stroke="#52525b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#52525b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
            itemStyle={{ color: "#fff" }}
          />
          <Line 
            type="monotone" 
            dataKey="requests" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: "#10b981", stroke: "#000", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
