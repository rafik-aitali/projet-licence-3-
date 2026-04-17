import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrash } from "@fortawesome/free-solid-svg-icons";

function ManageReviews() {
  const { token } = useSelector((state) => state.user);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = new URLSearchParams(location.search);
  const [queryString, setQueryString] = useState(
    new URLSearchParams(location.search).toString()
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setQueryString(urlParams.toString());
  }, [location.search]);

  const fetchReviews = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/admin/reviews?${queryString}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (data.success) {
        console.log(data);
        setReviews(data.reviews);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [queryString]);

  async function handleDelete(id) {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/reviews/${id}`,
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
        console.log(data);
        fetchReviews();
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="p-3">
      <h1 className="text-3xl font-semibold">Manage Reviews</h1>
      <p className="text-gray-500">Manage reviews submitted by users</p>

      <div className="flex gap-5 flex-wrap my-5">
        <input
          type="text"
          placeholder="Search by reviewer name, email, or business name"
          className="border p-2 bg-white rounded-md md:w-1/2 w-full"
          onChange={(e) => {
            params.set("search", e.target.value);
            setQueryString(params.toString());
          }}
        />
        <div className=" w-fit">
          <select
            className="border p-2 mr-5 border-gray-300 bg-white max-w-1/3  rounded-md"
            onChange={(e) => {
              params.set("filter", e.target.value);
              setQueryString(params.toString());
            }}
          >
            <option value="">All</option>
            <option value="today">Submitted Today</option>
            <option value="thisMonth">Submitted This Month</option>
          </select>
          <select
            className="border p-2 max-w-1/3 rounded-md border-gray-300 bg-white"
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split(":");
              params.set("sortBy", sortBy);
              params.set("order", order);
              setQueryString(params.toString());
            }}
          >
            <option value="">Sort By</option>
            <option value="rating:asc">Rating (Low to High)</option>
            <option value="rating:desc">Rating (High to Low)</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="createdAt:desc">Newest First</option>
            <option value="reviewerName:asc">Reviewer Name (A-Z)</option>
            <option value="reviewerName:desc">Reviewer Name (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Review
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
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
            {reviews.map((review) => (
              <tr key={review._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <div className="text-sm font-medium text-gray-900">
                      {review.userId?.name}
                    </div>
                    <div className="text-sm text-gray-500 mb-1">
                      for {review.businessId?.name}
                    </div>
                    <div className="text-sm text-gray-700 truncate">
                      {review.comment}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon
                        icon={faStar}
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(review.rating)
                            ? "fill-blue-500 text-blue-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {review.createdAt.slice(0, 10)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                         bg-green-100 text-green-800
                        
                        
      
                    }`}
                  >
                    Published
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <span
                      onClick={() => handleDelete(review._id)}
                      className="text-amber-700 cursor-pointer"
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

export default ManageReviews;
