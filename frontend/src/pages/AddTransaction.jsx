import { ArrowLeft, CircleHelp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import TransactionForm from "../components/transactions/TransactionForm.jsx";
import { createTransaction } from "../services/api.js";

export default function AddTransaction() {
  const navigate = useNavigate();

  const saveTransaction = async (transaction) => {
    await createTransaction(transaction);
    toast.success("Sale recorded successfully");
    navigate("/transactions");
  };

  return (
    <div className="content-page add-transaction-page">
      <button
        type="button"
        className="back-link"
        onClick={() => navigate("/transactions")}
      >
        <ArrowLeft size={16} /> Back
      </button>
      <div className="page-intro form-page-intro">
        <div>
          <div className="eyebrow">TRANSACTION ENTRY</div>
          <h1>Record a sale</h1>
          <p>Capture the details now. Your reports will take care of themselves.</p>
        </div>
      </div>
      <div className="form-layout">
        <TransactionForm
          onSubmit={saveTransaction}
          onCancel={() => navigate("/transactions")}
        />
        <aside className="form-aside">
          <div className="aside-icon"><CircleHelp size={18} /></div>
          <h2>A small note</h2>
          <p>Your transaction code is created automatically when you save. The total is calculated from quantity and unit price.</p>
        </aside>
      </div>
    </div>
  );
}
