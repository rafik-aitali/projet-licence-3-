import React, { useEffect, useRef, useState } from "react";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faGear,
  faRightFromBracket,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  logOutUserStart,
  logOutUserSuccess,
  logOutUserFailure,
} from "../store/user/userSlice";

export default function Profile() {
  const { currentUser, token } = useSelector((state) => state.user);
  const [myBusinesses, setMyBusinesses] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [id, setId] = useState(null);
  const [savedBusinesses, setSavedBusinesses] = useState([]);
  const [activeTab, setActiveTab] = useState("saved");
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/v1/user/businesses",
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              authorization: `Beared ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!data.success) {
          console.log(data);
        } else {
          setMyBusinesses(data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchBusinesses();
  }, [myBusinesses]);
  useEffect(() => {
    const fetchSavedBusinesses = async () => {
      const res = await fetch(
        "http://localhost:8000/api/v1/user/saved-businesses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (data.success) {
        setSavedBusinesses(data.savedBusinesses);
      }
    };

    fetchSavedBusinesses();
  }, [savedBusinesses]);

  function handleshow(id) {
    setId(id);
    setShow(true);
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/businesses/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!data.success) {
        console.log(data.message);
      }
      setShow(false);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleLogout() {
    try {
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
    } catch (error) {
      console.log(error);
      dispatch(logOutUserFailure);
    }
  }
  return (
    <div className="mt-40 mx-auto   flex flex-col gap-5  max-w-7xl  ">
      <div className="bg-blue-500 rounded-md p-6 shadow-md text-white relative">
        <div
          className="absolute right-6 top-4 p-2 bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
          title="Edit Profile"
        >
          <div className="flex flex-col">
            <Link to="/profile/update-profile">
              <span className=" cursor-pointer text-white text-2xl">
                <FontAwesomeIcon icon={faGear} />
              </span>
            </Link>
            <span
              onClick={handleLogout}
              className="cursor-pointer text-white text-2xl"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
            </span>
            {currentUser.role === "admin" && (
              <Link to="/admin/dashboard">
                <span className="cursor-pointer text-white text-2xl">
                  <FontAwesomeIcon icon={faListCheck} />
                </span>
              </Link>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-full border-4 border-white"
          />
          <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
            <h1 className="text-2xl font-bold font-display">
              {currentUser.name}
            </h1>
            <p className="mt-1">
              Member since {currentUser?.createdAt.slice(0, 10)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-around font-semibold text-sm my-5">
        <span
          className="cursor-pointer"
          onClick={() => {
            setActiveTab("saved");
          }}
        >
          Saved Businesses
        </span>
        <span
          className="cursor-pointer"
          onClick={() => {
            setActiveTab("myBusinesses");
          }}
        >
          My Businesses
        </span>
      </div>
      {activeTab === "saved" ? (
        <div className="flex flex-col justify-between w-full  gap-5">
          <div className="bg-white w-full ">
            <h1 className="font-semibold text-lg mb-5 p-3">
              Saved Businesses:
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedBusinesses.map((business) => (
                <Card
                  key={business?._id}
                  id={business?._id}
                  image={business?.avatar}
                  name={business?.name}
                  location={business?.location?.state}
                  rating={business?.rating}
                  category={business?.category}
                />
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === "myBusinesses" ? (
        <div className="bg-white w-full  ">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold text-lg mb-5 p-3">My businesses:</h1>
            <Link to="/profile/create-business">
              <button className="cursor-pointer  bg-blue-500 text-md text-white rounded-md  px-3 py-2">
                Add Business
              </button>
            </Link>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBusinesses.map((business) => {
              return (
                <div
                  className="bg-white rounded-md shadow-md block"
                  key={business.id}
                >
                  <Link to={`/business/${business._id}`}>
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={business.avatar}
                        alt={business.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <h3 className="font-bold text-lg text-black truncate">
                      {business.name}
                    </h3>

                    <div className="flex items-center my-2">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon
                            icon={faStar}
                            key={i}
                            size={16}
                            className={`${
                              i < Math.floor(business.rating)
                                ? "fill-gray-500 text-gray-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-dzGray-dark mb-2">
                      {business.category}
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <span className="truncate">
                        {business.location.state}
                      </span>
                    </div>
                    <div className="mt-5">
                      <Link
                        to={`update-business/${business._id}`}
                        className="text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-all mr-2"
                      >
                        Edite
                      </Link>
                      <button
                        onClick={() => handleshow(business._id)}
                        className="text-sm text-black border border-black px-4 py-2 rounded-md hover:bg-kyGray-light transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </ul>
          {show && (
            <div className="fixed bg-white shadow-gray flex flex-col  items-center shadow-2xl rounded-md p-5 top-1/2 left-1/4 ">
              <p>
                If you delete this business every data related to it will be
                removed!
              </p>
              <p>are you sure you want to delete this business ?</p>
              <div className="flex mt-5 justify-around w-full">
                <button
                  className="bg-green-600 text-white rounded-md px-3"
                  onClick={() => {
                    handleDelete(id);
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setShow(false);
                  }}
                  className="bg-red-600 text-white rounded-md px-3"
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
