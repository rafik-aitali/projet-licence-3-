import React from "react";
import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
export default function SharedLayout({ toggleMenu, toggleShowMenu }) {
  return (
    <>
      <div className="fixed bg-white shadow-sm left-0 min-w-full z-5 top-0">
        <Navbar toggleMenu={toggleMenu} toggleShowMenu={toggleShowMenu} />
      </div>
      <Outlet />
    </>
  );
}
