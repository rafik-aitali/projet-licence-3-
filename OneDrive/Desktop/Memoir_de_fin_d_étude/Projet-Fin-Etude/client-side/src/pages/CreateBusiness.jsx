import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function CreateBusiness() {
  const { token } = useSelector((state) => state.user);
  const fileRef = useRef();
  const avatar = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    country: "",
    state: "",
    tags: "",
    city: "Algiers",
    lat: "",
    lng: "",
    address: "",
    description: "",
    phone: "",
    website: "",
    email: "",
    images: [],
    avatar: null,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const required = <span className="text-amber-700">*</span>;
  const states = [
    "Algiers",
    "Bouira",
    "Bejaia",
    "Tizi Ouzu",
    "Bordj Bouararij",
    "Oran",
    "Constantine",
    "Annaba",
    "Blida",
    "Batna",
    "Djelfa",
    "Sétif",
    "Sidi Bel Abbès",
    "Biskra",
  ];

  function handleChange(e) {
    if (e.target.type === "file") {
      if (e.target.id === "avatar") {
        setFormData((prev) => ({
          ...prev,
          avatar: e.target.files[0],
        }));
      } else {
        const imagesArray = Array.from(e.target.files);
        console.log("Images array:", imagesArray);

        setFormData((prevFormData) => ({
          ...prevFormData,
          images: imagesArray,
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.id]: e.target.value,
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (validateStepOne() && validateStepTwo() && validateStepThree()) {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("subcategory", formData.subcategory);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("lat", formData.lat);
      formDataToSend.append("lng", formData.lng);

      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("website", formData.website);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("description", formData.description);

      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      if (formData.avatar) {
        formDataToSend.append("avatar", formData.avatar);
      }

      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:8000/api/v1/businesses",
          {
            method: "POST",
            headers: {
              authorization: `Bearer ${token}`,
            },
            body: formDataToSend,
          }
        );

        const data = await res.json();
        console.log(data);
        if (data.success) {
          setLoading(false);
          navigate(`/business/${data.data._id}`);
        } else {
          setLoading(false);
          console.error("Failed to create business:", data.message);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error creating business:", error);
        setErrorMessage(error);
      }
    } else {
      console.log("missing something");
    }
  }

  function removeImage(image) {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== image),
    }));
  }
  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        const data = await res.json();
        setCountries(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCountries();
  }, []);
  useEffect(() => {
    console.log(categories);
  }, [categories]);
  useEffect(() => {
    fetch("http://localhost:8000/api/v1/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);
  function validateStepOne() {
    const { name, category, subcategory, description } = formData;
    if (!name || !category || !subcategory || !description) {
      console.log("in step one");

      setErrorMessage("Basic informations are missing");
      return false;
    }
    setErrorMessage("");
    return true;
  }

  function validateStepTwo() {
    const { state, address } = formData;
    if (!state || !address) {
      console.log("in two");
      setErrorMessage("Location informations are missing");
      return false;
    }
    setErrorMessage("");
    return true;
  }

  function validateStepThree() {
    const { email, phone } = formData;
    if (!email || !phone) {
      console.log("in three");
      setErrorMessage("Contact informations are missing");

      return false;
    }
    setErrorMessage("");
    return true;
  }

  return (
    <div className=" h-full max-w-7xl mx-auto mt-40 ">
      <Link
        to="/profile"
        className="flex items-center text-kyGray-dark mb-4 hover:text-blue-500 transition-colors"
      >
        &lt; Back to Profile
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold font-display text-kyBlack mb-6">
        Add Your Business
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className=" flex flex-col space-y-6">
          <div>
            <h2 className="text-xl font-semibold font-display text-kyBlack mb-4">
              Basic Information
            </h2>

            <div className="space-y-4 flex flex-col">
              <div className="flex flex-col">
                <label>Business Name*</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Business Category*</label>
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  className="p-4 rounded-md border cursor-pointer border-gray-300"
                  placeholder="Select-category"
                  onChange={handleChange}
                  required
                >
                  <option value="">Click here to select category</option>
                  {categories?.map((category, i) => {
                    return (
                      <option key={i} value={category.name}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex flex-col min-w-full">
                <select
                  name="subcategory"
                  id="subcategory"
                  value={formData.subcategory}
                  className="p-4 cursor-pointer rounded-md border border-gray-300"
                  placeholder="Select-subcategory"
                  onChange={handleChange}
                  required
                >
                  <option value="">Click here to select subcategory</option>
                  {categories?.map((category, i) => {
                    return (
                      category.name === formData.category &&
                      category.subcategories.map((subCat, i) => {
                        return (
                          <option key={i} value={subCat.name}>
                            {subCat.name}
                          </option>
                        );
                      })
                    );
                  })}
                </select>
              </div>

              <div className="flex flex-col">
                <label>Description*</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell potential customers about your business..."
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold font-display text-kyBlack mb-4">
              Location & Contact Information
            </h2>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label>Street Address*</label>
                <input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>City*</label>
                <select
                  name="state"
                  id="state"
                  value={formData.state}
                  className="p-4 border border-gray-300 rounded-md cursor-pointer"
                  placeholder="Select-state"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a state</option>
                  {states.map((state, i) => {
                    return (
                      <option key={i} value={state}>
                        {state}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex flex-col min-w-full">
                <label htmlFor="address" className="block mb-2 font-semibold">
                  Coordinates(optional)
                </label>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1">
                    <label htmlFor="lat" className="font-semibold">
                      Latitud:
                    </label>
                    <input
                      type="text"
                      id="lat"
                      value={formData.lat}
                      placeholder="ex:33.545"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <label htmlFor="lng" className="font-semibold">
                      Longtitud:
                    </label>

                    <input
                      type="text"
                      id="lng"
                      value={formData.lng}
                      placeholder="ex:40.001"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label>Phone Number*</label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Business Email*</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Website (Optional)</label>
                <input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className=" font-semibold text-xl mb-2">Business logo</h2>
            <div className="border-2 border-dashed rounded-md border-gray-300 ">
              <div className="bg-white  rounded-full w-40 h-40 mx-auto overflow-hidden">
                <img
                  src={
                    formData.avatar
                      ? URL.createObjectURL(formData.avatar)
                      : "https://www.shutterstock.com/image-vector/upload-flat-icon-single-high-260nw-739633516.jpg"
                  }
                  alt="business logo"
                  className=" relative cursor-pointer"
                  onClick={() => {
                    avatar.current.click();
                  }}
                />
              </div>
              <input
                type="file"
                name="avatar"
                id="avatar"
                ref={avatar}
                className="hidden"
                onChange={handleChange}
              />
            </div>
            <h2 className="text-xl font-semibold font-display text-kyBlack mb-4">
              Business Photos
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="mb-4">
                <p className="text-sm text-kyGray-dark">
                  Upload high-quality images of your business (Max 3 images for
                  now you can add more later)
                </p>
              </div>
              <input
                type="file"
                name="images"
                ref={fileRef}
                id="images"
                multiple
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />

              <label
                className="bg-blue-500 px-3 py-2 rounded-md text-white text-[16px] inline-block cursor-pointer"
                onClick={() => {
                  fileRef.current.click();
                }}
              >
                Choose Files
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Business Photo ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className="absolute top-1 right-1 bg-kyBlack bg-opacity-70 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t items-center border-gray-300 pt-6 flex justify-end">
            <p className="text-blue-500">{errorMessage}</p>
            <button
              type="button"
              variant="outline"
              className="mr-4 border-1 border-gray-300 rounded-md px-3 py-2"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 px-3 py-2 rounded-md hover:bg-blue-500/90"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Business"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
