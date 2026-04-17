import React, { useEffect } from "react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Notifications from "./components/Notifications";
import Home from "./pages/Home";
import SideMenu from "./components/SideMenu";
import SharedLayout from "./pages/SharedLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreateBusiness from "./pages/CreateBusiness";
import Search from "./pages/Search";
import UpdateBusiness from "./pages/UpdateBusiness";
import Business from "./pages/Business";
import PrivateRoute from "./components/PrivateRoute";
import DropDownMenu from "./components/DropDownMenu";
import UpdateProfile from "./pages/UpdateProfile";
import DeleteUser from "./pages/DeleteUser";
import { useSelector } from "react-redux";
import UpdateReview from "./pages/UpdateReview";
import AdminPanel from "./components/AdminPanel";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import ManageBusinesses from "./pages/ManageBusinesses";
import ManageUsers from "./pages/ManageUsers";
import ManageReviews from "./pages/ManageReviews";
import {
  logOutUserFailure,
  logOutUserStart,
  logOutUserSuccess,
} from "./store/user/userSlice";
import Footer from "./components/Footer";
function App() {
  const { currentUser, token } = useSelector((state) => state.user);
  const [show, setShow] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    async function handleLogout() {
      try {
        // Check if the token is expired
        if (token) {
          const decodedToken = jwtDecode(token); // Decode the token
          const currentTime = Date.now() / 1000; // Get current time in seconds
          if (decodedToken.exp < currentTime) {
            console.log("Token expired");
            dispatch(logOutUserStart());
            const res = await fetch(
              "http://localhost:8000/api/v1/auth/logout"
            );
            const data = await res.json();
            console.log(data);
            if (!data.success) {
              dispatch(logOutUserFailure());
              return;
            }
            dispatch(logOutUserSuccess());
            navigate("/login");
            return;
          }
        }
      } catch (error) {
        console.log(error);
        dispatch(logOutUserFailure());
      }
    }

    if (!token) {
      handleLogout();
    } else {
      handleLogout();
    }
  }, [token]);

  function toggleMenu() {
    setShow(!show);
  }
  function toggleShowMenu() {
    setShowMenu(!showMenu);
  }
  useEffect(() => {
    document.getElementById("container").addEventListener("click", (e) => {
      setShow(false);
      setShowMenu(false);
    });
  }, []);
  return (
    <BrowserRouter>
      {show && <SideMenu toggleMenu={toggleMenu} />}
      {showMenu && <DropDownMenu toggleShowMenu={toggleShowMenu} />}
      <div id="container" className="min-w-full mx-auto">
        <Routes>
          <Route
            path="/"
            element={
              <SharedLayout
                toggleMenu={toggleMenu}
                toggleShowMenu={toggleShowMenu}
              />
            }
          >
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route
                path="/profile/update-profile"
                element={<UpdateProfile />}
              />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route
                path="/profile/create-business"
                element={<CreateBusiness />}
              />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/profile/delete-user" element={<DeleteUser />} />
            </Route>
            <Route path="/business/:businessId" element={<Business />} />
            <Route element={<PrivateRoute />}>
              <Route
                path="profile/update-business/:businessId"
                element={<UpdateBusiness />}
              />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route
                path="/business/:businessId/update-review/:reviewId"
                element={<UpdateReview />}
              />
            </Route>
            <Route path="/search" element={<Search />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminPanel />}>
                <Route index element={<AdminDashboard />}></Route>
                <Route
                  path="/admin/dashboard/businesses"
                  element={<ManageBusinesses />}
                ></Route>
                <Route
                  path="/admin/dashboard/users"
                  element={<ManageUsers />}
                ></Route>
                <Route
                  path="/admin/dashboard/reviews"
                  element={<ManageReviews />}
                ></Route>
              </Route>
            </Route>
          </Route>
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
