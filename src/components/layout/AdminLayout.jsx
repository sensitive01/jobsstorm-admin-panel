import { useState } from "react";
import { Outlet } from "react-router-dom"; // Add this import
import SideBar from "./SideBar";
import TopBar from "./TopBar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Wrapper */}
      <div
        className={`${
          sidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 min-h-screen flex flex-col`}
      >
        {/* TopBar */}
        <TopBar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

        {/* Main Content Area - Render child routes here */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet /> {/* This renders your nested routes */}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>© 2025 JobsStorm. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-600">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-600">
                Terms of Service
              </a>
              <a href="#" className="hover:text-blue-600">
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
