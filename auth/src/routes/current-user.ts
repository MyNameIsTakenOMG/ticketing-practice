import express from 'express';
import jwt from 'jsonwebtoken';
import { currentUserMiddleware } from '../middleware/current-user';

const router = express.Router();

router.get('/api/users/currentuser', currentUserMiddleware, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
