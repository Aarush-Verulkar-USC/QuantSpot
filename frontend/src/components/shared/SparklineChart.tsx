import { memo } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { getPriceColor } from "../../utils/colors";

interface SparklineChartProps {
  data: number[];
}

export const SparklineChart = memo(function SparklineChart({ data }: SparklineChartProps) {
  if (data.length === 0) return null;

  const change = data[data.length - 1] - data[0];
  const color = getPriceColor(change);
  const chartData = data.map((price) => ({ price }));

  return (
    <div className="pointer-events-none">
      <ResponsiveContainer width={120} height={40}>
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});
