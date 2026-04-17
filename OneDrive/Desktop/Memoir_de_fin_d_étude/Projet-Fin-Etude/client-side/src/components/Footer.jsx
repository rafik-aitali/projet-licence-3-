import { Link } from "react-router-dom";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import github from "../assets/github.svg";

const Footer = () => {
  return (
    <footer className="bg-gray-800 min-w-full text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-blue-500 font-display">
                 <span className="text-white">AvisDZ</span>
              </span>
            </Link>
            <p className="text-gray-100 mb-4">
              Discover the best local businesses in Algeria with
              community-driven reviews and recommendations.
            </p>
            <div>
              <a
                href="https://github.com/rafik-aitali/Projet-Fin-Etude"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img src={github} alt="github" className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/businesses"
                  className="text-gray-100 hover:text-blue-500 transition-colors"
                >
                  Popular Businesses
                </Link>
              </li>
              <li>
                <Link
                  to="/businesses"
                  className="text-gray-100 hover:text-blue-500 transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/businesses"
                  className="text-gray-100 hover:text-blue-500 transition-colors"
                >
                  Cities
                </Link>
              </li>
              <li>
                <div className="text-gray-100 hover:text-blue-500 transition-colors">
                  Write a Review
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">For Business</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/profile/create-business"
                  className="text-gray-100 hover:text-blue-500 transition-colors"
                >
                  Claim Your Business
                </Link>
              </li>
              <li>
                <Link
                  to="/create-business"
                  className="text-gray-100 hover:text-blue-500 transition-colors"
                >
                  Advertise on AvisDZ
                </Link>
              </li>
              <li>
                <div className="text-gray-100 hover:text-blue-500 transition-colors">
                  Success Stories
                </div>
              </li>
              <li>
                <div className="text-gray-100 hover:text-blue-500 transition-colors">
                  Business Resources
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <div className="text-gray-100 hover:text-blue-500 transition-colors">
                  About AvisDZ
                </div>
              </li>
              <li>
                <div className="text-gray-100 hover:text-blue-500 transition-colors">
                  Careers
                </div>
              </li>
              <li>
                <div className="text-gray-100 hover:text-blue-500 transition-colors">
                  Contact Us
                </div>
              </li>
              <li>
                <div className="text-gray-100 hover:text-blue-500 transition-colors">
                  Terms of Service
                </div>
              </li>
              <li>
                <div className="text-gray-100 hover:text-blue-500 transition-colors">
                  Privacy Policy
                </div>
              </li>
              <li>
                <Link
                  to="/profile/delete-user"
                  className="text-gray-100 hover:text-blue-500 transition-colors"
                >
                  Delete Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-100 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} AvisDZ. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="text-sm text-gray-100 hover:text-blue-500 transition-colors">
              English
            </button>
            <button className="text-sm text-gray-100 hover:text-blue-500 transition-colors">
              Français
            </button>
            <button className="text-sm text-gray-100 hover:text-blue-500 transition-colors">
              العربية
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
