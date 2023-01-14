const jwt = require("jsonwebtoken")

exports.verifyJWT = (req, res, next) => {
  // Get the token from the request header
  const token = req.headers['x-access-token'];

  // If there is no token, return an error
  if (!token) {
    return res.status(401).send({
      auth: false,
      message: 'No token provided.'
    });
  }

  // Otherwise, verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        auth: false,
        message: 'Failed to authenticate token.'
      });
    }

    // If the token is valid, save the decoded token to the request object
    req.decoded = decoded;
    next();
  });
}
