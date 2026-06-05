import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r p-5">
      <h1 className="text-2xl font-bold mb-8">
        Wornora Admin
      </h1>

      <nav className="flex flex-col gap-4">
        <Link to="/">Dashboard</Link>
        <Link to="/products">Products</Link>
        <Link to="/categories">Categories</Link>
      </nav>
    </aside>
  );
}