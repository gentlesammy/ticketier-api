const { verifyAccessToken } = require("../utils/jwt");
const { getJWT } = require("../utils/redis");

const userAuthorization = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    //check if jwt exist
    const decoded = await verifyAccessToken(authorization);
    if (decoded == undefined) {
      return res
        .status(403)
        .json({ status: "error", message: "forbidden now" });
    }
    if (decoded.email) {
      const userId = await getJWT(authorization);
      if (!userId) {
        return res.status(403).json({ status: "error", message: "forbidden" });
      }
      //extract user id => in user controller
      req.userId = userId;
      return next();
    }

    //TODO:
    //extract user profile based on user_id => in user controller

    //authorization not valid
    res.status(403).json({ status: "error", message: "forbidden" });
  } catch (error) {
    res.status(403).json({ status: "error", message: error.message });
  }
};

module.exports = {
  userAuthorization,
};
