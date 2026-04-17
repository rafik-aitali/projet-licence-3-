import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faBell } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const { currentUser, token } = useSelector((state) => state.user);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useRef(null);
  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/v1/notifications",
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setNotifications(data.notifications);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };
  useEffect(() => {
    if (!currentUser?._id || socketRef.current) return;
    fetchNotifications();
    socketRef.current = io("http://localhost:8000", {
      withCredentials: true,
    });
    socketRef.current.on("connect", () => {});

    socketRef.current.emit("registerUser", currentUser._id);

    socketRef.current.on("newReview", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("newReview");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [currentUser._id]);
  async function handleDeleteNotification(id) {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/notifications/${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handleOpenNotifications = async () => {
      if (!isOpen) {
        try {
          const res = await fetch(
            "http://localhost:8000/api/v1/notifications/mark-as-read",
            {
              method: "PUT",
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await res.json();
          fetchNotifications();
        } catch (err) {
          console.error("Failed to mark notifications as read:", err);
        }
      }
    };
    handleOpenNotifications();
  }, [isOpen]);
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="relative hover:text-blue-500"
      >
        <FontAwesomeIcon icon={faBell} />
        {notifications?.filter((notif) => notif.isRead === false).length >
          0 && (
          <span className="absolute z-0 top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
            {notifications?.filter((notif) => notif.isRead === false).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute  right-0 md:w-100 mx-auto mt-2 w-75 bg-white shadow-md rounded-md py-2">
          <h2 className="font-semibold text-sm p-1">Notifications:</h2>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm p-5">No notifications</p>
          ) : (
            <div className="max-h-100 overflow-y-scroll">
              {notifications
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((notif, index) => (
                  <div
                    key={index}
                    className={`p-2 cursor-pointer flex items-center gap-2 hover:bg-gray-100 ${
                      !notif.isRead && "bg-gray-100"
                    }`}
                    onClick={() => {
                      navigate(`/business/${notif.businessId?._id}`);
                    }}
                  >
                    <div className="w-20 rounded-full border-1 border-gray-300 overflow-hidden">
                      <img
                        src={notif?.businessId?.avatar}
                        className="w-full rounded-full border-1"
                      />
                    </div>
                    <div className="flex flex-col">
                      <ul className="flex">
                        {[...Array(parseInt(notif?.rating))].map((star, i) => {
                          return (
                            <li key={i}>
                              <FontAwesomeIcon
                                icon={faStar}
                                className="text-amber-700 text-[12px]"
                              />
                            </li>
                          );
                        })}
                      </ul>
                      <p className="text-[10px]">
                        <span className="font-semibold">
                          {notif.businessId?.name}
                        </span>
                        {` has recieved a new review from`}{" "}
                        <span className="font-semibold">
                          {notif.reviewer?.name}
                        </span>
                      </p>
                    </div>
                    <div className="min-h-full ml-auto mb-auto">
                      <span
                        className="text-gray-400 hover:text-black"
                        onClick={() => {
                          handleDeleteNotification(notif?._id);
                        }}
                      >
                        X
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
