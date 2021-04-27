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
  return new Promise((resolve, reject) => {
    try {
      client.get(key, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  setJWT,
  getJWT,
};
