import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faUtensils,
  faMugSaucer,
  faBagShopping,
  faBuilding,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
export default function Hero() {
  const navigate = useNavigate();
  const categories = [
    {
      name: "Restaurants",
      color: "bg-amber-500",
      icon: <FontAwesomeIcon icon={faUtensils} />,
      link: "search?category=Restaurants+%26+Food",
    },
    {
      name: "Cafés",
      color: "bg-orange-600",
      icon: <FontAwesomeIcon icon={faMugSaucer} />,
      link: "search?&category=Restaurants+%26+Food&sortBy=rating&subcategory=Cafes+%26+Coffee+Shops",
    },
    {
      name: "Shopping",
      color: "bg-blue-500",
      icon: <FontAwesomeIcon icon={faBagShopping} />,
      link: "search?category=Shopping+%26+Retail",
    },
    {
      name: "Health",
      color: "bg-pink-500",
      icon: <FontAwesomeIcon icon={faStar} />,
      link: "search?category=Health+%26+Wellness",
    },
    {
      name: "Hotels",
      color: "bg-indigo-500",
      icon: <FontAwesomeIcon icon={faBuilding} />,
      link: "search?category=Travel+%26+Transportation&sortBy=rating&subcategory=Hotels+%26+Resorts",
    },
    {
      name: "Services",
      color: "bg-emerald-500",
      icon: <FontAwesomeIcon icon={faScrewdriverWrench} />,
      link: "search?category=Home+Services",
    },
  ];
  return (
    <div className="relative min-w-full mt-30 bg-sky-400 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 drop-shadow-md">
            Find the Best Local Businesses in Algeria
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Discover top-rated restaurants, shops, and services near you with
            trusted reviews from the community
          </p>
          <div className="bg-white rounded-lg text-gray-500 p-2 md:p-3 shadow-lg flex flex-col md:flex-row gap-2">
            <SearchBar />
          </div>

          <div className="mt-12 grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="cursor-pointer flex flex-col items-center bg-white/10 backdrop-blur-sm p-3 rounded-lg hover:bg-white/20 transition-all"
                onClick={() => {
                  navigate(`/${category.link}`);
                }}
              >
                <span
                  className={`flex items-center justify-center w-12 h-12 rounded-full ${category.color} shadow-lg mb-2`}
                >
                  {category.icon}
                </span>
                <span className="text-sm font-medium">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
