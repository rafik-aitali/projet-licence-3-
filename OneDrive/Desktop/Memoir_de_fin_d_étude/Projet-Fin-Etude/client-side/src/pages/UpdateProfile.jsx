import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
} from "../store/user/userSlice";
export default function UpdateProfile() {
  const { currentUser, loading, error, token } = useSelector(
    (state) => state.user
  );
  const fileRef = useRef();
  const [file, setFile] = useState(undefined);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    avatar: currentUser.avatar,
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  function handleChangeAvatar(e) {
    setFile(e.target.files[0]);
    setFormData((prev) => {
      return {
        ...prev,
        avatar: e.target.files[0],
      };
    });
  }

  const handleUpload = async () => {
    if (!file) return;
    console.log("uploading");
    const avatarFormData = new FormData();
    avatarFormData.append("avatar", file);

    try {
      dispatch(updateUserStart());
      const res = await fetch("/api/v1/user/upload-avatar", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: avatarFormData,
      });

      const data = await res.json();
      if (data.success) {
        dispatch(updateUserSuccess(data));
      } else {
        dispatch(updateUserFailure(data));
        console.log("Error updating avatar:", data.message);
        return;
      }
    } catch (error) {
      console.error("Upload failed:", error);
      dispatch(updateUserFailure(error));
    }
  };

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      await handleUpload();
      const res = await fetch("/api/v1/user/profile", {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      navigate("/profile");
    } catch (error) {
      console.log(error);

      dispatch(updateUserFailure(error));
    }
  }

  return (
    <div className="max-w-7xl w-full mt-40 mx-auto px-4 py-8">
      <Link
        to="/profile"
        className="flex items-center text-gray-500 mb-4 hover:text-blue-500 transition-colors"
      >
        &lt; Back to Profile
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold font-display text-kyBlack mb-6">
        Edit Your Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold font-display text-kyBlack mb-4">
              Profile Information
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="flex flex-col ">
                <label className="text-sm " htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col ">
                <label className="text-sm" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-blue-500 px-3 py-2 rounded-md text-sm hover:bg-blue-500/90"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
              <p>{error || " "}</p>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold font-display text-kyBlack mb-4">
              Change Password
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="flex flex-col ">
                <label className="text-sm" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-blue-500 px-3 py-2 rounded-md text-sm hover:bg-blue-500/90"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold font-display  mb-4">
              Profile Picture
            </h2>
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 relative mb-6">
                <img
                  src={
                    typeof formData.avatar === "string"
                      ? formData.avatar
                      : formData.avatar
                      ? URL.createObjectURL(formData.avatar)
                      : ""
                  }
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full border-4 border-gray-300"
                />
              </div>
              <div className="w-full">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <div className="mb-4">
                    <p className="mt-2 text-sm text-gray-500">
                      Upload a new profile picture
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    onChange={handleChangeAvatar}
                    className="hidden"
                    id="avatar"
                  />
                  <label
                    onClick={() => fileRef.current.click()}
                    className="px-3 py-2 rounded-md bg-blue-500 text-white text-sm inline-block cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
                {file && (
                  <>
                    <div className="mt-2 text-center text-sm text-gray-500">
                      Selected file: {file.name}
                    </div>
                    <div className="mt-4 flex justify-center">
                      <button
                        type="button"
                        className="bg-blue-500 px-3 py-2 rounded-md text-sm hover:bg-blue-500/90"
                        onClick={handleUpload}
                      >
                        Upload New Picture
                      </button>
                    </div>
                  </>
                )}
                <p className="mt-4 text-sm text-gray-500 text-center">
                  Recommended: Square image, at least 300x300 pixels
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold font-display text-kyBlack mb-4">
              Account Management
            </h2>
            <Link to="/profile/delete-user">
              <button
                type="button"
                className="w-full bg-red-500 rounded-md py-2 text-white"
              >
                Delete Account
              </button>
            </Link>
            <p className="mt-2 text-sm text-gray-500 text-center">
              This action is permanent and cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
