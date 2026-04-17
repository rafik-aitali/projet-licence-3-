import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
  });
  const [categories, setCategories] = useState();

  const searchIcon = (
    <FontAwesomeIcon
      style={{
        fontSize: "1.2rem",
        margin: 0,
        padding: 0,
      }}
      icon={faMagnifyingGlass}
    />
  );
  const locationIcon = (
    <FontAwesomeIcon
      style={{
        fontSize: "1.2rem",
        margin: 0,
        padding: 0,
      }}
      icon={faLocationDot}
    />
  );
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const { name, location, category } = formData;
    const urlParams = new URLSearchParams();
    urlParams.set("name", name);
    urlParams.set("location", location);
    urlParams.set("category", category);
    urlParams.set("sortBy", "rating");
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    if (formData.category !== "") {
      handleSearch();
    }
  }, [formData.category]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <form
      className="overflow-hidden min-w-full flex  flex-wrap  items-center justify-between rounded-md border-gray-200 border-1"
      onSubmit={handleSearch}
    >
      <div className="flex items-center justify-start">
        <button type="submit" className=" text-2xl mr-2 ml-3 text-gray-400 ">
          {searchIcon}
        </button>
        <input
          className="outline-none  flex max-w-30 md:min-w-50 border-none min-w-0 border-gray-200"
          id="name"
          type="text"
          placeholder="Resturants, hotels..."
          onChange={handleChange}
        />
      </div>
      <div className="border-1 h-8 border-gray-300"></div>
      <div className="flex items-center justify-start">
        <span className="text-sm text-gray-400 mr-3 ml-3 ">{locationIcon}</span>
        <input
          className="outline-none flex max-w-30 border-none md:min-w-50 border-gray-200 min-w-0"
          id="location"
          type="text"
          placeholder="location"
          onChange={handleChange}
        />
      </div>
      <div className="border-1 h-8 border-gray-300"></div>
      <select
        className="outline-none border-none max-w-fit flex cursor-pointer"
        id="category"
        value={formData.category}
        type="text"
        placeholder="category"
        onChange={handleChange}
      >
        <option value="">All categories</option>
        {categories?.map((category, i) => (
          <option key={i} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      <br />
    </form>
  );
}
