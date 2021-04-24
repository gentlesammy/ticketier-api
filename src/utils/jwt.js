const jwt = require("jsonwebtoken");
const {
  jwtRefreshTokenSecretKey,
  jwtAccessTokenSecretKey,
} = require("../config/keys");

const { setJWT, getJWT } = require("./redis");

//create access token
const createAccessToken = async ({ email, id }) => {
  const accessToken = await jwt.sign({ email, id }, jwtAccessTokenSecretKey, {
    expiresIn: "15m",
  });
  await setJWT(accessToken, JSON.stringify(id));
  return accessToken;
};

//create refresh token
const createRefreshToken = async (email, id) => {
  const refreshToken = await jwt.sign({ email, id }, jwtRefreshTokenSecretKey, {
    expiresIn: "30d",
  });
  return refreshToken;
};

module.exports = {
  createAccessToken,
  createRefreshToken,
};
