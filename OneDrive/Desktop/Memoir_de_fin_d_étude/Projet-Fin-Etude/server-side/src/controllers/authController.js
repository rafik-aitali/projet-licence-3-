const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bycrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    if (user) {
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bycrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
        })
        .status(200)
        .json({
          success: true,
          message: "User logged in successfully",
          data: user,
          token,
        });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(201).json({
      success: true,
      message: "loged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, logoutUser };
