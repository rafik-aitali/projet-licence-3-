import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
export default function Card({ id, image, name, location, category, rating }) {
  return (
    <Link
      to={`/business/${id}`}
      className="bg-white rounded-md overflow-hidden shadow-md block"
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-black truncate">{name}</h3>

        <div className="flex items-center my-2">
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <FontAwesomeIcon
                icon={faStar}
                key={i}
                size={16}
                className={`${
                  i < Math.floor(rating)
                    ? "fill-gray-500 text-gray-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="text-sm text-dzGray-dark mb-2">{category}</div>

        <div className="flex items-center text-sm gap-2 text-gray-500">
          <span className="text-sm text-gray-400 ">
            {<FontAwesomeIcon icon={faLocationDot} />}
          </span>
          <span className="truncate">{location}</span>
        </div>
      </div>
    </Link>
  );
}
