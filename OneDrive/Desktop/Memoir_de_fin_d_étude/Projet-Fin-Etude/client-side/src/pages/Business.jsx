import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faPhone,
  faLocationDot,
  faMessage,
  faGlobe,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import Map from "../components/Map";
import ReviewItem from "../components/ReviewItem";
export default function Business() {
  const { currentUser, token } = useSelector((state) => state.user);
  const [business, setBusiness] = useState({});
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    images: [],
  });
  const [reviewMenu, setReviewMenu] = useState({
    show: false,
    id: null,
  });
  const [rating, setRating] = useState([]);
  const [hover, setHover] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const params = useParams();
  const navigate = useNavigate();
  const [queryString, setQueryString] = useState("order=desc");
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCount, setShowCount] = useState(3);

  function validateReviewForm() {
    if (rating == 0) {
      setErrorMessage("Please select a rating.");
      return false;
    }
    if (!formData.comment) {
      setErrorMessage("Please write a comment.");
      return false;
    }
    setErrorMessage("");
    return true;
  }
  useEffect(() => {
    const businessId = params.businessId;
    const fetchBusiness = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/businesses/${businessId}`
        );
        const data = await res.json();
        if (data.success) {
          console.log(data.business);
          setBusiness(data.business);
          fetchReviews(businessId);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBusiness();
  }, []);

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
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
          const isSaved = data.savedBusinesses.some(
            (b) => b._id === business._id
          );
          setSaved(isSaved);
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkIfSaved();
  }, [business._id]);

  async function fetchReviews(businessId) {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/reviews/businessReviews/${businessId}?${queryString}`
      );
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchReviews(params.businessId);
  }, [queryString]);

  function handleChangeOrder(e) {
    setQueryString(`order=${e.target.value}`);
  }

  function handleChange(e) {
    if (e.target.type === "file") {
      const imagesArray = Array.from(e.target.files);
      console.log("Images array:", imagesArray);

      setFormData((prevFormData) => ({
        ...prevFormData,
        images: imagesArray,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.id]: e.target.value,
      }));
    }
  }

  async function handleAddReview(e) {
    e.preventDefault();

    if (!validateReviewForm()) {
      return;
    }
    const businessId = params.businessId;
    const formDataToSend = new FormData();
    formDataToSend.append("businessId", businessId);
    formDataToSend.append("rating", rating);
    formDataToSend.append("comment", formData.comment);
    formData.images.forEach((image) => {
      formDataToSend.append("images", image);
    });
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:8000/api/v1/reviews",
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );
      const data = await res.json();
      if (!data.success) {
        return;
      }
      setLoading(false);
      fetchReviews(businessId);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  const toggleSave = async () => {
    const endpoint = saved
      ? "http://localhost:8000/api/v1/user/unsave-business"
      : "http://localhost:8000/api/v1/user/save-business";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ businessId: business._id }),
    });

    const data = await res.json();
    if (data.success) {
      setSaved(!saved);
    }
  };

  function handleShowReviewMenu(id) {
    setReviewMenu((prev) => {
      return {
        show: !prev.show,
        id,
      };
    });
  }

  async function handleDeleteReview(id) {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/reviews/${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className=" max-w-7xl  w-full mx-auto bg-white mt-46  ">
      <div className="bg-white rounded-lg flex flex-col shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h1 className="text-3xl font-bold font-display text-black mb-2 md:mb-0">
            {business.name}
          </h1>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  icon={faStar}
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.floor(business.rating)
                      ? "text-blue-500 fill-blue-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-600">
                {Math.round(business.rating * 10) / 10} ({reviews?.length}{" "}
                reviews)
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-500 mb-4">{business.category}</p>
        <p className="text-gray-500 mb-4">{business.subcategory}</p>

        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <span className="text-gray-300">
            <FontAwesomeIcon icon={faLocationDot} />
          </span>
          <span>
            {business.location?.address}, {business.location?.city}{" "}
            {business.location?.state}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <span className="text-gray-300">
            <FontAwesomeIcon icon={faMessage} />
          </span>

          <span>{business.contact?.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <span className="text-gray-300">
            <FontAwesomeIcon icon={faPhone} />
          </span>

          <span>{business.contact?.phone}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <span className="text-gray-300">
            <FontAwesomeIcon icon={faGlobe} />
          </span>

          <a
            href={`https://${business.contact?.website}`}
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {business.contact?.website}
          </a>
        </div>
        <div className="ml-auto mb-auto">
          <button
            className={`font-semibold text-lg ${
              saved ? "text-blue-500" : "text-gray-300"
            }`}
            onClick={toggleSave}
          >
            <FontAwesomeIcon icon={faBookmark} />
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold font-display text-black mb-4">
          Photos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {business.images?.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`${business.name} - Photo ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold font-display text-black mb-4">
          About the Business
        </h2>
        <p className="text-gray-500">{business.description}</p>
      </div>
      <div className="flex flex-col gap-5 my-5 md:flex-nowrap flex-wrap">
        <div className=" w-full grid  md:grid-cols-1 gap-5">
          <div className="bg-white rounded-md  ">
            <h1 className="font-semibold text-2xl mb-5">Location:</h1>

            <div className="w-full h-full">
              <Map
                coordinates={business.location?.coordinates}
                name={business.name}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md  ">
        {currentUser && (
          <form
            className="w-full flex flex-col shadow-md p-5"
            onSubmit={handleAddReview}
          >
            <h1 className="text-2xl font-semibold my-3">Write a Review :</h1>
            <h2 className="text-lg font-semibold">
              rating<span className="text-blue-500">*</span> :
            </h2>
            <div>
              {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;
                return (
                  <label key={i}>
                    <input
                      type="radio"
                      name="rating"
                      id="rating"
                      value={ratingValue}
                      className="hidden"
                      onClick={() => setRating(ratingValue)}
                    />
                    <FontAwesomeIcon
                      icon={faStar}
                      className={`cursor-pointer ${
                        ratingValue <= (hover || rating)
                          ? "text-blue-500"
                          : "text-gray-300"
                      }`}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(null)}
                    />
                  </label>
                );
              })}
            </div>
            <label className="text-lg font-semibold">
              comment<span className="text-blue-500">*</span> :
            </label>
            <textarea
              name="comment"
              id="comment"
              placeholder="write here"
              onChange={handleChange}
              className=" rounded-md h-40 p-2 border-1 border-gray-200 "
            ></textarea>
            <span
              className="cursor-pointer font-semibold mt-3"
              onClick={() => fileRef.current.click()}
            >
              Add pictures +
            </span>
            <input
              className="hidden"
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleChange}
            />
            <ul className="flex gap-3">
              {formData.images.map((image, index) => {
                return (
                  <li key={index}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt="image"
                      className="w-20 rounded-md"
                    />
                  </li>
                );
              })}
            </ul>
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="bg-blue-500 px-5 py-3 mt-3 ml-auto text-white rounded-md"
            >
              {loading ? "Adding..." : "Add Review"}
            </button>
          </form>
        )}
        <div className="mt-10">
          <div className="flex justify-between">
            <h1 className="text-3xl font-semibold">Reviews:</h1>
            <select
              name="order"
              id="order"
              defaultValue="desc"
              className="text-sm font-semibold"
              onChange={handleChangeOrder}
            >
              <option value="desc">newest first</option>
              <option value="asc"> oldest first </option>
            </select>
          </div>
          <ul className="flex flex-col gap-5 mt-10">
            {reviews.slice(0, showCount).map((review) => {
              return (
                <li key={review._id} className="shadow-md p-5 w-full">
                  <div className="flex items-center gap-2 ">
                    <img
                      src={review.userId.avatar}
                      className="w-15 rounded-full h-15"
                    />
                    <div>
                      <h3 className="font-semibold">{review.userId.name}</h3>
                      <span className="text-sm flex gap-2 text-gray-500">
                        <div>
                          {[...Array(5)].map((star, i) => {
                            const ratingValue = i + 1;
                            return (
                              <label key={i}>
                                <FontAwesomeIcon
                                  icon={faStar}
                                  className={`cursor-pointer ${
                                    ratingValue <= review.rating
                                      ? "text-blue-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              </label>
                            );
                          })}
                        </div>
                        {review.createdAt.slice(0, 10)}
                      </span>
                    </div>
                    <div className=" ml-auto mb-auto flex flex-col cursor-pointer font-semibold">
                      <span
                        className="ml-auto"
                        onClick={() => {
                          handleShowReviewMenu(review._id);
                        }}
                      >
                        ...
                      </span>
                      {reviewMenu.show && reviewMenu.id === review._id && (
                        <ul className="border-1 text-sm border-gray-300 border-t-0 w-20 ">
                          {review.userId._id === currentUser._id && (
                            <li
                              className="py-1 hover:bg-blue-500 hover:text-white px-2"
                              onClick={() => {
                                navigate(
                                  `/business/${business._id}/update-review/${review._id}`
                                );
                              }}
                            >
                              edite
                            </li>
                          )}
                          {review.userId._id === currentUser._id && (
                            <li
                              className="py-1 hover:bg-blue-500 hover:text-white px-2"
                              onClick={() => {
                                handleDeleteReview(review._id);
                              }}
                            >
                              delete
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>

                  <p className=" text-sm mt-5 text-gray-500">
                    {review.comment}
                  </p>
                  <ul className="flex gap-5">
                    {review.images.map((image, i) => {
                      return (
                        <li key={i}>
                          <img
                            src={image}
                            alt="review pic"
                            className=" mt-5 rounded-md max-w-80 w-full h-full"
                          />
                        </li>
                      );
                    })}
                  </ul>
                  <ReviewItem review={review} token={token} />
                  {review.ownerReply && (
                    <div className="pl-4">
                      <div className="flex items-center gap-1">
                        <img
                          src={currentUser.avatar}
                          className="w-10 rounded-full h-10"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold m-0 text-sm">
                            {review.userId.name}
                          </span>
                          <span className="text-[12px] m-0 text-gray-500">
                            business owner
                          </span>
                        </div>
                      </div>
                      <span className="text-[12px] text-gray-500">
                        {new Date(review.ownerReply.repliedAt).toLocaleString()}
                      </span>
                      <p className="text-sm font-semibold">
                        {review.ownerReply.text}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {showCount < reviews.length && (
            <div className="flex justify-center mt-6">
              <button
                className="px-6 mt-4 py-2 mb-10 bg-blue-500 text-white rounded hover:bg-blue-500/90"
                onClick={() => setShowCount((prev) => prev + 3)}
              >
                Show More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
