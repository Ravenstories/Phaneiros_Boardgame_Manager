import express from 'express';
import * as userService from '../services/userService.js';
import { authenticate, requireRole, requireSelfOrRole } from '../middleware/auth.js';

const router = express.Router();
router.use(express.json());

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

router.get('/session', authenticate, async (req, res) => {
  res.status(200).json(req.user);
});

router.get('/users', authenticate, requireRole('Admin'), async (_req, res) => {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/users/:id/role', authenticate, requireRole('Admin'), async (req, res) => {
  try {
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


router.get('/users/:id/games', authenticate, requireSelfOrRole('Admin'), async (req, res) => {
  try {
    const list = await userService.listUserGames(req.params.id);
    res.json(list);
  } catch (err) {
    const status = err.status || 400;
    res.status(status).json({ error: err.message, code: err.code });
  }
});

// ── Game membership endpoints ───────────────────────────────
router.post('/games/:id/users', authenticate, requireRole('Admin'), async (req, res) => {
  try {
    const assignment = await userService.assignUserToGame(
      req.body.user_id,
      req.params.id,
      req.body.role
    );
    res.status(201).json(assignment);
  } catch (err) {
    const status = err.status || 400;
    res.status(status).json({ error: err.message, code: err.code });
  }
});

router.get('/games/:id/users', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      const assignment = await userService.getGameAssignment(req.user.id, req.params.id);
      if (!assignment || assignment.role !== 'Game Master') {
        return res.status(403).json({ error: 'Admin or GM access required' });
      }
    }
    const list = await userService.listGameUsers(req.params.id);
    res.json(list);
  } catch (err) {
    const status = err.status || 400;
    res.status(status).json({ error: err.message, code: err.code });
  }
});

router.put('/games/:id/users/:userId', authenticate, requireRole('Admin'), async (req, res) => {
  try {
    const updated = await userService.updateAssignment(
      req.params.userId,
      req.params.id,
      req.body.role
    );
    res.json(updated);
  } catch (err) {
    const status = err.status || 400;
    res.status(status).json({ error: err.message, code: err.code });
  }
});

export { router as usersRouter };
export default router;