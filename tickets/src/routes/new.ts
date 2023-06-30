import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/tickets', (req, res) => {
  res.sendStatus(200);
});

export { router as createTicketRouter };
