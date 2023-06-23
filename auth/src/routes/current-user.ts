import express from 'express';
import { currentUserMiddleware } from '../middleware/current-user';
import { requireAuth } from '../middleware/require-auth';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUserMiddleware,
  requireAuth,
  (req, res) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
