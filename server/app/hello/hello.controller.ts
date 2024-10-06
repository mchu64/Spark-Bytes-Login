import { Request, Response } from 'express';
import prisma from '../prisma_client';

export const helloWorld = async (_: Request, res: Response) => {
  try {
    // Assuming you have a prisma client named `prisma`
    await prisma.$connect();
    res.send('Database connection successful');
    return;
  } catch (error) {
    res.send('Database connection failed');
    return;
  }
};
