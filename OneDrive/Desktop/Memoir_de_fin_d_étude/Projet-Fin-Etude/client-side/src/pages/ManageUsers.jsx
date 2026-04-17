import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function ManageUsers() {
  const { token } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = new URLSearchParams(location.search);
  const [queryString, setQueryString] = useState(
    new URLSearchParams(location.search).toString()
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setQueryString(urlParams.toString());
  }, [location.search]);

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/admin/users?${queryString}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [queryString]);

  async function handleDelete(id) {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/user/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="p-3">
      <h1 className="text-3xl font-semibold">Manage Users</h1>
      <p className="text-gray-500">Manage registered users</p>

      <div className="flex flex-wrap gap-5 my-5">
        <input
          type="text"
          placeholder="Search by name or email"
          className="border p-2 bg-white rounded-md w-full md:w-1/2"
          onChange={(e) => {
            params.set("search", e.target.value);
            setQueryString(params.toString());
          }}
        />
        <div className="w-fit">
          <select
            className="border-gray-300 border p-2 bg-white  rounded-md mr-5"
            onChange={(e) => {
              params.set("filter", e.target.value);
              setQueryString(params.toString());
            }}
          >
            <option value="">All</option>
            <option value="today">Registered Today</option>
            <option value="thisMonth">Registered This Month</option>
          </select>
          <select
            className="border-gray-300 border p-2 bg-white  rounded-md"
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split(":");
              params.set("sortBy", sortBy);
              params.set("order", order);
              setQueryString(params.toString());
            }}
          >
            <option value="">Sort By</option>
            <option value="name:asc">Name (A-Z)</option>
            <option value="name:desc">Name (Z-A)</option>
            <option value="email:asc">Email (A-Z)</option>
            <option value="email:desc">Email (Z-A)</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="createdAt:desc">Newest First</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{user.role}</span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.createdAt.slice(0, 10)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <span
                      onClick={() => handleDelete(user._id)}
                      className="text-amber-700 mx-auto cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;
