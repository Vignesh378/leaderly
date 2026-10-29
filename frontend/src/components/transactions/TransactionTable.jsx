import { Plus, ReceiptText } from "lucide-react";
import TransactionRow from "./TransactionRow.jsx";

export default function TransactionTable({
  transactions,
  loading,
  error,
  onDelete,
  onCreate,
}) {
  if (!loading && !transactions.length) {
    if (error) {
      return (
        <div className="table-empty transaction-empty">
          Transactions could not be loaded. Use “Try again” above to retry.
        </div>
      );
    }

    return (
      <div className="table-empty transaction-empty">
        <div className="empty-icon"><ReceiptText size={21} /></div>
        <h2>No transactions found</h2>
        <p>Try adjusting your filters, or record a new sale.</p>
        <button type="button" className="primary-button" onClick={onCreate}>
          <Plus size={16} /> Add a sale
        </button>
      </div>
    );
  }

  return (
    <div className={`table-scroll ${loading ? "table-loading" : ""}`}>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>TRANSACTION</th>
            <th>PRODUCT</th>
            <th>DATE</th>
            <th>PAYMENT</th>
            <th className="align-right">AMOUNT</th>
            <th><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction._id}
              transaction={transaction}
              onDelete={onDelete}
            />
          ))}
          {loading && !transactions.length && (
            <tr>
              <td colSpan="6" className="table-loading-message">
                Loading your transactions…
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
