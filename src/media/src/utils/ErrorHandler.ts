import { Response, NextFunction } from 'express';
import { HTTPClientError, HTTP404Error } from './httpErrors';


export const notFoundError = () => {
  throw new HTTP404Error('Route not found');
};

export const clientError = (err: Error, res: Response, next: NextFunction) => {

  if(err instanceof HTTPClientError) {
    console.warn(err);
    res.status(err.statusCode).json({ status: 'error', message: err.message});
  }
  else
    next(err);

};

export const serverError = (err: Error, res: Response, next: NextFunction) => {
  console.error(err);
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ status: 'error', message: 'Internal server error.'})
  }
  else {
    res.status(500).json({ status: 'error', message: err.stack})
  }
};