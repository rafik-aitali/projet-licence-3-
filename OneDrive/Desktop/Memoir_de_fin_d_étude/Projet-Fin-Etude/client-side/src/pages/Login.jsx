import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../store/user/userSlice";
export default function Login() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  function validateForm() {
    const { email, password } = formData;

    if (!email || !password) {
      setErrorMessage("Both email and password are required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    setErrorMessage("");
    return true;
  }
  function handelChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      dispatch(loginStart());
      const res = await fetch(
        "http://localhost:8000/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!data.success) {
        dispatch(loginFailure(data));
        return;
      }
      dispatch(loginSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(loginFailure(error));
    }
  }
  return (
    <div className="w-full max-w-7xl mt-30 mx-auto flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold font-display text-kyBlack mb-6 text-center">
          Log in to AvisDZ
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              placeholder="your@email.com"
              onChange={handelChange}
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <div className="flex items-center justify-between">
              <label htmlFor="password">Password</label>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              onChange={handelChange}
            />
          </div>
          <p className="text-red-700">{errorMessage || error}</p>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 rounded-md hover:bg-blue-500/90"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
