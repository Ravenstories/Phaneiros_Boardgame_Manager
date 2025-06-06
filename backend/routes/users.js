import express from 'express';
import * as userService from '../services/userService.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.registerUser(email, password);
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

router.put('/:id', async (req, res) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;