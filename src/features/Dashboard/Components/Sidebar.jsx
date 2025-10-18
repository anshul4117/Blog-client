import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FilePlus, FileText } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/posts", label: "My Posts", icon: FileText },
  { to: "/dashboard/create", label: "Create Post", icon: FilePlus },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-60 bg-muted/40 border-r min-h-screen p-4 space-y-2">
      <h2 className="text-lg font-bold mb-4">Dashboard</h2>
      {links.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition ${
              active ? "bg-accent text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
