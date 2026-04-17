import React, { useEffect, useState } from "react";
import ActivityCard from "./ActivityCard";
import { Link } from "react-router-dom";

export default function RecentActivities() {
  const [reviews, setReviews] = useState([]);
  const [list, setList] = useState([]);
  const [show, setShow] = useState(3);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/reviews?sortBy=createdAt`
        );
        const data = await res.json();
        if (!data.success) {
          console.error(data.message);
        }
        setReviews(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    setList(
      reviews
        .filter((activity) => activity.images && activity.images.length > 0)
        .map((activity) => ({
          hasImage: true,
          card: (
            <li key={activity._id}>
              <ActivityCard
                businessId={activity.businessId?._id}
                images={activity.images}
                profilePic={activity.userId?.avatar}
                username={activity.userId?.name} // <-- FIXED HERE
                comment={activity?.comment}
                rating={activity?.rating}
                businessName={activity.businessId?.name}
              />
            </li>
          ),
        }))
    );
  }, [reviews]);

  return (
    <section className="py-12 bg-gray-50 min-w-full">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-display ">
              Latest Reviews
            </h2>
            <p className="text-kyGray-dark">
              See what people are saying about local businesses
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.slice(0, show).map((listItem) => listItem.card)}
        </ul>
        {show < list.length && (
          <div className="flex justify-center mt-6">
            <button
              className="px-6 mt-10 py-2 bg-orange-500 text-white rounded hover:bg-orange-500/90"
              onClick={() => setShow((prev) => prev + 3)}
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
