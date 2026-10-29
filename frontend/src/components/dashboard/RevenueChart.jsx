import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const formatRupees = (value) =>
  `₹${Number(value).toLocaleString("en-IN")}`;

export default function RevenueChart({ data }) {
  const chartData = data ?? [];

  return (
    <section className="section-block revenue-section">
      <div className="section-heading">
        <div>
          <h2>Revenue over time</h2>
          <p>Track how your sales are performing</p>
        </div>

        <div className="chart-legend">
          <span className="legend-dot" />
          Sales revenue
        </div>
      </div>

      <div className="chart-container">
        {chartData.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 15, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#247657" stopOpacity={0.16} />
                <stop offset="95%" stopColor="#247657" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#edf0ed"
              strokeDasharray="3 5"
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8a928c", fontSize: 11 }}
              tickFormatter={(value) =>
                new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                })
              }
              dy={10}
              minTickGap={24}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8a928c", fontSize: 11 }}
              tickFormatter={(value) =>
                value >= 1000 ? `₹${Math.round(value / 1000)}k` : `₹${value}`
              }
              width={53}
            />

            <Tooltip
              formatter={(value) => [formatRupees(value), "Revenue"]}
              contentStyle={{
                border: "1px solid #e8ece8",
                borderRadius: "10px",
                boxShadow: "0 6px 24px rgba(20,40,25,0.06)",
                fontSize: "12px",
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#247657"
              strokeWidth={2.5}
              fill="url(#revenueFill)"
              activeDot={{ r: 5, fill: "#247657", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        ) : (
          <div className="chart-empty">
            <span>No sales to chart for this period.</span>
          </div>
        )}
      </div>
    </section>
  );
}