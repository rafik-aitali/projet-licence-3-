import React from "react";
import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="py-16 min-w-full bg-gray-800">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12 bg-gray-800 text-white">
              <h3 className="text-2xl md:text-3xl font-bold font-display mb-4">
                Own a Business in Algeria?
              </h3>
              <p className="mb-6 text-gray-300">
                Claim your business listing today and connect with thousands of
                potential customers. Manage your profile, respond to reviews,
                and gain valuable insights.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-300">
                    Free business page setup and management
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-300">Respond to customer reviews</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-300">
                    Access to business analytics and insights
                  </p>
                </div>
              </div>
              <Link to="/profile/create-business">
                <button className="mt-8 bg-blue-500 px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-500/90 text-white">
                  Claim Your Business
                </button>
              </Link>
            </div>

            <div className="md:w-1/2 p-8 md:p-12 bg-white">
              <h3 className="text-2xl md:text-3xl font-bold font-display text-gray-800 mb-4">
                Discover & Share Your Experiences
              </h3>
              <p className="mb-6 text-gray-500">
                Join our community to discover the best local businesses and
                share your own experiences. Your reviews help others find great
                places and services.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-500">
                    Find trusted businesses with verified reviews
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-500">
                    Save favorite places for later
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full  bg-blue-500 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-500">
                    Earn badges as you contribute to the community
                  </p>
                </div>
              </div>
              <Link to="/register">
                <button className="mt-8 bg-gray-800 px-3 py-2 rounded-md text-sm hover:bg-gray-800/90 text-white">
                  Sign Up Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
