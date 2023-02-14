const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { verify, sign } = jwt;

const checkAuth = (context) => {
  const authHeader = context.expressRequest.headers.authorization;
  if (authHeader) {
    // Bearer ....
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = verify(token, process.env.JWT_SECRET_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  throw new Error("Authorization header must be provided");
};

const generateToken = (user) => {
  return sign(
    {
      id: user.user_id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );
};

module.exports = { checkAuth, generateToken };
