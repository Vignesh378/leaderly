import { useState } from "react";
import { CalendarDays, ChevronDown, IndianRupee, Package, Tag } from "lucide-react";

const paymentMethods = ["Cash", "UPI", "Card", "Net Banking", "Other"];

const today = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

export default function TransactionForm({ onSubmit, onCancel }) {
  const [values, setValues] = useState({
    productName: "",
    category: "",
    quantity: "1",
    unitPrice: "",
    transactionDate: today(),
    paymentMethod: "UPI",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        ...values,
        quantity: Number(values.quantity),
        unitPrice: Number(values.unitPrice),
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Your sale couldn't be saved. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const total = Number(values.quantity || 0) * Number(values.unitPrice || 0);

  return (
    <form className="transaction-form" onSubmit={submit}>
      {error && <div className="form-error" role="alert">{error}</div>}
      <div className="form-section-heading">
        <div className="form-section-icon"><Package size={17} /></div>
        <div>
          <h2>Sale details</h2>
          <p>Enter the product and payment information.</p>
        </div>
      </div>

      <div className="form-grid">
        <label className="form-field form-field-wide">
          <span>Product name <b>*</b></span>
          <div className="input-with-icon">
            <Package size={16} aria-hidden="true" />
            <input
              name="productName"
              value={values.productName}
              onChange={update}
              placeholder="e.g. Ceramic pour-over set"
              maxLength={100}
              autoComplete="off"
              required
            />
          </div>
        </label>

        <label className="form-field">
          <span>Category <b>*</b></span>
          <div className="input-with-icon">
            <Tag size={16} aria-hidden="true" />
            <input
              name="category"
              value={values.category}
              onChange={update}
              placeholder="e.g. Homeware"
              maxLength={60}
              required
            />
          </div>
        </label>

        <label className="form-field">
          <span>Sale date <b>*</b></span>
          <div className="input-with-icon">
            <CalendarDays size={16} aria-hidden="true" />
            <input
              type="date"
              name="transactionDate"
              value={values.transactionDate}
              onChange={update}
              required
            />
          </div>
        </label>

        <label className="form-field">
          <span>Quantity <b>*</b></span>
          <input
            type="number"
            name="quantity"
            value={values.quantity}
            onChange={update}
            min="1"
            step="1"
            required
          />
        </label>

        <label className="form-field">
          <span>Unit price <b>*</b></span>
          <div className="input-with-icon">
            <IndianRupee size={16} aria-hidden="true" />
            <input
              type="number"
              name="unitPrice"
              value={values.unitPrice}
              onChange={update}
              min="0"
              step="0.01"
              placeholder="0.00"
              required
            />
          </div>
        </label>

        <label className="form-field">
          <span>Payment method <b>*</b></span>
          <div className="select-with-icon">
            <select
              name="paymentMethod"
              value={values.paymentMethod}
              onChange={update}
              required
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
            <ChevronDown size={15} aria-hidden="true" />
          </div>
        </label>
      </div>

      <div className="sale-total">
        <div>
          <span>Total sale</span>
          <small>{values.quantity || 0} item{Number(values.quantity) === 1 ? "" : "s"}</small>
        </div>
        <strong>
          ₹{total.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </strong>
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="primary-button" disabled={saving}>
          {saving ? "Saving sale…" : "Save sale"}
        </button>
      </div>
    </form>
  );
}
