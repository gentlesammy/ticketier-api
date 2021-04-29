const jwt = require("jsonwebtoken");
const {
  jwtRefreshTokenSecretKey,
  jwtAccessTokenSecretKey,
} = require("../config/keys");
const { setJWT, getJWT } = require("./redis");
const User = require("../models/userModel");

//create access token
const createAccessToken = async ({ email, id }) => {
  const accessToken = await jwt.sign({ email, id }, jwtAccessTokenSecretKey, {
    expiresIn: "60m",
  });
  await setJWT(accessToken, JSON.stringify(id));
  return accessToken;
};

//create refresh token
const createRefreshToken = async (email, id) => {
  const refreshToken = await jwt.sign({ email, id }, jwtRefreshTokenSecretKey, {
    expiresIn: "30d",
  });
  //TODO: NOTE: id entering as email.id
  //   console.log("id from refreshtoken create func", email.id);
  await storeUserRefreshToken(email.id, refreshToken);
  return refreshToken;
};

const storeUserRefreshToken = async (id, token) => {
  let _id = id;
  try {
    const data = await User.findOneAndUpdate(
      { _id },
      {
        $set: {
          "refreshJWT.token": token,
          "refreshJWT.addedAt": Date.now(),
        },
      },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};

//verify access token
const verifyAccessToken = async (accessToken) => {
  try {
    const decoded = await jwt.verify(
      accessToken,
      jwtAccessTokenSecretKey,
      function (err, decoded) {
        return decoded;
      }
    );
    return decoded;
  } catch (error) {
    console.log("error verifying token", error);
  }
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
};
