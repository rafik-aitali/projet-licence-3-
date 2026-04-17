import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Card from "../components/Card";

export default function Search() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pages, setPages] = useState();
  const [currentPage, setCurrentPage] = useState();
  const [categories, setCategories] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const [queryString, setQueryString] = useState(
    new URLSearchParams(location.search).toString()
  );
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setQueryString(urlParams.toString());
  }, [activeCategory, location.search]);
  useEffect(() => {
    params.set("subcategory", activeCategory);
    setQueryString(params.toString());
  }, [activeCategory]);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setActiveCategory(urlParams.get("subcategory") || "");
  }, [location.search]);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    console.log(queryString);
    const fetchBusinesses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/businesses?${queryString}`
        );
        const data = await res.json();

        if (data.success) {
          setListings(data.businesses);
          setCurrentPage(data.pagination.currentPage);
          setPages(data.pagination.totalPages + 1);
        } else {
          setListings([]);
        }
      } catch (error) {
        setError("Failed to fetch businesses. Please try again.");
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, [queryString]);

  function handleNextPage() {
    const nextPage = currentPage + 1;
    params.set("page", String(nextPage));
    setQueryString(params.toString());
  }

  function handlePreviousPage() {
    const previousPage = currentPage - 1;
    params.set("page", String(previousPage));
    setQueryString(params.toString());
  }

  return (
    <div className="flex gap-5 max-w-7xl mx-auto mt-30 flex-col bg-white p-5 ">
      <div className=" bg-white  rounded-md   w-full">
        <div className="flex justify-between items-center  py-10 ">
          <h1 className="text-3xl font-semibold ">
            {params.get("name") || "All Businesses"}{" "}
            {params.get("location") || ""} {params.get("category") || ""}
          </h1>

          <form>
            <label className="inline-block font-semibold">Sort :</label>
            <select
              name="sortBy"
              id="sortBy"
              defaultValue="rating"
              onChange={(e) => {
                params.set("sortBy", e.target.value);
                setQueryString(params.toString());
              }}
            >
              <option value="rating">Rating</option>
              <option value="name">A-Z</option>
              <option value="createdAt">Latest</option>
            </select>
          </form>
        </div>
        <div className=" w-full flex-col shadow-md mb-5 bg-white  rounded-md p-3 md:flex gap-5">
          <h1 className="font-semibold text-2xl">
            {" "}
            <span className="text-gray-800">
              <FontAwesomeIcon icon={faFilter} />
            </span>{" "}
            Filters :
          </h1>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => {
                params.delete("subcategory");
                navigate(`?${params.toString()}`);
                setActiveCategory("");
              }}
              className={`px-4 py-2 rounded-full transition-all ${
                activeCategory === ""
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black border border-gray-300 hover:border-blue-500"
              }`}
            >
              All
            </button>
            {categories?.map((cat) => {
              return cat.name === params.get("category")
                ? cat.subcategories.map((subCat, i) => {
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          params.set("subcategory", subCat.name);
                          navigate(`?${params.toString()}`);
                          setActiveCategory(subCat.name);
                        }}
                        className={`px-4 py-2 rounded-full transition-all ${
                          activeCategory === subCat.name
                            ? "bg-blue-500 text-white"
                            : "bg-white text-black border border-gray-300 hover:border-blue-500"
                        }`}
                      >
                        {subCat.name}
                      </button>
                    );
                  })
                : null;
            })}
          </div>
        </div>
        <div className="max-w-7xl mx-auto  flex flex-col">
          {loading ? (
            <p className="text-center mt-6 text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center mt-6 text-red-500">{error}</p>
          ) : listings.length > 0 ? (
            <section className="py-12 bg-white">
              <div className="container max-w-7xl mx-auto ">
                {/* Business Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((business) => (
                    <Card
                      key={business?._id}
                      id={business?._id}
                      image={business?.avatar}
                      name={business?.name}
                      location={business?.location?.state}
                      rating={business?.rating}
                      category={business?.category}
                    />
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <p className="text-center mt-6 text-gray-500">
              No businesses found
            </p>
          )}

          {pages && (
            <div className="flex w-full justify-center mt-auto">
              {currentPage > 1 ? (
                <button onClick={handlePreviousPage} className="text-amber-700">
                  Previous
                </button>
              ) : (
                <button className="text-gray-400">Previous</button>
              )}

              <ul className="flex gap-5 p-5 justify-center">
                {[...Array(pages)].map((_, i) => {
                  if (i === 0) return null; // skip 0 index if your pages start from 1
                  return (
                    <li key={i}>
                      <button
                        className={`px-3 py-1 rounded ${
                          i === currentPage
                            ? "bg-blue-500 text-white font-semibold"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                        onClick={() => {
                          params.set("page", String(i));
                          setQueryString(params.toString());
                        }}
                      >
                        {i}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {currentPage < pages - 1 ? (
                <button
                  onClick={handleNextPage}
                  className="text-amber-700 font-semibold"
                >
                  Next
                </button>
              ) : (
                <button className="text-gray-400 font-semibold">Next</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
