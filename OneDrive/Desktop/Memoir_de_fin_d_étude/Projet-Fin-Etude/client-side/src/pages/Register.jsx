import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  function validateForm() {
    const { email, password, name } = formData;

    if (!email || !password || !name) {
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
  function handleChange(e) {
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
      setLoading(true);
      const res = await fetch(
        "http://localhost:8000/api/v1/auth/register",
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
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }
  return (
    <div className="max-w-7xl w-full mx-auto mt-30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold font-display text-black mb-6 text-center">
            Join AvisDZ
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 flex flex-col">
              <lable htmlFor="name">Full Name</lable>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <lable htmlFor="email">Email</lable>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <lable htmlFor="password">Password</lable>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>
            <p className="text-red-700">{errorMessage || error}</p>
            <button
              type="submit"
              className="w-full bg-blue-500 px-3 py-2 rounded-md hover:bg-blue-500/90"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
