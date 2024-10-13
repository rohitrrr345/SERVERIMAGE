// Middleware to check if the user is authenticated
export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
      req.userId = req.session.user._id; 
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized: Please log in' });
    }
  };
  