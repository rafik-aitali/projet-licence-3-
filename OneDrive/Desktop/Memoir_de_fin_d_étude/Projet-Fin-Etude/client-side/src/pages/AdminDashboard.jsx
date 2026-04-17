import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faTrademark,
  faMessage,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";

function AdminDashboard() {
  const { token } = useSelector((state) => state.user);
  const [stats, setStats] = useState({
    users: { total: 0, today: 0, thisMonth: 0 },
    businesses: { total: 0, today: 0, thisMonth: 0 },
    reviews: { total: 0, today: 0, thisMonth: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/v1/admin/stats",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        } else {
          setError(data.message || "Failed to fetch statistics");
        }
      } catch (err) {
        setError("An error occurred while fetching statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600"> Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.users.total}
              </p>
            </div>
            <div className={`bg-blue-500 text-white py-3 px-4 rounded-full`}>
              <FontAwesomeIcon icon={faUsers} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Businesses</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.businesses.total}
              </p>
            </div>
            <div className={`bg-red-500 text-white py-3 px-4 rounded-full`}>
              <FontAwesomeIcon icon={faBuilding} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.reviews.total}
              </p>
            </div>
            <div className={`bg-blue-500 text-white py-3 px-4 rounded-full`}>
              <FontAwesomeIcon icon={faMessage} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">+12%</p>
            </div>
            <div className={`bg-blue-500 py-3 px-4 text-white rounded-full`}>
              <FontAwesomeIcon icon={faTrademark} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
