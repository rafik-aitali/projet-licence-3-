import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBars,
  faBuilding,
  faMessage,
  faDashboard,
} from "@fortawesome/free-solid-svg-icons";

function AdminPanel() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white shadow-lg transition-all  duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-blue-500">Admin Panel</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            {sidebarOpen ? <FontAwesomeIcon icon={faBars} /> : "..."}
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/dashboard"
                onClick={() => {
                  setActive("dashboard");
                }}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  active === "dashboard"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FontAwesomeIcon icon={faDashboard} />
                {sidebarOpen && <span className="ml-3">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/dashboard/users"
                onClick={() => {
                  setActive("users");
                }}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  active === "users"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FontAwesomeIcon icon={faUsers} />
                {sidebarOpen && <span className="ml-3">Users</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/dashboard/businesses"
                onClick={() => {
                  setActive("businesses");
                }}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  active === "businesses"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FontAwesomeIcon icon={faBuilding} />

                {sidebarOpen && <span className="ml-3">Businesses</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/dashboard/reviews"
                onClick={() => {
                  setActive("reviews");
                }}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  active === "reviews"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FontAwesomeIcon icon={faMessage} />
                {sidebarOpen && <span className="ml-3">Reviews</span>}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link
            to="/profile"
            className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            {sidebarOpen && <span className="ml-3">Back to Site</span>}
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
