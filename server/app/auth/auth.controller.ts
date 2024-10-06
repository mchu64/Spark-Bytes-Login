import { Request, Response } from 'express';
import prisma from '../prisma_client.ts';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '../common/setupEnv.ts';

async function doesUserExist(email: string): Promise<boolean> {
  /**
   * Check if user exists in the database
   * Potentially throws an error from Prisma
   * @param email string - email of the user
   */

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (user) {
    return true;
  }
  return false;
}

async function getUser(email: string) {
  /**
   * Get user from the database
   * Potentially throws an error from Prisma
   * @param email string - email of the user
   */
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  return user;
}

//@ts-ignore
async function createUser(name: string, email: string, password: string) {
  /**
   * Create user in the database
   * Potentially throws an error from Prisma
   * @param name string - name of the user
   * @param email string - email of the user
   * @param password string - password of the user
   */
  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
    },
  });
  return newUser;
}

export const signup = async (req: Request, res: Response) => {
  try {
    const userInfo = req.body;
    const email = userInfo.email;
    const password = userInfo.password;
    const name = userInfo.name;

    //check that we were given strings for user inputs
    if (!checkValidUserInputs([email, password, name])) {
      return res.status(401).json({ success: false, error: 'Invalid Credentials' });
    }
    //make sure this email is not in use already
    if (await doesUserExist(email)) {
      return res.status(409).json({ success: false, error: 'User already exists.' });
    }

    //salt the password to encrypt it
    const saltRounds = 10;
    const securedPassword = await bcrypt.hash(password, saltRounds);

    var newUser = await createUser(name, email, securedPassword);
    //passback the jwt for our new user
    const newToken: string = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        canPostEvents: newUser.canPostEvents,
        isAdmin: newUser.isAdmin,
      },
      env.JWT_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    return res.status(200).json({ success: true, token: newToken });
  }
  catch (error) {
    return res.status(500).json({ success: false, error: 'Sign Up Failed.' });
  }
};

export const login = async (req: Request, res: Response) => {
  const userInfo = req.body;
  const email: string = userInfo.email;
  const password: string = userInfo.password;

  try {
    //check that we were given strings for user inputs
    if (!checkValidUserInputs([email, password])) {
      return res.status(401).json({ success: false, error: 'Invalid Credentials' });
    }
    //make sure this user exists
    if (!(await doesUserExist(email))) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    var userFromDb = await getUser(email)
    if (userFromDb && userFromDb.password && (await bcrypt.compare(password, userFromDb.password))) {
      const newToken: string = jwt.sign(
        {
          id: userFromDb.id,
          name: userFromDb.name,
          email: userFromDb.email,
          canPostEvents: userFromDb.canPostEvents,
          isAdmin: userFromDb.isAdmin,
        },
        env.JWT_TOKEN_SECRET,
        { expiresIn: '1h' }
      );
      return res.status(200).json({ success: true, token: newToken });
    }
    else {
      return res.status(401).json({ success: false, error: 'Invalid Credentials' });
    }
  }
  catch (error) {
    return res.status(500).json({ success: false, error: 'Sign in Failed.' });
  }
};

function checkValidUserInputs(userInputs: string[]): boolean {
  return userInputs.every(input => input && input.trim() !== '');
}
