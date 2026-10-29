import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw, Sparkles } from "lucide-react";
import {
  getSummary,
  getSalesTrend,
  getTopProducts,
  getTransactions,
} from "../services/api.js";
import StatItem from "../components/dashboard/StatItem.jsx";
import RevenueChart from "../components/dashboard/RevenueChart.jsx";
import TopProducts from "../components/dashboard/TopProductsChart.jsx";
import RecentTransactions from "../components/dashboard/RecentTransactions.jsx";

const periods = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "All time", value: 0 },
];

const getDateRange = (days) => {
  if (!days) return {};
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));
  const dateString = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
  return {
    startDate: dateString(start),
    endDate: dateString(end),
  };
};

const formatMoney = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const responseData = (response) => response?.data?.data;

export default function Dashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState(30);
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  const loadDashboard = useCallback(async () => {
    const activeRequest = ++requestId.current;
    setLoading(true);
    setError("");
    const dateRange = getDateRange(period);

    try {
      const [summaryResponse, trendResponse, productsResponse, transactionsResponse] =
        await Promise.all([
          getSummary(dateRange),
          getSalesTrend(dateRange),
          getTopProducts({ ...dateRange, limit: 4 }),
          getTransactions({ ...dateRange, page: 1, limit: 5 }),
        ]);

      const summaryData = responseData(summaryResponse);
      const trendData = responseData(trendResponse);
      const productsData = responseData(productsResponse);
      const transactionsData = responseData(transactionsResponse);

      if (activeRequest !== requestId.current) return;
      setSummary(summaryData?.summary ?? summaryData ?? {});
      setTrend(Array.isArray(trendData) ? trendData : trendData?.trend ?? []);
      setProducts(
        Array.isArray(productsData) ? productsData : productsData?.products ?? []
      );
      setTransactions(
        Array.isArray(transactionsData)
          ? transactionsData
          : transactionsData?.transactions ?? transactionsData?.results ?? []
      );
    } catch (requestError) {
      if (activeRequest !== requestId.current) return;
      setSummary(null);
      setTrend([]);
      setProducts([]);
      setTransactions([]);
      setError(
        requestError.response?.data?.message ||
          "We couldn't load your sales data. Check your connection and try again."
      );
    } finally {
      if (activeRequest === requestId.current) setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (active) loadDashboard();
    });
    return () => {
      active = false;
      requestId.current += 1;
    };
  }, [loadDashboard]);

  const selectedPeriod =
    periods.find((option) => option.value === period)?.label ?? "30 days";

  return (
    <div className="dashboard-page">
      <div className="page-intro">
        <div>
          <div className="eyebrow"><Sparkles size={13} /> BUSINESS OVERVIEW</div>
          <h1>Your sales, in focus.</h1>
          <p>A considered view of how your business is doing.</p>
        </div>
        <div className="intro-actions">
          <label className="period-select-wrap">
            <span className="sr-only">Choose reporting period</span>
            <select
              className="period-select"
              value={period}
              onChange={(event) => setPeriod(Number(event.target.value))}
              aria-label="Reporting period"
            >
              {periods.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="secondary-button"
            onClick={loadDashboard}
            disabled={loading}
            aria-label="Refresh dashboard"
          >
            <RefreshCw size={15} className={loading ? "spin" : ""} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/add")}
          >
            <Plus size={16} />
            Add sale
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button type="button" onClick={loadDashboard}>Try again</button>
        </div>
      )}

      <section className="stats-grid" aria-label="Sales metrics">
        <StatItem
          label="REVENUE"
          value={summary ? formatMoney(summary.totalRevenue) : "—"}
        />
        <StatItem
          label="TRANSACTIONS"
          value={
            summary
              ? Number(summary.totalTransactions || 0).toLocaleString("en-IN")
              : "—"
          }
        />
        <StatItem
          label="UNITS SOLD"
          value={
            summary
              ? Number(summary.totalUnitsSold || 0).toLocaleString("en-IN")
              : "—"
          }
        />
        <StatItem
          label="AVERAGE SALE"
          value={summary ? formatMoney(summary.averageTransactionValue) : "—"}
        />
      </section>
      <div className="metrics-caption">
        {error
          ? "Sales metrics could not be refreshed."
          : loading
          ? "Updating your overview…"
          : period
            ? `For the last ${selectedPeriod.toLowerCase()}`
            : "For all recorded sales"}
      </div>

      {error ? (
        <div className="data-unavailable">
          Analytics will return once your sales data is available.
        </div>
      ) : !loading && !Number(summary?.totalTransactions) ? (
        <section className="welcome-panel">
          <div className="welcome-mark"><Plus size={19} /></div>
          <div>
            <h2>Your next sale starts here</h2>
            <p>Add your first transaction to see revenue trends and product insights.</p>
          </div>
          <button className="primary-button" type="button" onClick={() => navigate("/add")}>
            Record a sale <Plus size={15} />
          </button>
        </section>
      ) : (
        <>
          <div className="analytics-grid">
            <RevenueChart data={trend} />
            <TopProducts products={products} />
          </div>
          <RecentTransactions
            transactions={transactions}
            onViewAll={() => navigate("/transactions")}
          />
        </>
      )}

      <footer className="dashboard-footer">
        <span>Ledgerly</span>
        <span>
          Sales overview · {error ? "Connection issue" : loading ? "Refreshing" : "Up to date"}
        </span>
      </footer>
    </div>
  );
}
