const { sendError } = require("./SendResponses");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const isAuthUser = async (req, res, next) => {
  try {
    //Get Token From Cookies
    if (req.cookies.token) {
      //Verify Token
      const { userId } = jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET_KEY
      );
      //Get User From Token
      req.user = await userModel.findById(userId).select("-password");
      next();
    } else {
      sendError(res, 400, null);
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

module.exports = isAuthUser;
