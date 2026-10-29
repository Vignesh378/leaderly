import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import TransactionFilters from "../components/transactions/TransactionFilters.jsx";
import TransactionTable from "../components/transactions/TransactionTable.jsx";
import { deleteTransaction, getTransactions } from "../services/api.js";

const pageSize = 10;

export default function Transactions() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
  });
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const requestId = useRef(0);

  const loadTransactions = useCallback(async () => {
    const activeRequest = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const { data } = await getTransactions({
        ...filters,
        page,
        limit: pageSize,
      });
      if (activeRequest !== requestId.current) return;
      setTransactions(Array.isArray(data.data) ? data.data : []);
      setPagination(data.pagination ?? { total: 0, totalPages: 0 });
    } catch (requestError) {
      if (activeRequest !== requestId.current) return;
      setTransactions([]);
      setPagination({ total: 0, totalPages: 0 });
      setError(
        requestError.response?.data?.message ||
          "We couldn't load transactions. Check your connection and try again."
      );
    } finally {
      if (activeRequest === requestId.current) setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (active) loadTransactions();
    });
    return () => {
      active = false;
      requestId.current += 1;
    };
  }, [loadTransactions]);

  const updateFilter = (key, value) => {
    setPage(1);
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const removeTransaction = async () => {
    if (!selectedTransaction?._id) return;
    setDeleting(true);
    try {
      await deleteTransaction(selectedTransaction._id);
      toast.success("Transaction deleted");
      setSelectedTransaction(null);
      if (transactions.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadTransactions();
      }
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message || "Unable to delete this transaction."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="content-page">
      <div className="page-intro">
        <div>
          <div className="eyebrow">YOUR SALES RECORD</div>
          <h1>Transactions</h1>
          <p>Every sale, organized and easy to find.</p>
        </div>
        <div className="intro-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={loadTransactions}
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? "spin" : ""} />
            Refresh
          </button>
          <button type="button" className="primary-button" onClick={() => navigate("/add")}>
            <Plus size={16} /> Add sale
          </button>
        </div>
      </div>

      <TransactionFilters filters={filters} onChange={updateFilter} />

      {error && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button type="button" onClick={loadTransactions}>Try again</button>
        </div>
      )}

      <section className="transactions-section page-table-section" aria-label="Transactions">
        <div className="list-meta">
          <span>
            {loading
              ? "Loading transactions…"
              : `${pagination.total.toLocaleString("en-IN")} ${
                  pagination.total === 1 ? "transaction" : "transactions"
                }`}
          </span>
          {loading && <span className="loading-indicator" aria-hidden="true" />}
        </div>
        <TransactionTable
          transactions={transactions}
          loading={loading}
          error={error}
          onDelete={setSelectedTransaction}
          onCreate={() => navigate("/add")}
        />
        {pagination.totalPages > 1 && (
          <nav className="pagination" aria-label="Transaction pages">
            <button
              type="button"
              className="secondary-button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </button>
            <span>Page {page} of {pagination.totalPages}</span>
            <button
              type="button"
              className="secondary-button"
              disabled={page >= pagination.totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </nav>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(selectedTransaction)}
        title="Delete this transaction?"
        message={`This will permanently remove ${selectedTransaction?.transactionCode || "this sale"} from your records.`}
        confirmLabel={deleting ? "Deleting…" : "Delete transaction"}
        onCancel={() => !deleting && setSelectedTransaction(null)}
        onConfirm={removeTransaction}
        busy={deleting}
      />
    </div>
  );
}
