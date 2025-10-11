import { useState } from "react";
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
  X,
} from "lucide-react";

export default function TopBar({ setSidebarOpen, sidebarOpen }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: "New employer registered", time: "5 min ago", unread: true },
    { id: 2, text: "Job post approved", time: "1 hour ago", unread: true },
    {
      id: 3,
      text: "New application received",
      time: "2 hours ago",
      unread: false,
    },
    {
      id: 4,
      text: "Candidate profile updated",
      time: "3 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left Side - Menu Toggle & Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-xl">
        {/* Menu Toggle Button - Hidden on large screens */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
        >
          <Menu size={22} className="text-gray-600" />
        </button>

        {/* Search Bar */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search employers, candidates, jobs..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
          />
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={20} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900">
                    Notifications
                  </h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 ${
                        notification.unread ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex space-x-3">
                        <div
                          className={`w-2 h-2 mt-2 rounded-full ${
                            notification.unread ? "bg-blue-600" : "bg-gray-300"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p
                            className={`text-sm ${
                              notification.unread
                                ? "font-semibold text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.text}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-200 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View all
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300"></div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2 px-2 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-500 hidden md:block transition-transform ${
                showProfileMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowProfileMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                {/* Profile Info */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-bold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@jobstorm.com</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <a
                    href="#"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User size={16} />
                    <span>My Profile</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </a>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-200 py-2">
                  <a
                    href="#"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
