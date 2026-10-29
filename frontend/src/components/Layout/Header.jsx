import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageNames = {
  "/": "Dashboard",
  "/transactions": "Transactions",
  "/add": "Add a sale",
  "/reports": "Reports",
  "/404": "Page not found",
};

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const pageTitle = pageNames[pathname] || "Workspace";

  return (
    <header className="topbar">
      <button
        type="button"
        className="mobile-menu-button"
        aria-label="Open navigation menu"
        onClick={onMenuClick}
      >
        <Menu size={20} />
      </button>
      <div className="breadcrumb" aria-label="Current page">
        Workspace <span>/</span> <strong>{pageTitle}</strong>
      </div>
      <div className="topbar-context">
        <span className="status-dot" />
        <span>Sales workspace</span>
      </div>
    </header>
  );
}