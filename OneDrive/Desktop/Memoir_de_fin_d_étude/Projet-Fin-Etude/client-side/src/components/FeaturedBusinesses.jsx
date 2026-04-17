import React, { useState, useEffect } from "react";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

function FeaturedBusinesses() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState();
  const [listings, setListings] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [more, setMore] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/businesses?category=${activeCategory}`
        );
        const data = await res.json();

        if (data.success) {
          setListings(data.businesses);
        } else {
          setListings([]);
        }
      } catch (error) {
        console.error("Error fetching businesses:", error);
        setListings([]);
      }
    };
    fetchBusinesses();
  }, [activeCategory]);
  const handleViewMore = () => {
    navigate("/search?category=" + activeCategory);
  };
  return (
    <section className="py-12">
      <div className="container max-w-7xl mx-auto px-4">
        <h2 className="section-title text-center mb-4 text-3xl font-extrabold">
          Popular Places in Algeria
        </h2>
        <p className="text-center text-gray-500 max-w-2xl mx-auto mb-8">
          Discover the highest-rated and most loved businesses across the
          country
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => {
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
          {categories &&
            (more ? categories : categories.slice(0, 5)).map((category, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveCategory(category.name);
                }}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeCategory === category.name
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black border border-gray-300 hover:border-blue-500"
                }`}
              >
                {category.name}
              </button>
            ))}
          <button
            onClick={() => {
              setMore(!more);
            }}
            className={`px-4 py-2 rounded-full transition-all hover:bg-blue-500 hover:text-white`}
          >
            {more ? "less..." : "more..."}
          </button>
        </div>

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

        <div className="text-center mt-10">
          <button
            onClick={handleViewMore}
            className="bg-blue-500 text-white rounded-md px-8 py-3"
          >
            View More Businesses
          </button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedBusinesses;
