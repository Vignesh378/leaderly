import { ArrowUpRight, ReceiptText } from "lucide-react";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function RecentTransactions({
  transactions = [],
  onViewAll,
}) {
  const items = transactions.slice(0, 5);

  return (
    <section className="section-block transactions-section">
      <div className="section-heading">
        <div>
          <h2>Recent transactions</h2>
          <p>A quick look at your latest sales</p>
        </div>

        <button className="text-button" onClick={onViewAll} type="button">
          View all <ArrowUpRight size={15} />
        </button>
      </div>

      {items.length ? <div className="table-scroll">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>TRANSACTION</th>
              <th>PRODUCT</th>
              <th>DATE</th>
              <th>PAYMENT</th>
              <th className="align-right">AMOUNT</th>
            </tr>
          </thead>

          <tbody>
            {items.map((transaction) => (
              <tr key={transaction._id}>
                <td>
                  <div className="transaction-id">
                    <span className="transaction-icon">
                      <ReceiptText size={16} />
                    </span>
                    <span>{transaction.transactionCode}</span>
                  </div>
                </td>

                <td className="product-cell">{transaction.productName}</td>
                <td className="date-cell">
                  {formatDate(transaction.transactionDate)}
                </td>

                <td>
                  <span className="payment-label">
                    {transaction.paymentMethod}
                  </span>
                </td>

                <td className="align-right amount-cell">
                  {money(transaction.totalAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> : (
        <div className="table-empty">No transactions recorded in this period yet.</div>
      )}
    </section>
  );
}