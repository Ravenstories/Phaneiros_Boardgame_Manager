import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(auth.split(' ')[1], config.jwtSecret);
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