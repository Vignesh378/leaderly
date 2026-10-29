import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  getPaymentBreakdown,
  getSalesTrend,
  getSummary,
  getTopProducts,
} from "../services/api.js";
import RevenueChart from "../components/dashboard/RevenueChart.jsx";
import TopProducts from "../components/dashboard/TopProductsChart.jsx";

const periods = [
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
  { label: "All time", value: 0 },
];
const colors = ["#176b52", "#72b49a", "#b8d5c7", "#d9e7df", "#95a99d"];

const dateRange = (days) => {
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

const unwrap = (response) => response?.data?.data;
const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

export default function Reports() {
  const [period, setPeriod] = useState(30);
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  const loadReports = useCallback(async () => {
    const activeRequest = ++requestId.current;
    setLoading(true);
    setError("");
    const range = dateRange(period);
    try {
      const [summaryResponse, trendResponse, productsResponse, paymentResponse] =
        await Promise.all([
          getSummary(range),
          getSalesTrend(range),
          getTopProducts({ ...range, limit: 5 }),
          getPaymentBreakdown(range),
        ]);
      if (activeRequest !== requestId.current) return;
      setSummary(unwrap(summaryResponse) ?? {});
      setTrend(unwrap(trendResponse) ?? []);
      setProducts(unwrap(productsResponse) ?? []);
      setPayments(unwrap(paymentResponse) ?? []);
    } catch (requestError) {
      if (activeRequest !== requestId.current) return;
      setSummary(null);
      setTrend([]);
      setProducts([]);
      setPayments([]);
      setError(
        requestError.response?.data?.message ||
          "We couldn't load your reports. Check your connection and try again."
      );
    } finally {
      if (activeRequest === requestId.current) setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (active) loadReports();
    });
    return () => {
      active = false;
      requestId.current += 1;
    };
  }, [loadReports]);

  const paymentTotal = payments.reduce((sum, item) => sum + Number(item.revenue || 0), 0);

  return (
    <div className="content-page reports-page">
      <div className="page-intro">
        <div>
          <div className="eyebrow">KNOW YOUR NUMBERS</div>
          <h1>Reports</h1>
          <p>Make sense of your sales performance over time.</p>
        </div>
        <div className="intro-actions">
          <label className="period-select-wrap">
            <span className="sr-only">Choose reporting period</span>
            <select
              className="period-select"
              value={period}
              onChange={(event) => setPeriod(Number(event.target.value))}
            >
              {periods.map((option) => (
                <option key={option.label} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <button type="button" className="secondary-button" onClick={loadReports} disabled={loading}>
            <RefreshCw size={15} className={loading ? "spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button type="button" onClick={loadReports}>Try again</button>
        </div>
      )}

      <section className="report-summary" aria-label="Sales summary">
        <div>
          <span>Total revenue</span>
          <strong>{summary ? money(summary.totalRevenue) : "—"}</strong>
        </div>
        <div>
          <span>Transactions</span>
          <strong>
            {summary
              ? Number(summary.totalTransactions || 0).toLocaleString("en-IN")
              : "—"}
          </strong>
        </div>
        <div>
          <span>Units sold</span>
          <strong>
            {summary
              ? Number(summary.totalUnitsSold || 0).toLocaleString("en-IN")
              : "—"}
          </strong>
        </div>
        <div>
          <span>Average sale</span>
          <strong>{summary ? money(summary.averageTransactionValue) : "—"}</strong>
        </div>
      </section>
      <p className="report-caption">
        {error
          ? "Report data could not be refreshed."
          : loading
          ? "Updating reports…"
          : period
            ? "Figures reflect recorded transactions for the selected period."
            : "Figures reflect all recorded transactions."}
      </p>

      {error ? (
        <div className="data-unavailable">
          Report details will return once your sales data is available.
        </div>
      ) : (
      <>
        <div className="report-grid">
          <RevenueChart data={trend} />
          <section className="report-payment-section">
          <div className="section-heading">
            <div>
              <h2>Payment methods</h2>
              <p>Revenue by payment type</p>
            </div>
            <span className="report-total">{money(paymentTotal)}</span>
          </div>
          {payments.length ? (
            <div className="payment-breakdown">
              {payments.map((payment, index) => {
                const share = paymentTotal ? (payment.revenue / paymentTotal) * 100 : 0;
                return (
                  <div className="payment-breakdown-item" key={payment.paymentMethod}>
                    <div className="payment-breakdown-heading">
                      <span>
                        <i style={{ backgroundColor: colors[index % colors.length] }} />
                        {payment.paymentMethod}
                      </span>
                      <strong>{money(payment.revenue)}</strong>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${share}%`,
                          backgroundColor: colors[index % colors.length],
                        }}
                      />
                    </div>
                    <small>{share.toFixed(1)}% of revenue · {payment.transactions} sale{payment.transactions === 1 ? "" : "s"}</small>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="compact-empty">Payment insights will appear after your first sale.</div>
          )}
          </section>
        </div>

        <div className="report-products">
          <TopProducts products={products} />
        </div>
      </>
      )}
    </div>
  );
}
