const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "images";
    if (file.fieldname === "avatar") {
      folder = "avatars";
    }
    return {
      folder: folder,
      allowed_formats: ["jpg", "png", "jpeg"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});

const upload = multer({ storage }).fields([
  { name: "images", maxCount: 20 },
  { name: "avatar", maxCount: 1 },
]);

module.exports = upload;
