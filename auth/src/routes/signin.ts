import express, { Request, Response } from 'express';
import { body } from 'express-validator';
// import { validateRequest } from '../middleware/validate-request';
import { User } from '../models/user';
// import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@sftickets0110/common';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password must be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    // if user email already exists
    if (!existingUser) {
      throw new BadRequestError('invalid credentials');
    }
    // if password is corrent
    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError('invalid credentials');
    }

    // generate a jwt token and put it into req.session object
    const userJwtToken = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET!
    );

    req.session = {
      jwt: userJwtToken,
    };
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
