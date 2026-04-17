import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

function ManageBusinesses() {
  const { token } = useSelector((state) => state.user);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = new URLSearchParams(location.search);
  const [queryString, setQueryString] = useState(
    new URLSearchParams(location.search).toString()
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setQueryString(urlParams.toString());
  }, [location.search]);

  const fetchBusinesses = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/admin/businesses?${queryString}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (data.success) {
        setBusinesses(data.businesses);
        console.log(data.businesses);
      } else {
        setBusinesses([]);
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [queryString]);
  async function verifyBusiness(id) {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/admin/verify-business/${id}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      await fetchBusinesses();
      location.reload();
    } catch (error) {
      console.error(error);
    }
  }
  async function handleDelete(id) {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/admin/reject-business/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!data.success) {
        console.log(data.message);
      }
      fetchBusinesses();
      setShow(false);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="p-3">
      <h1 className="text-3xl font-semibold">Manage Businesses</h1>
      <p className="text-gray-500 ">
        Pending business listings awaiting verification
      </p>

      <div className="flex flex-wrap gap-5 my-5">
        <input
          type="text"
          placeholder="Search by name, location, or category"
          className="border p-2 rounded-md bg-white w-full md:w-1/2"
          onChange={(e) => {
            params.set("search", e.target.value);
            setQueryString(params.toString());
          }}
        />
        <div className="w-fit">
          <select
            className="border-gray-300 border p-2 mr-5 bg-white  rounded-md"
            onChange={(e) => {
              params.set("verified", e.target.value);
              setQueryString(params.toString());
            }}
          >
            <option value="">All</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
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
            <option value="category:asc">Category (A-Z)</option>
            <option value="category:desc">Category (Z-A)</option>
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
                Business
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {businesses.map((business) => (
              <tr key={business._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {business.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {business.category}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {business.owner_id.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-blue-500">
                      <FontAwesomeIcon icon={faStar} />
                    </span>
                    <span className="ml-1 text-sm text-gray-900">
                      {Math.round(business.rating * 10) / 10}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      business.isVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {business.isVerified ? (
                      <span>Verified</span>
                    ) : (
                      <span
                        className="cursor-pointer"
                        onClick={() => verifyBusiness(business._id)}
                      >
                        Verify
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    onClick={() => handleDelete(business._id)}
                    className="text-amber-700 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageBusinesses;
