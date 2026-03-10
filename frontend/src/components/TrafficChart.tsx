"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

export default function TrafficChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        const result = await fetchApi("/api/traffic");
        setData(result.traffic_data ?? []);
      } catch {
        // silently fail — endpoint may not exist yet
      }
    };

    fetchTraffic();
    const interval = setInterval(fetchTraffic, 5000);
    return () => clearInterval(interval);
  }, []);
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
            contentStyle={{
              backgroundColor: "#18181b",
              borderColor: "#27272a",
              borderRadius: "8px",
            }}
            itemStyle={{ color: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="requests"
            stroke="#10b981"
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              fill: "#10b981",
              stroke: "#000",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
