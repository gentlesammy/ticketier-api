const redis = require("redis");
const { redisConUrl } = require("../config/keys");
const client = redis.createClient(redisConUrl);

const setJWT = async (key, value) => {
  try {
    await client.set(key, value, (error, response) => {
      if (error) {
        console.error(error);
      }
      return response;
    });
  } catch (error) {
    console.log(error);
  }
};

const getJWT = async (key) => {
  try {
    await client.set(key, (error, response) => {
      if (error) {
        console.error(error);
      }
      return response;
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  setJWT,
  getJWT,
};
