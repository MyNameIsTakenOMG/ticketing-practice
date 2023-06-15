import { Request, Response, NextFunction } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { CustomError } from '../errors/custom-error';

export const erorrHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log('some error', err);
  // if (err instanceof RequestValidationError) {
  //   console.log('request validation error');
  // const formattedErrors = err.errors.map((error) => {
  //   if (error.type === 'field')
  //     return { message: error.msg, field: error.path };
  // });
  // return res.status(400).send({ errors: formattedErrors });
  //   return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  // }
  // if (err instanceof DatabaseConnectionError) {
  //   console.log('database connection error');
  // return res.status(500).send({
  //   errors: [
  //     {
  //       message: err.message,
  //     },
  //   ],
  // });
  //   return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  // }
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [
      {
        // message: err.message
        message: 'something went wrong',
      },
    ],
  });
};
