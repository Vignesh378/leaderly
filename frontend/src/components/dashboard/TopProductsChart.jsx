import { Package } from "lucide-react";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function TopProducts({ products = [] }) {
  const items = products.slice(0, 4);
  const maxRevenue = Math.max(...items.map((item) => item.revenue || 0), 1);

  return (
    <section className="section-block products-section">
      <div className="section-heading">
        <div>
          <h2>Top products</h2>
          <p>Your best performers</p>
        </div>
        <Package size={19} className="muted-icon" />
      </div>

      {items.length ? (
        <div className="product-list">
          {items.map((product, index) => (
            <div className="product-item" key={product._id || product.productName}>
              <div className="product-topline">
                <div className="product-identity">
                  <span className="product-rank">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <strong>{product.productName}</strong>
                    <span>{product.unitsSold || 0} units sold</span>
                  </div>
                </div>
                <strong className="product-revenue">{money(product.revenue)}</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${((product.revenue || 0) / maxRevenue) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="compact-empty">
          Product insights will appear after your first sale.
        </div>
      )}
    </section>
  );
}
