import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../common/setupEnv';

export const authToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // prevents authHeader from being empty or undefined
  if (!authHeader || authHeader.trim() === '') {
    return res.status(403).send('An authorization header is required');
  }

  // Extract the token from the auth header
  const authParts = authHeader.split(' ');
  if (authParts.length !== 2) {
    return res.status(403).send('Header format error');
  }

  const token = authParts[1];

  if (!token) {
    return res.status(403).send('A token is required');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_TOKEN_SECRET);
    req.body.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }

  return next();
};
