import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ReceiptText,
  Plus,
  ChartNoAxesCombined,
  CircleHelp,
  Leaf,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Transactions", path: "/transactions", icon: ReceiptText },
  { label: "Add Sale", path: "/add", icon: Plus },
  { label: "Reports", path: "/reports", icon: ChartNoAxesCombined },
];

export default function Sidebar({ isOpen = false, onNavigate = () => {} }) {
  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <Link to="/" className="brand" onClick={onNavigate}>
        <span className="brand-mark">
          <Leaf size={21} strokeWidth={2.4} />
        </span>
        <span>ledgerly</span>
      </Link>

      <div className="nav-label">WORKSPACE</div>

      <nav className="nav-list">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={19} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="nav-label">SUPPORT</div>
        <a className="nav-link" href="mailto:support@example.com">
          <CircleHelp size={19} strokeWidth={1.8} />
          <span>Help center</span>
        </a>

        <div className="sidebar-profile">
          <div className="profile-avatar" aria-hidden="true">SL</div>
          <div>
            <strong>Sales workspace</strong>
            <span>Business account</span>
          </div>
        </div>
      </div>
    </aside>
  );
}