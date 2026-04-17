import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar";

export default function SideMenu({ toggleMenu }) {
  return (
    <div className="fixed z-10 top-0 left-0 h-screen w-full max-w-100 bg-white flex flex-col ">
      <div className="flex justify-between">
        <Link to="/">
          <h2 className="p-5 text-3xl text-red-700 font-semibold">AvisDZ</h2>
        </Link>
        <FontAwesomeIcon
          style={{
            color: "gray",
            fontSize: "1.2rem",
            cursor: "pointer",
            margin: "10px",
            marginLeft: "auto",
          }}
          onClick={toggleMenu}
          icon={faX}
        />
      </div>
      <SearchBar />
      <ul className="flex flex-col   mt-5">
        <Link to="/">
          <li className="border-b-1 border-gray-200 p-5 cursor-pointer">
            Home
          </li>
        </Link>
        <Link to="/profile">
          <li className="border-b-1 border-gray-200 p-5 cursor-pointer">
            Profile
          </li>
        </Link>
        <Link to="/profile/create-business">
          <li className="border-b-1 border-gray-200 p-5 cursor-pointer">
            Add a business
          </li>
        </Link>
        <Link to="/search">
          <li className="border-b-1 border-gray-200 p-5 cursor-pointer">
            businesses
          </li>
        </Link>
      </ul>
    </div>
  );
}
