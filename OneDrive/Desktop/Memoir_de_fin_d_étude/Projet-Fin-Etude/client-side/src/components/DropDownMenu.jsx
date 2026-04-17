import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  logOutUserStart,
  logOutUserSuccess,
  logOutUserFailure,
} from "../store/user/userSlice";
export default function DropDownMenu({ toggleShowMenu }) {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function handleLogout() {
    toggleShowMenu();
    try {
      dispatch(logOutUserStart());
      const res = await fetch(
        "http://localhost:8000/api/v1/auth/logout"
      );
      const data = await res.json();
      if (!data.success) {
        dispatch(logOutUserFailure());
        return;
      }
      dispatch(logOutUserSuccess());
      navigate("/login");
    } catch (error) {
      console.log(error);
      dispatch(logOutUserFailure);
    }
  }
  return (
    <div className="fixed z-10 top-23 right-0 h-fit overflow-hidden rounded-l-md w-full max-w-100 bg-white flex flex-col ">
      <ul className=" flex flex-col ">
        <Link to="/profile">
          <li
            onClick={toggleShowMenu}
            className="hover:bg-amber-700 pl-3 font-semibold py-3 hover:text-white cursor-pointer"
          >
            Profil
          </li>
        </Link>
        {currentUser.role === "admin" && (
          <Link to="/admin/dashboard">
            <li
              onClick={toggleShowMenu}
              className="hover:bg-amber-700 pl-3 font-semibold py-3 hover:text-white cursor-pointer"
            >
              Admin panel
            </li>
          </Link>
        )}

        <li
          className="hover:bg-amber-700 pl-3 font-semibold py-3 hover:text-white cursor-pointer"
          onClick={handleLogout}
        >
          Log out
        </li>
      </ul>
    </div>
  );
}
