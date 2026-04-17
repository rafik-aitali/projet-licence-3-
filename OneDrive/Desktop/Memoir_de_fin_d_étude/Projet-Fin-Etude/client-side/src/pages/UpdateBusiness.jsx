import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function UpdateBusiness() {
  const { token } = useSelector((state) => state.user);
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const avatar = useRef(null);
  const [categories, setCategories] = useState();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    country: "",
    state: "",
    city: "",
    lat: "",
    lng: "",
    address: "",
    description: "",
    phone: "",
    website: "",
    email: "",
    tags: "",
    images: [],
    avatar: null,
  });
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

  useEffect(() => {
    const id = params.businessId;
    const fetchBusiness = async () => {
      try {
        const res = await fetch(`/api/v1/businesses/${id}`);
        const data = await res.json();

        if (data.success) {
          const { contact, location, ...rest } = data.business;
          const { coordinates, ...restOfLoc } = data.business.location;
          console.log(data.business);

          setFormData({
            ...rest,
            lat: coordinates[0],
            lng: coordinates[1],
            ...restOfLoc,
            ...contact,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBusiness();
  }, [params.businessId]);

  function handleChange(e) {
    if (e.target.type === "file") {
      if (e.target.id === "avatar") {
        setFormData((prev) => ({
          ...prev,
          avatar: e.target.files[0],
        }));
      } else {
        const imagesArray = Array.from(e.target.files);

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...imagesArray],
        }));
      }
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
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  async function handleUpdate(e) {
    e.preventDefault();
    if (validateStepOne() && validateStepTwo() && validateStepThree()) {
      const oldImages = formData.images.filter(
        (img) => typeof img === "string"
      );
      const newImages = formData.images.filter(
        (img) => typeof img !== "string"
      );

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

      formDataToSend.append("oldImages", JSON.stringify(oldImages));
      newImages.forEach((file) => {
        formDataToSend.append("images", file);
      });
      if (formData.avatar) {
        formDataToSend.append("avatar", formData.avatar);
      }

      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8000/api/v1/businesses/${params.businessId}`,
          {
            method: "PUT",
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
          navigate(`/business/${params.businessId}`);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
        setErrorMessage(error);
      }
    } else {
      console.log("missing something");
    }
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
    fetch("http://localhost:8000/api/v1/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);
  function validateStepOne() {
    const { name, category, subcategory, description } = formData;
    if (!name || !category || !subcategory || !description) {
      setErrorMessage("Basic informations are missing");
      return false;
    }
    setErrorMessage("");
    return true;
  }

  function validateStepTwo() {
    const { country, state, city, address, lat, lng } = formData;
    if (!state || !address) {
      setErrorMessage("Location informations are missing");
      return false;
    }
    setErrorMessage("");
    return true;
  }

  function validateStepThree() {
    const { email, phone } = formData;
    if (!email || !phone) {
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
        Update {formData.name}
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleUpdate} className=" flex flex-col space-y-6">
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
                  placeholder="Select-category"
                  onChange={handleChange}
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
                  placeholder="Select-subcategory"
                  onChange={handleChange}
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
                  placeholder="Select-state"
                  onChange={handleChange}
                >
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
                  Coordinates:
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
            <h2 className="text-white font-semibold">Business logo</h2>
            <div className="bg-white rounded-full w-40 h-40 mx-auto overflow-hidden">
              <img
                src={
                  formData.avatar
                    ? typeof formData.avatar[0] === "string"
                      ? formData.avatar[0]
                      : formData.avatar instanceof File
                      ? URL.createObjectURL(formData.avatar)
                      : "https://www.shutterstock.com/image-vector/upload-flat-icon-single-high-260nw-739633516."
                    : "https://www.shutterstock.com/image-vector/upload-flat-icon-single-high-260nw-739633516."
                }
                alt="business logo"
                className="relative cursor-pointer"
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
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt={`Business Photo ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className="absolute top-1 right-1 bg-kyBlack bg-opacity-70 text-white rounded-full p-1 text-xs"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-300 pt-6 flex items-center justify-end">
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
              {loading ? "Updating..." : "Updating Business"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
