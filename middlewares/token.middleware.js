import jwt from 'jsonwebtoken';

//middleware to protect routes and add payloads
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'not Authenticated!' });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) {
      console.error('JWT verification error:', err); // Log error
      return res.status(401).json({ message: 'token not valid!' });
    }

    req.userId = payload.id;
    req.isAdmin = payload.isAdmin;
    next();
  });
};
