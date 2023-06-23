import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';
import { validateRequest } from '../middleware/validate-request';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // const errors = validationResult(req);

    // scenario 1 : Invalid inputs
    // if (!errors.isEmpty()) {
    // return res.status(400).send(errors.array());
    // throw new Error('Invalid email or password');
    // throw new RequestValidationError(errors.array());
    // }
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      // console.log('User already exists');
      // return res.send({})
      throw new BadRequestError('Email already exists');
    }
    const user = User.build({ email, password });
    await user.save();

    // generate a jwt token and put it into req.session object
    const userJwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!
    );

    req.session = {
      jwt: userJwtToken,
    };

    res.status(201).send(user);

    // console.log('Creating a user...');

    // scenario 2: failed to connect to the database
    // throw new Error('error connecting to database');
    // throw new DatabaseConnectionError();

    // res.send({});

    // new User({ email, password })
  }
);

export { router as signupRouter };
