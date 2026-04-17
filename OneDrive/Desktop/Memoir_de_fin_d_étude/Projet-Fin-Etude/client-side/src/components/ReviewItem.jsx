import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

export default function ReviewItem({ review, token }) {
  const [likes, setLikes] = useState(review.likes.length);
  const [dislikes, setDislikes] = useState(review.dislikes.length);
  const [show, setShow] = useState(false);
  const [replyText, setReplyText] = useState("");
  const handleLike = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/reviews/${review._id}/like`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setLikes(data.data.likes.length);
        setDislikes(data.data.dislikes.length);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/reviews/${review._id}/dislike`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setLikes(data.data.likes.length);
        setDislikes(data.data.dislikes.length);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/reviews/${review._id}/reply`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ replyText }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Reply added successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error replying to review:", error);
    }
  };
  return (
    <div>
      <div className="flex gap-2 mt-8">
        <button className="font-semibold p-2" onClick={handleLike}>
          {likes} <FontAwesomeIcon icon={faThumbsUp} />
        </button>
        <button className="font-semibold p-2" onClick={handleDislike}>
          {dislikes} <FontAwesomeIcon icon={faThumbsDown} />
        </button>
        <button
          className="font-semibold p-2"
          onClick={() => {
            setShow(!show);
          }}
        >
          Reply
        </button>
      </div>
      {show && (
        <form className="min-w-full flex flex-col" onSubmit={handleReply}>
          <textarea
            name="reply"
            id="reply"
            value={replyText}
            onChange={(e) => {
              setReplyText(e.target.value);
              console.log(replyText);
            }}
            placeholder="Only business owner can reply"
            className="w-full text-sm rounded-none"
          ></textarea>
          <button className="ml-auto font-semibold">✔️</button>
        </form>
      )}
    </div>
  );
}
