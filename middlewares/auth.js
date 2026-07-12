const jwt = require('jsonwebtoken');
const jwtConfig = require('../configs//jwt');
const user = require('../models/users');

const isLogin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.json({
        result: false,
        message: "You need to login",
      });
    }

    const parts = authHeader.split(" ");
    
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.json({
        result: false,
        message: "Invalid token format",
      });
    }

    const token = parts[1];
    const decode = jwt.verify(token, jwtConfig.secret);
    
    let checkToken = await user.findByToken(token);

    if (checkToken.length == 0) { 
      throw new Error("Invalid token or expired");
    }
    req.user = decode;
    next();
  } catch (error) {
    return res.json({
      result: false,
      message: "Invalid token or expired",
    });
  }
};

module.exports = {
  isLogin
};

