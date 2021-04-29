//for management of token, generating new token especially
const { verifyAccessToken, createAccessToken } = require("../utils/jwt");
const { getuserByEmail } = require("./userController");
const {jwtRefreshTokenSecretKey} = require("../config/keys");
const { deleteJWT } = require("../utils/redis");
//get new access token if refresh token has not expired.
const getNewToken = async (req, res) => {
  const { authorization } = req.headers;
  //TODO: Steps
  //make sure token is valid
  if (!authorization) {
    return res.status(403).json({ status: "error", message: "forbidden" });
  }
  //
  const decoded = await verifyAccessToken(authorization);
  if (decoded == undefined) {
    deleteJWT(authorization);
    return res.status(403).json({ status: "error", message: "forbidden now" });
  }
  console.log("shey decoded wa", decoded)
  if (decoded.email) {
    //check if user exist in database getuserByEmail
    const user = await getuserByEmail(decoded.email);
      if (user._id) {
      //check if jwt exist in the database
      let tokenExp = user.refreshJWT.addedAt;
      const dbToken = user.refreshJWT.token;
      tokenExp = tokenExp.setDate(tokenExp.getDate() + 30);
      const today = new Date();
      //check if token has not expired
      if(dbToken !== authorization && tokenExp < today){
        //token expired
        return res.status(403).json({ status: "error", message: "forbidden ooo" });
      }


      console.log("decoded for creating new access Token", {email:decoded.email, user: JSON.stringify(user.id)});
      const payload = {email:decoded.email, id:JSON.stringify(user.id)} 
      const accessToken =await createAccessToken(payload);
      return res.status(200).json({status: "success", accessToken});
    }
  }

  return res.status(403).json({ status: "error", message: "forbidden last last" });
};

module.exports = {
  getNewToken,
};
