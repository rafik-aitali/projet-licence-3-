const Business = require("../models/Business");
const Review = require("../models/Review");
const cloudinary = require("../config/cloudinary");
const getBusinesses = async (req, res, next) => {
  try {
    const {
      name,
      category,
      subcategory,
      location,
      sortBy,
      page = 1,
      limit = 6,
    } = req.query;

    const filter = { isVerified: true };

    if (name && name !== "undefined") {
      filter.name = { $regex: name, $options: "i" };
    }

    if (category && category !== "undefined") {
      filter.category = { $regex: category, $options: "i" };
    }

    if (subcategory && subcategory !== "undefined") {
      filter.subcategory = { $regex: subcategory, $options: "i" };
    }

    if (location && location !== "undefined") {
      const locationRegex = { $regex: location, $options: "i" };
      filter.$or = [
        { "location.state": locationRegex },
        { "location.address": locationRegex },
      ];
    }

    const order = "desc";
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    }

    const pageNumber = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, parseInt(limit));
    const skip = (pageNumber - 1) * pageSize;

    const businesses = await Business.find(filter)
      .populate("owner_id", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Business.countDocuments(filter);
    const totalPages = Math.ceil(total / pageSize);

    return res.status(200).json({
      success: true,
      message: businesses.length
        ? "Businesses retrieved successfully"
        : "No businesses found",
      businesses,
      pagination: {
        total,
        totalPages,
        currentPage: pageNumber,
        pageSize,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getBusinessById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const business = await Business.findById(id).populate(
      "owner_id",
      "name email"
    );

    if (business) {
      return res.status(200).json({
        success: true,
        message: "Business found",
        business,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No business found",
      });
    }
  } catch (error) {
    next(error);
  }
};

const createBusiness = async (req, res, next) => {
  const {
    name,
    category,
    subcategory,
    description,
    address,
    state,
    lat,
    lng,
    phone,
    website,
    email,
    tags,
  } = req.body;

  try {
    const images = req.files?.images
      ? req.files.images.map((file) => file.path)
      : [];

    const owner_id = req.user.userId;
    let avatar = null;
    if (req.files.avatar) {
      avatar = req.files.avatar[0].path;
    } else {
      avatar =
        "https://e7.pngegg.com/pngimages/975/385/png-clipart-partnership-business-logo-marketing-business-service-people.png";
    }

    const business = await Business.create({
      name,
      category,
      subcategory,
      description,
      location: {
        address,
        state,
        coordinates: lat && lng ? [Number(lat), Number(lng)] : [],
      },
      contact: {
        phone,
        website,
        email,
      },
      images,
      avatar,
      tags: tags ? tags.split(",") : [],
      owner_id,
    });

    if (business) {
      return res.status(201).json({
        success: true,
        message: "Business created successfully",
        data: business,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to create business",
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateBusiness = async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    category,
    subcategory,
    description,
    address,
    city,
    state,
    country,
    lat,
    lng,
    phone,
    website,
    email,
    tags,
  } = req.body;

  try {
    let oldImages = [];
    if (req.body.oldImages) {
      try {
        oldImages = JSON.parse(req.body.oldImages);
      } catch (error) {
        oldImages = [];
      }
    }

    const newImages = req.files.images
      ? req.files.images.map((file) => file.path)
      : [];
    const updatedImages = [...oldImages, ...newImages];

    let avatar = null;
    if (req.files.avatar) {
      avatar = req.files.avatar[0].path;
    } else {
      const business = await Business.findById(id);
      avatar = business.avatar;
    }

    const business = await Business.findByIdAndUpdate(
      id,
      {
        name,
        category,
        subcategory,
        description,
        location: {
          address,
          city,
          state,
          country,
          coordinates: lat && lng ? [Number(lat), Number(lng)] : [],
        },
        contact: {
          phone,
          website,
          email,
        },
        images: updatedImages,
        avatar,
        tags: tags ? tags.split(",") : [],
      },
      { new: true, runValidators: true }
    );

    if (business) {
      return res.status(200).json({
        success: true,
        message: "Business updated successfully",
        data: business,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Business not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

const deleteBusiness = async (req, res, next) => {
  const { id } = req.params;
  try {
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    const deleteImages = async (imageUrl) => {
      if (typeof imageUrl !== "string") {
        console.error("Invalid image URL:", imageUrl);
        return;
      }
      const parts = imageUrl.split("/");
      const publicId = parts.slice(-2).join("/").split(".")[0];
      return await cloudinary.uploader.destroy(publicId);
    };

    if (
      business.avatar &&
      business.avatar !==
        "https://pngimg.com/uploads/letter_b/letter_b_PNG43.png"
    ) {
      await deleteImages(business.avatar);
    }

    if (business.images && business.images.length > 0) {
      await Promise.all(business.images.map((image) => deleteImages(image)));
    }

    const reviews = await Review.find({ businessId: business._id });
    for (const review of reviews) {
      if (review.images && review.images.length > 0) {
        await Promise.all(review.images.map((image) => deleteImages(image)));
      }
    }

    await Review.deleteMany({ businessId: business._id });

    const deletedBusiness = await Business.findByIdAndDelete(id);
    if (deletedBusiness) {
      return res.status(200).json({
        success: true,
        message: "Business and its reviews deleted successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to delete business",
      });
    }
  } catch (error) {
    console.error("Error deleting business:", error);
    next(error);
  }
};
const getUnverifiedBusinesses = async (req, res, next) => {
  try {
    const { page = 0, limit = 0 } = req.query;

    const filter = { verified: false };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const unverifiedBusinesses = await Business.find(filter)
      .populate("owner_id", "name email")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Business.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message: unverifiedBusinesses.length
        ? "Unverified businesses retrieved successfully"
        : "No unverified businesses found",
      businesses: unverifiedBusinesses,
      pagination: {
        total,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
const verifyBusiness = async (req, res, next) => {
  const { id } = req.params;
  try {
    const business = await Business.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true, runValidators: true }
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    if (business.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Business is already verified",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Business verified successfully",
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getUnverifiedBusinesses,
  verifyBusiness,
};
