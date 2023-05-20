import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      const error = new Error("Unauthorized access!");
      error.statusCode = 401;
      throw error;
    }
    if (token.startsWith("Bearer")) {
      token = token.slice(7, token.length).trimStart();
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 401;
    }
    next(err);
  }
};
