import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function UpdateReview() {
  const { token } = useSelector((state) => state.user);
  const params = useParams();
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [rating, setRating] = useState();
  const [hover, setHover] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    const reviewId = params.reviewId;

    async function fetchReview() {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/reviews/${reviewId}`
        );
        const data = await res.json();
        if (data.success) {
          setFormData(data.review);
          setRating(data.review.rating);
        } else {
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchReview();
  }, [params.reviewId]);
  function handleChange(e) {
    if (e.target.type === "file") {
      const imagesArray = Array.from(e.target.files);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imagesArray],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
      }));
    }
  }

  function removeImage(image) {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== image),
    }));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!validateReviewForm()) {
      return;
    }
    const businessId = params.businessId;
    const reviewId = params.reviewId;
    const formDataToSend = new FormData();

    const oldImages = formData.images.filter((img) => typeof img === "string");
    const newImages = formData.images.filter((img) => typeof img !== "string");

    formDataToSend.append("businessId", businessId);
    formDataToSend.append("rating", rating);
    formDataToSend.append("comment", formData.comment);
    formDataToSend.append("oldImages", JSON.stringify(oldImages));
    newImages.forEach((image) => {
      formDataToSend.append("images", image);
    });
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8000/api/v1/reviews/${reviewId}`,
        {
          method: "PUT",
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
      navigate(`/business/${businessId}`);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  return (
    <div className="bg-white mt-40 rounded-md p-5">
      <Link
        to="/profile"
        className="flex items-center text-gray-500 mb-4 hover:text-blue-500 transition-colors"
      >
        &lt; Back to Profile
      </Link>
      <h1 className="text-2xl md:text-3xl mb-5 font-bold font-display text-kyBlack">
        Edit Your Review
      </h1>
      <form
        className="bg-white flex flex-col rounded-lg shadow-md p-6"
        onSubmit={handleUpdate}
      >
        <div className="flex items-start mb-6">
          <img
            src={formData.businessId?.avatar}
            alt={formData.businessId?.name}
            className="w-16 h-16 object-cover rounded-lg mr-4"
          />
          <div>
            <Link
              to={`/business/${formData.businessId?._id}`}
              className="text-lg font-semibold font-display text-kyBlack hover:text-kyblue transition-colors"
            >
              {formData.businessId?.name}
            </Link>
            <p className="text-kyGray-dark">
              {formData.businessId?.location?.address}
            </p>
          </div>
        </div>

        <h2 className="text-lg mb-2">Your Rating</h2>
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
                  onClick={() => {
                    setRating(ratingValue);
                  }}
                />
                <FontAwesomeIcon
                  icon={faStar}
                  className={`cursor-pointer text-2xl ${
                    ratingValue <= (hover || rating)
                      ? "text-blue-500"
                      : "text-gray-300"
                  }`}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(rating)}
                />
              </label>
            );
          })}
        </div>
        <label className="text-lg mb-2 mt-4 ">Your Review</label>
        <textarea
          name="comment"
          id="comment"
          value={formData.comment}
          placeholder="write here"
          onChange={handleChange}
          className=" rounded-md h-40 p-2 border-1 border-gray-200 "
        ></textarea>
        <label className="text-lg mb-2 mt-4 ">Your photos</label>
        <div className="flex flex-col">
          <p className="text-sm">
            {formData?.images?.length ? "Click an image to delete it" : ""}
          </p>
          <input
            className="hidden"
            ref={fileRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
          />
          <ul className="flex gap-3">
            {formData?.images?.map((image, index) => {
              return (
                <li key={index}>
                  <img
                    src={
                      typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                    }
                    alt="image"
                    className="w-40 cursor-pointer hover:opacity-50 rounded-md"
                    onClick={() => {
                      removeImage(image);
                    }}
                  />
                </li>
              );
            })}
          </ul>
          <span
            className="cursor-pointer  bg-blue-500 px-3 py-2 text-white text-sm rounded-md mt-3 mr-auto"
            onClick={() => fileRef.current.click()}
          >
            Add pictures
          </span>
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
        <div className="mt-8">
          <button
            type="submit"
            className="bg-blue-500 text-sm px-3 py-2 mr-auto text-black rounded-md"
          >
            {loading ? "Updating..." : "Update Review"}
          </button>
          <button
            onClick={() => {
              navigate(`/business/${formData.businessId._id}`);
            }}
            className="text-sm px-3 py-2 ml-3 border-1  border-gray-300 mr-auto rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
