import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  console.log('Auth Check - Token present:', !!token);
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

  if (!token) {
    console.log('No token provided');
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized to access this route' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};
