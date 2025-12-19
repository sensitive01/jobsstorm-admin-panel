import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
} from "lucide-react";

export default function SideBar({
  activeMenu,
  setActiveMenu,
  sidebarOpen,
  setSidebarOpen,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview & Analytics",
      path: "/admin/dashboard",
    },
    {
      id: "employers",
      name: "Employers",
      icon: Building2,
      description: "Manage Companies",
      path: "/admin/employers-table",
    },
    {
      id: "candidates",
      name: "Candidates",
      icon: Users,
      description: "User Management",
      path: "/admin/candidates-table",
    },
    {
      id: "companies",
      name: "Companies",
      icon: Briefcase,
      description: "Company Listings",
      path: "/admin/company-table",
    },
    {
      id: "plans",
      name: "Plans",
      icon: Briefcase,
      description: "plans",
      path: "/admin/plans-display",
    },
    {
      id: "assignpackage",
      name: "Assign Package",
      icon: Briefcase,
      description: "assign package",
      path: "/admin/assign-package-display",
    },
    {
      id: "blogs",
      name: "Blogs",
      icon: Briefcase,
      description: "blogs",
      path: "/admin/blog-display",
    },
  ];

  // Handle menu click with navigation
  const handleMenuClick = (item) => {
    setActiveMenu(item.id);
    navigate(item.path);
  };

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-slate-900 to-slate-800 text-white fixed left-0 top-0 h-full transition-all duration-300 z-40 shadow-2xl`}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-4 border-b border-slate-700">
        {sidebarOpen ? (
          <div className="flex items-center space-x-3">
            <img
              src="/logo-light.png"
              alt="JobsStorm Logo"
              className="h-10 w-auto"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <img
              src="/logo-light.png"
              alt="JobsStorm"
              className="h-8 w-8 object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      {/* Menu Section */}
      <div className="flex flex-col h-[calc(100%-4rem)]">
        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              // Check if current path matches item path
              const isActive = location.pathname === item.path;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center ${
                      sidebarOpen ? "space-x-3 px-4" : "justify-center px-2"
                    } py-3 rounded-xl transition-all duration-200 group relative ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    }`}
                    title={!sidebarOpen ? item.name : ""}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                    )}

                    {/* Icon */}
                    <Icon
                      size={22}
                      className={`${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-white"
                      } transition-colors flex-shrink-0`}
                    />

                    {/* Menu Text */}
                    {sidebarOpen && (
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p
                          className={`text-xs ${
                            isActive ? "text-blue-100" : "text-slate-500"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    )}

                    {/* Tooltip for collapsed sidebar */}
                    {!sidebarOpen && (
                      <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-slate-700">
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-xs text-slate-400">
                          {item.description}
                        </div>
                        <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-slate-900"></div>
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Settings Button */}
          {sidebarOpen && (
            <div className="mt-6 pt-6 border-t border-slate-700">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200">
                <Settings size={22} className="text-slate-400" />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">Settings</p>
                  <p className="text-xs text-slate-500">Configurations</p>
                </div>
              </button>
            </div>
          )}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-700">
          {/* Logout Button */}
          {sidebarOpen && (
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 mb-3"
            >
              <LogOut size={20} />
              <span className="font-medium text-sm">Logout</span>
            </button>
          )}

          {/* Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-all duration-200 border border-slate-600"
          >
            {sidebarOpen ? (
              <>
                <ChevronLeft size={20} />
                <span className="ml-2 text-sm font-medium">Collapse</span>
              </>
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
