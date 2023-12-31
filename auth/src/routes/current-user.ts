import express from 'express';
// import { currentUserMiddleware } from '../middleware/current-user';
// import { requireAuth } from '../middleware/require-auth';
import { currentUserMiddleware } from '@sftickets0110/common';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUserMiddleware,
  // requireAuth,
  (req, res) => {
    res.send({
      currentUser: req.currentUser ? req.currentUser : null,
    });
  }
);

export { router as currentUserRouter };
