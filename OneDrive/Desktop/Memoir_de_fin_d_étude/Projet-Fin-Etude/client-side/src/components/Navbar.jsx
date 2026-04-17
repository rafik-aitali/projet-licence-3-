import React, { useState } from "react";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import Notifications from "./Notifications";
export default function NavBar() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="sticky top-0  z-50  flex max-w-7xl mx-auto justify-between bg-white ">
      <div className="  min-w-full">
        <div className="flex flex-wrap items-center  min-w-full justify-between py-4">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-500  font-display">
              Av<span className="text-black">isDZ</span>
            </span>
          </Link>
          <div className="mx-auto hidden lg:flex">
            <SearchBar />
          </div>

          <div className="flex items-center gap-6">
            {currentUser && (
              <Link
                to="/search?"
                className="text-black hover:text-blue-500  font-medium"
              >
                All Businesses
              </Link>
            )}
            {currentUser && <Notifications />}

            {currentUser ? (
              <Link to="/profile">
                <img
                  src={currentUser.avatar}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  alt="profile"
                />
              </Link>
            ) : (
              <nav className="flex items-center gap-4 ml-auto">
                <Link
                  to="/search?"
                  className="text-black hover:text-blue-500  font-medium"
                >
                  All Businesses
                </Link>
                <Link
                  to="/login"
                  className="text-black hover:text-blue-500   font-medium"
                >
                  Login
                </Link>
                <Link to="/register">
                  <button className="bg-blue-500 px-3 rounded-md py-2 hover:bg-blue-500/90 text-white">
                    Sign Up
                  </button>
                </Link>
              </nav>
            )}
          </div>
        </div>
        <div className="lg:hidden pb-4">
          <div className="">
            <div className="">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
