import { ArrowLeft, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="not-found-page">
      <div className="not-found-mark"><Leaf size={24} /></div>
      <span className="eyebrow">404 · PAGE NOT FOUND</span>
      <h1>This page took a wrong turn.</h1>
      <p>The address may be outdated, or the page may have moved.</p>
      <Link to="/" className="primary-button">
        <ArrowLeft size={16} /> Back to dashboard
      </Link>
    </section>
  );
}
