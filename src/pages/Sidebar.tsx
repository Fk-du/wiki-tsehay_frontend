import { useLocation, NavLink } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  // Define children for each page
  const sidebarItems: Record<string, string[]> = {
    "/home": ["Dashboard", "News", "Updates"],
    "/services": ["Web Dev", "Mobile Dev", "Cloud"],
    "/projects": ["Ongoing", "Completed"],
    "/about": ["Team", "History", "Vision"],
    "/contact": ["Email", "Phone", "Office"],
  };

  const items = sidebarItems[pathname] || [];

  return (
    <aside className="w-64 bg-[rgba(240,206,13,0.937)] shadow-md p-4 saturate-150 
    border-r border-[rgb(37, 91, 48) border-opacity-50 border-x-lime-600]">
      <h2 className="text-lg font-semibold mb-4">Menu</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item}>
            <NavLink
              to={`${pathname}/${item.toLowerCase()}`}
              className="block px-3 py-2 rounded hover:bg-gray-200"
            >
              {item}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
