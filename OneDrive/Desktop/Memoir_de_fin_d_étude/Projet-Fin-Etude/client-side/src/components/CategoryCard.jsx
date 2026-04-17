import React from "react";
import { useNavigate } from "react-router-dom";

export default function CategoryCard({ category }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        const encodedCategory = encodeURIComponent(category);
        navigate(`/search?category=${encodedCategory}`);
      }}
      className="border-1 shadow-md bg-white px-5 py-20 hover:shadow border-gray-200 cursor-pointer flex justify-center items-center"
    >
      <h2 className="font-semibold">{category}</h2>
    </div>
  );
}
