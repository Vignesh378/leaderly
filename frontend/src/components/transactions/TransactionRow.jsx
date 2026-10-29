import { CreditCard, MoreHorizontal, ReceiptText } from "lucide-react";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const dateLabel = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

export default function TransactionRow({ transaction, onDelete }) {
  return (
    <tr>
      <td>
        <div className="transaction-id">
          <span className="transaction-icon"><ReceiptText size={16} /></span>
          <span>{transaction.transactionCode}</span>
        </div>
      </td>
      <td>
        <div className="product-description">
          <strong>{transaction.productName}</strong>
          <span>{transaction.category}</span>
        </div>
      </td>
      <td className="date-cell">{dateLabel(transaction.transactionDate)}</td>
      <td>
        <span className="payment-label"><CreditCard size={13} /> {transaction.paymentMethod}</span>
      </td>
      <td className="align-right amount-cell">{money(transaction.totalAmount)}</td>
      <td className="row-action-cell">
        <button
          type="button"
          className="row-action-button"
          aria-label={`Delete ${transaction.transactionCode}`}
          title="Delete transaction"
          onClick={() => onDelete(transaction)}
        >
          <MoreHorizontal size={18} />
        </button>
      </td>
    </tr>
  );
}
