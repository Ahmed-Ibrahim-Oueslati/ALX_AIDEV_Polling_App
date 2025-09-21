// Chart component (Client Component if interactive)
"use client";
import { Bar } from "react-chartjs-2";
import { ChartProps } from "@/lib/analytics/types";

export default function Chart({ data, options }: ChartProps) {
  return <Bar data={data} options={options} />;
}