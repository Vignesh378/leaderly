import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout.jsx";

const AddTransaction = lazy(() => import("./pages/AddTransaction.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const Reports = lazy(() => import("./pages/Reports.jsx"));
const Transactions = lazy(() => import("./pages/Transactions.jsx"));

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Suspense fallback={<RouteLoading />}><Dashboard /></Suspense>} />
        <Route path="transactions" element={<Suspense fallback={<RouteLoading />}><Transactions /></Suspense>} />
        <Route path="add" element={<Suspense fallback={<RouteLoading />}><AddTransaction /></Suspense>} />
        <Route path="reports" element={<Suspense fallback={<RouteLoading />}><Reports /></Suspense>} />
        <Route path="404" element={<Suspense fallback={<RouteLoading />}><NotFound /></Suspense>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}

function RouteLoading() {
  return <div className="route-loading" role="status">Preparing your workspace…</div>;
}
