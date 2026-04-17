import React, { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8000/api/v1/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <div className="h-screen min-w-full mt-20">
      <h2 className="text-center text-3xl font-semibold mb-10">Categories</h2>

      <ul className="grid grid-cols-3 md:grid-cols-4 gap-5 w-full transition-opacity">
        {categories.map((category, i) => {
          return <CategoryCard key={i} category={category.name} />;
        })}
      </ul>
    </div>
  );
}
