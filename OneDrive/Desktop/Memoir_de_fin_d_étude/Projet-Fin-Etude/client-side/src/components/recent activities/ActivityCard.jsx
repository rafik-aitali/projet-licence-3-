import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
export default function ActivityCard({
  businessId,
  businessName,
  profilePic,
  images,
  username,
  comment,
  rating,
}) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  return (
    <div
      key={businessId}
      className="bg-white rounded-lg h-full shadow-md overflow-hidden"
    >
      {images && (
        <div className="h-48 overflow-hidden">
          <img
            src={images[0]}
            alt={businessName}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={profilePic}
            alt={username}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h4 className="font-medium text-black">{username}</h4>
            <div className="flex items-center">
              <div className="text-amber-400 mr-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>
                    {i < Math.floor(rating) ? "★" : i < rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500">{""}</span>
            </div>
          </div>
        </div>
        <h3 className="text-lg font-bold text-black mb-2">{businessName}</h3>
        <p className="text-gray-500 mb-4">
          {comment.length > 100 ? `${comment.substring(0, 100)}...` : comment}
        </p>
        {comment.length > 100 && (
          <Link
            to={`/business/${businessId}`}
            className="text-AvBlue hover:text-AvBlue/80 font-medium"
          >
            Read more
          </Link>
        )}
      </div>
    </div>
  );
}
