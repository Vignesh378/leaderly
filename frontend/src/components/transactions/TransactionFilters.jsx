import { Search, X } from "lucide-react";

const paymentMethods = ["Cash", "UPI", "Card", "Net Banking", "Other"];

export default function TransactionFilters({ filters, onChange }) {
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <section className="filter-toolbar" aria-label="Filter transactions">
      <label className="search-field">
        <Search size={17} aria-hidden="true" />
        <span className="sr-only">Search transactions</span>
        <input
          type="search"
          placeholder="Search product or transaction"
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
        />
      </label>
      <label className="filter-field">
        <span className="sr-only">Filter by category</span>
        <input
          type="search"
          placeholder="Category"
          value={filters.category}
          onChange={(event) => onChange("category", event.target.value)}
        />
      </label>
      <label className="filter-field">
        <span className="sr-only">Filter by payment method</span>
        <select
          value={filters.paymentMethod}
          onChange={(event) => onChange("paymentMethod", event.target.value)}
        >
          <option value="">All payments</option>
          {paymentMethods.map((method) => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </label>
      <label className="filter-field date-filter">
        <span className="sr-only">From date</span>
        <input
          type="date"
          value={filters.startDate}
          onChange={(event) => onChange("startDate", event.target.value)}
        />
      </label>
      <label className="filter-field date-filter">
        <span className="sr-only">To date</span>
        <input
          type="date"
          value={filters.endDate}
          min={filters.startDate || undefined}
          onChange={(event) => onChange("endDate", event.target.value)}
        />
      </label>
      {hasFilters && (
        <button
          type="button"
          className="clear-filters"
          onClick={() =>
            Object.keys(filters).forEach((key) => onChange(key, ""))
          }
        >
          <X size={14} /> Clear
        </button>
      )}
    </section>
  );
}
