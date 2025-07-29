import express from 'express';
import * as userService from '../services/userService.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
router.use(express.json());

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token provided' });
  try {
    const payload = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

router.post('/signup', async (req, res) => {
  const { email, password, ...details } = req.body;
  try {
    const user = await userService.registerUser(email, password, details);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await userService.loginUser(email, password);
    res.status(200).json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

router.get('/session', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  try {
    const user = await userService.verifyToken(authHeader.split(' ')[1]);
    res.status(200).json(user);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

router.get('/users', requireAdmin, async (_req, res) => {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/users/:id/role', requireAdmin, async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  try {
    const payload = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const updated = await userService.updateRole(req.params.id, req.body.role);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/users/:id/games', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token provided' });
  try {
    const payload = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    if (payload.role !== 'admin' && String(payload.id) !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const list = await userService.listUserGames(req.params.id);
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Game membership endpoints ───────────────────────────────
router.post('/games/:id/users', requireAdmin, async (req, res) => {
  try {
    const assignment = await userService.assignUserToGame(
      req.body.user_id,
      req.params.id,
      req.body.role
    );
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/games/:id/users', requireAdmin, async (req, res) => {
  try {
    const list = await userService.listGameUsers(req.params.id);
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/games/:id/users/:userId', requireAdmin, async (req, res) => {
  try {
    const updated = await userService.updateAssignment(
      req.params.userId,
      req.params.id,
      req.body.role
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export { router as usersRouter };
export default router;
