import * as userService from '../services/userService.js';

export async function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = await userService.verifyToken(auth.split(' ')[1]);
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

export function requireRole(role) {
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (req.user.role !== role) {
      return res.status(403).json({ error: `${role} access required` });
    }
    next();
  };
}

export function requireSelfOrRole(role) {
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (req.user.role === role || String(req.user.id) === String(req.params.id)) {
      return next();
    }
    res.status(403).json({ error: `${role} access required` });
  };
}