import createHttpError from 'http-errors';
import { registerUser, findUser } from '../services/auth.js';
import { compareHash } from '../utils/hash.js';
import { createSession } from '../services/session.js';

export const registerUserController = async (req, res) => {
  const { email } = req.body;
  const userOne = await findUser({ email });

  if (userOne) {
    throw createHttpError(409, 'Email already is use');
  }
  const user = await registerUser(req.body);
  const data = {
    name: user.name,
    email: user.email,
  };

  res.json({
    status: 201,
    message: 'user successfully registered',
    data,
  });
};

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });

  if (!user) {
    throw createHttpError(404, 'Email not found');
  }

  const passwordCompare = await compareHash(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'password invalid');
  }

  const { accessToken, refreshToken, _id, refreshTokenValidUntil } =
    await createSession(user._id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
  res.json({
    status: 200,
    message: 'User singin successfully',
    data: {
      accessToken: accessToken,
    },
  });
};
