import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
} from "../store/user/userSlice";
import Footer from "../components/Footer";

// Simple AlertTriangle SVG icon
function AlertTriangle(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01" />
    </svg>
  );
}

// Simple toast component
function Toast({ message, onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded shadow-lg z-50">
      {message}
    </div>
  );
}

// Simple Label, Input, Checkbox, Button components
const Label = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-700 mb-1"
  >
    {children}
  </label>
);
const Input = (props) => (
  <input
    {...props}
    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-2 focus:border-red-600 transition bg-white"
  />
);
const Checkbox = ({ id, checked, onCheckedChange }) => (
  <input
    id={id}
    type="checkbox"
    checked={checked}
    onChange={(e) => onCheckedChange(e.target.checked)}
    className="accent-red-600 w-4 h-4"
  />
);
const Button = ({ className = "", ...props }) => (
  <button
    {...props}
    className={"rounded px-4 py-2 font-semibold transition " + className}
  />
);

export default function DeleteUser() {
  const { currentUser, loading, error, token } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!confirmation) {
      setToast("You must check the confirmation checkbox to proceed.");
      return;
    }
    try {
      setIsLoading(true);
      dispatch(deleteUserStart());
      const res = await fetch(
        `http://localhost:8000/api/v1/user/${currentUser._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
        }
      );
      const data = await res.json();
      if (data.success) {
        dispatch(deleteUserSuccess());
        navigate("/login");
      } else {
        dispatch(deleteUserFailure(data));
      }
      setIsLoading(false);
    } catch (error) {
      dispatch(deleteUserFailure(error));
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <main className="flex-grow bg-white">
        <div className="container mx-auto flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-red-200">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold font-display text-kyBlack mb-2">
                  Delete Your Account
                </h1>
                <p className="text-kyGray-dark">
                  This action cannot be undone. All your data will be
                  permanently removed.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4 mb-6">
                <img
                  src={currentUser?.avatar}
                  className="w-24 h-24 rounded-full"
                  alt="profile-pic"
                />
                <h2 className="font-semibold text-xl">{currentUser?.name}</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Confirm your password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="confirmation"
                    checked={confirmation}
                    onCheckedChange={(checked) => {
                      setConfirmation(Boolean(checked));
                    }}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="confirmation"
                      className="text-sm font-medium leading-none text-red-500"
                    >
                      I understand this will permanently delete my account and
                      all associated data
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="text-center text-red-600 text-sm">
                    {error.message || error}
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-700 text-white"
                    disabled={isLoading || !confirmation}
                  >
                    {isLoading
                      ? "Deleting Account..."
                      : "Delete Account Permanently"}
                  </Button>
                </div>

                <div className="text-center mt-4">
                  <Button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
